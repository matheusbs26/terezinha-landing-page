#!/usr/bin/env python3
"""Monta o Reels de drenagem pós-operatória (1080x1920, 30 fps).

    python3 src/montar.py            # gera reels.mp4 e reels-com-trilha.mp4
    python3 src/montar.py --sem-trilha

Cada cena recebe um movimento lento de zoom na imagem (efeito Ken Burns) e o
texto entra por cima em fade, parado e nítido. As cenas se emendam por
crossfade. A trilha é um acorde sintetizado aqui mesmo — sem direitos de
terceiros — e existe só para o vídeo não sair mudo; nas publicações, um áudio
em alta do próprio Instagram costuma render mais alcance.
"""

import argparse
import math
import struct
import subprocess
import sys
import wave
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
QUADROS = RAIZ / "quadros"
FPS = 30
CROSS = 0.40          # duração do crossfade entre cenas
ZOOM_TOTAL = 0.07     # quanto a imagem avança em cada cena (movimento discreto)

# (duração em segundos, sentido do zoom). A duração já inclui o crossfade que
# a cena empresta para a seguinte — o tempo visível é este menos 0,40 s.
CENAS = [
    (3.60, "in"),     # 1 · 0,0–3,2 s · Operou. E agora?
    (3.40, "out"),    # 2 · 3,2–6,2 s · inchaço, peso, medo de encostar
    (4.40, "in"),     # 3 · 6,2–10,2 s · seu corpo precisa de tempo e cuidado
    (3.60, "out"),    # 4 · 10,2–13,4 s · liberação do cirurgião
    (3.00, "in"),     # 5 · 13,4–16,0 s · toque leve
    (2.80, "out"),    # 6 · 16,0–18,4 s · cuidado individual
    (4.20, "in"),     # 7 · 18,4–22,2 s · cada pós-operatório é único
    (3.20, "out"),    # 8 · 22,2–25,0 s · depoimento
    (3.00, "in"),     # 9 · 25,0–28,0 s · vamos conversar?
]


def duracao_total() -> float:
    """Duração final: a soma das cenas menos o que cada crossfade sobrepõe."""
    return sum(d for d, _ in CENAS) - CROSS * (len(CENAS) - 1)


def ffmpeg_bin() -> str:
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        from shutil import which
        exe = which("ffmpeg")
        if not exe:
            sys.exit("ffmpeg não encontrado — instale com: pip install imageio-ffmpeg")
        return exe


def trilha(caminho: Path, duracao: float) -> None:
    """Pad ambiente em Lá menor, bem baixo, com abertura e fecho suaves."""
    taxa = 44100
    n = int(duracao * taxa)
    # Lá2 + Dó4 + Mi4 + Sol4 — acorde parado, sem melodia para não competir
    # com a leitura do texto.
    parciais = [(110.0, 0.30), (220.0, 0.16), (261.63, 0.12),
                (329.63, 0.10), (392.0, 0.07), (440.0, 0.05)]
    with wave.open(str(caminho), "w") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(taxa)
        quadros = bytearray()
        for i in range(n):
            t = i / taxa
            # respiração lenta do acorde
            lfo = 0.86 + 0.14 * math.sin(2 * math.pi * 0.055 * t)
            v = sum(a * math.sin(2 * math.pi * f * t + 0.4 * k)
                    for k, (f, a) in enumerate(parciais))
            v *= lfo
            env = min(1.0, t / 2.2) * min(1.0, max(0.0, (duracao - t) / 2.6))
            v *= env * 0.16
            # leve descorrelação entre os canais, para o som não ficar plano
            esq = int(max(-1.0, min(1.0, v)) * 32767)
            dir_ = int(max(-1.0, min(1.0, v * 0.97)) * 32767)
            quadros += struct.pack("<hh", esq, dir_)
        w.writeframes(bytes(quadros))


