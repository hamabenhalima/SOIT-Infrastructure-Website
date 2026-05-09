// ============ API CONFIGURATION ============
const API_URL = "https://soit-backend.onrender.com/api";

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
  messageDiv.innerHTML = `${icon} ${message}`;
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
  if (menuBtn && navbar)
    menuBtn.addEventListener("click", () => navbar.classList.toggle("active"));
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
  let currentHighlights = [];
  let currentIndex = -1;

  function openSearch() {
    searchForm?.classList.add("active");
    searchOverlay?.classList.add("active");
    searchInput?.focus();
  }
  function closeSearch() {
    searchForm?.classList.remove("active");
    searchOverlay?.classList.remove("active");
    clearHighlights();
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
    const bar = document.querySelector(".search-results-bar");
    bar?.remove();
  }
  function scrollToHighlight() {
    if (currentHighlights[currentIndex]) {
      currentHighlights[currentIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      currentHighlights[currentIndex].style.transition = "all 0.3s";
      currentHighlights[currentIndex].style.boxShadow = "0 0 0 3px #2370f5";
      setTimeout(() => {
        if (currentHighlights[currentIndex])
          currentHighlights[currentIndex].style.boxShadow = "";
      }, 1000);
    }
  }
  function updateSearchBar() {
    const bar = document.querySelector(".search-results-bar");
    if (bar) {
      bar.innerHTML = `<span>${currentHighlights.length} résultat(s) trouvé(s)</span>
        <button id="prev-match" ${currentIndex === 0 ? "disabled" : ""}>◀ Précédent</button>
        <button id="next-match" ${currentIndex >= currentHighlights.length - 1 ? "disabled" : ""}>Suivant ▶</button>
        <button id="clear-matches">✕ Effacer</button>`;
      document.getElementById("prev-match")?.addEventListener("click", () => {
        if (currentIndex > 0) {
          currentIndex--;
          scrollToHighlight();
          updateSearchBar();
        }
      });
      document.getElementById("next-match")?.addEventListener("click", () => {
        if (currentIndex < currentHighlights.length - 1) {
          currentIndex++;
          scrollToHighlight();
          updateSearchBar();
        }
      });
      document
        .getElementById("clear-matches")
        ?.addEventListener("click", clearHighlights);
    }
  }
  function highlightText(term) {
    clearHighlights();
    const regex = new RegExp(`(${term})`, "gi");
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (
            node.parentElement.tagName === "SCRIPT" ||
            node.parentElement.tagName === "STYLE" ||
            node.parentElement.classList?.contains("search-results-bar") ||
            node.parentElement.classList?.contains("search-form")
          )
            return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      const text = node.textContent;
      if (regex.test(text)) {
        const span = document.createElement("span");
        span.innerHTML = text.replace(
          regex,
          `<mark class="highlight">$1</mark>`,
        );
        node.parentNode.replaceChild(span, node);
        span
          .querySelectorAll(".highlight")
          .forEach((el) => currentHighlights.push(el));
      }
    });
    if (currentHighlights.length > 0) {
      currentIndex = 0;
      scrollToHighlight();
      updateSearchBar();
    } else {
      showMessage(`Aucun résultat trouvé pour "${term}"`, "info");
    }
  }
  searchBtn?.addEventListener("click", openSearch);
  searchClose?.addEventListener("click", closeSearch);
  searchOverlay?.addEventListener("click", closeSearch);
  searchForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    const term = searchInput?.value;
    if (term && term.trim() !== "") {
      highlightText(term);
      closeSearch();
    } else showMessage("Veuillez entrer un terme de recherche", "warning");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
  });
});

// ============ HOME SLIDER ============
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".home .slide");
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
    interval = setInterval(nextSlide, 6000);
  }
  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => {
      showSlide(index);
      resetInterval();
    }),
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });
  interval = setInterval(nextSlide, 6000);
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
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const forgotLink = document.getElementById("forgot-password-link");
  const backToLogin = document.getElementById("back-to-login");

  function closeAllModals() {
    loginForm?.classList.remove("active");
    registerForm?.classList.remove("active");
    forgotForm?.classList.remove("active");
  }

  loginBtn?.addEventListener("click", () => {
    closeAllModals();
    loginForm?.classList.add("active");
  });
  showRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    registerForm?.classList.add("active");
  });
  showLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    loginForm?.classList.add("active");
  });
  forgotLink?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    forgotForm?.classList.add("active");
  });
  backToLogin?.addEventListener("click", (e) => {
    e.preventDefault();
    closeAllModals();
    loginForm?.classList.add("active");
  });

  // Login submit
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value.trim();
      if (!email || !password) {
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
        const data = await res.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          showMessage(data.message, "success");
          loginForm.classList.remove("active");
          loginForm.reset();
          document.querySelector("#login-btn").innerHTML =
            '<i class="fas fa-user-check"></i>';
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
          registerForm.classList.remove("active");
          loginForm.classList.add("active");
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
          showMessage(result.message, "success");
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
    if (
      !loginBtn?.contains(event.target) &&
      forms.some((f) => f?.classList.contains("active"))
    ) {
      if (!forms.some((f) => f?.contains(event.target)))
        forms.forEach((f) => f?.classList.remove("active"));
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
  });
});

