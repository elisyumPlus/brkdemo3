      const year = document.getElementById("year");
      if (year) year.textContent = new Date().getFullYear();
      const consentStorageKey = "brk-cookie-consent-v1";
      const consentLifetime = 180 * 24 * 60 * 60 * 1000;
      const readConsent = function () {
        try {
          const saved = JSON.parse(window.localStorage.getItem(consentStorageKey) || "null");
          if (!saved || !saved.expiresAt || saved.expiresAt < Date.now()) {
            window.localStorage.removeItem(consentStorageKey);
            return null;
          }
          return saved;
        } catch (error) {
          return null;
        }
      };
      let cookieConsent = readConsent();
      const applyOptionalEmbeds = function (choice) {
        if (!choice) return;
        if (choice.googleMaps) {
          document.querySelectorAll("[data-optional-map]").forEach(function (frame) {
            if (!frame.getAttribute("src")) frame.setAttribute("src", frame.dataset.consentSrc);
            frame.hidden = false;
            const placeholder = frame.parentElement.querySelector("[data-map-placeholder]");
            if (placeholder) placeholder.hidden = true;
          });
        }
        if (choice.instagram) {
          const posts = document.querySelectorAll("[data-optional-instagram]");
          posts.forEach(function (post) {
            post.hidden = false;
            const placeholder = post.parentElement.querySelector("[data-instagram-placeholder]");
            if (placeholder) placeholder.hidden = true;
          });
          if (posts.length && !document.querySelector("script[data-instagram-embed]")) {
            const embedScript = document.createElement("script");
            embedScript.src = "https://www.instagram.com/embed.js";
            embedScript.async = true;
            embedScript.dataset.instagramEmbed = "true";
            embedScript.onload = function () {
              if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
            };
            document.body.appendChild(embedScript);
          }
        }
      };
      applyOptionalEmbeds(cookieConsent);
      const cookieBanner = document.createElement("section");
      cookieBanner.className = "cookie-banner";
      cookieBanner.hidden = Boolean(cookieConsent);
      cookieBanner.setAttribute("role", "dialog");
      cookieBanner.setAttribute("aria-labelledby", "cookie-banner-title");
      cookieBanner.innerHTML =
        '<div class="cookie-banner-copy"><span class="eyebrow">Gizlilik tercihleri</span>' +
        '<h2 id="cookie-banner-title">Harita ve Instagram içeriği</h2>' +
        '<p>Google Maps haritası ve Instagram gönderileri, iznin olursa yüklenir. Seçimini dilediğin zaman değiştirebilirsin. <a href="cerez-politikasi.html">Çerez politikası</a> · <a href="kvkk.html">KVKK aydınlatma</a></p></div>' +
        '<div class="cookie-actions"><button class="cookie-choice" type="button" data-cookie-action="accept">Tümüne izin ver</button>' +
        '<button class="cookie-choice" type="button" data-cookie-action="reject">Reddet</button>' +
        '<button class="cookie-choice" type="button" data-cookie-action="settings">Tercihleri yönet</button></div>' +
        '<div class="cookie-preferences" data-cookie-preferences hidden>' +
        '<label><input type="checkbox" data-cookie-map /> Google Maps haritasını yükle</label>' +
        '<label><input type="checkbox" data-cookie-instagram /> Instagram gönderilerini yükle</label>' +
        '<button class="cookie-save" type="button" data-cookie-action="save">Seçimi kaydet</button></div>';
      document.body.appendChild(cookieBanner);
      const preferences = cookieBanner.querySelector("[data-cookie-preferences]");
      const mapPreference = cookieBanner.querySelector("[data-cookie-map]");
      const instagramPreference = cookieBanner.querySelector("[data-cookie-instagram]");
      const showCookieSettings = function () {
        cookieBanner.hidden = false;
        preferences.hidden = false;
        mapPreference.checked = Boolean(cookieConsent && cookieConsent.googleMaps);
        instagramPreference.checked = Boolean(cookieConsent && cookieConsent.instagram);
        mapPreference.focus();
      };
      const saveCookieConsent = function (googleMaps, instagram) {
        cookieConsent = {
          googleMaps: Boolean(googleMaps),
          instagram: Boolean(instagram),
          updatedAt: Date.now(),
          expiresAt: Date.now() + consentLifetime
        };
        try {
          window.localStorage.setItem(consentStorageKey, JSON.stringify(cookieConsent));
        } catch (error) {
          // The choice still applies for this page view if browser storage is unavailable.
        }
        cookieBanner.hidden = true;
        applyOptionalEmbeds(cookieConsent);
      };
      cookieBanner.addEventListener("click", function (event) {
        const action = event.target.closest("[data-cookie-action]");
        if (!action) return;
        if (action.dataset.cookieAction === "accept") saveCookieConsent(true, true);
        if (action.dataset.cookieAction === "reject") saveCookieConsent(false, false);
        if (action.dataset.cookieAction === "settings") showCookieSettings();
        if (action.dataset.cookieAction === "save") saveCookieConsent(mapPreference.checked, instagramPreference.checked);
      });
      document.querySelectorAll("[data-open-cookie-settings]").forEach(function (button) {
        button.addEventListener("click", showCookieSettings);
      });
      const pageHeader = document.querySelector("header");
      const updateHeader = function () {
        if (pageHeader) pageHeader.classList.toggle("is-scrolled", window.scrollY > 80);
      };
      updateHeader();
      window.addEventListener("scroll", updateHeader, { passive: true });
      const menuToggle = document.getElementById("menu-toggle");
      const navLinks = document.getElementById("nav-links");
      if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
          const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
          menuToggle.setAttribute("aria-expanded", String(!isOpen));
          navLinks.classList.toggle("is-open", !isOpen);
          menuToggle.textContent = isOpen ? "Menü" : "Kapat";
        });
        navLinks.querySelectorAll("a").forEach(function (link) {
          link.addEventListener("click", function () {
            navLinks.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "Menü";
          });
        });
      }
      document.querySelectorAll("[data-service]").forEach(function (link) {
        link.addEventListener("click", function () {
          const serviceField = document.getElementById("service");
          if (serviceField) serviceField.value = link.dataset.service;
        });
      });
      const heroVideo = document.getElementById("hero-video");
      if (heroVideo) {
        const heroSection = heroVideo.closest(".hero");
        const gestureEvents = ["touchstart", "pointerdown", "click"];
        let playPending = false;
        heroVideo.muted = true;
        heroVideo.defaultMuted = true;
        heroVideo.setAttribute("muted", "");
        heroVideo.loop = true;
        heroVideo.playsInline = true;
        heroVideo.setAttribute("playsinline", "");
        heroVideo.setAttribute("webkit-playsinline", "");
        const showHeroFallback = function () {
          if (heroSection) heroSection.classList.add("hero-video-fallback");
        };
        const removeGestureRetries = function () {
          gestureEvents.forEach(function (eventName) {
            window.removeEventListener(eventName, startHeroVideo);
          });
        };
        const onHeroPlaying = function () {
          playPending = false;
          if (heroSection) heroSection.classList.remove("hero-video-fallback");
          removeGestureRetries();
        };
        const startHeroVideo = function () {
          if (document.hidden || !heroVideo.paused || playPending) return;
          playPending = true;
          let playback;
          try {
            playback = heroVideo.play();
          } catch (error) {
            playPending = false;
            showHeroFallback();
            return;
          }
          if (playback && typeof playback.then === "function") {
            playback.then(function () {
              playPending = false;
            }).catch(function () {
              playPending = false;
              showHeroFallback();
            });
          } else {
            playPending = false;
          }
        };
        heroVideo.addEventListener("playing", onHeroPlaying);
        heroVideo.addEventListener("error", showHeroFallback);
        heroVideo.addEventListener("loadeddata", startHeroVideo, { once: true });
        heroVideo.addEventListener("canplay", startHeroVideo, { once: true });
        gestureEvents.forEach(function (eventName) {
          window.addEventListener(eventName, startHeroVideo, { passive: true });
        });
        document.addEventListener("visibilitychange", function () {
          if (!document.hidden) startHeroVideo();
        });
        window.addEventListener("pageshow", startHeroVideo);
        startHeroVideo();
      }
      const serviceField = document.getElementById("service");
      const serviceKey = new URLSearchParams(window.location.search).get("hizmet");
      const serviceLabels = {
        ppf: "PPF kaplama",
        cam: "Cam filmi",
        seramik: "Seramik kaplama",
        pasta: "Pasta & cila",
        detayli: "Detaylı temizlik",
        diger: "Diğer"
      };
      if (serviceField && serviceLabels[serviceKey]) {
        serviceField.value = serviceLabels[serviceKey];
      }
      document.querySelectorAll("[data-comparison]").forEach(function (stage) {
        const slider = stage.querySelector(".compare-range");
        if (!slider) return;
        const updateComparison = function () {
          stage.style.setProperty("--comparison", slider.value + "%");
        };
        slider.addEventListener("input", updateComparison);
        updateComparison();
      });
      const bookingForm = document.getElementById("booking-form");
      if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
          event.preventDefault();
          const name = document.getElementById("name").value.trim();
          const phone = document.getElementById("phone").value.trim();
          const vehicle = document.getElementById("vehicle").value.trim();
          const service = document.getElementById("service").value;
          const note = document.getElementById("note").value.trim();
          const message = "Merhaba, BRK Garage için teklif almak istiyorum.%0A%0A" +
            "Ad Soyad: " + encodeURIComponent(name) + "%0A" +
            "Telefon: " + encodeURIComponent(phone) + "%0A" +
            "Araç: " + encodeURIComponent(vehicle) + "%0A" +
            "Hizmet: " + encodeURIComponent(service) +
            (note ? "%0ANot: " + encodeURIComponent(note) : "");
          window.open("https://wa.me/905441723633?text=" + message, "_blank", "noopener");
        });
      }
