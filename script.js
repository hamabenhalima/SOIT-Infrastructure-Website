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

// ============ WAIT FOR PAGE TO LOAD ============
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Frontend loaded, API URL:", API_URL);

  // ============ GET ALL FORM ELEMENTS ============
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
        console.error("Login error:", error);
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
        console.error("Registration error:", error);
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
        console.error("Forgot password error:", error);
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ CONTACT FORM HANDLER ============
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

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
        showMessage(
          "Veuillez remplir tous les champs obligatoires (nom, email, message)",
          "warning",
        );
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
        console.error("Contact error:", error);
        showMessage("Erreur de connexion au serveur", "error");
      }
    });
  }

  // ============ CLOSE FORMS WHEN CLICKING OUTSIDE ============
  document.addEventListener("click", function (event) {
    const forms = [loginForm, registerForm, forgotForm];
    const loginIcon = document.querySelector("#login-btn");
    const isFormActive = forms.some(
      (form) => form && form.classList.contains("active"),
    );

    if (loginIcon && !loginIcon.contains(event.target) && isFormActive) {
      let clickedInsideForm = false;
      forms.forEach((form) => {
        if (form && form.contains(event.target)) {
          clickedInsideForm = true;
        }
      });

      if (!clickedInsideForm) {
        forms.forEach((form) => {
          if (form) form.classList.remove("active");
        });
      }
    }
  });

  // ============ ESCAPE KEY CLOSES FORMS ============
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  const loginIcon = document.querySelector("#login-btn");
  if (loginIcon) {
    loginIcon.innerHTML = '<i class="fas fa-user"></i>';
  }
  showMessage("Déconnexion réussie !", "success");
  setTimeout(() => {
    location.reload();
  }, 1000);
}

// ============ CHECK LOGIN STATUS ON PAGE LOAD ============
document.addEventListener("DOMContentLoaded", function () {
  const user = localStorage.getItem("user");

  if (user) {
    try {
      const userData = JSON.parse(user);
      const loginIcon = document.querySelector("#login-btn");
      if (loginIcon) {
        if (userData.role === "admin") {
          loginIcon.innerHTML = '<i class="fas fa-user-shield"></i>';
        } else {
          loginIcon.innerHTML = '<i class="fas fa-user-check"></i>';
        }
      }
      console.log("✅ User already logged in:", userData.username);
    } catch (e) {
      console.error("Error parsing user data:", e);
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

// ============ MENU BUTTON (Mobile) ============
document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector("#menu-btn");
  const navbar = document.querySelector(".header .navbar");
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      navbar.classList.toggle("active");
    });
  }
});

// ============ INFO SIDEBAR ============
document.addEventListener("DOMContentLoaded", function () {
  const infoBtn = document.querySelector("#info-btn");
  const contactInfo = document.querySelector(".contact-info");
  const closeInfo = document.querySelector("#close-info");
  if (infoBtn && contactInfo) {
    infoBtn.addEventListener("click", function () {
      contactInfo.classList.add("active");
    });
    if (closeInfo) {
      closeInfo.addEventListener("click", function () {
        contactInfo.classList.remove("active");
      });
    }
  }
});

// ============ CLOSE FORMS WHEN CLICKING OUTSIDE ============
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.querySelector(".search-form");
  const searchBtn = document.querySelector("#search-btn");
  const contactInfo = document.querySelector(".contact-info");
  const infoBtn = document.querySelector("#info-btn");
  const navbar = document.querySelector(".header .navbar");
  const menuBtn = document.querySelector("#menu-btn");

  document.addEventListener("click", function (event) {
    if (
      searchForm &&
      searchBtn &&
      !searchForm.contains(event.target) &&
      !searchBtn.contains(event.target)
    ) {
      searchForm.classList.remove("active");
    }
    if (
      contactInfo &&
      infoBtn &&
      contactInfo.classList.contains("active") &&
      !contactInfo.contains(event.target) &&
      !infoBtn.contains(event.target)
    ) {
      contactInfo.classList.remove("active");
    }
    if (
      navbar &&
      menuBtn &&
      !navbar.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      navbar.classList.remove("active");
    }
  });
});

// ============ SIMPLE SEARCH FUNCTIONALITY ============
document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-box");
  let currentHighlights = [];
  let currentHighlightIndex = -1;
  let searchResultsBar = null;

  // Create search results bar
  function createSearchBar() {
    if (document.querySelector(".search-results-bar")) return;

    const bar = document.createElement("div");
    bar.className = "search-results-bar";
    bar.innerHTML = `
            <span id="search-result-count">0 résultat</span>
            <button id="prev-result" disabled>◀ Précédent</button>
            <button id="next-result" disabled>Suivant ▶</button>
            <button id="clear-search" class="close-search">✕</button>
        `;
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

  // Clear all highlights
  function clearHighlights() {
    currentHighlights.forEach((el) => {
      if (el && el.parentNode) {
        const parent = el.parentNode;
        const text = document.createTextNode(el.textContent);
        parent.replaceChild(text, el);
        parent.normalize();
      }
    });
    currentHighlights = [];
    currentHighlightIndex = -1;

    if (searchResultsBar) {
      searchResultsBar.classList.remove("show");
    }
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
            node.parentElement.tagName === "BUTTON" ||
            node.parentElement.classList?.contains("search-results-bar") ||
            node.parentElement.classList?.contains("search-form")
          ) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      },
    );

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => {
      const text = node.textContent;
      const lowerText = text.toLowerCase();
      let index = lowerText.indexOf(term);

      if (index !== -1) {
        const span = document.createElement("span");
        let lastIndex = 0;
        let html = "";

        while (index !== -1) {
          html += escapeHtml(text.substring(lastIndex, index));
          const matchText = text.substr(index, term.length);
          html += `<mark class="highlight">${escapeHtml(matchText)}</mark>`;
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
      const count = currentHighlights.length;
      const resultText =
        count === 1 ? "1 résultat trouvé" : `${count} résultats trouvés`;
      const countSpan = document.getElementById("search-result-count");
      if (countSpan) countSpan.textContent = resultText;

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
      document.querySelectorAll(".highlight-current").forEach((el) => {
        el.classList.remove("highlight-current");
      });

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
    const prevBtn = document.getElementById("prev-result");
    const nextBtn = document.getElementById("next-result");

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

  // Handle search form submission
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
    if (e.key === "Escape") {
      clearSearch();
    }
  });
});