def filtro() -> tuple[list[str], str, float]:
    entradas: list[str] = []
    partes: list[str] = []

    for i, (dur, sentido) in enumerate(CENAS):
        fundo = QUADROS / f"cena-{i+1}-fundo.png"
        texto = QUADROS / f"cena-{i+1}-texto.png"
        for arquivo in (fundo, texto):
            if not arquivo.exists():
                sys.exit(f"falta {arquivo} — rode ./src/render.sh primeiro")
        # O fundo entra como quadro único: é o zoompan que gera os quadros da
        # cena (com -loop, cada quadro de entrada viraria uma cena inteira).
        entradas += ["-i", str(fundo)]
        entradas += ["-loop", "1", "-t", f"{dur:.3f}", "-i", str(texto)]

        quadros = max(2, round(dur * FPS))
        passo = ZOOM_TOTAL / quadros
        if sentido == "in":
            z = f"min(zoom+{passo:.6f},{1+ZOOM_TOTAL:.3f})"
        else:
            z = f"if(eq(on,0),{1+ZOOM_TOTAL:.3f},max(zoom-{passo:.6f},1.0))"

        # A imagem é ampliada antes do zoom para o corte não perder definição.
        partes.append(
            f"[{2*i}:v]scale=2160:3840:force_original_aspect_ratio=increase,"
            f"crop=2160:3840,"
            f"zoompan=z='{z}':d={quadros}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
            f":s=1080x1920:fps={FPS},trim=duration={dur:.3f},setsar=1[bg{i}]"
        )
        saida_fade = max(0.4, dur - 0.55)
        partes.append(
            f"[{2*i+1}:v]format=rgba,fps={FPS},"
            f"fade=t=in:st=0.25:d=0.55:alpha=1,"
            f"fade=t=out:st={saida_fade:.2f}:d=0.5:alpha=1,setsar=1[ov{i}]"
        )
        partes.append(
            f"[bg{i}][ov{i}]overlay=x=0:y='if(lt(t,0.9), 14*(1-t/0.9), 0)':"
            f"format=auto,format=yuv420p[c{i}]"
        )

    # Emenda das cenas por crossfade.
    atual = "c0"
    acumulado = CENAS[0][0]
    for i in range(1, len(CENAS)):
        offset = acumulado - CROSS
        alvo = f"x{i}"
        partes.append(
            f"[{atual}][c{i}]xfade=transition=fade:duration={CROSS}:"
            f"offset={offset:.3f}[{alvo}]"
        )
        atual = alvo
        acumulado += CENAS[i][0] - CROSS

    partes.append(f"[{atual}]format=yuv420p[v]")
    return entradas, ";".join(partes), acumulado


def montar_video(ff, entradas, graf, saida, duracao):
    print(f"montando {duracao:.1f}s …")
    subprocess.run(
        [ff, "-y", "-hide_banner", "-loglevel", "error", *entradas,
         "-filter_complex", graf, "-map", "[v]",
         "-c:v", "libx264", "-profile:v", "high", "-crf", "19",
         "-preset", "medium", "-pix_fmt", "yuv420p", "-r", str(FPS),
         "-movflags", "+faststart", str(saida)],
        check=True,
    )
    print(f"\u2192 {saida.name}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sem-trilha", action="store_true",
                    help="gera apenas o vídeo mudo")
    ap.add_argument("--narracao", metavar="ARQUIVO",
                    help="áudio de locução (wav/mp3) para entrar por cima da "
                         "trilha; gera reels-com-voz.mp4")
    ap.add_argument("--forcar", action="store_true",
                    help="remonta o mp4 mesmo que ele já esteja atualizado")
    args = ap.parse_args()

    # O caminho da locução é conferido antes de qualquer render: montar o vídeo
    # inteiro para só então descobrir que o arquivo não existe é tempo jogado.
    voz = None
    if args.narracao:
        voz = Path(args.narracao).expanduser()
        if not voz.exists():
            sys.exit(
                f"não achei o áudio: {voz}\n"
                "Passe o caminho real do arquivo, por exemplo:\n"
                "  python3 src/montar.py --narracao ~/Downloads/audio_voicebox.wav"
            )

    ff = ffmpeg_bin()
    duracao = duracao_total()
    mudo = RAIZ / "reels.mp4"

    cenas = sorted(QUADROS.glob("cena-*.png"))
    atualizado = mudo.exists() and (
        not cenas or mudo.stat().st_mtime >= max(c.stat().st_mtime for c in cenas)
    )
    if atualizado and not args.forcar:
        print(f"\u2192 {mudo.name} já está atualizado (use --forcar para remontar)")
    else:
        entradas, graf, duracao = filtro()
        montar_video(ff, entradas, graf, mudo, duracao)

    if args.sem_trilha and not voz:
        return

    wav = QUADROS / "trilha.wav"
    QUADROS.mkdir(exist_ok=True)   # num clone novo a pasta ainda não existe
    trilha(wav, duracao)
    com_trilha = RAIZ / "reels-com-trilha.mp4"
    subprocess.run(
        [ff, "-y", "-hide_banner", "-loglevel", "error",
         "-i", str(mudo), "-i", str(wav),
         "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
         "-shortest", "-movflags", "+faststart", str(com_trilha)],
        check=True,
    )
    print(f"\u2192 {com_trilha.name}")

    if voz:
        com_voz = RAIZ / "reels-com-voz.mp4"
        # A locução manda: a trilha cai para 25% e some junto com o vídeo.
        subprocess.run(
            [ff, "-y", "-hide_banner", "-loglevel", "error",
             "-i", str(mudo), "-i", str(wav), "-i", str(voz),
             "-filter_complex",
             "[1:a]volume=0.25,aformat=sample_rates=44100:channel_layouts=stereo[bed];"
             "[2:a]volume=1.0,aformat=sample_rates=44100:channel_layouts=stereo[voz];"
             "[bed][voz]amix=inputs=2:duration=first:dropout_transition=0,"
             f"afade=t=out:st={max(0.0, duracao - 1.2):.2f}:d=1.2[a]",
             "-map", "0:v", "-map", "[a]",
             "-c:v", "copy", "-c:a", "aac", "-b:a", "160k",
             "-shortest", "-movflags", "+faststart", str(com_voz)],
            check=True,
        )
        print(f"\u2192 {com_voz.name}")


if __name__ == "__main__":
    main()
