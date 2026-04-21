// ============ API CONFIGURATION ============
const API_URL = "https://soit-backend.onrender.com/api";

// ============ CUSTOM TOAST NOTIFICATION ============
function showMessage(message, type = "success") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const messageDiv = document.createElement("div");
  messageDiv.className = `alert-message alert-${type}`;
  let icon = "";
  switch (type) {
    case "success":
      icon = '<i class="fas fa-check-circle"></i>';
      break;
    case "error":
      icon = '<i class="fas fa-times-circle"></i>';
      break;
    case "warning":
      icon = '<i class="fas fa-exclamation-triangle"></i>';
      break;
    case "info":
      icon = '<i class="fas fa-info-circle"></i>';
      break;
    default:
      icon = '<i class="fas fa-bell"></i>';
  }
  messageDiv.innerHTML = `${icon}<span>${message}</span>`;
  container.appendChild(messageDiv);
  setTimeout(() => {
    messageDiv.remove();
    if (container.children.length === 0) container.remove();
  }, 5000);
}

// ============ TRANSLATIONS ============
const translations = {
  fr: {
    home: "Accueil",
    about: "À propos",
    services: "Services",
    projects: "Projets",
    clients: "Nos Clients",
    contact: "Contact",
    aboutHeading: "Qui sommes-nous ?",
    servicesHeading: "Nos services",
    projectsHeading: "Nos réalisations",
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
    clients: "Our Clients",
    contact: "Contact",
    aboutHeading: "Who are we?",
    servicesHeading: "Our Services",
    projectsHeading: "Our Achievements",
    reviewsHeading: "What our clients say",
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
    clients: "عملاؤنا",
    contact: "اتصل بنا",
    aboutHeading: "من نحن؟",
    servicesHeading: "خدماتنا",
    projectsHeading: "إنجازاتنا",
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

let currentLanguage = "fr";

function updateLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("language", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

  const navLinks = document.querySelectorAll(".navbar a");
  if (navLinks[0]) navLinks[0].textContent = translations[lang].home;
  if (navLinks[1]) navLinks[1].textContent = translations[lang].about;
  if (navLinks[2]) navLinks[2].textContent = translations[lang].services;
  if (navLinks[3]) navLinks[3].textContent = translations[lang].projects;
  if (navLinks[4]) navLinks[4].textContent = translations[lang].clients;
  if (navLinks[5]) navLinks[5].textContent = translations[lang].contact;

  const headings = document.querySelectorAll(".heading");
  if (headings[0]) headings[0].textContent = translations[lang].aboutHeading;
  if (headings[1]) headings[1].textContent = translations[lang].servicesHeading;
  if (headings[2]) headings[2].textContent = translations[lang].projectsHeading;
  if (headings[3]) headings[3].textContent = translations[lang].reviewsHeading;
  if (headings[4]) headings[4].textContent = translations[lang].blogHeading;
  if (headings[5]) headings[5].textContent = translations[lang].contactHeading;

  const btns = document.querySelectorAll(".btn");
  btns.forEach((btn) => {
    const text = btn.textContent;
    if (
      text.includes("Commencez") ||
      text.includes("Start") ||
      text.includes("ابدأ")
    )
      btn.textContent = translations[lang].startNow;
    else if (
      text.includes("En savoir") ||
      text.includes("Learn") ||
      text.includes("اعرف")
    )
      btn.textContent = translations[lang].learnMore;
    else if (
      text.includes("Envoyer") ||
      text.includes("Send") ||
      text.includes("إرسال")
    )
      btn.textContent = translations[lang].sendMessage;
  });

  const searchInput = document.getElementById("search-box");
  if (searchInput)
    searchInput.placeholder = translations[lang].searchPlaceholder;

  const contactName = document.getElementById("contact-name");
  const contactEmail = document.getElementById("contact-email");
  const contactPhone = document.getElementById("contact-phone");
  const contactMessage = document.getElementById("contact-message");
  if (contactName) contactName.placeholder = translations[lang].yourName;
  if (contactEmail) contactEmail.placeholder = translations[lang].yourEmail;
  if (contactPhone) contactPhone.placeholder = translations[lang].yourPhone;
  if (contactMessage)
    contactMessage.placeholder = translations[lang].yourMessage;

  const infoTitles = document.querySelectorAll(".info h3");
  if (infoTitles[0]) infoTitles[0].textContent = translations[lang].phone;
  if (infoTitles[1]) infoTitles[1].textContent = translations[lang].emailLabel;
  if (infoTitles[2]) infoTitles[2].textContent = translations[lang].address;

  // Update active language in dropdown
  document
    .querySelectorAll(".lang-item")
    .forEach((item) => item.classList.remove("active"));
  const activeItem = document.querySelector(`.lang-item[data-lang="${lang}"]`);
  if (activeItem) activeItem.classList.add("active");
  const currentLangSpan = document.getElementById("current-lang");
  if (currentLangSpan) currentLangSpan.textContent = lang.toUpperCase();
}

// ============ LANGUAGE SELECTOR SETUP ============
document.addEventListener("DOMContentLoaded", function () {
  const selector = document.querySelector(".language-selector");
  const btn = document.getElementById("lang-btn");
  if (selector && btn) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      selector.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!selector.contains(e.target)) selector.classList.remove("active");
    });
  }

  document.querySelectorAll(".lang-item").forEach((item) => {
    item.addEventListener("click", () => {
      const lang = item.getAttribute("data-lang");
      updateLanguage(lang);
      if (selector) selector.classList.remove("active");
    });
  });

  // Load saved language
  const savedLang = localStorage.getItem("language");
  if (savedLang && translations[savedLang]) {
    updateLanguage(savedLang);
  } else {
    updateLanguage("fr");
  }
});

