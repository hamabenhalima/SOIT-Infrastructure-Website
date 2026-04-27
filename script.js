// ============ API CONFIGURATION ============

const API_URL = "https://soit-backend.onrender.com/api";
// ============ SHOW MESSAGE FUNCTION ============
function showMessage(message, type = "success") {
  // Create container if it doesn't exist
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  // Create message element
  const toast = document.createElement("div");
  toast.className = `alert-message alert-${type}`;

  // Add icon based on type
  let icon = "";
  if (type === "success") icon = "✅";
  else if (type === "error") icon = "❌";
  else if (type === "warning") icon = "⚠️";
  else icon = "ℹ️";

  toast.innerHTML = `${icon} ${message}`;
  container.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.remove();
    if (container.children.length === 0) {
      container.remove();
    }
  }, 3000);
}

// ============ TOAST NOTIFICATION ============
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

// ============ SLIDER FUNCTION ============
function initSlider(
  sliderClass,
  slideClass,
  prevBtnClass,
  nextBtnClass,
  dotsClass,
) {
  const slider = document.querySelector(sliderClass);
  const slides = document.querySelectorAll(slideClass);
  const prevBtn = document.querySelector(prevBtnClass);
  const nextBtn = document.querySelector(nextBtnClass);
  const dotsContainer = document.querySelector(dotsClass);

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let slidesToShow = 1;
  let totalSlides = slides.length;
  let maxIndex = 0;

  function updateSlidesToShow() {
    if (window.innerWidth <= 768) slidesToShow = 1;
    else if (window.innerWidth <= 992) slidesToShow = 2;
    else slidesToShow = 3;
    maxIndex = Math.max(0, totalSlides - slidesToShow);
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    updateSlider();
    createDots();
  }

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth;
    const gap = 20;
    const translateX = -currentIndex * (slideWidth + gap);
    slider.style.transform = `translateX(${translateX}px)`;
    updateButtons();
    updateDots();
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

  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });
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

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  window.addEventListener("resize", () => setTimeout(updateSlidesToShow, 100));
  setTimeout(() => {
    updateSlidesToShow();
  }, 100);
  window.addEventListener("load", () => updateSlidesToShow());
}

// ============ INITIALIZE ALL SLIDERS ============
document.addEventListener("DOMContentLoaded", function () {
  initSlider(
    ".reviews-slider",
    ".reviews .slide",
    ".slider-prev",
    ".slider-next",
    ".slider-dots",
  );
  initSlider(
    ".blogs-slider",
    ".blogs .slide",
    ".blog-slider-prev",
    ".blog-slider-next",
    ".blog-slider-dots",
  );
  initSlider(
    ".before-after-slider",
    ".before-after-card",
    ".before-after-prev",
    ".before-after-next",
    ".before-after-dots",
  );
});

// ============ SEARCH FUNCTIONALITY ============
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("#search-btn");
  const searchForm = document.querySelector(".search-form");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchClose = document.querySelector("#search-close");
  const searchInput = document.getElementById("search-box");

  function openSearch() {
    searchForm.classList.add("active");
    if (searchOverlay) searchOverlay.classList.add("active");
    if (searchInput) searchInput.focus();
  }
  function closeSearch() {
    searchForm.classList.remove("active");
    if (searchOverlay) searchOverlay.classList.remove("active");
    clearHighlights();
  }
  if (searchBtn) searchBtn.addEventListener("click", openSearch);
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchOverlay) searchOverlay.addEventListener("click", closeSearch);
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const term = searchInput.value;
      if (term && term.trim() !== "") {
        highlightText(term);
        closeSearch();
      } else {
        showMessage("Veuillez entrer un terme de recherche", "warning");
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSearch();
  });

  let currentHighlights = [];
  let currentIndex = -1;

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
    if (bar) bar.remove();
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
      createSearchBar();
    } else {
      showMessage(`Aucun résultat trouvé pour "${term}"`, "info");
    }
  }

  function createSearchBar() {
    let bar = document.querySelector(".search-results-bar");
    if (bar) bar.remove();
    bar = document.createElement("div");
    bar.className = "search-results-bar";
    bar.innerHTML = `<span>${currentHighlights.length} résultat(s) trouvé(s)</span>
            <button id="prev-match" ${currentIndex === 0 ? "disabled" : ""}>◀ Précédent</button>
            <button id="next-match" ${currentIndex >= currentHighlights.length - 1 ? "disabled" : ""}>Suivant ▶</button>
            <button id="clear-matches">✕ Effacer</button>`;
    document.body.appendChild(bar);
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
});

