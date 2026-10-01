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

const pageTranslations = {
  en: {
    "Aller au contenu principal": "Skip to main content", Accueil: "Home", "À propos": "About", Services: "Services", Projets: "Projects", Évolution: "Our impact", Actualités: "News", Clients: "Clients", Contact: "Contact",
    Menu: "Menu", Infos: "Information", Rechercher: "Search", Connexion: "Log in", Langue: "Language", "Mode sombre": "Dark mode", "Suggestions populaires": "Popular searches", "Construction routes": "Road construction", Terrassement: "Earthworks", Ponts: "Bridges",
    "Accédez à votre espace personnel": "Access your account", "Se souvenir de moi": "Remember me", "Mot de passe oublié ?": "Forgot password?", "Se connecter": "Log in", "Pas encore de compte ?": "Don't have an account yet?", "Créer un compte": "Create an account", Inscription: "Sign up", "Créez votre compte gratuitement": "Create your account for free", "S'inscrire": "Register", "Déjà un compte ?": "Already have an account?", "Entrez votre email pour réinitialiser": "Enter your email to reset your password", "Envoyer le lien": "Send the link", "← Retour à la connexion": "← Back to login", "Nos coordonnées": "Our contact details", Téléphone: "Phone", "E-mail": "Email", Adresse: "Address", "Cliquez pour ouvrir dans Google Maps": "Click to open in Google Maps", Horaires: "Opening hours", "Lun - Ven : 8h00 - 17h30": "Mon–Fri: 8:00 AM–5:30 PM", "Sam : 8h00 - 13h00": "Sat: 8:00 AM–1:00 PM", "Dim : Fermé": "Sun: Closed", "Suivez-nous": "Follow us",
    "Leader depuis 1997": "Leading since 1997", "Infrastructure & Travaux Publics": "Infrastructure & Public Works", "Plus de 28 ans d'expertise au service du développement national. SOIT réalise des projets d'envergure qui transforment le territoire tunisien.": "More than 28 years of expertise serving national development. SOIT delivers major projects that transform Tunisia.", "Découvrir notre savoir-faire": "Discover our expertise", "Notre empreinte": "Our footprint", "Des infrastructures qui connectent la Tunisie": "Infrastructure that connects Tunisia", "Routes, ponts, réseaux urbains, terrassement... SOIT construit des infrastructures durables qui créent de la valeur et rapprochent les territoires.": "Roads, bridges, urban networks and earthworks: SOIT builds lasting infrastructure that creates value and connects communities.", "Découvrir nos réalisations": "Explore our projects", "Votre partenaire de confiance": "Your trusted partner", "Votre projet mérite l'excellence": "Your project deserves excellence", "Entreprise agréée Catégorie 5, nous garantissons qualité, sécurité et respect des délais pour concrétiser vos ambitions.": "As a Category 5 certified company, we deliver quality, safety and on-time work to bring your plans to life.", "Demander un devis": "Request a quote",
    "Notre histoire": "Our story", "Qui sommes-nous ?": "Who are we?", "Découvrez l'entreprise qui construit l'avenir de la Tunisie depuis 1997": "Discover the company building Tunisia's future since 1997", "La Société El Oukhoua d'Infrastructure et de Travaux Publics (SOIT)": "El Oukhoua Infrastructure and Public Works Company (SOIT)", Fondation: "Founded", Statut: "Legal status", "Agrément": "Accreditation", "État Catégorie 5": "Category 5 state accreditation", Spécialité: "Specialty", Gérant: "Manager", Certification: "Certification", "Qualité & Sécurité": "Quality & Safety", "SOIT est une entreprise tunisienne spécialisée dans le secteur du BTP. Depuis sa création, elle s'est imposée comme un acteur majeur dans le domaine de l'infrastructure et des travaux publics en Tunisie.": "SOIT is a Tunisian construction company. Since its founding, it has become a major player in infrastructure and public works across Tunisia.", "Notre société à responsabilité limitée (S.A.R.L.) est fière d'être classée comme Entreprise Agréée par l'État en Catégorie, témoignant de notre conformité aux normes les plus élevées de qualité et de sécurité.": "Our limited liability company is proud to hold state-approved company status, reflecting our commitment to high standards of quality and safety.", "Découvrir nos services →": "Explore our services →", "ans d'expérience": "years of experience", "projets réalisés": "projects completed", "clients satisfaits": "satisfied clients", professionnels: "professionals",
    "Notre expertise": "Our expertise", "Une gamme complète de services pour vos projets d'infrastructure": "A complete range of services for your infrastructure projects", "La Société El Oukhoua d'Infrastructure et de Travaux (SOIT) propose une gamme complète de services spécialisés dans les infrastructures de transport et les réseaux urbains.": "El Oukhoua Infrastructure and Public Works Company (SOIT) provides specialized transport infrastructure and urban network services.", "Entreprise agréée par l'État (Catégorie 5)": "State-approved company (Category 5)", "Infrastructures Routières": "Road Infrastructure", "Entreprise Générale de Routes": "General road construction", "Revêtements Routiers": "Road surfacing", "Terrassements": "Earthworks", "Entretien et Réparation": "Maintenance and repair", "Demander un devis →": "Request a quote →", "Voiries et Réseaux Divers (VRD)": "Roads and Utility Networks", "Entreprise Générale VRD": "General utility network works", "Pose de Canalisations Hydrauliques": "Water pipeline installation", "Réseaux Divers (Électricité, Télécom)": "Utility networks (power, telecoms)", "Travaux Publics & Terrassement": "Public Works & Earthworks", "Gestion de Projet": "Project management", "Nettoyage de Chantier": "Site cleanup", "Logistique de Transport": "Transport logistics", "Réseaux et Infrastructures": "Networks & Infrastructure", "Infrastructures Urbaines": "Urban infrastructure", "Gestion de Projets Complexes": "Complex project management", "Solutions Durables": "Sustainable solutions",
    "Portfolio terrain": "Projects on site", "Des projets réels, sur le terrain": "Real projects, on the ground", "Une sélection de chantiers SOIT, illustrés par les photos de nos équipes.": "A selection of SOIT projects, shown in photos taken by our teams.", "projets documentés": "documented projects", "Photos du chantier SOIT": "SOIT site photos", "Lotissement VRD": "Utility network development", "Aménagement Siliana El Jadida": "Siliana El Jadida development", "Travaux d'aménagement et de réseaux divers pour le nouveau lotissement.": "Development and utility network works for the new subdivision.", "Siliana, Tunisie": "Siliana, Tunisia", "Chantier en images": "Project photos", "Aménagement urbain": "Urban development", "Entrée de la ville, Souk Jdid": "Souk Jdid town entrance", "Embellissement de l'entrée de Souk Jdid, dans le gouvernorat de Sidi Bouzid.": "Improving the entrance to Souk Jdid in the Sidi Bouzid Governorate.", "Sidi Bouzid, Tunisie": "Sidi Bouzid, Tunisia", "Projet achevé": "Completed project", "Infrastructures routières": "Road infrastructure", "Travaux de voirie": "Road works", "Préparation et revêtement d'une chaussée, photographiés sur le chantier.": "Road preparation and surfacing, photographed on site.", "Revêtement routier": "Road surfacing",
    "Notre impact": "Our impact", "Nos chantiers, avant et après": "Our projects: before and after", "Comparez les photos réelles de nos travaux. Chaque paire est présentée séparément pour respecter son angle de prise de vue.": "Compare real photos of our work. Each pair is shown separately to preserve its original camera angle.", Tous: "All", Quartiers: "Neighborhoods", Voirie: "Roads", Avant: "Before", "Après": "After", "Un espace public réaménagé": "A renewed public space", "Transformation d'un espace de quartier en promenade paysagée.": "Transforming a neighborhood space into a landscaped promenade.", "Réhabilitation d'une ruelle": "Lane rehabilitation", "Une chaussée remise en état pour faciliter l'accès aux habitations.": "A restored road providing easier access to homes.", "Modernisation d'une voie": "Road modernization", "Travaux de nivellement et réalisation d'une chaussée neuve.": "Grading works and construction of a new road.", "Aménagement d'un accès local": "Local access improvement", "Passage d'une voie en terre à un accès revêtu et praticable.": "Converting an unpaved road into a surfaced, accessible route.", "Voirie et éclairage public": "Roads and public lighting", "Amélioration d'une voie locale et de son éclairage nocturne.": "Improving a local road and its night lighting.", "Réaménagement d'une voie locale": "Local road renewal", "Une rue plus propre et plus accessible pour les riverains.": "A cleaner, more accessible street for residents.",
    "Projet phare": "Featured project", "Projet en cours": "Ongoing project", "Découvrez l'avancement de notre projet d'envergure": "See the progress of our major project", "Projet prioritaire": "Priority project", "En cours": "In progress", "Projet d'aménagement d'un nouveau lotissement moderne à Siliana, comprenant des infrastructures routières, réseaux divers (VRD), espaces verts et équipements publics. Un projet d'envergure qui transformera la région et améliorera la qualité de vie des habitants.": "Development of a modern subdivision in Siliana, including roads, utility networks, green spaces and public facilities. This major project will transform the area and improve residents' quality of life.", Localisation: "Location", "Date de début": "Start date", "Durée prévisionnelle": "Planned duration", "Fin estimée": "Estimated completion", Superficie: "Area", Budget: "Budget", "Avancement des travaux": "Work progress", Étude: "Planning", "Terrassement": "Earthworks", "En cours": "In progress", "Espaces verts": "Green spaces", Livraison: "Handover", "Galerie du projet": "Project gallery", "Découvrez l'évolution du chantier en images": "Follow the project through photos", "Vue générale du projet": "Overall project view", "Plan d'aménagement": "Development plan", "Localisation satellite": "Satellite location", "Plan de lotissement approuvé": "Approved subdivision plan", "Phase 1 - Terrassement": "Phase 1 - Earthworks", "Phase 2 - Réseaux": "Phase 2 - Utility networks", "Phase 3 - Voirie": "Phase 3 - Roads", "Vue aérienne des travaux": "Aerial view of the works", "Équipements modernes": "Modern equipment", "Installation des réseaux": "Utility network installation", "Notre équipe sur le terrain": "Our team on site", "Matériaux de qualité": "Quality materials", "Contrôle qualité rigoureux": "Strict quality control", "Sécurité sur le chantier": "Site safety", "Travaux de finition": "Finishing works", "Résultat final attendu": "Expected final result", "Équipe projet": "Project team", "Chef de projet": "Project manager", Ingénieurs: "Engineers", "5 experts terrain": "5 site experts", "Ouvriers qualifiés": "Skilled workers", "35 professionnels": "35 professionals", "Contrôle qualité": "Quality control", "3 inspecteurs": "3 inspectors", "Intéressé par ce projet ?": "Interested in this project?", "Contactez-nous pour plus d'informations sur les opportunités d'investissement": "Contact us to learn more about investment opportunities", "Nous contacter": "Contact us", "Voir les photos": "View photos", "Parler d'un projet similaire": "Discuss a similar project",
    "Actualités & Événements": "News & Events", "Dernières nouvelles": "Latest news", "Restez informés des dernières actualités de SOIT": "Keep up with the latest SOIT news", "À la une": "Featured", "Projet": "Project", "5 min de lecture": "5 min read", "Lancement du projet Siliana El Jadida": "Siliana El Jadida project begins", "SOIT démarre les travaux d'aménagement du nouveau lotissement \"Siliana El Jadida\". Un projet d'envergure de 540 jours qui transformera la région avec des infrastructures modernes et durables.": "SOIT has begun work on the new Siliana El Jadida subdivision. This 540-day project will transform the area with modern, sustainable infrastructure.", "jours de travaux": "days of work", "DT budget": "DT budget", "Lire l'article complet": "Read the full story", "15 Mars 2025": "March 15, 2025", "245 vues": "245 views", "SOIT renouvelle son agrément Catégorie 5": "SOIT renews its Category 5 accreditation", "L'entreprise confirme son statut auprès de l'État tunisien pour les grands projets d'infrastructure.": "The company confirms its status with the Tunisian state for major infrastructure projects.", "Lire la suite": "Read more", Anniversaire: "Anniversary", "14 Avril 2025": "April 14, 2025", "512 vues": "512 views", "SOIT fête ses 28 ans d'excellence": "SOIT celebrates 28 years of excellence", "Fondée en 1997, SOIT célèbre 28 années d'engagement pour le développement des infrastructures tunisiennes.": "Founded in 1997, SOIT celebrates 28 years of commitment to developing Tunisia's infrastructure.", Investissement: "Investment", "20 Janvier 2025": "January 20, 2025", "189 vues": "189 views", "Renouvellement de notre parc machine": "Renewing our equipment fleet", "SOIT investit dans des équipements de dernière génération pour optimiser ses chantiers et garantir l'excellence.": "SOIT is investing in state-of-the-art equipment to improve its sites and deliver excellent results.", "10 Décembre 2024": "December 10, 2024", "156 vues": "156 views", "Programme de formation pour nos équipes": "Training program for our teams", "SOIT investit dans la montée en compétences de ses collaborateurs avec des programmes certifiants.": "SOIT is developing its employees' skills through certified training programs.", "Développement durable": "Sustainable development", "5 Septembre 2024": "September 5, 2024", "203 vues": "203 views", "SOIT s'engage pour l'environnement": "SOIT commits to the environment", "L'entreprise adopte des pratiques durables pour réduire son impact environnemental et protéger les écosystèmes.": "The company is adopting sustainable practices to reduce its environmental impact and protect ecosystems.", Partenariat: "Partnership", "15 Août 2024": "August 15, 2024", "98 vues": "98 views", "Nouveau partenariat stratégique": "New strategic partnership", "SOIT signe un accord avec un leader international pour renforcer son expertise technique.": "SOIT has signed an agreement with an international leader to strengthen its technical expertise.", "Restez informés": "Stay informed", "Recevez nos actualités directement dans votre boîte mail": "Get SOIT news delivered straight to your inbox", "L'inscription à notre lettre d'information sera bientôt disponible.": "Newsletter signup will be available soon.",
    Témoignages: "Testimonials", "Ce que disent nos clients": "What our clients say", "La satisfaction de nos clients, notre plus belle récompense": "Our clients' satisfaction is our greatest reward", "Basé sur 128 avis": "Based on 128 reviews", "5 étoiles": "5 stars", "4 étoiles": "4 stars", "3 étoiles": "3 stars", "2 étoiles": "2 stars", "1 étoile": "1 star", "Donnez votre avis": "Leave a review", "Partagez votre expérience": "Share your experience", "Votre note :": "Your rating:", "Envoyer mon avis": "Submit my review",
    "Questions fréquentes": "Frequently asked questions", "Foire Aux Questions": "Frequently Asked Questions", "Toutes les réponses à vos questions sur nos services": "Answers to your questions about our services", "Quels types de projets réalisez-vous ?": "What types of projects do you deliver?", "Nous réalisons tous types de projets d'infrastructure :": "We deliver all types of infrastructure projects:", "Construction et réfection de routes": "Road construction and rehabilitation", "Ponts et ouvrages d'art": "Bridges and civil engineering structures", "VRD (Voiries et Réseaux Divers)": "Roads and utility networks", "Terrassement et aménagement": "Earthworks and site development", "Réseaux hydrauliques et d'assainissement": "Water and sanitation networks", "Comment obtenir un devis ?": "How can I get a quote?", "Pour obtenir un devis gratuit :": "To get a free quote:", "Remplissez le formulaire de contact": "Fill out the contact form", "Appelez-nous au": "Call us at", "Envoyez-nous un email à": "Email us at", "Nous vous répondons sous 24h avec une proposition détaillée.": "We will reply within 24 hours with a detailed proposal.", "Quelles sont vos zones d'intervention ?": "Which areas do you serve?", "Nous intervenons sur tout le territoire tunisien, avec une base principale à Sousse. Nos équipes sont mobiles et peuvent réaliser des projets dans toutes les régions :": "We work across Tunisia, based in Sousse. Our mobile teams can deliver projects in every region:", "Quels sont vos délais de réalisation ?": "What are your project timelines?", "Les délais varient selon la complexité du projet :": "Timelines vary depending on project complexity:", "Petits projets :": "Small projects:", "2 à 4 semaines": "2 to 4 weeks", "Projets moyens :": "Medium projects:", "2 à 6 mois": "2 to 6 months", "Grands projets :": "Large projects:", "6 à 24 mois": "6 to 24 months", "Nous respectons toujours nos engagements contractuels.": "We always honor our contractual commitments.", "Quelles sont vos certifications ?": "What certifications do you hold?", "SOIT est fièrement certifiée :": "SOIT is proudly certified:", "✅ Entreprise agréée par l'État - Catégorie 5": "✅ State-approved company - Category 5", "✅ Certification Qualité ISO 9001:2015": "✅ ISO 9001:2015 Quality Certification", "✅ Agrément Sécurité sur les chantiers": "✅ Site Safety Accreditation", "✅ Membre de la Fédération Tunisienne du BTP": "✅ Member of the Tunisian Construction Federation", "Comment devenir partenaire ou fournisseur ?": "How can I become a partner or supplier?", "Nous sommes toujours à la recherche de partenaires de qualité. Contactez notre service achats :": "We are always looking for quality partners. Contact our procurement team:", "Vous n'avez pas trouvé votre réponse ?": "Didn't find your answer?", "Contactez-nous": "Contact us",
    "Une question ? Un projet ? Notre équipe est à votre écoute": "A question or a project? Our team is here to help", "Ouvrir dans Google Maps": "Open in Google Maps", "N'hésitez pas à nous contacter": "Get in touch with us", "Envoyer un message": "Send a message", "Votre nom": "Your name", "Votre email": "Your email", "Votre téléphone": "Your phone", "Votre message": "Your message", "Expert en infrastructure et travaux publics en Tunisie depuis 1997.": "Infrastructure and public works experts in Tunisia since 1997.", "Liens rapides": "Quick links", "Travaux Publics": "Public Works", "Réseaux Urbains": "Urban networks", "Sousse, Tunisie": "Sousse, Tunisia", "Tous droits réservés. Reproduction interdite sans autorisation.": "All rights reserved. Reproduction prohibited without authorization.", "Créé par": "Created by", "Développeur web": "Web developer", "Retour en haut de page": "Back to top"
  },
  ar: {
    "Aller au contenu principal": "انتقل إلى المحتوى الرئيسي", Accueil: "الرئيسية", "À propos": "من نحن", Services: "الخدمات", Projets: "المشاريع", Évolution: "الأثر", Actualités: "الأخبار", Clients: "العملاء", Contact: "اتصل بنا",
    Menu: "القائمة", Infos: "معلومات", Rechercher: "بحث", Connexion: "تسجيل الدخول", Langue: "اللغة", "Mode sombre": "الوضع الداكن", "Suggestions populaires": "عمليات بحث شائعة", "Construction routes": "إنشاء الطرق", Terrassement: "أعمال الحفر", Ponts: "الجسور",
    "Accédez à votre espace personnel": "ادخل إلى حسابك", "Se souvenir de moi": "تذكرني", "Mot de passe oublié ?": "هل نسيت كلمة المرور؟", "Se connecter": "تسجيل الدخول", "Pas encore de compte ?": "ليس لديك حساب بعد؟", "Créer un compte": "إنشاء حساب", Inscription: "إنشاء حساب", "Créez votre compte gratuitement": "أنشئ حسابك مجانًا", "S'inscrire": "تسجيل", "Déjà un compte ?": "لديك حساب بالفعل؟", "Entrez votre email pour réinitialiser": "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور", "Envoyer le lien": "إرسال الرابط", "← Retour à la connexion": "← العودة إلى تسجيل الدخول", "Nos coordonnées": "معلومات الاتصال", Téléphone: "الهاتف", "E-mail": "البريد الإلكتروني", Adresse: "العنوان", "Cliquez pour ouvrir dans Google Maps": "انقر لفتح الموقع في خرائط Google", Horaires: "ساعات العمل", "Lun - Ven : 8h00 - 17h30": "الإثنين–الجمعة: 8:00–17:30", "Sam : 8h00 - 13h00": "السبت: 8:00–13:00", "Dim : Fermé": "الأحد: مغلق", "Suivez-nous": "تابعونا",
    "Leader depuis 1997": "رواد منذ 1997", "Infrastructure & Travaux Publics": "البنية التحتية والأشغال العامة", "Plus de 28 ans d'expertise au service du développement national. SOIT réalise des projets d'envergure qui transforment le territoire tunisien.": "أكثر من 28 عامًا من الخبرة في خدمة التنمية الوطنية. تنفذ SOIT مشاريع كبرى تسهم في تطوير الأراضي التونسية.", "Découvrir notre savoir-faire": "اكتشف خبرتنا", "Notre empreinte": "أثرنا", "Des infrastructures qui connectent la Tunisie": "بنية تحتية تربط تونس", "Routes, ponts, réseaux urbains, terrassement... SOIT construit des infrastructures durables qui créent de la valeur et rapprochent les territoires.": "الطرق والجسور والشبكات الحضرية وأعمال الحفر... تبني SOIT بنية تحتية مستدامة تخلق القيمة وتربط المناطق.", "Découvrir nos réalisations": "اكتشف مشاريعنا", "Votre partenaire de confiance": "شريككم الموثوق", "Votre projet mérite l'excellence": "مشروعكم يستحق التميز", "Entreprise agréée Catégorie 5, nous garantissons qualité, sécurité et respect des délais pour concrétiser vos ambitions.": "بصفتنا شركة معتمدة من الفئة الخامسة، نضمن الجودة والسلامة واحترام المواعيد لتحقيق طموحاتكم.", "Demander un devis": "اطلب عرض سعر",
    "Notre histoire": "قصتنا", "Qui sommes-nous ?": "من نحن؟", "Découvrez l'entreprise qui construit l'avenir de la Tunisie depuis 1997": "اكتشفوا الشركة التي تسهم في بناء مستقبل تونس منذ عام 1997", "La Société El Oukhoua d'Infrastructure et de Travaux Publics (SOIT)": "شركة الإخوة للبنية التحتية والأشغال العامة (SOIT)", Fondation: "تاريخ التأسيس", Statut: "الوضع القانوني", "Agrément": "الاعتماد", "État Catégorie 5": "اعتماد الدولة - الفئة الخامسة", Spécialité: "التخصص", Gérant: "المدير", Certification: "الشهادة", "Qualité & Sécurité": "الجودة والسلامة", "SOIT est une entreprise tunisienne spécialisée dans le secteur du BTP. Depuis sa création, elle s'est imposée comme un acteur majeur dans le domaine de l'infrastructure et des travaux publics en Tunisie.": "SOIT شركة تونسية متخصصة في قطاع البناء والأشغال العامة. ومنذ تأسيسها، أصبحت من الشركات البارزة في مجال البنية التحتية والأشغال العامة في تونس.", "Notre société à responsabilité limitée (S.A.R.L.) est fière d'être classée comme Entreprise Agréée par l'État en Catégorie, témoignant de notre conformité aux normes les plus élevées de qualité et de sécurité.": "تفخر شركتنا ذات المسؤولية المحدودة بتصنيفها شركة معتمدة من الدولة، مما يعكس التزامنا بأعلى معايير الجودة والسلامة.", "Découvrir nos services →": "اكتشف خدماتنا ←", "ans d'expérience": "سنوات من الخبرة", "projets réalisés": "مشاريع منجزة", "clients satisfaits": "عملاء راضون", professionnels: "محترفون",
    "Notre expertise": "خبرتنا", "Une gamme complète de services pour vos projets d'infrastructure": "مجموعة متكاملة من الخدمات لمشاريع البنية التحتية", "La Société El Oukhoua d'Infrastructure et de Travaux (SOIT) propose une gamme complète de services spécialisés dans les infrastructures de transport et les réseaux urbains.": "تقدم شركة الإخوة للبنية التحتية والأشغال (SOIT) مجموعة متكاملة من الخدمات المتخصصة في بنية النقل والشبكات الحضرية.", "Entreprise agréée par l'État (Catégorie 5)": "شركة معتمدة من الدولة (الفئة الخامسة)", "Infrastructures Routières": "البنية التحتية للطرق", "Entreprise Générale de Routes": "إنجاز الطرق", "Revêtements Routiers": "تعبيد الطرق", "Terrassements": "أعمال الحفر", "Entretien et Réparation": "الصيانة والإصلاح", "Demander un devis →": "اطلب عرض سعر ←", "Voiries et Réseaux Divers (VRD)": "الطرق والشبكات المختلفة", "Entreprise Générale VRD": "إنجاز شبكات الطرق والمرافق", "Pose de Canalisations Hydrauliques": "تركيب قنوات المياه", "Réseaux Divers (Électricité, Télécom)": "الشبكات المختلفة (الكهرباء والاتصالات)", "Travaux Publics & Terrassement": "الأشغال العامة والحفر", "Gestion de Projet": "إدارة المشاريع", "Nettoyage de Chantier": "تنظيف مواقع العمل", "Logistique de Transport": "الخدمات اللوجستية للنقل", "Réseaux et Infrastructures": "الشبكات والبنية التحتية", "Infrastructures Urbaines": "البنية التحتية الحضرية", "Gestion de Projets Complexes": "إدارة المشاريع المعقدة", "Solutions Durables": "حلول مستدامة",
    "Portfolio terrain": "مشاريع ميدانية", "Des projets réels, sur le terrain": "مشاريع حقيقية على أرض الواقع", "Une sélection de chantiers SOIT, illustrés par les photos de nos équipes.": "مجموعة من مواقع مشاريع SOIT موثقة بصور فرقنا.", "projets documentés": "مشاريع موثقة", "Photos du chantier SOIT": "صور موقع SOIT", "Lotissement VRD": "تهيئة وشبكات", "Aménagement Siliana El Jadida": "تهيئة سليانة الجديدة", "Travaux d'aménagement et de réseaux divers pour le nouveau lotissement.": "أعمال التهيئة والشبكات المختلفة للمقسم الجديد.", "Siliana, Tunisie": "سليانة، تونس", "Chantier en images": "صور المشروع", "Aménagement urbain": "تهيئة حضرية", "Entrée de la ville, Souk Jdid": "مدخل مدينة سوق الجديد", "Embellissement de l'entrée de Souk Jdid, dans le gouvernorat de Sidi Bouzid.": "تحسين مدخل سوق الجديد بولاية سيدي بوزيد.", "Sidi Bouzid, Tunisie": "سيدي بوزيد، تونس", "Projet achevé": "مشروع مكتمل", "Infrastructures routières": "البنية التحتية للطرق", "Travaux de voirie": "أشغال الطرق", "Préparation et revêtement d'une chaussée, photographiés sur le chantier.": "تهيئة وتعبيد طريق، موثقة بالصور في الموقع.", "Revêtement routier": "تعبيد الطرق",
    "Notre impact": "أثرنا", "Nos chantiers, avant et après": "مشاريعنا قبل وبعد", "Comparez les photos réelles de nos travaux. Chaque paire est présentée séparément pour respecter son angle de prise de vue.": "قارنوا الصور الحقيقية لأعمالنا. نعرض كل زوج من الصور بشكل منفصل للحفاظ على زاوية التصوير الأصلية.", Tous: "الكل", Quartiers: "الأحياء", Voirie: "الطرق", Avant: "قبل", "Après": "بعد", "Un espace public réaménagé": "إعادة تهيئة فضاء عام", "Transformation d'un espace de quartier en promenade paysagée.": "تحويل فضاء الحي إلى ممشى منسق.", "Réhabilitation d'une ruelle": "إعادة تأهيل زقاق", "Une chaussée remise en état pour faciliter l'accès aux habitations.": "إصلاح الطريق لتسهيل الوصول إلى المساكن.", "Modernisation d'une voie": "تحديث طريق", "Travaux de nivellement et réalisation d'une chaussée neuve.": "أعمال التسوية وإنجاز طريق جديد.", "Aménagement d'un accès local": "تهيئة منفذ محلي", "Passage d'une voie en terre à un accès revêtu et praticable.": "تحويل طريق ترابي إلى منفذ معبد وسهل الاستخدام.", "Voirie et éclairage public": "الطرق والإنارة العمومية", "Amélioration d'une voie locale et de son éclairage nocturne.": "تحسين طريق محلي وإنارته الليلية.", "Réaménagement d'une voie locale": "إعادة تهيئة طريق محلي", "Une rue plus propre et plus accessible pour les riverains.": "شارع أنظف وأسهل وصولًا للسكان.",
    "Projet phare": "المشروع الرئيسي", "Projet en cours": "مشروع قيد الإنجاز", "Découvrez l'avancement de notre projet d'envergure": "تابعوا تقدم مشروعنا الكبير", "Projet prioritaire": "مشروع ذو أولوية", "En cours": "قيد الإنجاز", "Projet d'aménagement d'un nouveau lotissement moderne à Siliana, comprenant des infrastructures routières, réseaux divers (VRD), espaces verts et équipements publics. Un projet d'envergure qui transformera la région et améliorera la qualité de vie des habitants.": "مشروع تهيئة مقسم حديث في سليانة يشمل الطرق والشبكات المختلفة والمساحات الخضراء والمرافق العامة. مشروع كبير سيسهم في تطوير المنطقة وتحسين جودة حياة سكانها.", Localisation: "الموقع", "Date de début": "تاريخ البداية", "Durée prévisionnelle": "المدة المتوقعة", "Fin estimée": "تاريخ الانتهاء المتوقع", Superficie: "المساحة", Budget: "الميزانية", "Avancement des travaux": "تقدم الأشغال", Étude: "الدراسة", "Terrassement": "أعمال الحفر", "Espaces verts": "المساحات الخضراء", Livraison: "التسليم", "Galerie du projet": "معرض المشروع", "Découvrez l'évolution du chantier en images": "تابعوا مراحل المشروع بالصور", "Vue générale du projet": "نظرة عامة على المشروع", "Plan d'aménagement": "مخطط التهيئة", "Localisation satellite": "الموقع عبر الأقمار الصناعية", "Plan de lotissement approuvé": "مخطط المقسم المصادق عليه", "Phase 1 - Terrassement": "المرحلة 1 - أعمال الحفر", "Phase 2 - Réseaux": "المرحلة 2 - الشبكات", "Phase 3 - Voirie": "المرحلة 3 - الطرق", "Vue aérienne des travaux": "مشهد جوي للأشغال", "Équipements modernes": "معدات حديثة", "Installation des réseaux": "تركيب الشبكات", "Notre équipe sur le terrain": "فريقنا في الموقع", "Matériaux de qualité": "مواد عالية الجودة", "Contrôle qualité rigoureux": "مراقبة دقيقة للجودة", "Sécurité sur le chantier": "السلامة في موقع العمل", "Travaux de finition": "أعمال الإنهاء", "Résultat final attendu": "النتيجة النهائية المتوقعة", "Équipe projet": "فريق المشروع", "Chef de projet": "مدير المشروع", Ingénieurs: "المهندسون", "5 experts terrain": "5 خبراء ميدانيين", "Ouvriers qualifiés": "عمال مهرة", "35 professionnels": "35 مهنيًا", "Contrôle qualité": "مراقبة الجودة", "3 inspecteurs": "3 مفتشين", "Intéressé par ce projet ?": "هل يهمكم هذا المشروع؟", "Contactez-nous pour plus d'informations sur les opportunités d'investissement": "تواصلوا معنا للمزيد من المعلومات حول فرص الاستثمار", "Nous contacter": "تواصل معنا", "Voir les photos": "عرض الصور", "Parler d'un projet similaire": "ناقشوا مشروعًا مشابهًا",
    "Actualités & Événements": "الأخبار والفعاليات", "Dernières nouvelles": "آخر الأخبار", "Restez informés des dernières actualités de SOIT": "تابعوا آخر أخبار SOIT", "À la une": "أبرز الأخبار", "Projet": "مشروع", "5 min de lecture": "5 دقائق للقراءة", "Lancement du projet Siliana El Jadida": "انطلاق مشروع سليانة الجديدة", "SOIT démarre les travaux d'aménagement du nouveau lotissement \"Siliana El Jadida\". Un projet d'envergure de 540 jours qui transformera la région avec des infrastructures modernes et durables.": "بدأت SOIT أعمال تهيئة المقسم الجديد «سليانة الجديدة». مشروع كبير مدته 540 يومًا سيطور المنطقة ببنية تحتية حديثة ومستدامة.", "jours de travaux": "يوم عمل", "DT budget": "الميزانية بالدينار", "Lire l'article complet": "اقرأ المقال كاملًا", "15 Mars 2025": "15 مارس 2025", "245 vues": "245 مشاهدة", "SOIT renouvelle son agrément Catégorie 5": "SOIT تجدد اعتماد الفئة الخامسة", "L'entreprise confirme son statut auprès de l'État tunisien pour les grands projets d'infrastructure.": "تؤكد الشركة اعتمادها لدى الدولة التونسية لتنفيذ مشاريع البنية التحتية الكبرى.", "Lire la suite": "اقرأ المزيد", Anniversaire: "ذكرى سنوية", "14 Avril 2025": "14 أبريل 2025", "512 vues": "512 مشاهدة", "SOIT fête ses 28 ans d'excellence": "SOIT تحتفل بـ28 عامًا من التميز", "Fondée en 1997, SOIT célèbre 28 années d'engagement pour le développement des infrastructures tunisiennes.": "تحتفل SOIT، التي تأسست عام 1997، بـ28 عامًا من الالتزام بتطوير البنية التحتية التونسية.", Investissement: "استثمار", "20 Janvier 2025": "20 يناير 2025", "189 vues": "189 مشاهدة", "Renouvellement de notre parc machine": "تجديد أسطول المعدات", "SOIT investit dans des équipements de dernière génération pour optimiser ses chantiers et garantir l'excellence.": "تستثمر SOIT في أحدث المعدات لتحسين مواقع العمل وضمان التميز.", "10 Décembre 2024": "10 ديسمبر 2024", "156 vues": "156 مشاهدة", "Programme de formation pour nos équipes": "برنامج تدريب فرقنا", "SOIT investit dans la montée en compétences de ses collaborateurs avec des programmes certifiants.": "تستثمر SOIT في تطوير مهارات موظفيها من خلال برامج تدريب معتمدة.", "Développement durable": "التنمية المستدامة", "5 Septembre 2024": "5 سبتمبر 2024", "203 vues": "203 مشاهدة", "SOIT s'engage pour l'environnement": "SOIT تلتزم بحماية البيئة", "L'entreprise adopte des pratiques durables pour réduire son impact environnemental et protéger les écosystèmes.": "تعتمد الشركة ممارسات مستدامة لتقليل أثرها البيئي وحماية النظم الطبيعية.", Partenariat: "شراكة", "15 Août 2024": "15 أغسطس 2024", "98 vues": "98 مشاهدة", "Nouveau partenariat stratégique": "شراكة استراتيجية جديدة", "SOIT signe un accord avec un leader international pour renforcer son expertise technique.": "وقعت SOIT اتفاقًا مع شركة دولية رائدة لتعزيز خبرتها الفنية.", "Restez informés": "ابقوا على اطلاع", "Recevez nos actualités directement dans votre boîte mail": "استقبلوا أخبارنا مباشرة عبر بريدكم الإلكتروني", "L'inscription à notre lettre d'information sera bientôt disponible.": "سيصبح الاشتراك في نشرتنا الإخبارية متاحًا قريبًا.",
    Témoignages: "آراء العملاء", "Ce que disent nos clients": "ماذا يقول عملاؤنا", "La satisfaction de nos clients, notre plus belle récompense": "رضا عملائنا هو أفضل مكافأة لنا", "Basé sur 128 avis": "استنادًا إلى 128 تقييمًا", "5 étoiles": "5 نجوم", "4 étoiles": "4 نجوم", "3 étoiles": "3 نجوم", "2 étoiles": "نجمتان", "1 étoile": "نجمة واحدة", "Donnez votre avis": "أضف تقييمك", "Partagez votre expérience": "شارك تجربتك", "Votre note :": "تقييمك:", "Envoyer mon avis": "إرسال تقييمي",
    "Questions fréquentes": "الأسئلة الشائعة", "Foire Aux Questions": "الأسئلة المتكررة", "Toutes les réponses à vos questions sur nos services": "إجابات عن أسئلتكم حول خدماتنا", "Quels types de projets réalisez-vous ?": "ما أنواع المشاريع التي تنفذونها؟", "Nous réalisons tous types de projets d'infrastructure :": "ننفذ مختلف أنواع مشاريع البنية التحتية:", "Construction et réfection de routes": "إنشاء الطرق وإعادة تأهيلها", "Ponts et ouvrages d'art": "الجسور والمنشآت الفنية", "VRD (Voiries et Réseaux Divers)": "الطرق والشبكات المختلفة", "Terrassement et aménagement": "أعمال الحفر والتهيئة", "Réseaux hydrauliques et d'assainissement": "شبكات المياه والصرف الصحي", "Comment obtenir un devis ?": "كيف أحصل على عرض سعر؟", "Pour obtenir un devis gratuit :": "للحصول على عرض سعر مجاني:", "Remplissez le formulaire de contact": "املأ نموذج الاتصال", "Appelez-nous au": "اتصلوا بنا على", "Envoyez-nous un email à": "راسلونا عبر البريد الإلكتروني على", "Nous vous répondons sous 24h avec une proposition détaillée.": "سنرد عليكم خلال 24 ساعة بعرض مفصل.", "Quelles sont vos zones d'intervention ?": "ما مناطق عملكم؟", "Nous intervenons sur tout le territoire tunisien, avec une base principale à Sousse. Nos équipes sont mobiles et peuvent réaliser des projets dans toutes les régions :": "نعمل في جميع أنحاء تونس انطلاقًا من مقرنا في سوسة. فرقنا جاهزة لتنفيذ المشاريع في مختلف المناطق:", "Quels sont vos délais de réalisation ?": "ما المدة اللازمة لتنفيذ المشاريع؟", "Les délais varient selon la complexité du projet :": "تختلف المدة حسب تعقيد المشروع:", "Petits projets :": "المشاريع الصغيرة:", "2 à 4 semaines": "من أسبوعين إلى أربعة أسابيع", "Projets moyens :": "المشاريع المتوسطة:", "2 à 6 mois": "من شهرين إلى ستة أشهر", "Grands projets :": "المشاريع الكبرى:", "6 à 24 mois": "من 6 إلى 24 شهرًا", "Nous respectons toujours nos engagements contractuels.": "نلتزم دائمًا بتعهداتنا التعاقدية.", "Quelles sont vos certifications ?": "ما الشهادات والاعتمادات التي حصلتم عليها؟", "SOIT est fièrement certifiée :": "تفخر SOIT بحصولها على:", "✅ Entreprise agréée par l'État - Catégorie 5": "✅ اعتماد الدولة - الفئة الخامسة", "✅ Certification Qualité ISO 9001:2015": "✅ شهادة الجودة ISO 9001:2015", "✅ Agrément Sécurité sur les chantiers": "✅ اعتماد السلامة في مواقع العمل", "✅ Membre de la Fédération Tunisienne du BTP": "✅ عضو الاتحاد التونسي للبناء والأشغال العامة", "Comment devenir partenaire ou fournisseur ?": "كيف أصبح شريكًا أو موردًا؟", "Nous sommes toujours à la recherche de partenaires de qualité. Contactez notre service achats :": "نبحث دائمًا عن شركاء موثوقين. تواصلوا مع قسم المشتريات:", "Vous n'avez pas trouvé votre réponse ?": "لم تجد إجابة عن سؤالك؟", "Contactez-nous": "اتصلوا بنا",
    "Une question ? Un projet ? Notre équipe est à votre écoute": "لديكم سؤال أو مشروع؟ فريقنا في خدمتكم", "Ouvrir dans Google Maps": "افتح في خرائط Google", "N'hésitez pas à nous contacter": "لا تترددوا في التواصل معنا", "Envoyer un message": "إرسال رسالة", "Votre nom": "اسمك", "Votre email": "بريدك الإلكتروني", "Votre téléphone": "هاتفك", "Votre message": "رسالتك", "Expert en infrastructure et travaux publics en Tunisie depuis 1997.": "خبراء في البنية التحتية والأشغال العامة في تونس منذ عام 1997.", "Liens rapides": "روابط سريعة", "Travaux Publics": "الأشغال العامة", "Réseaux Urbains": "الشبكات الحضرية", "Sousse, Tunisie": "سوسة، تونس", "Tous droits réservés. Reproduction interdite sans autorisation.": "جميع الحقوق محفوظة. يُمنع النسخ دون إذن.", "Créé par": "تنفيذ", "Développeur web": "مطور الويب", "Retour en haut de page": "العودة إلى أعلى الصفحة"
  }
};

