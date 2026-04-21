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

  document
    .querySelectorAll(".lang-option")
    .forEach((opt) => opt.classList.remove("active"));
  const activeOpt = document.querySelector(`.lang-option[data-lang="${lang}"]`);
  if (activeOpt) activeOpt.classList.add("active");
}

// ============ LANGUAGE SWITCH ============
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

  const savedLang = localStorage.getItem("language");
  if (savedLang && translations[savedLang]) {
    updateLanguage(savedLang);
  }
});

// ============ WAIT FOR PAGE TO LOAD ============
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Frontend loaded, API URL:", API_URL);

  // ============ GET FORM ELEMENTS ============
  const loginBtn = document.querySelector("#login-btn");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const forgotForm = document.getElementById("forgot-form");
  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const forgotPasswordLink = document.getElementById("forgot-password-link");
  const backToLoginLink = document.getElementById("back-to-login");

  // ============ TOGGLE FORMS ============
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
      forgotForm.classList.remove("active");
    });
  }

  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.classList.remove("active");
      forgotForm.classList.remove("active");
      registerForm.classList.add("active");
    });
  }

  if (showLoginLink) {
    showLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      registerForm.classList.remove("active");
      forgotForm.classList.remove("active");
      loginForm.classList.add("active");
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (e) {
      e.preventDefault();
      loginForm.classList.remove("active");
      registerForm.classList.remove("active");
      forgotForm.classList.add("active");
    });
  }

  if (backToLoginLink) {
    backToLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      forgotForm.classList.remove("active");
      loginForm.classList.add("active");
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
        console.error("Login error:", error);
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ REGISTRATION HANDLER (WORKING) ============
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
            `Inscription réussie ! Bienvenue ${firstName} ${lastName} !`,
            "success",
          );
          registerForm.reset();
          registerForm.classList.remove("active");
          loginForm.classList.add("active");
          const loginEmail = document.getElementById("login-email");
          if (loginEmail) loginEmail.value = email;
        } else {
          showMessage(data.message, "error");
        }
      } catch (error) {
        console.error("Registration error:", error);
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ FORGOT PASSWORD HANDLER (WORKING) ============
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
          loginForm.classList.add("active");
        } else {
          showMessage(data.message, "error");
        }
      } catch (error) {
        console.error("Forgot password error:", error);
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
      if (!clickedInsideForm) {
        forms.forEach((form) => {
          if (form) form.classList.remove("active");
        });
      }
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

// ============ SEARCH BUTTON ============
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("#search-btn");
  const searchForm = document.querySelector(".search-form");
  if (searchBtn && searchForm) {
    searchBtn.addEventListener("click", function () {
      searchForm.classList.toggle("active");
      if (searchForm.classList.contains("active")) {
        document.querySelector("#search-box")?.focus();
      }
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
      if (window.scrollY > 300) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    });
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
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

  if (!slider || slides.length === 0) return;

  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;

  function updateSlider() {
    const slideWidth = slides[0].offsetWidth;
    const gap = 20;
    const translateX = -currentIndex * (slideWidth + gap);
    slider.style.transform = `translateX(${translateX}px)`;

    if (prevBtn) {
      prevBtn.disabled = currentIndex === 0;
      prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    }
    if (nextBtn) {
      nextBtn.disabled = currentIndex >= maxIndex;
      nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
      }
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
      }
    });

  window.addEventListener("resize", () => {
    slidesToShow =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    maxIndex = totalSlides - slidesToShow;
    currentIndex = Math.min(currentIndex, maxIndex);
    updateSlider();
  });

  setTimeout(updateSlider, 100);
  window.addEventListener("load", updateSlider);
});

// ============ BLOG SLIDER ============
document.addEventListener("DOMContentLoaded", function () {
  const blogSlider = document.querySelector(".blogs-slider");
  const blogSlides = document.querySelectorAll(".blogs .slide");
  const blogPrevBtn = document.querySelector(".blog-slider-prev");
  const blogNextBtn = document.querySelector(".blog-slider-next");

  if (!blogSlider || blogSlides.length === 0) return;

  let currentIndex = 0;
  let slidesToShow =
    window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
  let totalSlides = blogSlides.length;
  let maxIndex = totalSlides - slidesToShow;

  function updateBlogSlider() {
    const slideWidth = blogSlides[0].offsetWidth;
    const gap = 20;
    const translateX = -currentIndex * (slideWidth + gap);
    blogSlider.style.transform = `translateX(${translateX}px)`;

    if (blogPrevBtn) {
      blogPrevBtn.disabled = currentIndex === 0;
      blogPrevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1";
    }
    if (blogNextBtn) {
      blogNextBtn.disabled = currentIndex >= maxIndex;
      blogNextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1";
    }
  }

  if (blogPrevBtn)
    blogPrevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateBlogSlider();
      }
    });

  if (blogNextBtn)
    blogNextBtn.addEventListener("click", () => {
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateBlogSlider();
      }
    });

  window.addEventListener("resize", () => {
    slidesToShow =
      window.innerWidth <= 768 ? 1 : window.innerWidth <= 992 ? 2 : 3;
    maxIndex = totalSlides - slidesToShow;
    currentIndex = Math.min(currentIndex, maxIndex);
    updateBlogSlider();
  });

  setTimeout(updateBlogSlider, 100);
  window.addEventListener("load", updateBlogSlider);
});
