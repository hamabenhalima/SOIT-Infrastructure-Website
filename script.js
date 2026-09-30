// ============ API CONFIGURATION ============
const API_URL = window.SOIT_CONFIG.apiBaseUrl;

// ============ SHOW MESSAGE FUNCTION (UNIQUE) ============
function showMessage(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const messageDiv = document.createElement("div");
  messageDiv.className = `alert-message alert-${type}`;
  let icon =
    type === "success"
      ? "✅"
      : type === "error"
        ? "❌"
        : type === "warning"
          ? "⚠️"
          : "ℹ️";
  messageDiv.textContent = `${icon} ${message}`;
  container.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.remove();
    if (container.children.length === 0) container.remove();
  }, 5000);
}

// ============ LOADER ============
function showLoader() {
  document.getElementById("loading-spinner")?.classList.add("show");
}
function hideLoader() {
  document.getElementById("loading-spinner")?.classList.remove("show");
}

// ============ SCROLL TO TOP ============
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("scroll-top");
  if (btn) {
    window.addEventListener("scroll", () =>
      btn.classList.toggle("show", window.scrollY > 300),
    );
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
});

// ============ MOBILE MENU ============
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const navbar = document.querySelector(".header .navbar");
  if (menuBtn && navbar) {
    const closeMenu = () => {
      navbar.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    };
    menuBtn.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("active");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    navbar.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", closeMenu),
    );
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }
});

// Keep one blue section marker in sync with the visible section.
document.addEventListener("DOMContentLoaded", () => {
  const links = [...document.querySelectorAll('.header .navbar a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      links.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.4] },
  );
  sections.forEach((section) => observer.observe(section));
});

// Load the muted looping About video only as it approaches the viewport.
document.addEventListener("DOMContentLoaded", () => {
  const video = document.querySelector(".about-video video[data-src]");
  if (!video) return;
  const startVideo = () => {
    if (!video.src) {
      video.src = video.dataset.src;
      video.load();
    }
    video.play().catch(() => {});
  };
  if (!("IntersectionObserver" in window)) {
    startVideo();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startVideo();
        else video.pause();
      });
    },
    { rootMargin: "300px 0px" },
  );
  observer.observe(video);
});

// ============ INFO SIDEBAR ============
document.addEventListener("DOMContentLoaded", () => {
  const infoBtn = document.querySelector("#info-btn");
  const contactInfo = document.querySelector(".contact-info");
  const closeInfo = document.querySelector("#close-info");
  if (infoBtn)
    infoBtn.addEventListener("click", () =>
      contactInfo?.classList.add("active"),
    );
  if (closeInfo)
    closeInfo.addEventListener("click", () =>
      contactInfo?.classList.remove("active"),
    );
});

// ============ SEARCH FUNCTIONALITY ============
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("#search-btn");
  const searchForm = document.querySelector(".search-form");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector("#search-close");
  const searchInput = document.getElementById("search-box");
  const searchSuggestions = document.getElementById("search-suggestions");
  let currentHighlights = [];
  let currentIndex = -1;

  function openSearch() {
    searchForm?.classList.add("active");
    searchOverlay?.classList.add("active");
    searchBtn?.setAttribute("aria-expanded", "true");
    searchInput?.focus();
  }
  function closeSearch() {
    searchForm?.classList.remove("active");
    searchOverlay?.classList.remove("active");
    searchBtn?.setAttribute("aria-expanded", "false");
  }
  function clearHighlights() {
    currentHighlights.forEach((el) => {
      if (el && el.parentNode) {
        const parent = el.parentNode;
        parent.replaceChild(document.createTextNode(el.textContent), el);
        parent.normalize();
      }
    });
    currentHighlights = [];
    currentIndex = -1;
    const bar = document.querySelector(".search-results-bar");
    bar?.remove();
  }
  function normalizeForSearch(value) {
    let normalized = "";
    const starts = [];
    const ends = [];
    for (let offset = 0; offset < value.length;) {
      const character = String.fromCodePoint(value.codePointAt(offset));
      const start = offset;
      const end = offset + character.length;
      const folded = character.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase();
      for (const foldedCharacter of folded) {
        normalized += foldedCharacter;
        starts.push(start);
        ends.push(end);
      }
      offset = end;
    }
    return { normalized, starts, ends };
  }
  function scrollToHighlight() {
    currentHighlights.forEach((mark, index) => {
      const isCurrent = index === currentIndex;
      mark.classList.toggle("highlight-current", isCurrent);
      if (isCurrent) mark.setAttribute("aria-current", "true");
      else mark.removeAttribute("aria-current");
    });
    const current = currentHighlights[currentIndex];
    if (current) {
      current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
  function updateSearchBar() {
    let bar = document.querySelector(".search-results-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.className = "search-results-bar";
      bar.setAttribute("role", "status");
      bar.setAttribute("aria-live", "polite");
      document.body.append(bar);
    }

    const status = document.createElement("span");
    status.className = "search-results-status";
    status.textContent = currentHighlights.length
      ? `Résultat ${currentIndex + 1} sur ${currentHighlights.length}`
      : "Aucun résultat trouvé";
    bar.replaceChildren(status);

    if (currentHighlights.length > 1) {
      const previous = document.createElement("button");
      previous.type = "button";
      previous.textContent = "← Précédent";
      previous.disabled = currentIndex <= 0;
      previous.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex -= 1;
          scrollToHighlight();
          updateSearchBar();
        }
      });

      const next = document.createElement("button");
      next.type = "button";
      next.textContent = "Suivant →";
      next.disabled = currentIndex >= currentHighlights.length - 1;
      next.addEventListener("click", () => {
        if (currentIndex < currentHighlights.length - 1) {
          currentIndex += 1;
          scrollToHighlight();
          updateSearchBar();
        }
      });
      bar.append(previous, next);
    }

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "clear-search-results";
    clear.textContent = "Effacer";
    clear.addEventListener("click", clearHighlights);
    bar.append(clear);
    bar.classList.add("show");
  }
  function highlightText(term) {
    clearHighlights();
    const foldedTerm = normalizeForSearch(term).normalized;
    if (!foldedTerm) return;
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          const parent = node.parentElement;
          if (!parent || parent.closest("script, style, noscript, .search-results-bar, .search-form, [hidden], [aria-hidden='true']")) {
            return NodeFilter.FILTER_REJECT;
          }
          if (parent.getClientRects().length === 0) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const text = node.textContent;
      const foldedText = normalizeForSearch(text);
      const matches = [];
      let searchFrom = 0;
      let matchAt = foldedText.normalized.indexOf(foldedTerm, searchFrom);
      while (matchAt !== -1) {
        const start = foldedText.starts[matchAt];
        const end = foldedText.ends[matchAt + foldedTerm.length - 1];
        if (Number.isInteger(start) && Number.isInteger(end)) matches.push({ start, end });
        searchFrom = matchAt + Math.max(foldedTerm.length, 1);
        matchAt = foldedText.normalized.indexOf(foldedTerm, searchFrom);
      }
      if (!matches.length) return;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      matches.forEach(({ start, end }) => {
        fragment.append(document.createTextNode(text.slice(lastIndex, start)));
        const mark = document.createElement("mark");
        mark.className = "highlight";
        mark.textContent = text.slice(start, end);
        fragment.append(mark);
        currentHighlights.push(mark);
        lastIndex = end;
      });
      fragment.append(document.createTextNode(text.slice(lastIndex)));
      node.parentNode.replaceChild(fragment, node);
    });
    if (currentHighlights.length > 0) {
      currentIndex = 0;
      scrollToHighlight();
    }
    updateSearchBar();
  }
  searchBtn?.addEventListener("click", openSearch);
  searchClose?.addEventListener("click", closeSearch);
  searchOverlay?.addEventListener("click", closeSearch);
  searchSuggestions?.addEventListener("click", (event) => {
    const suggestion = event.target.closest(".suggestion-chip");
    if (!suggestion || !searchInput || !searchForm) return;
    searchInput.value = suggestion.textContent.trim();
    searchForm.requestSubmit();
  });
  searchForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const term = searchInput?.value?.trim();
    if (term) {
      highlightText(term);
      closeSearch();
    } else showMessage("Veuillez entrer un terme de recherche", "warning");
  });
  document.addEventListener("keydown", function (e) {
    const target = e.target;
    const isTyping = target instanceof HTMLElement && (
      target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
    );
    const openWithShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
    const openWithSlash = e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping;
    if (openWithShortcut || openWithSlash) {
      e.preventDefault();
      openSearch();
      return;
    }
    if (e.key === "Escape") closeSearch();
  });
});

