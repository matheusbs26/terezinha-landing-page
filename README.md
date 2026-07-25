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

- **Serviços**: a lista em `#servicos` usa nomes comuns de massoterapia
  (Relaxante, Terapêutica, Drenagem Linfática, Modeladora, Reflexologia Podal,
  Pedras Quentes) sem preço fixo. Ajuste para os serviços reais oferecidos.
- **Avaliações**: a seção `#avaliacoes` linka para o perfil do Google Meu
  Negócio em vez de citar depoimentos, já que não havia texto de avaliação
  disponível no momento da criação da página.
- **WhatsApp/endereço**: já preenchidos com os dados informados
  ((51) 98458-8761 — R. José de Alencar, 658/306, Menino Deus, Porto Alegre).
