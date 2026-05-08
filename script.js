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

// Update indicators when slide changes
function updateSliderIndicators() {
  const slides = document.querySelectorAll(".home .slide");
  const indicators = document.querySelectorAll(".indicator");

  if (!slides.length || !indicators.length) return;

  let currentIndex = 0;
  slides.forEach((slide, index) => {
    if (slide.style.display === "flex") {
      currentIndex = index;
    }
  });

  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentIndex);
  });
}

// Add click events to indicators
document.querySelectorAll(".indicator").forEach((indicator, index) => {
  indicator.addEventListener("click", () => {
    const slides = document.querySelectorAll(".home .slide");
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? "flex" : "none";
    });
    updateSliderIndicators();
  });
});

// Call update when slider changes (add to your existing slider interval)
// After your existing slider code, add: updateSliderIndicators();

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
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".home .slide");
  const prevBtn = document.querySelector(".home-prev");
  const nextBtn = document.querySelector(".home-next");
  const dots = document.querySelectorAll(".home-dots .dot");

  if (!slides.length) return;

  let currentIndex = 0;
  let interval;
  const totalSlides = slides.length;

  // Function to show slide
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (dots[i]) dots[i].classList.remove("active");
    });

    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
    currentIndex = index;
  }

  // Next slide
  function nextSlide() {
    let newIndex = currentIndex + 1;
    if (newIndex >= totalSlides) newIndex = 0;
    showSlide(newIndex);
    resetInterval();
  }

  // Previous slide
  function prevSlide() {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = totalSlides - 1;
    showSlide(newIndex);
    resetInterval();
  }

  // Reset auto-slide interval
  function resetInterval() {
    if (interval) clearInterval(interval);
    interval = setInterval(nextSlide, 6000);
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Dot click event
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      resetInterval();
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });

  // Start auto-slide
  interval = setInterval(nextSlide, 6000);
});

// ============ STATS COUNTER ANIMATION ============
function animateStats() {
  const statNumbers = document.querySelectorAll(".stat-number");

  if (!statNumbers.length) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
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
          } else {
            element.textContent = Math.floor(current);
          }
        }, 16);

        observer.unobserve(element);
      }
    });
  }, observerOptions);

  statNumbers.forEach((number) => {
    observer.observe(number);
  });
}

// Call when page loads
document.addEventListener("DOMContentLoaded", animateStats);

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