// ============ HOME SLIDER ============
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".home .slide");
  const home = document.querySelector(".home");
  const prevBtn = document.querySelector(".home-prev");
  const nextBtn = document.querySelector(".home-next");
  const dots = document.querySelectorAll(".home-dots .dot");
  if (!slides.length) return;
  let currentIndex = 0,
    interval;
  const totalSlides = slides.length;
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      dots[i]?.classList.toggle("active", i === index);
      dots[i]?.setAttribute("aria-current", String(i === index));
    });
    currentIndex = index;
  }
  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= totalSlides) newIndex = 0;
    showSlide(newIndex);
    resetInterval();
  }
  function prevSlide() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = totalSlides - 1;
    showSlide(newIndex);
    resetInterval();
  }
  function resetInterval() {
    if (interval) clearInterval(interval);
    if (
      !document.hidden &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      interval = setInterval(nextSlide, 7000);
  }
  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => {
      showSlide(index);
      resetInterval();
    }),
  );
  home?.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });
  home?.addEventListener("mouseenter", () => clearInterval(interval));
  home?.addEventListener("mouseleave", resetInterval);
  home?.addEventListener("focusin", () => clearInterval(interval));
  home?.addEventListener("focusout", (event) => {
    if (!home.contains(event.relatedTarget)) resetInterval();
  });
  document.addEventListener("visibilitychange", resetInterval);
  resetInterval();
});

// ============ STATS COUNTER ANIMATION ============
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");
  if (!statNumbers.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute("data-target"));
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            element.textContent = target;
            observer.unobserve(element);
            return;
          }
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              element.textContent = target;
              clearInterval(timer);
            } else element.textContent = Math.floor(current);
          }, 16);
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.5 },
  );
  statNumbers.forEach((number) => observer.observe(number));
}
document.addEventListener("DOMContentLoaded", animateStats);

