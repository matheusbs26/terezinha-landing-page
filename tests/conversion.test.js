/**
 * Valores enviados nos eventos de conversão (Google Ads / GA4) por
 * assets/js/script.js.
 *
 * O script roda numa VM com um DOM mínimo e um gtag falso que grava as
 * chamadas. Nada aqui toca em rede nem em produção.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SCRIPT = fs.readFileSync(
  path.join(__dirname, "..", "assets", "js", "script.js"),
  "utf8"
);

const CONVERSION_SEND_TO = "AW-18025240124/C6WGCKnPhqQcELysjZND";

/** Link de WhatsApp falso: só os atributos que o script lê. */
function waLink(attrs = {}, extra = {}) {
  return {
    href: "https://wa.me/5551989582730?text=Ol%C3%A1",
    textContent: "  Falar no WhatsApp  ",
    getAttribute: (name) => (name in attrs ? attrs[name] : null),
    ...extra
  };
}

/**
 * Carrega o script e devolve uma função que simula um clique em `link`
 * (ou fora de qualquer link do WhatsApp, quando `link` é null).
 */
function load({ bodyAttrs = {}, withGtag = true } = {}) {
  const calls = [];
  let clickHandler = null;

  const document = {
    body: { getAttribute: (name) => (name in bodyAttrs ? bodyAttrs[name] : null) },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: (type, handler) => {
      if (type === "click") clickHandler = handler;
    }
  };
  const window = { addEventListener: () => {} };

  const sandbox = { document, window };
  if (withGtag) sandbox.gtag = (...args) => calls.push(args);
  vm.runInNewContext(SCRIPT, sandbox);

  assert.equal(typeof clickHandler, "function", "script deve registrar o listener de clique");

  return {
    calls,
    click(link) {
      const event = {
        target: { closest: (selector) => (selector === 'a[href*="wa.me"]' ? link : null) }
      };
      clickHandler(event);
    }
  };
}

// Objetos criados dentro da VM têm outro Object.prototype; o JSON os traz de
// volta para este contexto e deixa o deepStrictEqual comparar só os dados.
const plain = (value) => JSON.parse(JSON.stringify(value));
const params = (calls, eventName) => plain(calls.find(([, name]) => name === eventName)[2]);

const conversion = (calls) => params(calls, "conversion");
const whatsappClick = (calls) => params(calls, "whatsapp_click");

test("data-price do link vira o valor da conversão em BRL", () => {
  const page = load();
  page.click(waLink({ "data-price": "180", "data-service": "Massagem Relaxante" }));

  assert.deepEqual(conversion(page.calls), {
    send_to: CONVERSION_SEND_TO,
    value: 180,
    currency: "BRL"
  });
});

test("preços decimais são preservados", () => {
  const page = load();
  page.click(waLink({ "data-price": "180.5" }));

  assert.equal(conversion(page.calls).value, 180.5);
});

test("sem preço no link, usa o data-price do body", () => {
  const page = load({ bodyAttrs: { "data-price": "220" } });
  page.click(waLink());

  assert.equal(conversion(page.calls).value, 220);
});

test("o data-price do link tem prioridade sobre o do body", () => {
  const page = load({ bodyAttrs: { "data-price": "220" } });
  page.click(waLink({ "data-price": "120" }));

  assert.equal(conversion(page.calls).value, 120);
});

test("sem preço em lugar nenhum, o valor é 1 (só marca a conversão)", () => {
  const page = load();
  page.click(waLink());

  assert.equal(conversion(page.calls).value, 1);
});

test("preço inválido cai no valor 1, nunca em NaN", () => {
  for (const invalid of ["abc", "", "R$"]) {
    const page = load({ bodyAttrs: { "data-price": invalid } });
    page.click(waLink({ "data-price": invalid }));

    assert.equal(conversion(page.calls).value, 1, `data-price=${JSON.stringify(invalid)}`);
  }
});

test("o evento whatsapp_click informa serviço, URL e texto do botão", () => {
  const page = load();
  const link = waLink({ "data-service": "Reiki", "data-price": "160" });
  page.click(link);

  assert.deepEqual(whatsappClick(page.calls), {
    service: "Reiki",
    link_url: link.href,
    link_text: "Falar no WhatsApp"
  });
});

test("o serviço vem do link, depois do body, depois '(geral)'", () => {
  const fromLink = load({ bodyAttrs: { "data-service": "Body" } });
  fromLink.click(waLink({ "data-service": "Link" }));
  assert.equal(whatsappClick(fromLink.calls).service, "Link");

  const fromBody = load({ bodyAttrs: { "data-service": "Body" } });
  fromBody.click(waLink());
  assert.equal(whatsappClick(fromBody.calls).service, "Body");

  const fallback = load();
  fallback.click(waLink());
  assert.equal(whatsappClick(fallback.calls).service, "(geral)");
});

test("sem texto no botão, usa o aria-label e depois 'WhatsApp'", () => {
  const withAria = load();
  withAria.click(waLink({ "aria-label": "Chamar no WhatsApp" }, { textContent: "   " }));
  assert.equal(whatsappClick(withAria.calls).link_text, "Chamar no WhatsApp");

  const bare = load();
  bare.click(waLink({}, { textContent: "" }));
  assert.equal(whatsappClick(bare.calls).link_text, "WhatsApp");
});

test("cada clique envia exatamente dois eventos, na mesma ordem (sem contagem dupla)", () => {
  const page = load();
  page.click(waLink({ "data-price": "190" }));

  assert.deepEqual(
    page.calls.map(([command, name]) => [command, name]),
    [
      ["event", "whatsapp_click"],
      ["event", "conversion"]
    ]
  );
});

test("clique fora de um link do WhatsApp não envia nada", () => {
  const page = load();
  page.click(null);

  assert.deepEqual(page.calls, []);
});

test("sem gtag carregado (ex.: bloqueador), o clique não quebra", () => {
  const page = load({ withGtag: false });

  assert.doesNotThrow(() => page.click(waLink({ "data-price": "180" })));
});
