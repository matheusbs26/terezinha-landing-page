# Medição: GA4, Google Ads e cliques no WhatsApp

Como o site mede o contato pelo WhatsApp, o que ainda precisa ser configurado
no Google Analytics 4 e no Google Ads, e os cuidados para não contar o mesmo
contato duas vezes. Nada aqui altera configuração externa: os passos marcados
como pendentes são feitos por quem administra as contas.

## O que o site envia

Todas as páginas carregam um único `gtag.js` com dois destinos:
`GT-5DFB7B74` (Google tag / GA4) e `AW-18025240124` (Google Ads). Os cliques
são tratados num único listener em `assets/js/script.js`, delegado do
`document`. Cada clique num link `wa.me` envia exatamente dois eventos, nesta
ordem (coberto por `tests/conversion.test.js`):

| Evento | Destino | Parâmetros |
| --- | --- | --- |
| `whatsapp_click` | GA4 | `service` (técnica de origem), `link_url`, `link_text` |
| `conversion` (`send_to: AW-18025240124/C6WGCKnPhqQcELysjZND`) | Google Ads, ação "Contato - whats" | `value`, `currency: BRL` |

- `service` vem do `data-service` do botão, depois do `data-service` da página,
  e por fim `"(geral)"` (por exemplo, o botão do cabeçalho na home).
- Links internos, inclusive os que levam a `/agendar/`, não disparam evento: o
  acesso a essa página aparece como visualização de `/agendar/`.
- Sem `gtag` carregado (bloqueador de anúncios), o clique funciona e nada é
  enviado.

## O que um clique significa

O evento mede **a abertura da conversa no WhatsApp**. Não mede mensagem
enviada, agendamento confirmado, atendimento realizado nem receita. Na
leitura dos relatórios, `whatsapp_click` e "Contato - whats" são **intenção
de contato**.

## Valor da conversão: metodologia atual e decisão pendente

Hoje o `value` de cada conversão é o **preço da sessão avulsa** da técnica de
origem. Ele vem do `data-price` do botão ou da página, gerado de
`tools/services.js`; por exemplo, R$ 120 na Reflexologia e R$ 220 na
Pós-Operatória. Sem preço conhecido (cabeçalho, `/agendar/`), o valor é 1.

Isso serve para **comparar técnicas entre si**, mas superestima o valor
absoluto: trata cada clique como uma sessão vendida. O ROAS e o "valor de
conversão" do Google Ads ficam inflados na proporção de cliques que não viram
agendamento.

Opções (exigem decisão de quem gerencia a campanha):

1. **Valor esperado (recomendada quando houver dado):**
   `valor = preço da sessão × taxa de cliques que viram agendamento`.
   - A taxa sai da contagem de agendamentos vindos do site num período,
     dividida pelos cliques `whatsapp_click` no mesmo período.
   - Mudança no código: multiplicar `price` por uma constante em
     `script.js`.
2. **Manter o preço integral** e ler o valor só como peso relativo entre
   técnicas.
3. **Valor fixo 1**: a conversão só conta contatos, sem diferenciar técnica.

Antes de mudar, confira a estratégia de lance da campanha:
- Com **Maximizar valor da conversão** ou **ROAS desejado**, mudar o valor
  muda os lances, e convém fazer isso numa data marcada.
- Com **Maximizar conversões** ou **CPA desejado**, o valor afeta só os
  relatórios.

## Configuração pendente no GA4

### 1. Dimensão personalizada `service`

Sem ela o parâmetro chega, mas não aparece nos relatórios.

1. GA4 → **Administrador** → **Exibição de dados** → **Definições
   personalizadas** → **Criar dimensão personalizada**.
2. Nome: `Serviço`; Escopo: **Evento**; Parâmetro do evento: `service`.
3. Salvar. Os dados passam a aparecer a partir desse momento; não há
   preenchimento retroativo.

Opcional, do mesmo jeito: `link_text`, para saber qual botão (hero, card,
rodapé, botão flutuante) recebe mais cliques.

### 2. Evento principal

Em **Administrador** → **Eventos**, marque `whatsapp_click` como **evento
principal** (antigo "conversão"), para ele aparecer nos relatórios de
aquisição e de página de destino.

### 3. Evitar contagem dupla no Google Ads

O Google Ads já recebe "Contato - whats" direto pela tag. Se o
`whatsapp_click` do GA4 também for **importado** para o Google Ads como ação
de conversão, cada clique conta duas vezes.

Em Google Ads → **Metas** → **Conversões** → **Resumo**:
- só "Contato - whats" deve ser **ação principal** para o objetivo de
  contato;
- uma ação importada do GA4 com o mesmo significado deve ficar como
  **secundária** (só observação) ou ser removida.

O GA4 também registra, com a medição otimizada ligada, o evento automático
`click` (`outbound: true`) em links externos como o `wa.me`. Ele não é
duplicidade do `whatsapp_click`, a menos que os dois sejam marcados como
evento principal. Deixe só o `whatsapp_click`.

### 4. Search Console vinculado

**Administrador** → **Vinculações de produtos** → **Search Console**. Libera
os relatórios de consultas e de páginas de destino orgânicas dentro do GA4.

## Leituras úteis depois de configurar

- **Origem orgânica:** Relatórios → Aquisição → **Aquisição de tráfego**,
  com filtro "Grupo de canais padrão da sessão = Pesquisa orgânica". A métrica
  "Eventos principais" filtrada por `whatsapp_click` dá os contatos vindos da
  busca.
- **Páginas de entrada com mais contato:** Relatórios → Engajamento →
  **Página de destino**, com a métrica de eventos principais
  (`whatsapp_click`). Para o potencial, compare sessões e taxa de contato por
  página.
- **Técnica que gera contato:** uma exploração livre com a dimensão `Serviço`
  e a contagem de `whatsapp_click`.