// ============ REVIEWS SLIDER ============
function initReviewsSlider() {
  const slider = document.querySelector(".reviews-slider");
  const slides = document.querySelectorAll(".review-card");
  const prevBtn = document.querySelector(".reviews-prev");
  const nextBtn = document.querySelector(".reviews-next");
  const dotsContainer = document.querySelector(".reviews-dots");

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

  function updateDots() {
    if (!dotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = dotsContainer.querySelectorAll(".review-dot");
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
    resizeTimer = setTimeout(refreshSlider, 150);
  });

  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// ============ LOAD REVIEWS FROM API ============
async function loadReviews() {
  try {
    const response = await fetch(`${API_URL}/reviews`);
    const data = await response.json();

    if (data.success && data.reviews) {
      const reviewsSlider = document.querySelector(".reviews-slider");
      if (reviewsSlider) {
        reviewsSlider.innerHTML = "";

        if (data.reviews.length === 0) {
          reviewsSlider.innerHTML =
            '<div class="review-card"><div class="review-header"><div class="review-avatar"><i class="fas fa-user"></i></div><div class="review-info"><div class="review-name">Soyez le premier</div><div class="review-stars"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i></div></div></div><div class="review-quote"><i class="fas fa-quote-left"></i><p>Partagez votre expérience avec SOIT en laissant un avis !</p></div></div>';
        } else {
          data.reviews.forEach((review) => {
            const stars = getStarsHtml(review.rating);
            const slide = document.createElement("div");
            slide.className = "review-card";
            slide.innerHTML = `
                            <div class="review-header">
                                <div class="review-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="review-info">
                                    <div class="review-name">
                                        ${escapeHtml(review.name)}
                                        <span class="verified-badge"><i class="fas fa-check-circle"></i> Vérifié</span>
                                    </div>
                                    <div class="review-stars">${stars}</div>
                                    <div class="review-date">${new Date(review.createdAt).toLocaleDateString("fr-FR")}</div>
                                </div>
                            </div>
                            <div class="review-quote">
                                <i class="fas fa-quote-left"></i>
                                <p>${escapeHtml(review.comment)}</p>
                            </div>
                            <div class="review-project">
                                <i class="fas fa-hard-hat"></i> Client SOIT
                            </div>
                        `;
            reviewsSlider.appendChild(slide);
          });
        }

        // Refresh slider after loading new reviews
        if (typeof initReviewsSlider === "function") {
          initReviewsSlider();
        }
      }

      // Update rating summary
      updateRatingSummary(data.reviews);
    }
  } catch (error) {
    console.error("Error loading reviews:", error);
  }
}

function getStarsHtml(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i - 0.5 <= rating) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
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

  const percentages = [85, 10, 3, 1, 1];
  const fills = document.querySelectorAll(".rating-fill");
  fills.forEach((fill, index) => {
    const percent = ((ratings[4 - index] / total) * 100).toFixed(0);
    fill.style.width = `${percent}%`;
    const percentSpan = fill.parentElement.nextElementSibling;
    if (percentSpan) percentSpan.textContent = `${percent}%`;
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
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

  // Star rating functionality
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

  // Form submission
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
          form.reset();
          ratingInput.value = "0";
          stars.forEach((star) => {
            star.classList.remove("active", "fas");
            star.classList.add("far");
          });
          modal.classList.remove("active");
          document.body.style.overflow = "";

          // Reload reviews after adding new one
          setTimeout(() => {
            loadReviews();
          }, 1000);
        } else {
          showMessage(result.message, "error");
        }
      } catch (error) {
        console.error("Review error:", error);
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  loadReviews();
  initReviewModal();
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
    const gap = 15;
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
    const dots = dotsContainer.querySelectorAll(".project-dot");
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
    resizeTimer = setTimeout(refreshSlider, 150);
  });

  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// Gallery Modal for Project Images
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
    if (imgSrc) {
      images.push({ src: imgSrc, caption: imgCaption });
    }
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

  if (closeBtn) closeBtn.addEventListener("click", closeGallery);
  if (prevBtn) prevBtn.addEventListener("click", prevImage);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGallery();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!modal?.classList.contains("active")) return;
    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  initProjectSlider();
  initProjectGallery();
});

// Forgot password handler
const forgotForm = document.getElementById("forgot-form");
if (forgotForm) {
  forgotForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Forgot form submitted");

    const email = document.getElementById("forgot-email")?.value.trim();
    console.log("Email:", email);
    console.log("API_URL:", API_URL);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  });
}

// Measure page load time
window.addEventListener("load", function () {
  const loadTime =
    performance.timing.domContentLoadedEventEnd -
    performance.timing.navigationStart;
  console.log(`Page loaded in ${loadTime}ms`);

  // Send to analytics (optional)
  if (loadTime > 3000) {
    console.warn("Slow page load detected");
  }
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
  let slidesToShow = getSlidesToShow();
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1200) return 2;
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
    resizeTimer = setTimeout(refreshSlider, 150);
  });

  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  initBeforeAfterSlider();
});