// ============ LOGOUT ============
function logout() {
  localStorage.removeItem("user");
  document.querySelector("#login-btn").innerHTML =
    '<i class="fas fa-user"></i>';
  showMessage("Déconnexion réussie !", "success");
  setTimeout(() => location.reload(), 1000);
}

// ============ CHECK LOGIN STATUS ============
document.addEventListener("DOMContentLoaded", () => {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      document.querySelector("#login-btn").innerHTML =
        userData.role === "admin"
          ? '<i class="fas fa-user-shield"></i>'
          : '<i class="fas fa-user-check"></i>';
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

// ============ BEFORE/AFTER SLIDER ============
function initBeforeAfterSlider() {
  const slider = document.querySelector(".before-after-slider");
  const slides = document.querySelectorAll(".before-after-card");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const dotsContainer = document.querySelector(".slider-dots");
  if (!slider || slides.length === 0) return;
  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
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
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 1200 ? 2 : 3;
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

// ============ FILTERS ============
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".before-after-card");
  if (!filterBtns.length) return;
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      cards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-category") === filter) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 10);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
      setTimeout(() => initBeforeAfterSlider(), 350);
    });
  });
}

// ============ FAQ ACCORDÉON ============
function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question?.addEventListener("click", () => {
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active"))
          otherItem.classList.remove("active");
      });
      item.classList.toggle("active");
    });
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
      const dot = document.createElement("div");
      dot.classList.add("review-dot");
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
      const dot = document.createElement("div");
      dot.classList.add("project-dot");
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

// ============ INITIALISATIONS ============
document.addEventListener("DOMContentLoaded", function () {
  initBeforeAfterSlider();
  initFilters();
  initBlogSlider();
  initProjectSlider();
  initFaq();
  loadReviews();
  initReviewModal();
  initReviewsSlider();
  initProjectGallery();
  initLoadMore();
  initNewsletter();
  initArticleModal();
  console.log("✅ Tous les scripts sont chargés !");
});

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
  let images = [];
  let currentIndex = 0;
  slides.forEach((slide, index) => {
    const img = slide.querySelector("img");
    const imgSrc = img?.src;
    const imgCaption = slide.querySelector(".slide-caption")?.innerText || "";
    if (imgSrc) images.push({ src: imgSrc, caption: imgCaption });
    slide.addEventListener("click", () => openGallery(index));
  });
  function openGallery(index) {
    if (!modal || !modalImg) return;
    currentIndex = index;
    modalImg.src = images[currentIndex].src;
    if (caption) caption.textContent = images[currentIndex].caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
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
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
    if (caption) caption.textContent = images[currentIndex].caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
  }
  function prevImage() {
    if (!modalImg) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
    if (caption) caption.textContent = images[currentIndex].caption;
    if (counter) counter.textContent = `${currentIndex + 1} / ${images.length}`;
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

// ============ LOAD MORE, NEWSLETTER, ARTICLE MODAL ============
function initLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (!loadMoreBtn) return;
  let currentArticles = 6;
  const totalArticles = 9;
  loadMoreBtn.addEventListener("click", function () {
    loadMoreBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Chargement...';
    setTimeout(() => {
      currentArticles += 3;
      loadMoreBtn.innerHTML =
        '<i class="fas fa-sync-alt"></i> Charger plus d\'articles';
      if (currentArticles >= totalArticles) loadMoreBtn.style.display = "none";
    }, 1500);
  });
}
function initNewsletter() {
  const newsletterForm = document.querySelector(".newsletter-form");
  if (!newsletterForm) return;
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector("input")?.value;
    if (email) {
      alert(
        `Merci pour votre inscription ! Vous recevrez nos actualités sur ${email}`,
      );
      this.reset();
    }
  });
}
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