Object.assign(pageTranslations.en, {
  "Dernière actualité du chantier": "Latest site update", "Étape actuelle": "Current stage", "Mis à jour le": "Updated on", "VRD": "Utility networks (VRD)",
  "Direction générale": "General management", "Gérant · Société El Oukhoua d'Infrastructure et de Travaux Publics (SOIT)": "Manager · El Oukhoua Infrastructure and Public Works Company (SOIT)", "Engagement de la direction": "Management commitment", "Depuis 1997, SOIT contribue au développement des infrastructures tunisiennes. La direction place la qualité d'exécution, la sécurité et le respect des engagements au cœur de chaque projet.": "Since 1997, SOIT has contributed to the development of Tunisia's infrastructure. Management places quality workmanship, safety and keeping commitments at the heart of every project.", "SOIT en bref": "SOIT at a glance", "Repères & qualifications": "Company credentials", "Les informations essentielles sur l'entreprise et ses domaines d'activité.": "Key information about the company and its areas of work.", "Fondée le": "Founded", "Agrément de l'État": "State approval", "Catégorie 5": "Category 5", "Statut juridique": "Legal status", "Société à responsabilité limitée": "Limited liability company", Domaines: "Areas of work", "Routes · VRD · Travaux publics": "Roads · Utilities · Public works", "Étude de cas terrain": "Project case study", "Voir l'étude de cas": "View project case study",
  "28 Avril 2025": "April 28, 2025", "14 avril 1997": "April 14, 1997", "Avr 2025": "Apr 2025", "Mai 2025": "May 2025", "Sep 2025": "Sep 2025", "Fév 2026": "Feb 2026", "Nov 2026": "Nov 2026", "Tunis - Siliana": "Tunis - Siliana",
  "Fermer la fenêtre de connexion": "Close login window", "Fermer les détails du projet": "Close project details", "Fermer la galerie": "Close gallery", "Photo précédente": "Previous photo", "Photo suivante": "Next photo", "Afficher les réalisations précédentes": "Show previous projects", "Afficher les réalisations suivantes": "Show next projects", "Diapositive précédente": "Previous slide", "Diapositive suivante": "Next slide", "Afficher la diapositive 1": "Show slide 1", "Afficher la diapositive 2": "Show slide 2", "Afficher la diapositive 3": "Show slide 3", "Votre commentaire...": "Your comment...", "Carte de localisation de SOIT ? Akouda, Sousse": "SOIT location map - Akouda, Sousse"
});
Object.assign(pageTranslations.ar, {
  "Dernière actualité du chantier": "آخر تحديث للموقع", "Étape actuelle": "المرحلة الحالية", "Mis à jour le": "تاريخ التحديث", "VRD": "الشبكات المختلفة (VRD)",
  "Direction générale": "الإدارة العامة", "Gérant · Société El Oukhoua d'Infrastructure et de Travaux Publics (SOIT)": "المدير · شركة الإخوة للبنية التحتية والأشغال العامة (SOIT)", "Engagement de la direction": "التزام الإدارة", "Depuis 1997, SOIT contribue au développement des infrastructures tunisiennes. La direction place la qualité d'exécution, la sécurité et le respect des engagements au cœur de chaque projet.": "تسهم SOIT منذ عام 1997 في تطوير البنية التحتية التونسية. وتضع الإدارة جودة التنفيذ والسلامة والوفاء بالالتزامات في صميم كل مشروع.", "SOIT en bref": "SOIT باختصار", "Repères & qualifications": "نبذة ومؤهلات الشركة", "Les informations essentielles sur l'entreprise et ses domaines d'activité.": "معلومات أساسية عن الشركة ومجالات عملها.", "Fondée le": "تاريخ التأسيس", "Agrément de l'État": "اعتماد الدولة", "Catégorie 5": "الفئة الخامسة", "Statut juridique": "الوضع القانوني", "Société à responsabilité limitée": "شركة ذات مسؤولية محدودة", Domaines: "مجالات العمل", "Routes · VRD · Travaux publics": "الطرق · الشبكات · الأشغال العامة", "Étude de cas terrain": "دراسة حالة لمشروع", "Voir l'étude de cas": "عرض دراسة المشروع",
  "28 Avril 2025": "28 أبريل 2025", "14 avril 1997": "14 أبريل 1997", "Avr 2025": "أبريل 2025", "Mai 2025": "مايو 2025", "Sep 2025": "سبتمبر 2025", "Fév 2026": "فبراير 2026", "Nov 2026": "نوفمبر 2026", "Tunis - Siliana": "تونس - سليانة",
  "Fermer la fenêtre de connexion": "إغلاق نافذة تسجيل الدخول", "Fermer les détails du projet": "إغلاق تفاصيل المشروع", "Fermer la galerie": "إغلاق المعرض", "Photo précédente": "الصورة السابقة", "Photo suivante": "الصورة التالية", "Afficher les réalisations précédentes": "عرض المشاريع السابقة", "Afficher les réalisations suivantes": "عرض المشاريع التالية", "Diapositive précédente": "الشريحة السابقة", "Diapositive suivante": "الشريحة التالية", "Afficher la diapositive 1": "عرض الشريحة 1", "Afficher la diapositive 2": "عرض الشريحة 2", "Afficher la diapositive 3": "عرض الشريحة 3", "Votre commentaire...": "تعليقك...", "Carte de localisation de SOIT ? Akouda, Sousse": "خريطة موقع SOIT - أكودة، سوسة"
});

