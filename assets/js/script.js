(function () {
  document.getElementById("year").textContent = new Date().getFullYear();

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

  // Google Ads conversion ("Contato - whats") on WhatsApp button clicks.
  //
  // This is the ONLY place the conversion is sent. There used to be a second
  // copy inline in index.html, which meant every click counted twice and the
  // two copies disagreed on the value. Keep it here — one listener, delegated
  // from the document so links added later are covered too.
  //
  // The buttons open WhatsApp in a new tab, so this page stays alive and the
  // event has time to send — no navigation callback needed, and hijacking
  // window.location (as the default Google snippet does) would break the
  // target="_blank" behaviour.
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest('a[href*="wa.me"]');
    if (!link || typeof gtag !== "function") return;

    // Read in the Google tag / GA4 reports: which button people actually use.
    gtag("event", "whatsapp_click", {
      link_url: link.href,
      link_text:
        link.textContent.trim() || link.getAttribute("aria-label") || "WhatsApp"
    });

    gtag("event", "conversion", {
      send_to: "AW-18025240124/C6WGCKnPhqQcELysjZND",
      value: 1.0,
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