// ============ LOGIN, REGISTER, CONTACT FORMS ============
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector("#login-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const forgotForm = document.getElementById("forgot-form");
  const authContainer = document.querySelector(".login-form-container");
  const authBackdrop = authContainer?.querySelector(".auth-backdrop");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const forgotLink = document.getElementById("forgot-password-link");
  const backToLogin = document.getElementById("back-to-login");

  function closeAllModals() {
    loginForm?.classList.remove("active");
    registerForm?.classList.remove("active");
    forgotForm?.classList.remove("active");
    authContainer?.classList.remove("active");
    document.body.classList.remove("auth-modal-open");
    loginBtn?.setAttribute("aria-expanded", "false");
  }

  function openForm(form) {
    if (!form) return;
    closeAllModals();
    form.classList.add("active");
    authContainer?.classList.add("active");
    document.body.classList.add("auth-modal-open");
    loginBtn?.setAttribute("aria-expanded", String(form === loginForm));
    window.setTimeout(() => form.querySelector("input")?.focus({ preventScroll: true }), 100);
  }

  // Delegate from the document so this still works if the header is rebuilt.
  // Ignore clicks from nested tooltip/icon nodes by resolving the button itself.
  document.addEventListener("click", (event) => {
    const clickedLoginButton = event.target.closest?.("#login-btn");
    if (!clickedLoginButton) return;
    event.preventDefault();
    event.stopPropagation();
    if (loginForm?.classList.contains("active")) closeAllModals();
    else openForm(loginForm);
  });
  authBackdrop?.addEventListener("click", closeAllModals);
  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    openForm(registerForm);
  });
  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    openForm(loginForm);
  });
  forgotLink?.addEventListener("click", (e) => {
    e.preventDefault();
    openForm(forgotForm);
  });
  backToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    openForm(loginForm);
  });

  // Login submit
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value ?? "";
      if (!email || !password.trim()) {
        showMessage("Veuillez entrer votre email et mot de passe", "warning");
        return;
      }
      showLoader();
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.token) localStorage.setItem("token", data.token);
          showMessage(data.message, "success");
          closeAllModals();
          loginForm.reset();
          loginBtn?.setAttribute("aria-label", "Mon compte");
          const icon = loginBtn?.querySelector("i");
          if (icon) icon.className = data.user?.role === "admin" ? "fas fa-user-shield" : "fas fa-user-check";
        } else {
          showMessage(
            data.message || `Échec de connexion (HTTP ${res.status}). Vérifiez le serveur API.`,
            "error",
          );
        }
      } catch (error) {
        console.error("Login request failed:", error);
        showMessage(
          "Impossible de joindre le serveur de connexion. Vérifiez votre connexion ou réessayez dans quelques instants.",
          "error",
        );
      } finally {
        hideLoader();
      }
    });
  }

  // Register submit
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const firstName = document.getElementById("reg-firstname")?.value.trim();
      const lastName = document.getElementById("reg-lastname")?.value.trim();
      const username = document.getElementById("reg-username")?.value.trim();
      const email = document.getElementById("reg-email")?.value.trim();
      const password = document.getElementById("reg-password")?.value;
      const confirm = document.getElementById("reg-confirm-password")?.value;
      if (!firstName || !lastName || !username || !email || !password) {
        showMessage("Veuillez remplir tous les champs", "warning");
        return;
      }
      if (password !== confirm) {
        showMessage("Les mots de passe ne correspondent pas", "error");
        return;
      }
      if (password.length < 6) {
        showMessage(
          "Le mot de passe doit contenir au moins 6 caractères",
          "warning",
        );
        return;
      }
      showLoader();
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        if (data.success) {
          showMessage(
            `Inscription réussie ! Bienvenue ${firstName} ${lastName} !`,
            "success",
          );
          registerForm.reset();
          openForm(loginForm);
          document.getElementById("login-email").value = email;
        } else {
          showMessage(data.message, "error");
        }
      } catch (error) {
        showMessage("Erreur de connexion au serveur", "error");
      } finally {
        hideLoader();
      }
    });
  }

  // Contact form
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: document.getElementById("contact-name")?.value,
        email: document.getElementById("contact-email")?.value,
        phone: document.getElementById("contact-phone")?.value,
        message: document.getElementById("contact-message")?.value,
      };
      if (!data.name || !data.email || !data.message) {
        showMessage("Veuillez remplir tous les champs obligatoires", "warning");
        return;
      }
      showLoader();
      try {
        const res = await fetch(`${API_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await res.json();
        if (result.success) {
          showMessage(result.message, result.emailSent ? "success" : "warning");
          contactForm.reset();
        } else {
          showMessage(result.message, "error");
        }
      } catch (error) {
        showMessage("Erreur de connexion au serveur", "error");
      } finally {
        hideLoader();
      }
    });
  }

  // Close forms on outside click
  document.addEventListener("click", (event) => {
    const forms = [loginForm, registerForm, forgotForm];
    const isOpen = forms.some((form) => form?.classList.contains("active"));
    if (isOpen && !authContainer?.contains(event.target) && !loginBtn?.contains(event.target)) closeAllModals();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
});

// ============ LOGOUT ============
function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  const loginBtn = document.querySelector("#login-btn");
  loginBtn?.setAttribute("aria-label", "Connexion");
  const icon = loginBtn?.querySelector("i");
  if (icon) icon.className = "fas fa-user";
  showMessage("Déconnexion réussie !", "success");
  setTimeout(() => location.reload(), 1000);
}

// ============ CHECK LOGIN STATUS ============
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      const loginBtn = document.querySelector("#login-btn");
      loginBtn?.setAttribute("aria-label", "Mon compte");
      const icon = loginBtn?.querySelector("i");
      if (icon) icon.className = userData.role === "admin" ? "fas fa-user-shield" : "fas fa-user-check";
    } catch (e) {}
  }
});

// ============ LANGUAGE ============
const translations = {
  fr: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    projects: "Projets",
    beforeAfter: "Évolution",
    clients: "Clients",
    blogs: "Actualités",
    contact: "Contact",
    aboutHeading: "À propos de nous",
    servicesHeading: "Nos services",
    projectsHeading: "Nos réalisations",
    beforeAfterHeading: "Transformation de nos projets",
    reviewsHeading: "Ce que disent nos clients",
    blogHeading: "Actualités",
    contactHeading: "Contactez-nous",
    learnMore: "En savoir plus",
    startNow: "Commencez maintenant",
    sendMessage: "Envoyer un message",
    yourName: "Votre nom",
    yourEmail: "Votre email",
    yourPhone: "Votre téléphone",
    yourMessage: "Votre message",
    searchPlaceholder: "Rechercher sur le site...",
    phone: "Téléphone",
    emailLabel: "E-mail",
    address: "Adresse",
  },
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    projects: "Projects",
    beforeAfter: "Before/After",
    clients: "Clients",
    blogs: "News",
    contact: "Contact",
    aboutHeading: "About Us",
    servicesHeading: "Our Services",
    projectsHeading: "Our Achievements",
    beforeAfterHeading: "Transformation of Our Projects",
    reviewsHeading: "What Our Clients Say",
    blogHeading: "News",
    contactHeading: "Contact Us",
    learnMore: "Learn more",
    startNow: "Start now",
    sendMessage: "Send message",
    yourName: "Your name",
    yourEmail: "Your email",
    yourPhone: "Your phone",
    yourMessage: "Your message",
    searchPlaceholder: "Search the site...",
    phone: "Phone",
    emailLabel: "Email",
    address: "Address",
  },
  ar: {
    home: "الرئيسية",
    about: "من نحن",
    services: "خدماتنا",
    projects: "مشاريعنا",
    beforeAfter: "قبل / بعد",
    clients: "عملاؤنا",
    blogs: "أخبار",
    contact: "اتصل بنا",
    aboutHeading: "من نحن",
    servicesHeading: "خدماتنا",
    projectsHeading: "إنجازاتنا",
    beforeAfterHeading: "تحول مشاريعنا",
    reviewsHeading: "ماذا يقول عملاؤنا",
    blogHeading: "أخبار",
    contactHeading: "اتصل بنا",
    learnMore: "اعرف المزيد",
    startNow: "ابدأ الآن",
    sendMessage: "إرسال رسالة",
    yourName: "اسمك",
    yourEmail: "بريدك الإلكتروني",
    yourPhone: "هاتفك",
    yourMessage: "رسالتك",
    searchPlaceholder: "ابحث في الموقع...",
    phone: "الهاتف",
    emailLabel: "البريد الإلكتروني",
    address: "العنوان",
  },
};

function updateLanguage(lang) {
  localStorage.setItem("language", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  const nav = document.querySelectorAll(".navbar a");
  if (nav[0]) nav[0].textContent = translations[lang].home;
  if (nav[1]) nav[1].textContent = translations[lang].about;
  if (nav[2]) nav[2].textContent = translations[lang].services;
  if (nav[3]) nav[3].textContent = translations[lang].projects;
  if (nav[4]) nav[4].textContent = translations[lang].beforeAfter;
  if (nav[5]) nav[5].textContent = translations[lang].clients;
  if (nav[6]) nav[6].textContent = translations[lang].blogs;
  if (nav[7]) nav[7].textContent = translations[lang].contact;
  const headings = [
    "#about .heading",
    "#services .heading",
    "#projects .heading",
    "#before-after .heading",
    "#reviews .heading",
    "#blogs .heading",
    "#contact .heading",
  ];
  const texts = [
    translations[lang].aboutHeading,
    translations[lang].servicesHeading,
    translations[lang].projectsHeading,
    translations[lang].beforeAfterHeading,
    translations[lang].reviewsHeading,
    translations[lang].blogHeading,
    translations[lang].contactHeading,
  ];
  headings.forEach((h, i) => {
    if (document.querySelector(h))
      document.querySelector(h).textContent = texts[i];
  });
  document
    .querySelectorAll(".home .btn, .about .btn")
    .forEach((btn) => (btn.textContent = translations[lang].startNow));
  document
    .querySelectorAll(".services .btn, .blogs .btn")
    .forEach((btn) => (btn.textContent = translations[lang].learnMore));
  const contactBtn = document.querySelector(".contact .btn");
  if (contactBtn) contactBtn.textContent = translations[lang].sendMessage;
  const searchBox = document.getElementById("search-box");
  if (searchBox) searchBox.placeholder = translations[lang].searchPlaceholder;
  const fields = {
    name: "contact-name",
    email: "contact-email",
    phone: "contact-phone",
    message: "contact-message",
  };
  Object.keys(fields).forEach((key) => {
    const el = document.getElementById(fields[key]);
    if (el)
      el.placeholder =
        translations[lang][`your${key.charAt(0).toUpperCase() + key.slice(1)}`];
  });
  const info = document.querySelectorAll(".info h3");
  if (info[0]) info[0].textContent = translations[lang].phone;
  if (info[1]) info[1].textContent = translations[lang].emailLabel;
  if (info[2]) info[2].textContent = translations[lang].address;
  document
    .querySelectorAll(".lang-option")
    .forEach((opt) => opt.classList.remove("active"));
  const active = document.querySelector(`.lang-option[data-lang="${lang}"]`);
  if (active) active.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("language-btn");
  const langDropdown = document.getElementById("language-dropdown");
  if (langBtn && langDropdown) {
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langDropdown.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!langBtn.contains(e.target) && !langDropdown.contains(e.target))
        langDropdown.classList.remove("active");
    });
  }
  document.querySelectorAll(".lang-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      updateLanguage(opt.dataset.lang);
      langDropdown?.classList.remove("active");
    });
  });
  const saved = localStorage.getItem("language");
  if (saved && translations[saved]) updateLanguage(saved);
  else updateLanguage("fr");
});

// ============ FILTERS ============
function initBeforeAfterSlider() {
  const viewport = document.querySelector(".before-after-slider-container");
  const slider = document.querySelector(".before-after-slider");
  const previousButton = document.querySelector(".before-after-prev");
  const nextButton = document.querySelector(".before-after-next");
  if (!viewport || !slider || !previousButton || !nextButton) return;

  const updateControls = () => {
    const atStart = viewport.scrollLeft <= 2;
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    previousButton.disabled = atStart;
    nextButton.disabled = atEnd;
  };
  const scrollOneCard = (direction) => {
    const firstCard = slider.querySelector(".before-after-card:not([hidden])");
    if (!firstCard) return;
    const gap = Number.parseFloat(getComputedStyle(slider).columnGap) || 0;
    viewport.scrollBy({
      left: direction * (firstCard.getBoundingClientRect().width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  previousButton.addEventListener("click", () => scrollOneCard(-1));
  nextButton.addEventListener("click", () => scrollOneCard(1));
  viewport.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
}

function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".before-after-card");
  if (!filterBtns.length) return;
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
      filterBtns.forEach((filterBtn) => {
        const active = filterBtn === btn;
        filterBtn.classList.toggle("active", active);
        filterBtn.setAttribute("aria-pressed", String(active));
      });
      cards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.category !== filter;
      });
      const visibleCount = [...cards].filter((card) => !card.hidden).length;
      document
        .querySelector(".before-after-slider")
        ?.classList.toggle("is-short", visibleCount === 2);
      const viewport = document.querySelector(".before-after-slider-container");
      if (viewport) {
        viewport.scrollTo({
          left: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      }
    });
  });
}

// ============ FAQ ACCORDÉON ============
function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, index) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question) return;
    if (answer && !answer.id) answer.id = `faq-answer-${index + 1}`;
    question.setAttribute("role", "button");
    question.setAttribute("tabindex", "0");
    question.setAttribute("aria-expanded", String(item.classList.contains("active")));
    if (answer) question.setAttribute("aria-controls", answer.id);
    const toggleQuestion = () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
          otherItem
            .querySelector(".faq-question")
            ?.setAttribute("aria-expanded", "false");
        }
      });
      const isOpen = item.classList.toggle("active");
      question.setAttribute("aria-expanded", String(isOpen));
    };
    question.addEventListener("click", toggleQuestion);
    question.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleQuestion();
      }
    });
  });
}

function initScrollReveal() {
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  const revealTargets = document.querySelectorAll(
    ".section-subtitle, .heading, .section-description, .stat-card, .service-card, .project-card, .before-after-card, .article-card, .faq-item, .form-card, .map-card",
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -24px 0px" },
  );
  revealTargets.forEach((element, index) => {
    element.style.setProperty("--reveal-index", String(index % 5));
    element.classList.add("motion-reveal");
    observer.observe(element);
  });
}

function initPasswordControls() {
  document.querySelectorAll(".toggle-password").forEach((button) => {
    const input = document.getElementById(button.dataset.target);
    const icon = button.querySelector("i");
    if (!input) return;
    button.setAttribute("aria-label", "Afficher le mot de passe");
    button.setAttribute("aria-pressed", "false");
    icon?.setAttribute("aria-hidden", "true");
    button.addEventListener("click", () => {
      const isVisible = input.type === "password";
      input.type = isVisible ? "text" : "password";
      button.setAttribute("aria-label", isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe");
      button.setAttribute("aria-pressed", String(isVisible));
      icon?.classList.toggle("fa-eye", !isVisible);
      icon?.classList.toggle("fa-eye-slash", isVisible);
    });
  });

  const password = document.getElementById("reg-password");
  const strength = document.getElementById("password-strength");
  if (!password || !strength) return;
  const bars = strength.querySelectorAll(".strength-bar");
  const label = strength.querySelector(".strength-text");
  label?.setAttribute("aria-live", "polite");
  password.addEventListener("input", () => {
    const value = password.value;
    const score = value
      ? [
          value.length >= 12,
          /[a-z]/.test(value) && /[A-Z]/.test(value),
          /\d/.test(value),
          /[^A-Za-z0-9]/.test(value),
        ].filter(Boolean).length
      : 0;
    const level = score <= 1 ? "weak" : score <= 3 ? "medium" : "strong";
    bars.forEach((bar, index) => {
      bar.classList.remove("weak", "medium", "strong");
      if (index < score) bar.classList.add(level);
    });
    if (label) label.textContent = score === 0 ? "" : score <= 1 ? "Faible" : score <= 3 ? "Moyen" : "Fort";
  });
}

// ============ DARK MODE TOGGLE ============
function initDarkMode() {
  const darkModeBtn = document.getElementById("dark-mode-btn");
  if (!darkModeBtn) return;
  const moonIcon = darkModeBtn.querySelector("i");
  const isDarkMode = localStorage.getItem("darkMode") === "true";
  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    moonIcon?.classList.replace("fa-moon", "fa-sun");
  }
  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark);
    if (moonIcon) {
      if (isDark) moonIcon.classList.replace("fa-moon", "fa-sun");
      else moonIcon.classList.replace("fa-sun", "fa-moon");
      moonIcon.style.transform = "scale(1.1)";
      setTimeout(() => (moonIcon.style.transform = "scale(1)"), 200);
    }
  });
}
function detectSystemTheme() {
  if (localStorage.getItem("darkMode") === null) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      document.body.classList.add("dark-mode");
      document
        .querySelector("#dark-mode-btn i")
        ?.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("darkMode", "true");
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  detectSystemTheme();
});

// ============ GALERIE PROJET SOUK JDID - 12 PHOTOS ============
const soukJdidImages = [
  {
    src: "images/projets/souk-jdid/1.jpg",
    caption: "Vue générale - Entrée de Souk Jdid",
  },
  { src: "images/projets/souk-jdid/2.jpg", caption: "Préparation du terrain" },
  {
    src: "images/projets/souk-jdid/3.jpg",
    caption: "Mise en place des bordures",
  },
  { src: "images/projets/souk-jdid/4.jpg", caption: "Plantation d'arbres" },
  { src: "images/projets/souk-jdid/5.jpg", caption: "Aménagement paysager" },
  {
    src: "images/projets/souk-jdid/6.jpg",
    caption: "Installation éclairage public",
  },
  {
    src: "images/projets/souk-jdid/7.jpg",
    caption: "Revêtement des trottoirs",
  },
  { src: "images/projets/souk-jdid/8.jpg", caption: "Signalétique décorative" },
  { src: "images/projets/souk-jdid/9.jpg", caption: "Avancement des travaux" },
  { src: "images/projets/souk-jdid/10.jpg", caption: "Finitions" },
  { src: "images/projets/souk-jdid/11.jpg", caption: "Vue après aménagement" },
  {
    src: "images/projets/souk-jdid/12.jpg",
    caption: "Résultat final - Entrée embellie",
  },
];
let soukJdidCurrentIndex = 0;

function openSoukJdidGallery(index) {
  soukJdidCurrentIndex = index;
  const modal = document.getElementById("galleryModalSoukJdid");
  const img = document.getElementById("galleryImageSoukJdid");
  const caption = document.getElementById("galleryCaptionSoukJdid");
  const counter = document.getElementById("galleryCounterSoukJdid");
  if (!modal) return;
  img.src = soukJdidImages[soukJdidCurrentIndex].src;
  if (caption)
    caption.textContent = soukJdidImages[soukJdidCurrentIndex].caption;
  if (counter)
    counter.textContent = `${soukJdidCurrentIndex + 1} / ${soukJdidImages.length}`;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}
function closeSoukJdidGallery() {
  const modal = document.getElementById("galleryModalSoukJdid");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}
function nextSoukJdidImage() {
  soukJdidCurrentIndex = (soukJdidCurrentIndex + 1) % soukJdidImages.length;
  const img = document.getElementById("galleryImageSoukJdid");
  const caption = document.getElementById("galleryCaptionSoukJdid");
  const counter = document.getElementById("galleryCounterSoukJdid");
  if (img) img.src = soukJdidImages[soukJdidCurrentIndex].src;
  if (caption)
    caption.textContent = soukJdidImages[soukJdidCurrentIndex].caption;
  if (counter)
    counter.textContent = `${soukJdidCurrentIndex + 1} / ${soukJdidImages.length}`;
}
function prevSoukJdidImage() {
  soukJdidCurrentIndex =
    (soukJdidCurrentIndex - 1 + soukJdidImages.length) % soukJdidImages.length;
  const img = document.getElementById("galleryImageSoukJdid");
  const caption = document.getElementById("galleryCaptionSoukJdid");
  const counter = document.getElementById("galleryCounterSoukJdid");
  if (img) img.src = soukJdidImages[soukJdidCurrentIndex].src;
  if (caption)
    caption.textContent = soukJdidImages[soukJdidCurrentIndex].caption;
  if (counter)
    counter.textContent = `${soukJdidCurrentIndex + 1} / ${soukJdidImages.length}`;
}
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("galleryModalSoukJdid");
  if (modal && modal.style.display === "flex") {
    if (e.key === "Escape") closeSoukJdidGallery();
    if (e.key === "ArrowRight") nextSoukJdidImage();
    if (e.key === "ArrowLeft") prevSoukJdidImage();
  }
});

// ============ FONCTION POUR AFFICHER LES DÉTAILS DU PROJET ============
function showProjectDetails(projectId) {
  if (projectId === "souk-jdid") {
    alert(
      "Projet: Embellissement de l'entrée de Souk Jdid\nLocalisation: Sidi Bouzid, Tunisie\nAnnée: 2025\nStatut: Terminé\nPhotos: 12 vues",
    );
  } else {
    alert("Plus de détails disponibles prochainement.");
  }
}

// ============ REVIEWS SECTION ============
async function loadReviews() {
  try {
    const response = await fetch(`${API_URL}/reviews`);
    const data = await response.json();
    const reviewsSlider = document.querySelector(".reviews-slider");
    if (reviewsSlider && data.success && data.reviews) {
      reviewsSlider.innerHTML = "";
      if (data.reviews.length === 0) {
        reviewsSlider.innerHTML =
          '<div class="review-card"><div class="review-header"><div class="review-avatar"><i class="fas fa-user"></i></div><div class="review-info"><div class="review-name">Soyez le premier</div><div class="review-stars"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i></div></div></div><div class="review-quote"><i class="fas fa-quote-left"></i><p>Partagez votre expérience avec SOIT en laissant un avis !</p></div></div>';
      } else {
        data.reviews.forEach((review) => {
          const stars = getStarsHtml(review.rating);
          const slide = document.createElement("div");
          slide.className = "review-card";
          slide.innerHTML = `<div class="review-header"><div class="review-avatar"><i class="fas fa-user"></i></div><div class="review-info"><div class="review-name">${escapeHtml(review.name)}<span class="verified-badge"><i class="fas fa-check-circle"></i> Vérifié</span></div><div class="review-stars">${stars}</div><div class="review-date">${new Date(review.createdAt).toLocaleDateString("fr-FR")}</div></div></div><div class="review-quote"><i class="fas fa-quote-left"></i><p>${escapeHtml(review.comment)}</p></div><div class="review-project"><i class="fas fa-hard-hat"></i> Client SOIT</div>`;
          reviewsSlider.appendChild(slide);
        });
      }
      initReviewsSlider();
      updateRatingSummary(data.reviews);
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}
function getStarsHtml(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) stars += '<i class="fas fa-star"></i>';
    else if (i - 0.5 <= rating) stars += '<i class="fas fa-star-half-alt"></i>';
    else stars += '<i class="far fa-star"></i>';
  }
  return stars;
}
function updateRatingSummary(reviews) {
  const total = reviews.length;
  if (total === 0) return;
  const ratings = [0, 0, 0, 0, 0];
  let sum = 0;
  reviews.forEach((review) => {
    ratings[5 - review.rating]++;
    sum += review.rating;
  });
  const average = sum / total;
  const ratingNumber = document.querySelector(".rating-number");
  const ratingStars = document.querySelector(".rating-stars");
  const ratingCount = document.querySelector(".rating-count");
  if (ratingNumber) ratingNumber.textContent = average.toFixed(1);
  if (ratingCount) ratingCount.textContent = `Basé sur ${total} avis`;
  if (ratingStars) ratingStars.innerHTML = getStarsHtml(Math.round(average));
  const fills = document.querySelectorAll(".rating-fill");
  fills.forEach((fill, index) => {
    const percent = ((ratings[4 - index] / total) * 100).toFixed(0);
    fill.style.width = `${percent}%`;
    const percentSpan = fill.parentElement?.nextElementSibling;
    if (percentSpan) percentSpan.textContent = `${percent}%`;
  });
}
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
function enableTouchSwipe(viewport, onPrevious, onNext) {
  if (!viewport) return;
  let start = null;
  let ignoreClick = false;
  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    start = { x: event.clientX, y: event.clientY };
    viewport.setPointerCapture?.(event.pointerId);
  });
  viewport.addEventListener("pointerup", (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      ignoreClick = true;
      window.setTimeout(() => { ignoreClick = false; }, 350);
      if (dx < 0) onNext(); else onPrevious();
    }
  });
  viewport.addEventListener("pointercancel", () => { start = null; });
  viewport.addEventListener("click", (event) => {
    if (!ignoreClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
}
function initReviewsSlider() {
  const slider = document.querySelector(".reviews-slider");
  const slides = document.querySelectorAll(".review-card");
  const prevBtn = document.querySelector(".reviews-prev");
  const nextBtn = document.querySelector(".reviews-next");
  const dotsContainer = document.querySelector(".reviews-dots");
  if (!slider || slides.length === 0) return;
  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;
  function updateSlider() {
    const slideWidth = slides[0]?.offsetWidth || 0;
    slider.style.transform = `translateX(${-currentIndex * (slideWidth + 20)}px)`;
    updateDots();
    updateButtons();
  }
  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }
  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = dotsContainer.querySelectorAll(".review-dot");
    dots.forEach((dot, index) =>
      dot.classList.toggle("active", index === dotIndex),
    );
  }
  function createDots() {
    if (!dotsContainer) return;
    const numberOfDots = Math.ceil(totalSlides / slidesToShow);
    dotsContainer.innerHTML = "";
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.classList.add("review-dot");
      dot.setAttribute("aria-label", `Afficher les avis ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i * slidesToShow;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  }
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }
  function refreshSlider() {
    const newSlidesToShow =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      maxIndex = totalSlides - slidesToShow;
      currentIndex = Math.min(currentIndex, maxIndex);
      createDots();
    }
    updateSlider();
  }
  enableTouchSwipe(document.querySelector(".reviews-slider-container"), prevSlide, nextSlide);
  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshSlider, 150);
  });
  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// ============ FORGOT PASSWORD ============