const originalTextNodes = new WeakMap();
const originalTextAttributes = new WeakMap();
let activeLanguage = "fr";
let activeCurrentProjectData = null;

function normalizedTranslationText(value) {
  return value.replace(/[’‘ʼ]/g, "'").replace(/[‐‑‒–—]/g, "-").replace(/\s+/g, " ").trim();
}

function translatePageNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
    const original = originalTextNodes.get(node);
    const normalized = normalizedTranslationText(original);
    const translated = pageTranslations[activeLanguage]?.[normalized];
    if (translated) {
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      node.nodeValue = `${leading}${translated}${trailing}`;
    } else if (activeLanguage === "fr") node.nodeValue = original;
    return;
  }

  if (node.nodeType !== Node.ELEMENT_NODE || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(node.tagName)) return;
  ["placeholder", "aria-label", "title", "alt"].forEach((attribute) => {
    if (!node.hasAttribute(attribute)) return;
    let originals = originalTextAttributes.get(node);
    if (!originals) { originals = {}; originalTextAttributes.set(node, originals); }
    if (!(attribute in originals)) originals[attribute] = node.getAttribute(attribute);
    const original = originals[attribute];
    node.setAttribute(attribute, activeLanguage === "fr" ? original : (pageTranslations[activeLanguage]?.[normalizedTranslationText(original)] || original));
  });
  node.childNodes.forEach(translatePageNode);
}

