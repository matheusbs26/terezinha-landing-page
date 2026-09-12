(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var floatBtn = document.getElementById("whatsappFloat");
  var hero = document.querySelector(".hero");
  if (floatBtn && hero) {
    var toggleFloat = function () {
      var heroBottom = hero.getBoundingClientRect().bottom;
      floatBtn.classList.toggle("hide-in-hero", heroBottom > 80);
    };
    window.addEventListener("scroll", toggleFloat, { passive: true });
    toggleFloat();
  }

  // Google Ads conversion ("Contato - whats") on contact button clicks.
  //
  // This is the ONLY place the conversion is sent. There used to be a second
  // copy inline in index.html, which meant every click counted twice and the
  // two copies disagreed on the value. Keep it here — one listener, delegated
  // from the document so links added later are covered too.
  //
  // Two kinds of contact link count as a lead: WhatsApp (wa.me) and the phone
  // links (tel:). A call is at least as good a lead as a message, so leaving
  // tel: out would hide part of what the campaign produces and let the bidding
  // optimise against an incomplete signal. The GA4 event keeps the two apart
  // (whatsapp_click vs phone_click) so the split stays visible in the reports.
  //
  // The WhatsApp buttons open in a new tab and tel: hands off to the dialer, so
  // this page stays alive either way and the event has time to send — no
  // navigation callback needed, and hijacking window.location (as the default
  // Google snippet does) would break the target="_blank" behaviour.
  document.addEventListener("click", function (event) {
    var link =
      event.target.closest &&
      event.target.closest('a[href*="wa.me"], a[href^="tel:"]');
    if (!link || typeof gtag !== "function") return;

    var isPhone = link.getAttribute("href").indexOf("tel:") === 0;

    // Qual técnica originou o clique: o data-service do próprio link (cards e
    // botões das páginas de serviço) ou, na falta dele, o da página inteira.
    // Serve para comparar no GA4 quais massagens da campanha geram contato.
    var service =
      link.getAttribute("data-service") ||
      document.body.getAttribute("data-service") ||
      "(geral)";

    // Preço da sessão avulsa da técnica de origem do clique, quando conhecido
    // (data-price vem do build.js, gerado a partir de tools/services.js). Sem
    // isso todo clique valia o mesmo 1.0 fixo, fazendo o Reflexologia Podal
    // (R$120) pesar igual à Drenagem Pós-Operatória (R$220) nos relatórios e
    // numa eventual estratégia de lance por valor. Sem preço conhecido (ex.:
    // botão do cabeçalho, página /agendar/), mantém 1.0 só para marcar a
    // conversão.
    var price = parseFloat(
      link.getAttribute("data-price") || document.body.getAttribute("data-price")
    );
    var value = isNaN(price) ? 1.0 : price;

    // Read in the Google tag / GA4 reports: which button people actually use.
    gtag("event", isPhone ? "phone_click" : "whatsapp_click", {
      service: service,
      link_url: link.href,
      link_text:
        link.textContent.trim() ||
        link.getAttribute("aria-label") ||
        (isPhone ? "Ligar" : "WhatsApp")
    });

    gtag("event", "conversion", {
      send_to: "AW-18025240124/C6WGCKnPhqQcELysjZND",
      value: value,
      currency: "BRL"
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