const forgotForm = document.getElementById("forgot-form");
if (forgotForm) {
  forgotForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("forgot-email")?.value.trim();
    if (!email) {
      showMessage("Veuillez entrer votre email", "warning");
      return;
    }
    showLoader();
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      showMessage(data.message, data.success ? "success" : "error");
    } catch (error) {
      showMessage("Erreur de connexion au serveur", "error");
    } finally {
      hideLoader();
    }
  });
}

// ============ BLOG SLIDER ============
function initBlogSlider() {
  const slider = document.querySelector(".blogs-slider");
  const slides = document.querySelectorAll(".blogs .slide");
  const prevBtn = document.querySelector(".blog-slider-prev");
  const nextBtn = document.querySelector(".blog-slider-next");
  const dotsContainer = document.querySelector(".blog-slider-dots");
  if (!slider || slides.length === 0) return;
  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;
  function updateSlider() {
    const slideWidth = slides[0]?.offsetWidth || 0;
    slider.style.transform = `translateX(${-currentIndex * (slideWidth + 20)}px)`;
    updateDots();
    updateButtons();
  }
  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }
  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) =>
      dot.classList.toggle("active", index === dotIndex),
    );
  }
  function createDots() {
    if (!dotsContainer) return;
    const numberOfDots = Math.ceil(totalSlides / slidesToShow);
    dotsContainer.innerHTML = "";
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i * slidesToShow;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  }
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }
  function refreshSlider() {
    const newSlidesToShow =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      maxIndex = totalSlides - slidesToShow;
      currentIndex = Math.min(currentIndex, maxIndex);
      createDots();
    }
    updateSlider();
  }
  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshSlider, 150);
  });
  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// ============ REVIEW MODAL ============