// ============ GALLERY FOR BEFORE/AFTER ============
document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".before-after-card");
  const images = [];
  cards.forEach((card) => {
    const img = card.querySelector(".image img");
    if (img) images.push(img.src);
  });
  if (images.length === 0) return;

  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.innerHTML = `<div class="gallery-modal-content"><div class="gallery-modal-close"><i class="fas fa-times"></i></div><img src="" alt="Image"><div class="gallery-counter"><span class="current">1</span> / <span class="total">${images.length}</span></div></div><button class="gallery-prev"><i class="fas fa-chevron-left"></i></button><button class="gallery-next"><i class="fas fa-chevron-right"></i></button>`;
  document.body.appendChild(modal);
  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector(".gallery-modal-close");
  const prevBtn = modal.querySelector(".gallery-prev");
  const nextBtn = modal.querySelector(".gallery-next");
  const counterSpan = modal.querySelector(".current");
  let currentImageIndex = 0;

  function openGallery(index) {
    currentImageIndex = index;
    modalImg.src = images[currentImageIndex];
    counterSpan.textContent = currentImageIndex + 1;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeGallery() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    modalImg.src = images[currentImageIndex];
    counterSpan.textContent = currentImageIndex + 1;
  }
  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentImageIndex];
    counterSpan.textContent = currentImageIndex + 1;
  }

  cards.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (
        !e.target.closest(".before-after-prev") &&
        !e.target.closest(".before-after-next")
      )
        openGallery(index);
    });
  });
  closeBtn.addEventListener("click", closeGallery);
  prevBtn.addEventListener("click", prevImage);
  nextBtn.addEventListener("click", nextImage);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeGallery();
  });
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeGallery();
    else if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();
  });
});

// ============ LOGIN, REGISTER, CONTACT FORMS ============
document.addEventListener("DOMContentLoaded", function () {
  // Toggle forms
  const loginBtn = document.querySelector("#login-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const forgotForm = document.getElementById("forgot-form");
  const showRegister = document.getElementById("show-register");
  const showLogin = document.getElementById("show-login");
  const forgotLink = document.getElementById("forgot-password-link");
  const backToLogin = document.getElementById("back-to-login");

  if (loginBtn)
    loginBtn.addEventListener("click", () => {
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
      forgotForm.classList.remove("active");
    });
  if (showRegister)
    showRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("active");
      forgotForm.classList.remove("active");
      registerForm.classList.add("active");
    });
  if (showLogin)
    showLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerForm.classList.remove("active");
      forgotForm.classList.remove("active");
      loginForm.classList.add("active");
    });
  if (forgotLink)
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("active");
      registerForm.classList.remove("active");
      forgotForm.classList.add("active");
    });
  if (backToLogin)
    backToLogin.addEventListener("click", (e) => {
      e.preventDefault();
      forgotForm.classList.remove("active");
      loginForm.classList.add("active");
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
    if (e.key === "Escape") {
      loginForm?.classList.remove("active");
      registerForm?.classList.remove("active");
      forgotForm?.classList.remove("active");
    }
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

// ============ HOME SLIDER ============
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".home .slide");
  if (slides.length) {
    let index = 0;
    slides.forEach((s, i) => (s.style.display = i === 0 ? "flex" : "none"));
    setInterval(() => {
      index = (index + 1) % slides.length;
      slides.forEach(
        (s, i) => (s.style.display = i === index ? "flex" : "none"),
      );
    }, 6000);
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
  const h = {
    about: "#about .heading",
    services: "#services .heading",
    projects: "#projects .heading",
    beforeAfter: "#before-after .heading",
    reviews: "#reviews .heading",
    blog: "#blogs .heading",
    contact: "#contact .heading",
  };
  if (document.querySelector(h.about))
    document.querySelector(h.about).textContent =
      translations[lang].aboutHeading;
  if (document.querySelector(h.services))
    document.querySelector(h.services).textContent =
      translations[lang].servicesHeading;
  if (document.querySelector(h.projects))
    document.querySelector(h.projects).textContent =
      translations[lang].projectsHeading;
  if (document.querySelector(h.beforeAfter))
    document.querySelector(h.beforeAfter).textContent =
      translations[lang].beforeAfterHeading;
  if (document.querySelector(h.reviews))
    document.querySelector(h.reviews).textContent =
      translations[lang].reviewsHeading;
  if (document.querySelector(h.blog))
    document.querySelector(h.blog).textContent = translations[lang].blogHeading;
  if (document.querySelector(h.contact))
    document.querySelector(h.contact).textContent =
      translations[lang].contactHeading;
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
  if (document.getElementById(fields.name))
    document.getElementById(fields.name).placeholder =
      translations[lang].yourName;
  if (document.getElementById(fields.email))
    document.getElementById(fields.email).placeholder =
      translations[lang].yourEmail;
  if (document.getElementById(fields.phone))
    document.getElementById(fields.phone).placeholder =
      translations[lang].yourPhone;
  if (document.getElementById(fields.message))
    document.getElementById(fields.message).placeholder =
      translations[lang].yourMessage;
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
      langDropdown.classList.remove("active");
    });
  });
  const saved = localStorage.getItem("language");
  if (saved && translations[saved]) updateLanguage(saved);
  else updateLanguage("fr");
});

