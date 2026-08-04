# Sitelinks da campanha no Google Ads

Gerado por `node tools/build.js` a partir de `tools/services.js`. Não edite
este arquivo à mão: ajuste os dados na fonte e rode o build de novo.

Cada técnica de massagem tem uma página própria no site, com conteúdo específico
sobre ela. É para essas páginas que os sitelinks devem apontar — nunca todas para
a home. Isso melhora a experiência da página de destino (um dos componentes do
Índice de qualidade) e faz o clique cair direto no assunto que a pessoa procurou.

## Textos prontos

Limites do Google Ads: **texto do sitelink até 25 caracteres**, **cada linha de
descrição até 35 caracteres**. Os textos abaixo já respeitam esses limites — o
build falha se algum passar.

| Texto do sitelink | Descrição 1 | Descrição 2 | URL final |
| --- | --- | --- | --- |
| Massagem Relaxante | Alívio do estresse do dia a dia | Sessão individual, sem pressa | `https://terezinharamos.com.br/massagem-relaxante/` |
| Massagem Terapêutica | Foco nos pontos de dor e tensão | Técnica ajustada à sua queixa | `https://terezinharamos.com.br/massagem-terapeutica/` |
| Drenagem Linfática | Ajuda a reduzir o inchaço | Toque suave e ritmo constante | `https://terezinharamos.com.br/drenagem-linfatica/` |
| Drenagem Pós-Operatória | Cuidado na sua recuperação | Com liberação da equipe médica | `https://terezinharamos.com.br/drenagem-pos-operatoria/` |
| Massagem Modeladora | Ativa a circulação e o contorno | Protocolo combinado com você | `https://terezinharamos.com.br/massagem-modeladora/` |
| Reflexologia Podal | Pontos reflexos dos pés | Relaxamento e bem-estar geral | `https://terezinharamos.com.br/reflexologia-podal/` |
| Pedras Quentes | Calor e toque terapêutico | Relaxamento muscular profundo | `https://terezinharamos.com.br/massagem-pedras-quentes/` |
| Ventosaterapia | Ventosas soltam a musculatura | Alívio de tensão nas costas | `https://terezinharamos.com.br/ventosaterapia/` |
| Reiki | Terapia complementar de pausa | Equilíbrio físico e emocional | `https://terezinharamos.com.br/reiki/` |

## Como cadastrar

1. Google Ads → **Recursos** → botão **+** → **Sitelink**.
2. Escolha o nível: **campanha** (recomendado, para a campanha de massoterapia)
   ou grupo de anúncios, se quiser sitelinks diferentes por técnica.
3. Preencha texto, as duas descrições e a URL final de cada linha da tabela.
4. Cadastre **no mínimo 4 sitelinks** — o Google só exibe a extensão a partir
   de 2, e com 4 ou mais ele tem margem para testar combinações.
5. Deixe o Google escolher quais mostrar; não é preciso definir programação.

Para importar em massa, use `docs/google-ads-sitelinks.csv` no Google Ads
Editor (Conta → Importar → Do arquivo). Se a sua interface estiver em português,
pode ser necessário renomear os cabeçalhos das colunas para os equivalentes
traduzidos.

## Sugestão de quais usar

Os sitelinks aparecem em número limitado (normalmente de 2 a 6). Vale começar
pelos serviços de maior procura e intenção de compra:

1. Massagem Relaxante
2. Massagem Terapêutica
3. Drenagem Linfática
4. Drenagem Pós-Operatória

E rodar os demais em teste depois de acumular dados de cliques.

## Medição

Todas as páginas carregam o mesmo Google tag (`AW-18025240124` e
`GT-5DFB7B74`) da home, e o clique em qualquer botão de WhatsApp dispara:

- o evento `whatsapp_click` (com `service`, `link_url` e `link_text`), útil
  para ver no GA4 qual técnica gera mais contato;
- a conversão `Contato - whats` do Google Ads.

Como cada técnica tem URL própria, dá para separar o desempenho por página em
Relatórios → Página de destino.

## Âncoras (alternativa)

Se em algum momento fizer sentido apontar um sitelink para um trecho da home em
vez de uma página inteira, cada card da seção de serviços tem `id` próprio —
por exemplo `https://terezinharamos.com.br/#massagem-relaxante`. As páginas dedicadas continuam
sendo a melhor opção para anúncios.