function initReviewModal() {
  const openBtn = document.getElementById("openReviewModal");
  const modal = document.getElementById("reviewModal");
  const closeBtn = modal?.querySelector(".review-modal-close");
  const form = document.getElementById("review-form-modal");
  const stars = document.querySelectorAll("#reviewModal .rating-input i");
  const ratingInput = document.getElementById("review-rating-modal");
  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
    closeBtn?.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
  if (stars.length > 0 && ratingInput) {
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = parseInt(this.getAttribute("data-rating"));
        ratingInput.value = rating;
        stars.forEach((s, index) => {
          if (index < rating) {
            s.classList.add("active");
            s.classList.remove("far");
            s.classList.add("fas");
          } else {
            s.classList.remove("active");
            s.classList.remove("fas");
            s.classList.add("far");
          }
        });
      });
      star.addEventListener("mouseenter", function () {
        const rating = parseInt(this.getAttribute("data-rating"));
        stars.forEach((s, index) => {
          s.style.color = index < rating ? "#ffc107" : "#ccc";
        });
      });
      star.addEventListener("mouseleave", function () {
        const currentRating = parseInt(ratingInput.value);
        stars.forEach((s, index) => {
          s.style.color = index < currentRating ? "#ffc107" : "#ccc";
        });
      });
    });
  }
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("review-name-modal")?.value.trim();
      const email = document.getElementById("review-email-modal")?.value.trim();
      const rating = parseInt(ratingInput?.value || 0);
      const comment = document
        .getElementById("review-comment-modal")
        ?.value.trim();
      if (!name || !email || !comment) {
        showMessage("Veuillez remplir tous les champs", "warning");
        return;
      }
      if (rating === 0) {
        showMessage("Veuillez sélectionner une note", "warning");
        return;
      }
      if (comment.length < 10) {
        showMessage(
          "Votre commentaire doit contenir au moins 10 caractères",
          "warning",
        );
        return;
      }
      showLoader();
      try {
        const response = await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, rating, comment }),
        });
        const result = await response.json();
        if (result.success) {
          showMessage(result.message, "success");
          form.reset();
          ratingInput.value = "0";
          stars.forEach((star) => {
            star.classList.remove("active", "fas");
            star.classList.add("far");
          });
          modal.classList.remove("active");
          document.body.style.overflow = "";
          setTimeout(() => loadReviews(), 1000);
        } else {
          showMessage(result.message, "error");
        }
      } catch (error) {
        showMessage("Erreur de connexion au serveur", "error");
      } finally {
        hideLoader();
      }
    });
  }
}