// ============ REVIEW SUBMISSION ============
document.addEventListener("DOMContentLoaded", function () {
  const reviewForm = document.getElementById("review-form");
  const reviewStatus = document.getElementById("review-status");
  const stars = document.querySelectorAll(".stars-input i");
  const ratingInput = document.getElementById("review-rating");

  // Star rating functionality
  if (stars.length > 0) {
    stars.forEach((star) => {
      star.addEventListener("click", function () {
        const rating = parseInt(this.getAttribute("data-rating"));
        ratingInput.value = rating;

        // Update star colors
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
          if (index < rating) {
            s.style.color = "#ffc107";
          } else {
            s.style.color = "#ccc";
          }
        });
      });

      star.addEventListener("mouseleave", function () {
        const currentRating = parseInt(ratingInput.value);
        stars.forEach((s, index) => {
          if (index < currentRating) {
            s.style.color = "#ffc107";
          } else {
            s.style.color = "#ccc";
          }
        });
      });
    });
  }

  // Submit review
  if (reviewForm) {
    reviewForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("review-name")?.value.trim();
      const email = document.getElementById("review-email")?.value.trim();
      const rating = parseInt(ratingInput?.value || 0);
      const comment = document.getElementById("review-comment")?.value.trim();

      // Validation
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

      showMessage("Envoi en cours...", "info");

      try {
        const response = await fetch(`${API_URL}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, rating, comment }),
        });

        const result = await response.json();

        if (result.success) {
          showMessage(result.message, "success");
          reviewForm.reset();
          ratingInput.value = "0";
          stars.forEach((star) => {
            star.classList.remove("active", "fas");
            star.classList.add("far");
          });
        } else {
          showMessage(result.message, "error");
        }
      } catch (error) {
        console.error("Review error:", error);
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }
});

// ============ REVIEWS SLIDER INITIALIZATION (SPECIFIC FOR REVIEWS) ============
function initReviewsSlider() {
  const slider = document.querySelector(".reviews-slider");
  const slides = document.querySelectorAll(".reviews .slide");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  const dotsContainer = document.querySelector(".slider-dots");

  // If no slider or no slides, exit
  if (!slider || slides.length === 0) return;

  // Reset any existing transform to avoid conflicts
  slider.style.transform = "translateX(0)";

  let currentIndex = 0;
  let slidesToShow = getSlidesToShow();
  let totalSlides = slides.length;
  let maxIndex = Math.max(0, totalSlides - slidesToShow);
  let slideWidth = 0;
  let gap = 20;

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function updateSlideWidth() {
    const container = slider.parentElement;
    const containerWidth = container.clientWidth - 32;
    slideWidth = (containerWidth - gap * (slidesToShow - 1)) / slidesToShow;
    slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidth}px`;
    });
  }

  function updateSliderPosition() {
    const translateX = -currentIndex * (slideWidth + gap);
    slider.style.transform = `translateX(${translateX}px)`;
    updateDots();
    updateButtons();
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
        updateSliderPosition();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });
  }

  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      prevBtn.style.cursor = currentIndex === 0 ? "not-allowed" : "pointer";
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
      nextBtn.style.cursor =
        currentIndex >= maxIndex ? "not-allowed" : "pointer";
    }
  }

  function nextSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateSliderPosition();
    }
  }

  function prevSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateSliderPosition();
    }
  }

  function refreshSlider() {
    const newSlidesToShow = getSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      maxIndex = Math.max(0, totalSlides - slidesToShow);
      currentIndex = Math.min(currentIndex, maxIndex);
      createDots();
    }
    updateSlideWidth();
    updateSliderPosition();
  }

  // Remove old event listeners and add new ones to prevent duplicates
  if (prevBtn) {
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    newPrevBtn.addEventListener("click", prevSlide);
  }
  if (nextBtn) {
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    newNextBtn.addEventListener("click", nextSlide);
  }

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshSlider();
    }, 150);
  });

  // Initialize the slider
  updateSlideWidth();
  createDots();
  updateSliderPosition();

  window.addEventListener("load", function () {
    refreshSlider();
  });
}