// ============ WAIT FOR PAGE TO LOAD (other features) ============
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Frontend loaded, API URL:", API_URL);

  // ============ FORM ELEMENTS ============
  const loginBtn = document.querySelector("#login-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const forgotForm = document.getElementById("forgot-form");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const backToLoginLink = document.getElementById("back-to-login");

  // Toggle Forms
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      if (loginForm) loginForm.classList.add("active");
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
    });
  }
  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (loginForm) loginForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
      if (registerForm) registerForm.classList.add("active");
    });
  }
  if (showLoginLink) {
    showLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
      if (loginForm) loginForm.classList.add("active");
    });
  }
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (loginForm) loginForm.classList.remove("active");
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.add("active");
    });
  }
  if (backToLoginLink) {
    backToLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (forgotForm) forgotForm.classList.remove("active");
      if (loginForm) loginForm.classList.add("active");
    });
  }

  // ============ LOGIN HANDLER ============
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value.trim();
      if (!email || !password) {
        showMessage("Veuillez entrer votre email et mot de passe", "warning");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("user", JSON.stringify(data.user));
          showMessage(data.message, "success");
          loginForm.classList.remove("active");
          loginForm.reset();
          const icon = document.querySelector("#login-btn");
          if (icon) icon.innerHTML = '<i class="fas fa-user-check"></i>';
        } else {
          showMessage(data.message, "error");
        }
      } catch (error) {
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ REGISTRATION HANDLER ============
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const firstName = document.getElementById("reg-firstname")?.value.trim();
      const lastName = document.getElementById("reg-lastname")?.value.trim();
      const username = document.getElementById("reg-username")?.value.trim();
      const email = document.getElementById("reg-email")?.value.trim();
      const password = document.getElementById("reg-password")?.value;
      const confirmPassword = document.getElementById(
        "reg-confirm-password",
      )?.value;

      if (!firstName || !lastName || !username || !email || !password) {
        showMessage("Veuillez remplir tous les champs", "warning");
        return;
      }
      if (password !== confirmPassword) {
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
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (data.success) {
          showMessage(
            `${data.message} Bienvenue ${firstName} ${lastName} !`,
            "success",
          );
          registerForm.reset();
          registerForm.classList.remove("active");
          if (loginForm) loginForm.classList.add("active");
          const loginEmail = document.getElementById("login-email");
          if (loginEmail) loginEmail.value = email;
        } else {
          showMessage(data.message, "error");
        }
      } catch (error) {
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ FORGOT PASSWORD HANDLER ============
  if (forgotForm) {
    forgotForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.getElementById("forgot-email")?.value.trim();
      if (!email) {
        showMessage("Veuillez entrer votre email", "warning");
        return;
      }
      try {
        const response = await fetch(`${API_URL}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          showMessage(data.message, "success");
          forgotForm.reset();
          forgotForm.classList.remove("active");
          if (loginForm) loginForm.classList.add("active");
        } else {
          showMessage(data.message, "error");
        }
      } catch (error) {
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ CONTACT FORM HANDLER ============
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = {
        name: document.getElementById("contact-name")?.value || "",
        email: document.getElementById("contact-email")?.value || "",
        phone: document.getElementById("contact-phone")?.value || "",
        message: document.getElementById("contact-message")?.value || "",
      };
      if (!formData.name || !formData.email || !formData.message) {
        showMessage("Veuillez remplir tous les champs obligatoires", "warning");
        return;
      }
      showMessage("Envoi en cours...", "info");
      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
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

  // ============ CLOSE FORMS ON OUTSIDE CLICK ============
  document.addEventListener("click", function (event) {
    const forms = [loginForm, registerForm, forgotForm];
    const loginIcon = document.querySelector("#login-btn");
    const isFormActive = forms.some(
      (form) => form && form.classList.contains("active"),
    );
    if (loginIcon && !loginIcon.contains(event.target) && isFormActive) {
      let clickedInsideForm = false;
      forms.forEach((form) => {
        if (form && form.contains(event.target)) clickedInsideForm = true;
      });
      if (!clickedInsideForm)
        forms.forEach((form) => {
          if (form) form.classList.remove("active");
        });
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (loginForm) loginForm.classList.remove("active");
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
    }
  });
});

// ============ LOGOUT FUNCTION ============
function logout() {
  localStorage.removeItem("user");
  const loginIcon = document.querySelector("#login-btn");
  if (loginIcon) loginIcon.innerHTML = '<i class="fas fa-user"></i>';
  showMessage("Déconnexion réussie !", "success");
  setTimeout(() => location.reload(), 1000);
}

// ============ CHECK LOGIN STATUS ============
document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      const loginIcon = document.querySelector("#login-btn");
      if (loginIcon) {
        loginIcon.innerHTML =
          userData.role === "admin"
            ? '<i class="fas fa-user-shield"></i>'
            : '<i class="fas fa-user-check"></i>';
      }
    } catch (e) {
      console.error(e);
    }
  }
});

// ============ HOME SLIDER ============
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".home .slide");
  if (slides.length > 0) {
    let currentIndex = 0;
    slides.forEach((slide, i) => {
      slide.style.display = i === 0 ? "flex" : "none";
    });
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      slides.forEach((slide, i) => {
        slide.style.display = i === currentIndex ? "flex" : "none";
      });
    }, 6000);
  }
});

// ============ MOBILE MENU ============
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector("#menu-btn");
  const navbar = document.querySelector(".header .navbar");
  if (menuBtn && navbar) {
    menuBtn.addEventListener("click", () => navbar.classList.toggle("active"));
  }
});

// ============ SEARCH FUNCTIONALITY ============
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-box");
  let currentHighlights = [],
    currentHighlightIndex = -1,
    searchResultsBar = null;

  function createSearchBar() {
    if (document.querySelector(".search-results-bar")) return;
    const bar = document.createElement("div");
    bar.className = "search-results-bar";
    bar.innerHTML = `<span id="search-result-count">0 résultat</span>
            <button id="prev-result" disabled>◀ Précédent</button>
            <button id="next-result" disabled>Suivant ▶</button>
            <button id="clear-search" class="close-search">✕</button>`;
    document.body.appendChild(bar);
    searchResultsBar = bar;
    document
      .getElementById("prev-result")
      ?.addEventListener("click", previousHighlight);
    document
      .getElementById("next-result")
      ?.addEventListener("click", nextHighlight);
    document
      .getElementById("clear-search")
      ?.addEventListener("click", clearSearch);
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
    currentHighlightIndex = -1;
    if (searchResultsBar) searchResultsBar.classList.remove("show");
  }

  function clearSearch() {
    clearHighlights();
    if (searchInput) searchInput.value = "";
    if (searchResultsBar) searchResultsBar.classList.remove("show");
  }

  function highlightText(searchTerm) {
    clearHighlights();
    if (!searchTerm || searchTerm.trim() === "") return;
    const term = searchTerm.trim().toLowerCase();
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
      const lowerText = text.toLowerCase();
      let index = lowerText.indexOf(term);
      if (index !== -1) {
        const span = document.createElement("span");
        let lastIndex = 0,
          html = "";
        while (index !== -1) {
          html += escapeHtml(text.substring(lastIndex, index));
          html += `<mark class="highlight">${escapeHtml(text.substr(index, term.length))}</mark>`;
          lastIndex = index + term.length;
          index = lowerText.indexOf(term, lastIndex);
        }
        html += escapeHtml(text.substring(lastIndex));
        span.innerHTML = html;
        node.parentNode.replaceChild(span, node);
      }
    });
    currentHighlights = Array.from(document.querySelectorAll(".highlight"));
    if (currentHighlights.length > 0) {
      const countSpan = document.getElementById("search-result-count");
      if (countSpan)
        countSpan.textContent =
          currentHighlights.length === 1
            ? "1 résultat trouvé"
            : `${currentHighlights.length} résultats trouvés`;
      if (searchResultsBar) searchResultsBar.classList.add("show");
      currentHighlightIndex = 0;
      scrollToHighlight();
      updateNavButtons();
    } else if (searchTerm.trim() !== "") {
      showMessage(`Aucun résultat trouvé pour "${searchTerm}"`, "info");
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function scrollToHighlight() {
    if (
      currentHighlights.length > 0 &&
      currentHighlights[currentHighlightIndex]
    ) {
      document
        .querySelectorAll(".highlight-current")
        .forEach((el) => el.classList.remove("highlight-current"));
      currentHighlights[currentHighlightIndex].classList.add(
        "highlight-current",
      );
      currentHighlights[currentHighlightIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  function updateNavButtons() {
    const prevBtn = document.getElementById("prev-result"),
      nextBtn = document.getElementById("next-result");
    if (prevBtn) prevBtn.disabled = currentHighlightIndex <= 0;
    if (nextBtn)
      nextBtn.disabled = currentHighlightIndex >= currentHighlights.length - 1;
  }

  function nextHighlight() {
    if (currentHighlightIndex < currentHighlights.length - 1) {
      currentHighlightIndex++;
      scrollToHighlight();
      updateNavButtons();
    }
  }
  function previousHighlight() {
    if (currentHighlightIndex > 0) {
      currentHighlightIndex--;
      scrollToHighlight();
      updateNavButtons();
    }
  }

  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value;
      if (searchTerm && searchTerm.trim() !== "") {
        createSearchBar();
        highlightText(searchTerm);
        searchForm.classList.remove("active");
      } else {
        showMessage("Veuillez entrer un terme de recherche", "warning");
      }
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") clearSearch();
  });
});

// Search button toggle
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("#search-btn");
  const searchForm = document.querySelector(".search-form");
  if (searchBtn && searchForm) {
    searchBtn.addEventListener("click", function () {
      searchForm.classList.toggle("active");
      if (searchForm.classList.contains("active"))
        document.querySelector("#search-box")?.focus();
      else document.getElementById("clear-search")?.click();
    });
  }
});

// ============ INFO SIDEBAR ============
document.addEventListener("DOMContentLoaded", function () {
  const infoBtn = document.querySelector("#info-btn");
  const contactInfo = document.querySelector(".contact-info");
  const closeInfo = document.querySelector("#close-info");
  if (infoBtn && contactInfo) {
    infoBtn.addEventListener("click", () =>
      contactInfo.classList.add("active"),
    );
    if (closeInfo)
      closeInfo.addEventListener("click", () =>
        contactInfo.classList.remove("active"),
      );
  }
});

// ============ SCROLL TO TOP BUTTON ============
document.addEventListener("DOMContentLoaded", function () {
  const scrollBtn = document.getElementById("scroll-top");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) scrollBtn.classList.add("show");
      else scrollBtn.classList.remove("show");
    });
    scrollBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }
});

// ============ GALLERY FUNCTIONALITY ============
document.addEventListener("DOMContentLoaded", function () {
  const projectBoxes = document.querySelectorAll(
    ".projects .box-container .box",
  );
  if (projectBoxes.length === 0) return;
  let galleryImages = [];
  projectBoxes.forEach((box) => {
    const imgSrc = box.querySelector(".image img")?.src;
    if (imgSrc) galleryImages.push(imgSrc);
  });
  if (galleryImages.length === 0) return;
  let currentIndex = 0;
  const modal = document.createElement("div");
  modal.className = "gallery-modal";
  modal.innerHTML = `<div class="gallery-modal-content"><div class="gallery-modal-close"><i class="fas fa-times"></i></div><img src="" alt="Gallery Image"><div class="gallery-counter"><span class="current">1</span> / <span class="total">${galleryImages.length}</span></div></div><button class="gallery-prev"><i class="fas fa-chevron-left"></i></button><button class="gallery-next"><i class="fas fa-chevron-right"></i></button>`;
  document.body.appendChild(modal);
  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector(".gallery-modal-close");
  const prevBtn = modal.querySelector(".gallery-prev");
  const nextBtn = modal.querySelector(".gallery-next");
  const currentCounter = modal.querySelector(".current");
  function openGallery(index) {
    currentIndex = index;
    modalImg.src = galleryImages[currentIndex];
    currentCounter.textContent = currentIndex + 1;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
  function closeGallery() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
  function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    modalImg.src = galleryImages[currentIndex];
    currentCounter.textContent = currentIndex + 1;
  }
  function prevImage() {
    currentIndex =
      (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    modalImg.src = galleryImages[currentIndex];
    currentCounter.textContent = currentIndex + 1;
  }
  projectBoxes.forEach((box, index) => {
    box.addEventListener("click", (e) => {
      e.preventDefault();
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

// ============ REVIEWS SLIDER ============
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".reviews-slider");
  const slides = document.querySelectorAll(".reviews .slide");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  const dotsContainer = document.querySelector(".slider-dots");
  if (!slider || slides.length === 0) return;
  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;
  function getGap() {
    return parseFloat(window.getComputedStyle(slider).gap) || 20;
  }
  function updateSlider() {
    const gap = getGap();
    const translateX = -currentIndex * (slides[0].offsetWidth + gap);
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
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });
  }
  function updateButtons() {
    if (prevBtn) {
      if (currentIndex === 0) prevBtn.setAttribute("disabled", "disabled");
      else prevBtn.removeAttribute("disabled");
    }
    if (nextBtn) {
      if (currentIndex >= maxIndex)
        nextBtn.setAttribute("disabled", "disabled");
      else nextBtn.removeAttribute("disabled");
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
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(refreshSlider, 150);
  });
  createDots();
  updateSlider();
  window.addEventListener("load", refreshSlider);
});

// ============ BLOG SLIDER - FIXED FOR DESKTOP ============
document.addEventListener("DOMContentLoaded", function () {
  initBlogSlider();
});

function initBlogSlider() {
  const blogSlider = document.querySelector(".blogs-slider");
  const blogSlides = document.querySelectorAll(".blogs .slide");
  const blogPrevBtn = document.querySelector(".blog-slider-prev");
  const blogNextBtn = document.querySelector(".blog-slider-next");

  if (!blogSlider || blogSlides.length === 0) {
    console.log("Blog slider not found");
    return;
  }

  console.log("Initializing blog slider, slides:", blogSlides.length);

  let currentIndex = 0;
  let slidesToShow = getSlidesToShow();
  let totalSlides = blogSlides.length;
  let maxIndex = totalSlides - slidesToShow;

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getGap() {
    const sliderStyle = window.getComputedStyle(blogSlider);
    return parseFloat(sliderStyle.gap) || 20;
  }

  function updateSlider() {
    if (blogSlides.length === 0) return;

    const gap = getGap();
    const slideWidth = blogSlides[0].offsetWidth;
    const translateX = -currentIndex * (slideWidth + gap);
    blogSlider.style.transform = `translateX(${translateX}px)`;

    updateButtons();
  }

  function updateButtons() {
    if (blogPrevBtn) {
      if (currentIndex === 0) {
        blogPrevBtn.setAttribute("disabled", "disabled");
        blogPrevBtn.style.opacity = "0.5";
        blogPrevBtn.style.cursor = "not-allowed";
      } else {
        blogPrevBtn.removeAttribute("disabled");
        blogPrevBtn.style.opacity = "1";
        blogPrevBtn.style.cursor = "pointer";
      }
    }
    if (blogNextBtn) {
      if (currentIndex >= maxIndex) {
        blogNextBtn.setAttribute("disabled", "disabled");
        blogNextBtn.style.opacity = "0.5";
        blogNextBtn.style.cursor = "not-allowed";
      } else {
        blogNextBtn.removeAttribute("disabled");
        blogNextBtn.style.opacity = "1";
        blogNextBtn.style.cursor = "pointer";
      }
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
    }
    // Reset transform and recalculate
    blogSlider.style.transform = "";
    setTimeout(() => {
      updateSlider();
    }, 50);
  }

  // Event listeners
  if (blogPrevBtn) blogPrevBtn.addEventListener("click", prevSlide);
  if (blogNextBtn) blogNextBtn.addEventListener("click", nextSlide);

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshSlider();
    }, 150);
  });

  // Initial update
  setTimeout(() => {
    updateSlider();
  }, 100);

  // Update after all images load
  window.addEventListener("load", function () {
    refreshSlider();
  });
}

// ============ SIMPLE LANGUAGE SWITCH ============
document.addEventListener("DOMContentLoaded", function () {
  const languageBtn = document.getElementById("language-btn");
  const languageDropdown = document.getElementById("language-dropdown");

  if (languageBtn && languageDropdown) {
    languageBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      languageDropdown.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (
        !languageBtn.contains(e.target) &&
        !languageDropdown.contains(e.target)
      ) {
        languageDropdown.classList.remove("active");
      }
    });
  }

  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      updateLanguage(lang);
      languageDropdown.classList.remove("active");
    });
  });

  // Load saved language
  const savedLang = localStorage.getItem("language");
  if (savedLang && translations[savedLang]) {
    updateLanguage(savedLang);
  }
});