function updateLanguage(lang) {
  if (!translations[lang]) return;
  activeLanguage = lang;
  localStorage.setItem("language", lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  translatePageNode(document.body);

  const searchBox = document.getElementById("search-box");
  if (searchBox) searchBox.placeholder = translations[lang].searchPlaceholder;
  const fields = { name: "contact-name", email: "contact-email", phone: "contact-phone", message: "contact-message" };
  Object.entries(fields).forEach(([key, id]) => {
    const input = document.getElementById(id);
    const label = `your${key[0].toUpperCase()}${key.slice(1)}`;
    if (input) input.placeholder = translations[lang][label];
  });
  document.querySelectorAll(".lang-option").forEach((option) => {
    option.classList.toggle("active", option.dataset.lang === lang);
    option.setAttribute("aria-pressed", String(option.dataset.lang === lang));
  });
  renderLocalizedCurrentProjectUpdate(activeCurrentProjectData);
}

const pageTranslationObserver = new MutationObserver((mutations) => {
  if (activeLanguage === "fr") return;
  mutations.forEach((mutation) => mutation.addedNodes.forEach(translatePageNode));
});
document.addEventListener("DOMContentLoaded", () => {
  pageTranslationObserver.observe(document.body, { childList: true, subtree: true });
});

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
      nextBtn.disabled = currentIndex >= getMaxIndex();
      nextBtn.style.opacity = currentIndex >= getMaxIndex() ? "0.5" : "1";
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
  const prevBtn = document.querySelector(".project-prev");
  const nextBtn = document.querySelector(".project-next");
  const dotsContainer = document.querySelector(".project-slider-dots");
  if (!slider) return;
  if (slider.projectSliderController) {
    slider.projectSliderController.refresh();
    return;
  }
  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  const getSlides = () => Array.from(slider.querySelectorAll(".project-slide"));
  const getMaxIndex = () => Math.max(0, getSlides().length - slidesToShow);
  function updateSlider() {
    const slides = getSlides();
    const maxIndex = getMaxIndex();
    currentIndex = Math.min(currentIndex, maxIndex);
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
    const numberOfDots = Math.ceil(getSlides().length / slidesToShow);
    dotsContainer.replaceChildren();
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.classList.add("project-dot");
      dot.setAttribute("aria-label", `Afficher la diapositive ${i + 1}`);
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i * slidesToShow;
        currentIndex = Math.min(currentIndex, getMaxIndex());
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function nextSlide() {
    if (currentIndex < getMaxIndex()) {
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
    }
    createDots();
    updateSlider();
  }
  slider.projectSliderController = { refresh: () => { currentIndex = 0; refreshSlider(); } };
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
      initScrollReveal();
    }
    initProjectCategoryFilters();
    initProjectDetails();
    initProjectGallery();
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
  initArticleModal();
});