// ============ LOAD REVIEWS FROM API ============
async function loadReviews() {
  try {
    const response = await fetch(`${API_URL}/reviews`);
    const data = await response.json();

    if (data.success && data.reviews) {
      const reviewsSlider = document.querySelector(".reviews-slider");
      if (reviewsSlider) {
        // Clear the slider
        reviewsSlider.innerHTML = "";

        if (data.reviews.length === 0) {
          // Show a message if no reviews yet
          reviewsSlider.innerHTML =
            '<div class="slide"><p>Soyez le premier à laisser un avis !</p></div>';
        } else {
          // Add each review as a slide
          data.reviews.forEach((review) => {
            const stars = getStarRating(review.rating);
            const slide = document.createElement("div");
            slide.className = "slide";
            slide.innerHTML = `
                            <p>${escapeHtml(review.comment)}</p>
                            <div class="user">
                                <div>
                                    <h3>${escapeHtml(review.name)}</h3>
                                    <div class="stars">${stars}</div>
                                </div>
                            </div>
                        `;
            reviewsSlider.appendChild(slide);
          });
        }

        // Reinitialize the reviews slider after adding slides
        initReviewsSlider();
      }
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

function getStarRating(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Call loadReviews when page loads
document.addEventListener("DOMContentLoaded", function () {
  loadReviews();
});

// ============ CURRENT PROJECT SLIDER ============
function initProjectSlider() {
  const slider = document.querySelector(".project-slider");
  const slides = document.querySelectorAll(".project-slide");
  const prevBtn = document.querySelector(".project-prev");
  const nextBtn = document.querySelector(".project-next");
  const dotsContainer = document.querySelector(".project-slider-dots");

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let slidesToShow = getSlidesToShow();
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth;
    const gap = 20;
    const translateX = -currentIndex * (slideWidth + gap);
    slider.style.transform = `translateX(${translateX}px)`;
    updateDots();
    updateButtons();
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

  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = document.querySelectorAll(".project-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });
  }

  function updateButtons() {
    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
      prevBtn.style.cursor = currentIndex === 0 ? "not-allowed" : "pointer";
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
      nextBtn.style.cursor =
        currentIndex >= maxIndex ? "not-allowed" : "pointer";
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
    const newSlidesToShow = getSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      maxIndex = totalSlides - slidesToShow;
      currentIndex = Math.min(currentIndex, maxIndex);
      createDots();
    }
    updateSlider();
  }

  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshSlider();
    }, 150);
  });

  createDots();
  updateSlider();
  window.addEventListener("load", refreshSlider);
}

// ============ GALLERY MODE FOR PROJECT IMAGES ============
function initProjectGallery() {
  const slides = document.querySelectorAll(".project-slide");
  const images = [];

  slides.forEach((slide) => {
    const imgSrc = slide.querySelector("img")?.src;
    if (imgSrc) images.push(imgSrc);
  });

  if (images.length === 0) return;

  // Create modal
  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.innerHTML = `
        <div class="gallery-modal-content">
            <div class="gallery-modal-close"><i class="fas fa-times"></i></div>
            <img src="" alt="Gallery Image">
            <div class="gallery-counter"><span class="current">1</span> / <span class="total">${images.length}</span></div>
        </div>
        <button class="gallery-prev"><i class="fas fa-chevron-left"></i></button>
        <button class="gallery-next"><i class="fas fa-chevron-right"></i></button>
    `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector(".gallery-modal-close");
  const prevBtn = modal.querySelector(".gallery-prev");
  const nextBtn = modal.querySelector(".gallery-next");
  const currentCounter = modal.querySelector(".current");
  let currentIndex = 0;

  function openGallery(index) {
    currentIndex = index;
    modalImg.src = images[currentIndex];
    currentCounter.textContent = currentIndex + 1;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex];
    currentCounter.textContent = currentIndex + 1;
  }

  function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex];
    currentCounter.textContent = currentIndex + 1;
  }

  slides.forEach((slide, index) => {
    slide.addEventListener("click", () => openGallery(index));
  });

  closeBtn.addEventListener("click", closeGallery);
  prevBtn.addEventListener("click", prevImage);
  nextBtn.addEventListener("click", nextImage);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeGallery();
  });
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeGallery();
    else if (e.key === "ArrowRight") nextImage();
    else if (e.key === "ArrowLeft") prevImage();
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initProjectSlider();
  initProjectGallery();
});