// ============ CURRENT PROJECT SLIDER ============
function initProjectSlider() {
  const slider = document.querySelector(".project-slider");
  const slides = document.querySelectorAll(".project-slide");
  const prevBtn = document.querySelector(".project-prev");
  const nextBtn = document.querySelector(".project-next");
  const dotsContainer = document.querySelector(".project-slider-dots");
  if (!slider || slides.length === 0) return;
  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;
  function updateSlider() {
    const slideWidth = slides[0]?.offsetWidth || 0;
    slider.style.transform = `translateX(${-currentIndex * (slideWidth + 15)}px)`;
    updateDots();
    updateButtons();
  }
  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }
  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = dotsContainer.querySelectorAll(".project-dot");
    dots.forEach((dot, index) =>
      dot.classList.toggle("active", index === dotIndex),
    );
  }
  function createDots() {
    if (!dotsContainer) return;
    const numberOfDots = Math.ceil(totalSlides / slidesToShow);
    dotsContainer.innerHTML = "";
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.classList.add("project-dot");
      dot.setAttribute("aria-label", `Afficher la diapositive ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i * slidesToShow;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSlider();
    }
  }
  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  }
  function refreshSlider() {
    const newSlidesToShow =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      maxIndex = totalSlides - slidesToShow;
      currentIndex = Math.min(currentIndex, maxIndex);
      createDots();
    }
    updateSlider();
  }
  enableTouchSwipe(document.querySelector(".project-slider-container"), prevSlide, nextSlide);
  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshSlider, 150);
  });
  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// ============ INITIALISATIONS ============
document.addEventListener("DOMContentLoaded", function () {
  loadPublicProjects().then((updated) => {
    if (updated) {
      initProjectGallery();
      initScrollReveal();
    }
    initProjectCategoryFilters();
  });
  initBeforeAfterSlider();
  initFilters();
  initBlogSlider();
  initProjectSlider();
  initFaq();
  initScrollReveal();
  initPasswordControls();
  loadReviews();
  initReviewModal();
  initReviewsSlider();
  initProjectGallery();
  initArticleModal();
});

// ============ MANAGED PROJECTS ============
async function loadPublicProjects() {
  const grid = document.querySelector("#projects .projects-grid");
  if (!grid) return false;

  try {
    const response = await fetch(`${API_URL}/projects`);
    const data = await response.json();
    if (!response.ok || !data.success || !Array.isArray(data.projects)) return false;

    if (data.projects.length === 0) {
      grid.replaceChildren(createProjectEmptyState());
      const count = document.querySelector(".projects-count strong");
      if (count) count.textContent = "00";
      return true;
    }

    const createTextElement = (tag, className, text) => {
      const element = document.createElement(tag);
      if (className) element.className = className;
      element.textContent = text;
      return element;
    };

    const cards = data.projects.map((project) => {
      const sources = [project.image, ...(Array.isArray(project.galleryImages) ? project.galleryImages : [])]
        .filter((source, index, all) => typeof source === "string" && source && all.indexOf(source) === index);
      if (!sources.length) return null;

      const card = document.createElement("article");
      card.className = "project-card motion-reveal";
      card.dataset.gallery = sources.join("|");
      card.dataset.projectCategory = project.category || "Projet SOIT";

      const imageWrap = document.createElement("div");
      imageWrap.className = "project-image";
      const image = document.createElement("img");
      image.src = sources[0];
      image.alt = project.title || "Projet SOIT";
      image.loading = "lazy";
      imageWrap.append(image);

      const overlay = document.createElement("div");
      overlay.className = "project-overlay";
      const links = document.createElement("div");
      links.className = "project-links";
      const viewButton = document.createElement("button");
      viewButton.type = "button";
      viewButton.className = "project-link";
      viewButton.setAttribute("aria-label", `Voir les photos du projet ${project.title || "SOIT"}`);
      viewButton.innerHTML = '<i class="fas fa-expand" aria-hidden="true"></i>';
      links.append(viewButton);
      overlay.append(links);
      imageWrap.append(overlay);

      const imageLabel = document.createElement("span");
      imageLabel.className = "project-image-label";
      imageLabel.innerHTML = '<i class="fas fa-camera" aria-hidden="true"></i> Photos du chantier SOIT';
      imageWrap.append(imageLabel);
      card.append(imageWrap);

      const content = document.createElement("div");
      content.className = "project-content";
      content.append(createTextElement("span", "project-category", project.category || "Projet SOIT"));
      content.append(createTextElement("h3", "", project.title || "Projet SOIT"));
      content.append(createTextElement("p", "", project.description || ""));

      const meta = document.createElement("div");
      meta.className = "project-meta";
      const location = document.createElement("span");
      location.innerHTML = '<i class="fas fa-map-marker-alt" aria-hidden="true"></i>';
      location.append(document.createTextNode(` ${project.location || "Tunisie"}`));
      const year = document.createElement("span");
      year.innerHTML = project.year
        ? '<i class="fas fa-calendar-alt" aria-hidden="true"></i>'
        : '<i class="fas fa-images" aria-hidden="true"></i>';
      year.append(document.createTextNode(project.year || "Chantier en images"));
      meta.append(location, year);
      content.append(meta);
      card.append(content);
      return card;
    }).filter(Boolean);

    if (!cards.length) return false;
    grid.replaceChildren(...cards);
    const count = document.querySelector(".projects-count strong");
    if (count) count.textContent = String(cards.length).padStart(2, "0");
    return true;
  } catch {
    // Keep the hand-authored project cards visible if the API is temporarily unavailable.
    return false;
  }
}

function initProjectCategoryFilters() {
  const filterBar = document.getElementById("projectFilters");
  const grid = document.querySelector("#projects .projects-grid");
  if (!filterBar || !grid) return;

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  if (!cards.length) {
    filterBar.replaceChildren();
    filterBar.hidden = true;
    return;
  }

  const normalize = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("fr");
  const categories = [...new Set(cards.map((card) => {
    const categoryElement = card.querySelector(".project-category");
    const category = card.dataset.projectCategory || categoryElement?.textContent || "Projet SOIT";
    card.dataset.projectCategory = category.trim();
    return category.trim();
  }).filter(Boolean))];

  filterBar.hidden = categories.length < 2;
  if (filterBar.hidden) {
    filterBar.replaceChildren();
    return;
  }

  const count = document.querySelector(".projects-count strong");
  const buttons = [{ label: "Tous", value: "*" }, ...categories.map((category) => ({ label: category, value: category }))];
  filterBar.replaceChildren(...buttons.map(({ label, value }, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-filter-btn";
    button.textContent = label;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    if (index === 0) button.classList.add("active");
    button.addEventListener("click", () => {
      const selected = normalize(value);
      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = value === "*" || normalize(card.dataset.projectCategory) === selected;
        card.hidden = !matches;
        if (matches) visibleCount += 1;
      });
      buttons.forEach((item, buttonIndex) => {
        const active = buttonIndex === index;
        const filterButton = filterBar.children[buttonIndex];
        filterButton.classList.toggle("active", active);
        filterButton.setAttribute("aria-pressed", String(active));
      });
      if (count) count.textContent = String(visibleCount).padStart(2, "0");
    });
    return button;
  }));
}

function createProjectEmptyState() {
  const message = document.createElement("p");
  message.className = "projects-empty-state";
  message.textContent = "Nos prochains projets seront bientôt présentés ici.";
  return message;
}

// ============ PROJECT GALLERY ============
function initProjectGallery() {
  const slides = document.querySelectorAll(".project-slide");
  const modal = document.getElementById("projectGalleryModal");
  const modalImg = modal?.querySelector("img");
  const closeBtn = modal?.querySelector(".gallery-close");
  const prevBtn = modal?.querySelector(".gallery-prev");
  const nextBtn = modal?.querySelector(".gallery-next");
  const caption = modal?.querySelector(".gallery-caption");
  const counter = modal?.querySelector(".gallery-counter");
  const currentProjectImages = [];
  const portfolioImages = [];
  let activeImages = currentProjectImages;
  let currentIndex = 0;
  slides.forEach((slide) => {
    const img = slide.querySelector("img");
    const imgSrc = img?.src;
    const imgCaption = slide.querySelector(".slide-caption")?.innerText || "";
    if (imgSrc) {
      const index = currentProjectImages.push({ src: imgSrc, caption: imgCaption }) - 1;
      slide.addEventListener("click", () => openGallery(index, currentProjectImages));
    }
  });
  document.querySelectorAll(".projects-grid .project-card").forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;
    const caption = card.querySelector("h3")?.textContent.trim() || img.alt;
    const gallerySources = (card.dataset.gallery || img.getAttribute("src") || "").split("|").filter(Boolean);
    const index = portfolioImages.length;
    gallerySources.forEach((src, galleryIndex) => {
      portfolioImages.push({
        src: new URL(src, document.baseURI).href,
        caption: galleryIndex ? caption + " - photo " + (galleryIndex + 1) : caption,
      });
    });
    const button = card.querySelector(".project-link");
    button?.setAttribute("aria-label", `Voir la photo : ${caption}`);
    button?.addEventListener("click", () => openGallery(index, portfolioImages));
  });
  function openGallery(index, imageSet) {
    if (!modal || !modalImg) return;
    activeImages = imageSet;
    currentIndex = index;
    modalImg.src = activeImages[currentIndex].src;
    if (caption) caption.textContent = activeImages[currentIndex].caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeGallery() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  function nextImage() {
    if (!modalImg) return;
    currentIndex = (currentIndex + 1) % activeImages.length;
    modalImg.src = activeImages[currentIndex].src;
    if (caption) caption.textContent = activeImages[currentIndex].caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
  }
  function prevImage() {
    if (!modalImg) return;
    currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
    modalImg.src = activeImages[currentIndex].src;
    if (caption) caption.textContent = activeImages[currentIndex].caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
  }
  closeBtn?.addEventListener("click", closeGallery);
  prevBtn?.addEventListener("click", prevImage);
  nextBtn?.addEventListener("click", nextImage);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeGallery();
  });
  document.addEventListener("keydown", (e) => {
    if (!modal?.classList.contains("active")) return;
    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
}

// ============ ARTICLE MODAL ============
function initArticleModal() {
  const readMoreBtns = document.querySelectorAll(".read-more, .btn-read-more");
  const modal = document.getElementById("articleModal");
  const modalClose = modal?.querySelector(".modal-close");
  if (!modal) return;
  readMoreBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const article = btn.closest(".article-card, .featured-article");
      if (article) {
        const img = article.querySelector("img")?.src;
        const title = article.querySelector("h2, h3")?.innerText;
        const meta = article.querySelector(".article-meta")?.innerHTML;
        const desc = article.querySelector("p")?.innerText;
        const modalImg = modal.querySelector("img");
        const modalTitle = modal.querySelector("h2");
        const modalMeta = modal.querySelector(".modal-meta");
        const modalDesc = modal.querySelector(".modal-description");
        if (modalImg) modalImg.src = img;
        if (modalTitle) modalTitle.textContent = title;
        if (modalMeta) modalMeta.innerHTML = meta;
        if (modalDesc) modalDesc.textContent = desc;
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });
  modalClose?.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  });
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal?.classList.contains("active")) {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
}
