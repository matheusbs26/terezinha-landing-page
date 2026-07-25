# terezinha-landing-page

Landing page da Massoterapeuta Terezinha Ramos.

Site estático (HTML/CSS/JS puro, sem build) pensado para conversão via WhatsApp:
hero com foto real de atendimento, seção sobre, benefícios, serviços, galeria,
link para avaliações no Google, mapa/localização do consultório e botão
flutuante de WhatsApp.

## Estrutura

```
index.html
assets/
  css/style.css
  js/script.js
  img/            # logo, favicons e fotos (Google Drive da Terezinha)
site.webmanifest
```

## Rodando localmente

Qualquer servidor estático funciona, por exemplo:

```
python3 -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Conteúdo a revisar

- **Serviços**: a lista em `#servicos` (Relaxante, Terapêutica, Drenagem
  Linfática, Drenagem Pós-Operatória, Modeladora, Reflexologia Podal, Pedras
  Quentes, Reiki) foi montada a partir de termos comuns de massoterapia e do
  que aparece nas avaliações reais do Google. Sem preço fixo. Vale confirmar
  com a Terezinha se a lista bate exatamente com o que ela oferece.
- **Avaliações**: `#avaliacoes` traz 6 depoimentos reais extraídos do perfil
  do Google Meu Negócio (5,0 ★, 28 avaliações), com link para ver todas.
- **WhatsApp/endereço**: já preenchidos com os dados informados
  ((51) 98458-8761 — R. José de Alencar, 658/306, Menino Deus, Porto Alegre).