// ============ GALLERY MODE FOR BEFORE/AFTER ============
function initGallery() {
  const galleryBtns = document.querySelectorAll(".gallery-btn");
  const modal = document.getElementById("galleryModal");
  const modalImg = modal?.querySelector("img");
  const closeBtn = modal?.querySelector(".gallery-close");
  const prevBtn = modal?.querySelector(".gallery-prev");
  const nextBtn = modal?.querySelector(".gallery-next");
  const counter = modal?.querySelector(".gallery-counter");

  let currentImages = [];
  let currentIndex = 0;

  // Collect all images
  galleryBtns.forEach((btn) => {
    const imgSrc = btn.getAttribute("data-image");
    if (imgSrc) currentImages.push(imgSrc);
  });

  function openGallery(index) {
    if (!modal || !modalImg) return;
    currentIndex = index;
    modalImg.src = currentImages[currentIndex];
    if (counter)
      counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
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
    currentIndex = (currentIndex + 1) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
    if (counter)
      counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  }

  function prevImage() {
    if (!modalImg) return;
    currentIndex =
      (currentIndex - 1 + currentImages.length) % currentImages.length;
    modalImg.src = currentImages[currentIndex];
    if (counter)
      counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  }

  // Add click events to gallery buttons
  galleryBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => openGallery(index));
  });

  if (closeBtn) closeBtn.addEventListener("click", closeGallery);
  if (prevBtn) prevBtn.addEventListener("click", prevImage);
  if (nextBtn) nextBtn.addEventListener("click", nextImage);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeGallery();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!modal?.classList.contains("active")) return;
    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
}

// Filter functionality
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".before-after-card");

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

      // Refresh slider after filter
      setTimeout(() => {
        if (typeof initBeforeAfterSlider === "function") {
          initBeforeAfterSlider();
        }
      }, 350);
    });
  });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  initGallery();
  initFilters();
});

// ============ BLOG SLIDER ============
function initBlogSlider() {
  const slider = document.querySelector(".blogs-slider");
  const slides = document.querySelectorAll(".blogs .slide");
  const prevBtn = document.querySelector(".blog-slider-prev");
  const nextBtn = document.querySelector(".blog-slider-next");
  const dotsContainer = document.querySelector(".blog-slider-dots");

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
    resizeTimer = setTimeout(refreshSlider, 150);
  });

  createDots();
  refreshSlider();
  window.addEventListener("load", refreshSlider);
}

// Load More Articles
function initLoadMore() {
  const loadMoreBtn = document.querySelector(".load-more-btn");
  if (!loadMoreBtn) return;

  let currentArticles = 6;
  const totalArticles = 9;

  loadMoreBtn.addEventListener("click", function () {
    // Simulate loading more articles
    loadMoreBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Chargement...';

    setTimeout(() => {
      currentArticles += 3;
      loadMoreBtn.innerHTML =
        '<i class="fas fa-sync-alt"></i> Charger plus d\'articles';

      if (currentArticles >= totalArticles) {
        loadMoreBtn.style.display = "none";
      }
    }, 1500);
  });
}

// Newsletter Form
function initNewsletter() {
  const newsletterForm = document.querySelector(".newsletter-form");
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector("input").value;

    if (email) {
      alert(
        `Merci pour votre inscription ! Vous recevrez nos actualités sur ${email}`,
      );
      this.reset();
    }
  });
}

// Article Modal
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

  if (modalClose) {
    modalClose.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

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

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  initBlogSlider();
  initLoadMore();
  initNewsletter();
  initArticleModal();
});

// ============ FAQ ACCORDÉON ============
function initFaq() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Fermer les autres items (optionnel - un seul ouvert à la fois)
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
        }
      });

      // Toggle l'item actuel
      item.classList.toggle("active");
    });
  });
}

// Initialiser au chargement
document.addEventListener("DOMContentLoaded", () => {
  initFaq();
});

// ============ DARK MODE TOGGLE ============
function initDarkMode() {
  const darkModeBtn = document.getElementById("dark-mode-btn");

  if (!darkModeBtn) return;

  const moonIcon = darkModeBtn.querySelector("i");

  // Vérifier la préférence sauvegardée
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    if (moonIcon) {
      moonIcon.classList.remove("fa-moon");
      moonIcon.classList.add("fa-sun");
    }
  }

  darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("darkMode", isDark);

    if (moonIcon) {
      if (isDark) {
        moonIcon.classList.remove("fa-moon");
        moonIcon.classList.add("fa-sun");
        moonIcon.style.transform = "scale(1.1)";
        setTimeout(() => {
          moonIcon.style.transform = "scale(1)";
        }, 200);
      } else {
        moonIcon.classList.remove("fa-sun");
        moonIcon.classList.add("fa-moon");
        moonIcon.style.transform = "scale(1.1)";
        setTimeout(() => {
          moonIcon.style.transform = "scale(1)";
        }, 200);
      }
    }
  });
}