// Search button toggle
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.querySelector("#search-btn");
  const searchForm = document.querySelector(".search-form");

  if (searchBtn && searchForm) {
    searchBtn.addEventListener("click", function () {
      searchForm.classList.toggle("active");
      if (searchForm.classList.contains("active")) {
        document.querySelector("#search-box")?.focus();
      } else {
        const clearBtn = document.getElementById("clear-search");
        if (clearBtn) clearBtn.click();
      }
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
  modal.innerHTML = `
        <div class="gallery-modal-content">
            <div class="gallery-modal-close"><i class="fas fa-times"></i></div>
            <img src="" alt="Gallery Image">
            <div class="gallery-counter">
                <span class="current">1</span> / <span class="total">${galleryImages.length}</span>
            </div>
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
  let slidesToShow = getSlidesToShow();
  let totalSlides = slides.length;
  let maxIndex = totalSlides - slidesToShow;

  function getSlidesToShow() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 992) return 2;
    return 3;
  }

  function getGap() {
    const sliderStyle = window.getComputedStyle(slider);
    return parseFloat(sliderStyle.gap) || 20;
  }

  function updateSlider() {
    const gap = getGap();
    const slideWidth = slides[0].offsetWidth;
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
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });
  }

  function updateButtons() {
    if (prevBtn) {
      if (currentIndex === 0) {
        prevBtn.setAttribute("disabled", "disabled");
      } else {
        prevBtn.removeAttribute("disabled");
      }
    }
    if (nextBtn) {
      if (currentIndex >= maxIndex) {
        nextBtn.setAttribute("disabled", "disabled");
      } else {
        nextBtn.removeAttribute("disabled");
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

  window.addEventListener("load", function () {
    refreshSlider();
  });
});

// ============ BLOG SLIDER ============
document.addEventListener("DOMContentLoaded", function () {
  const blogSlider = document.querySelector(".blogs-slider");
  const blogSlides = document.querySelectorAll(".blogs .slide");
  const blogPrevBtn = document.querySelector(".blog-slider-prev");
  const blogNextBtn = document.querySelector(".blog-slider-next");
  const blogDotsContainer = document.querySelector(".blog-slider-dots");

  if (!blogSlider || blogSlides.length === 0) return;

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

  function updateBlogSlider() {
    const gap = getGap();
    const slideWidth = blogSlides[0].offsetWidth;
    const translateX = -currentIndex * (slideWidth + gap);
    blogSlider.style.transform = `translateX(${translateX}px)`;
    updateBlogDots();
    updateBlogButtons();
  }

  function createBlogDots() {
    if (!blogDotsContainer) return;
    const numberOfDots = Math.ceil(totalSlides / slidesToShow);
    blogDotsContainer.innerHTML = "";
    for (let i = 0; i < numberOfDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("blog-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => {
        currentIndex = i * slidesToShow;
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        updateBlogSlider();
      });
      blogDotsContainer.appendChild(dot);
    }
  }

  function updateBlogDots() {
    if (!blogDotsContainer) return;
    const dotIndex = Math.floor(currentIndex / slidesToShow);
    const dots = document.querySelectorAll(".blog-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === dotIndex);
    });
  }

  function updateBlogButtons() {
    if (blogPrevBtn) {
      if (currentIndex === 0) {
        blogPrevBtn.setAttribute("disabled", "disabled");
      } else {
        blogPrevBtn.removeAttribute("disabled");
      }
    }
    if (blogNextBtn) {
      if (currentIndex >= maxIndex) {
        blogNextBtn.setAttribute("disabled", "disabled");
      } else {
        blogNextBtn.removeAttribute("disabled");
      }
    }
  }

  function nextBlogSlide() {
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateBlogSlider();
    }
  }

  function prevBlogSlide() {
    if (currentIndex > 0) {
      currentIndex--;
      updateBlogSlider();
    }
  }

  function refreshBlogSlider() {
    const newSlidesToShow = getSlidesToShow();
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      maxIndex = totalSlides - slidesToShow;
      currentIndex = Math.min(currentIndex, maxIndex);
      createBlogDots();
    }
    updateBlogSlider();
  }

  if (blogPrevBtn) blogPrevBtn.addEventListener("click", prevBlogSlide);
  if (blogNextBtn) blogNextBtn.addEventListener("click", nextBlogSlide);

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshBlogSlider();
    }, 150);
  });

  createBlogDots();
  updateBlogSlider();

  window.addEventListener("load", function () {
    refreshBlogSlider();
  });
});