// ============ MANAGED PROJECTS ============
function renderLocalizedCurrentProjectUpdate(project) {
  if (!project) return;
  const selectedLanguage = document.documentElement.lang || "fr";
  const stage = document.getElementById("currentProjectStage");
  if (stage) stage.textContent = project.currentStage || "";
  const updateText = document.getElementById("currentProjectUpdateText");
  if (updateText) {
    const localizedUpdate = {
      fr: project.latestUpdate,
      en: project.latestUpdateEn,
      ar: project.latestUpdateAr,
    }[selectedLanguage] || project.latestUpdate;
    updateText.textContent = localizedUpdate || project.description || "";
  }
  const updateDate = document.getElementById("currentProjectUpdateDate");
  const parsedDate = project.latestUpdateAt ? new Date(project.latestUpdateAt) : null;
  if (updateDate && parsedDate && !Number.isNaN(parsedDate.getTime())) {
    const locale = selectedLanguage === "ar" ? "ar-TN" : selectedLanguage === "en" ? "en-GB" : "fr-TN";
    updateDate.dateTime = parsedDate.toISOString();
    updateDate.textContent = new Intl.DateTimeFormat(locale, {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(parsedDate);
  }
}

function renderCurrentProjectUpdate(project) {
  if (!project?.isCurrent) return;
  activeCurrentProjectData = project;
  const section = document.getElementById("current-project");
  const updateCard = document.getElementById("currentProjectUpdate");
  if (!section || !updateCard) return;

  const title = section.querySelector(".project-title-section h2");
  const description = section.querySelector(".project-description");
  if (title) title.textContent = project.title || "Projet SOIT";
  if (description) description.textContent = project.description || "";

  const metrics = section.querySelectorAll(".metric-card");
  metrics.forEach((metric, index) => { metric.hidden = index > 0; });
  section.querySelector(".key-metrics")?.style.setProperty("grid-template-columns", "1fr");
  const locationValue = section.querySelector(".metric-card .metric-value");
  if (locationValue) locationValue.textContent = project.location || "Tunisie";
  section.querySelector(".progress-stages")?.setAttribute("hidden", "");
  section.querySelector(".team-section")?.setAttribute("hidden", "");
  const priorityBadge = section.querySelector(".project-title-section .badge-primary");
  if (priorityBadge) priorityBadge.hidden = true;

  const percent = Math.max(0, Math.min(100, Number(project.progressPercent) || 0));
  const percentage = section.querySelector(".progress-percentage");
  const progressTrack = section.querySelector(".progress-bar-track");
  const progressFill = section.querySelector(".progress-bar-fill");
  if (percentage) percentage.textContent = `${percent}%`;
  if (progressTrack) progressTrack.setAttribute("aria-valuenow", String(percent));
  if (progressFill) progressFill.style.width = `${percent}%`;

  renderLocalizedCurrentProjectUpdate(project);
  updateCard.hidden = false;

  const imageSources = [project.image, ...(Array.isArray(project.galleryImages) ? project.galleryImages : [])]
    .filter((source, index, sources) => typeof source === "string" && source && sources.indexOf(source) === index);
  const slider = section.querySelector(".project-slider");
  if (slider && imageSources.length) {
    const slides = imageSources.map((source, index) => {
      const slide = document.createElement("div");
      slide.className = "project-slide";
      const image = document.createElement("img");
      image.src = source;
      image.alt = `${project.title || "Projet SOIT"} — photo ${index + 1}`;
      image.loading = "lazy";
      image.decoding = "async";
      const caption = document.createElement("div");
      caption.className = "slide-caption";
      caption.textContent = `${project.title || "Projet SOIT"} · ${index + 1}`;
      slide.append(image, caption);
      return slide;
    });
    slider.replaceChildren(...slides);
    initProjectSlider();
  }
}

async function loadPublicProjects() {
  const grid = document.querySelector("#projects .projects-grid");
  if (!grid) return false;

  try {
    const response = await fetch(`${API_URL}/projects`);
    const data = await response.json();
    if (!response.ok || !data.success || !Array.isArray(data.projects)) return false;
    const currentProject = data.currentProject || data.projects.find((project) => project.isCurrent) || null;

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
      if (project._id) card.dataset.projectId = project._id;

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
    renderCurrentProjectUpdate(currentProject);
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

function initProjectDetails() {
  const grid = document.querySelector("#projects .projects-grid");
  const modal = document.getElementById("projectDetailsModal");
  const dialog = modal?.querySelector(".project-details-dialog");
  const closeButton = modal?.querySelector(".project-details-close");
  const backdrop = modal?.querySelector(".project-details-backdrop");
  const galleryButton = modal?.querySelector(".project-details-gallery");
  if (!grid || !modal || !dialog || !closeButton) return;

  let activeCard = null;
  let returnFocus = null;
  let previousOverflow = "";

  grid.querySelectorAll(".project-card").forEach((card) => {
    const content = card.querySelector(".project-content");
    if (!content || content.querySelector(".project-details-trigger")) return;
    const title = card.querySelector("h3")?.textContent.trim() || "Projet SOIT";
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "project-details-trigger";
    trigger.setAttribute("aria-label", "Voir l'étude de cas");
    trigger.innerHTML = 'Voir l’étude de cas <i class="fas fa-arrow-right" aria-hidden="true"></i>';
    content.append(trigger);
  });

  function closeDetails() {
    if (!modal.classList.contains("active")) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousOverflow;
    activeCard = null;
    returnFocus?.focus();
    returnFocus = null;
  }

  function openDetails(card, trigger) {
    const image = card.querySelector(".project-image img");
    const category = card.querySelector(".project-category")?.textContent.trim() || "Projet SOIT";
    const title = card.querySelector("h3")?.textContent.trim() || "Projet SOIT";
    const description = card.querySelector(".project-content p")?.textContent.trim() || "";
    const imageElement = modal.querySelector(".project-details-image img");
    const categoryElement = modal.querySelector(".project-details-category");
    const titleElement = modal.querySelector("#projectDetailsTitle");
    const descriptionElement = modal.querySelector(".project-details-description");
    const metaElement = modal.querySelector(".project-details-meta");

    if (imageElement) {
      imageElement.src = image?.getAttribute("src") || "";
      imageElement.alt = image?.alt || title;
    }
    if (categoryElement) categoryElement.textContent = category;
    if (titleElement) titleElement.textContent = title;
    if (descriptionElement) descriptionElement.textContent = description;
    if (metaElement) {
      const details = Array.from(card.querySelectorAll(".project-meta span"))
        .map((item) => item.textContent.trim())
        .filter(Boolean);
      metaElement.replaceChildren(...details.map((text) => {
        const item = document.createElement("span");
        item.textContent = text;
        return item;
      }));
    }

    activeCard = card;
    returnFocus = trigger;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("active");
    closeButton.focus();
  }

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".project-details-trigger");
    if (!trigger) return;
    const card = trigger.closest(".project-card");
    if (card) openDetails(card, trigger);
  });
  closeButton.addEventListener("click", closeDetails);
  backdrop?.addEventListener("click", closeDetails);
  modal.querySelector(".project-details-contact")?.addEventListener("click", closeDetails);
  modal.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeDetails();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialog.querySelectorAll("button:not(:disabled), a[href]"));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  galleryButton?.addEventListener("click", () => {
    const galleryTrigger = activeCard?.querySelector(".project-link");
    closeDetails();
    galleryTrigger?.focus();
    galleryTrigger?.click();
  });
}