// Détecter la préférence système
function detectSystemTheme() {
  if (localStorage.getItem("darkMode") === null) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (prefersDark) {
      document.body.classList.add("dark-mode");
      const moonIcon = document.querySelector("#dark-mode-btn i");
      if (moonIcon) {
        moonIcon.classList.remove("fa-moon");
        moonIcon.classList.add("fa-sun");
      }
      localStorage.setItem("darkMode", "true");
    }
  }
}

// Initialiser
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  detectSystemTheme();
});

// ============ GALERIE PROJET SOUK JDID ============
const galleryData = [
  {
    src: "images/projets/souk-jdid/souk-jdid-01.jpg",
    caption: "Vue générale - Entrée de Souk Jdid",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-02.jpg",
    caption: "Préparation du terrain",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-03.jpg",
    caption: "Mise en place des bordures",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-04.jpg",
    caption: "Plantation d'arbres",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-05.jpg",
    caption: "Aménagement paysager",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-06.jpg",
    caption: "Installation éclairage public",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-07.jpg",
    caption: "Revêtement des trottoirs",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-08.jpg",
    caption: "Signalétique décorative",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-09.jpg",
    caption: "Avancement des travaux",
  },
  { src: "images/projets/souk-jdid/souk-jdid-10.jpg", caption: "Finitions" },
  {
    src: "images/projets/souk-jdid/souk-jdid-11.jpg",
    caption: "Vue après aménagement",
  },
  {
    src: "images/projets/souk-jdid/souk-jdid-12.jpg",
    caption: "Résultat final - Entrée embellie",
  },
];

let currentGalleryIndex = 0;
const modal = document.getElementById("galleryModal");
const mainImage = document.getElementById("galleryMainImage");
const captionEl = document.getElementById("galleryCaption");
const currentSpan = document.getElementById("galleryCurrent");
const totalSpan = document.getElementById("galleryTotal");
const thumbnailsContainer = document.getElementById("galleryThumbnails");

// Générer les miniatures
function generateThumbnails() {
  thumbnailsContainer.innerHTML = "";
  galleryData.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.alt = img.caption;
    thumb.classList.add("thumbnail");
    if (index === currentGalleryIndex) thumb.classList.add("active");
    thumb.addEventListener("click", () => openImage(index));
    thumbnailsContainer.appendChild(thumb);
  });
}

// Ouvrir la galerie
function openGallery(index) {
  currentGalleryIndex = index;
  mainImage.src = galleryData[currentGalleryIndex].src;
  captionEl.textContent = galleryData[currentGalleryIndex].caption;
  currentSpan.textContent = currentGalleryIndex + 1;
  totalSpan.textContent = galleryData.length;
  updateThumbnailsActive();
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Fermer la galerie
function closeGallery() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Ouvrir une image spécifique
function openImage(index) {
  currentGalleryIndex = index;
  mainImage.src = galleryData[currentGalleryIndex].src;
  captionEl.textContent = galleryData[currentGalleryIndex].caption;
  currentSpan.textContent = currentGalleryIndex + 1;
  updateThumbnailsActive();
}

// Image suivante
function nextImage() {
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
  mainImage.src = galleryData[currentGalleryIndex].src;
  captionEl.textContent = galleryData[currentGalleryIndex].caption;
  currentSpan.textContent = currentGalleryIndex + 1;
  updateThumbnailsActive();
}

// Image précédente
function prevImage() {
  currentGalleryIndex =
    (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
  mainImage.src = galleryData[currentGalleryIndex].src;
  captionEl.textContent = galleryData[currentGalleryIndex].caption;
  currentSpan.textContent = currentGalleryIndex + 1;
  updateThumbnailsActive();
}

// Mettre à jour la classe active des miniatures
function updateThumbnailsActive() {
  const thumbs = document.querySelectorAll(".thumbnail");
  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle("active", idx === currentGalleryIndex);
    if (idx === currentGalleryIndex) {
      thumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  });
}

// Écouteurs d'événements
document
  .getElementById("galleryCloseBtn")
  ?.addEventListener("click", closeGallery);
document.getElementById("galleryPrev")?.addEventListener("click", prevImage);
document.getElementById("galleryNext")?.addEventListener("click", nextImage);

// Ouvrir la galerie depuis un bouton
document.querySelectorAll(".view-gallery").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openGallery(0);
  });
});

// Navigation au clavier
document.addEventListener("keydown", function (e) {
  if (!modal.classList.contains("active")) return;
  if (e.key === "Escape") closeGallery();
  if (e.key === "ArrowLeft") prevImage();
  if (e.key === "ArrowRight") nextImage();
});

// Initialiser
generateThumbnails();

// ============ GALERIE PROJET SOUK JDID - VERSION CORRIGÉE ============
// ============ GALERIE PROJET SOUK JDID - 12 PHOTOS (1.jpg à 12.jpg) ============
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

  if (!modal) {
    console.error("Modal non trouvée");
    return;
  }

  img.src = soukJdidImages[soukJdidCurrentIndex].src;
  caption.textContent = soukJdidImages[soukJdidCurrentIndex].caption;
  counter.textContent =
    soukJdidCurrentIndex + 1 + " / " + soukJdidImages.length;

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
  if (soukJdidCurrentIndex < soukJdidImages.length - 1) {
    soukJdidCurrentIndex++;
  } else {
    soukJdidCurrentIndex = 0;
  }
  const img = document.getElementById("galleryImageSoukJdid");
  const caption = document.getElementById("galleryCaptionSoukJdid");
  const counter = document.getElementById("galleryCounterSoukJdid");

  img.src = soukJdidImages[soukJdidCurrentIndex].src;
  caption.textContent = soukJdidImages[soukJdidCurrentIndex].caption;
  counter.textContent =
    soukJdidCurrentIndex + 1 + " / " + soukJdidImages.length;
}

function prevSoukJdidImage() {
  if (soukJdidCurrentIndex > 0) {
    soukJdidCurrentIndex--;
  } else {
    soukJdidCurrentIndex = soukJdidImages.length - 1;
  }
  const img = document.getElementById("galleryImageSoukJdid");
  const caption = document.getElementById("galleryCaptionSoukJdid");
  const counter = document.getElementById("galleryCounterSoukJdid");

  img.src = soukJdidImages[soukJdidCurrentIndex].src;
  caption.textContent = soukJdidImages[soukJdidCurrentIndex].caption;
  counter.textContent =
    soukJdidCurrentIndex + 1 + " / " + soukJdidImages.length;
}

// Navigation au clavier
document.addEventListener("keydown", function (e) {
  const modal = document.getElementById("galleryModalSoukJdid");
  if (modal && modal.style.display === "flex") {
    if (e.key === "Escape") closeSoukJdidGallery();
    if (e.key === "ArrowRight") nextSoukJdidImage();
    if (e.key === "ArrowLeft") prevSoukJdidImage();
  }
});

// ============ GALERIE PROJET SOUK JDID - DÉCLARATION AU DÉBUT ============
// Déclarez la variable au tout début du fichier, avant toute fonction
let soukJdidCurrentIndex = 0;

// Tableau des 12 photos (1.jpg à 12.jpg)
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

// Fonctions de la galerie
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
    counter.textContent =
      soukJdidCurrentIndex + 1 + " / " + soukJdidImages.length;

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

// ============ FONCTION POUR AFFICHER LES DÉTAILS DU PROJET ============
function showProjectDetails(projectId) {
  if (projectId === "souk-jdid") {
    alert(
      "Projet: Embellissement de l'entrée de Souk Jdid\n" +
        "Localisation: Sidi Bouzid, Tunisie\n" +
        "Année: 2025\n" +
        "Statut: Terminé\n" +
        "Photos: 12 vues",
    );
  } else {
    alert("Plus de détails disponibles prochainement.");
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
    counter.textContent =
      soukJdidCurrentIndex + 1 + " / " + soukJdidImages.length;
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
    counter.textContent =
      soukJdidCurrentIndex + 1 + " / " + soukJdidImages.length;
}