// ============ PROJECT GALLERY ============
function initProjectGallery() {
  const slides = document.querySelectorAll(".project-slide");
  const modal = document.getElementById("projectGalleryModal");
  const modalImg = modal?.querySelector("img");
  const thumbnailRail = modal?.querySelector(".gallery-thumbnails");
  const closeBtn = modal?.querySelector(".gallery-close");
  const prevBtn = modal?.querySelector(".gallery-prev");
  const nextBtn = modal?.querySelector(".gallery-next");
  const caption = modal?.querySelector(".gallery-caption");
  const counter = modal?.querySelector(".gallery-counter");
  const currentProjectImages = [];
  let activeImages = currentProjectImages;
  let currentIndex = 0;
  let galleryReturnFocus = null;
  let previousBodyOverflow = "";
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
    const projectImages = gallerySources.map((src, galleryIndex) => ({
        src: new URL(src, document.baseURI).href,
        caption: galleryIndex ? caption + " - photo " + (galleryIndex + 1) : caption,
      }));
    const button = card.querySelector(".project-link");
    button?.setAttribute("aria-label", `Voir la photo : ${caption}`);
    button?.addEventListener("click", () => openGallery(0, projectImages));
  });
  function openGallery(index, imageSet) {
    if (!modal || !modalImg) return;
    activeImages = imageSet;
    currentIndex = index;
    renderGalleryImage();
    renderGalleryThumbnails();
    galleryReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousBodyOverflow = document.body.style.overflow;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  }
  function renderGalleryImage() {
    if (!modalImg || !activeImages.length) return;
    const image = activeImages[currentIndex];
    modalImg.src = image.src;
    modalImg.alt = image.caption || "Photo du projet SOIT";
    if (caption) caption.textContent = image.caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${activeImages.length}`;
    thumbnailRail?.querySelectorAll(".gallery-thumbnail").forEach((button, index) => {
      const active = index === currentIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
      if (active) button.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  }
  function renderGalleryThumbnails() {
    if (!thumbnailRail) return;
    thumbnailRail.hidden = activeImages.length < 2;
    thumbnailRail.replaceChildren(...activeImages.map((image, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-thumbnail";
      button.setAttribute("aria-label", `Afficher la photo ${index + 1} sur ${activeImages.length}`);
      button.setAttribute("aria-pressed", String(index === currentIndex));
      if (index === currentIndex) button.classList.add("active");
      const thumbnail = document.createElement("img");
      thumbnail.src = image.src;
      thumbnail.alt = "";
      thumbnail.loading = "lazy";
      button.append(thumbnail);
      button.addEventListener("click", () => {
        currentIndex = index;
        renderGalleryImage();
      });
      return button;
    }));
    thumbnailRail.querySelector(".gallery-thumbnail.active")?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }
  function closeGallery() {
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;
    galleryReturnFocus?.focus();
    galleryReturnFocus = null;
  }
  function nextImage() {
    if (!modalImg || activeImages.length < 2) return;
    currentIndex = (currentIndex + 1) % activeImages.length;
    renderGalleryImage();
  }
  function prevImage() {
    if (!modalImg || activeImages.length < 2) return;
    currentIndex = (currentIndex - 1 + activeImages.length) % activeImages.length;
    renderGalleryImage();
  }
  closeBtn?.addEventListener("click", closeGallery);
  prevBtn?.addEventListener("click", prevImage);
  nextBtn?.addEventListener("click", nextImage);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeGallery();
  });
  let touchStartX = 0;
  let touchStartY = 0;
  modalImg?.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });
  modalImg?.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (deltaX < 0) nextImage();
    else prevImage();
  }, { passive: true });
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
