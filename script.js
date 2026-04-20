// ============ API CONFIGURATION ============
const API_URL = "http://localhost:3000/api";

// ============ WAIT FOR PAGE TO LOAD ============
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Frontend loaded");

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
  // Show login form when clicking user icon
  if (loginBtn) {
    loginBtn.addEventListener("click", function () {
      console.log("🔘 Login button clicked");
      if (loginForm) loginForm.classList.add("active");
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
    });
  }

  // Show registration form
  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔘 Show register form clicked");
      if (loginForm) loginForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
      if (registerForm) registerForm.classList.add("active");
    });
  }

  // Show login form from registration
  if (showLoginLink) {
    showLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔘 Show login form clicked");
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.remove("active");
      if (loginForm) loginForm.classList.add("active");
    });
  }

  // Show forgot password form
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔘 Forgot password link clicked");
      if (loginForm) loginForm.classList.remove("active");
      if (registerForm) registerForm.classList.remove("active");
      if (forgotForm) forgotForm.classList.add("active");
    });
  }

  // Back to login from forgot password
  if (backToLoginLink) {
    backToLoginLink.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("🔘 Back to login clicked");
      if (forgotForm) forgotForm.classList.remove("active");
      if (loginForm) loginForm.classList.add("active");
    });
  }

  // ============ LOGIN HANDLER ============
  if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("🔐 Login form submitted");

      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value.trim();

      if (!email || !password) {
        alert("❌ Veuillez entrer votre email et mot de passe");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("Login response:", data);

        if (data.success) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(`✅ ${data.message}`);
          loginForm.classList.remove("active");
          loginForm.reset();

          const icon = document.querySelector("#login-btn");
          if (icon) icon.innerHTML = '<i class="fas fa-user-check"></i>';
        } else {
          alert(`❌ ${data.message}`);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("❌ Erreur de connexion au serveur");
      }
    });
  }

  // ============ REGISTRATION HANDLER ============
  if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("📝 Registration form submitted");

      const firstName = document.getElementById("reg-firstname")?.value.trim();
      const lastName = document.getElementById("reg-lastname")?.value.trim();
      const username = document.getElementById("reg-username")?.value.trim();
      const email = document.getElementById("reg-email")?.value.trim();
      const password = document.getElementById("reg-password")?.value;
      const confirmPassword = document.getElementById(
        "reg-confirm-password",
      )?.value;

      if (!firstName || !lastName || !username || !email || !password) {
        alert("❌ Veuillez remplir tous les champs");
        return;
      }

      if (password !== confirmPassword) {
        alert("❌ Les mots de passe ne correspondent pas");
        return;
      }

      if (password.length < 6) {
        alert("❌ Le mot de passe doit contenir au moins 6 caractères");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        console.log("Registration response:", data);

        if (data.success) {
          alert(`✅ ${data.message}\nBienvenue ${firstName} ${lastName} !`);
          registerForm.reset();
          registerForm.classList.remove("active");
          if (loginForm) loginForm.classList.add("active");

          const loginEmail = document.getElementById("login-email");
          if (loginEmail) loginEmail.value = email;
        } else {
          alert(`❌ ${data.message}`);
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("❌ Erreur de connexion au serveur");
      }
    });
  }

  // ============ FORGOT PASSWORD HANDLER ============
  if (forgotForm) {
    forgotForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("🔑 Forgot password form submitted");

      const email = document.getElementById("forgot-email")?.value.trim();

      if (!email) {
        alert("❌ Veuillez entrer votre email");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/forgot-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        console.log("Forgot password response:", data);

        if (data.success) {
          alert(`✅ ${data.message}`);
          forgotForm.reset();
          forgotForm.classList.remove("active");
          if (loginForm) loginForm.classList.add("active");
        } else {
          alert(`❌ ${data.message}`);
        }
      } catch (error) {
        console.error("Forgot password error:", error);
        alert("❌ Erreur de connexion au serveur");
      }
    });
  }

  // ============ CONTACT FORM HANDLER ============
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("📧 Contact form submitted");

      const formData = {
        name: document.getElementById("contact-name")?.value || "",
        email: document.getElementById("contact-email")?.value || "",
        phone: document.getElementById("contact-phone")?.value || "",
        message: document.getElementById("contact-message")?.value || "",
      };

      if (!formData.name || !formData.email || !formData.message) {
        if (formStatus) {
          formStatus.style.display = "block";
          formStatus.innerHTML =
            '<p style="color: red;">❌ Veuillez remplir tous les champs</p>';
          setTimeout(() => {
            formStatus.style.display = "none";
          }, 3000);
        }
        return;
      }

      if (formStatus) {
        formStatus.style.display = "block";
        formStatus.innerHTML =
          '<p style="color: blue;">📤 Envoi en cours...</p>';
      }

      try {
        const response = await fetch(`${API_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log("Contact response:", result);

        if (result.success) {
          formStatus.innerHTML =
            '<p style="color: green;">✅ Message envoyé avec succès !</p>';
          contactForm.reset();
          setTimeout(() => {
            formStatus.style.display = "none";
          }, 5000);
        } else {
          formStatus.innerHTML =
            '<p style="color: red;">❌ Erreur lors de l\'envoi</p>';
        }
      } catch (error) {
        console.error("Contact error:", error);
        formStatus.innerHTML =
          '<p style="color: red;">❌ Erreur de connexion au serveur</p>';
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
  alert("✅ Déconnexion réussie !");
  location.reload();
}

// ============ CHECK LOGIN STATUS ON PAGE LOAD ============
document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (token && user) {
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

// ============ SEARCH FORM ============
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

    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const term = document.querySelector("#search-box")?.value;
      if (term) {
        alert("Recherche: " + term);
        searchForm.classList.remove("active");
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

// ============ REVIEWS SLIDER - WORKING ON ALL DEVICES ============
document.addEventListener("DOMContentLoaded", function () {
  const slider = document.querySelector(".reviews-slider");
  const slides = document.querySelectorAll(".reviews .slide");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");
  const dotsContainer = document.querySelector(".slider-dots");

  if (!slider || slides.length === 0) {
    console.log("Reviews slider not found");
    return;
  }

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

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshSlider();
    }, 150);
  });

  // Initialize
  createDots();
  updateSlider();

  // Re-initialize after all images load
  window.addEventListener("load", function () {
    refreshSlider();
  });
});

// ============ BLOG SLIDER - WORKING ON ALL DEVICES ============
document.addEventListener("DOMContentLoaded", function () {
  initBlogSlider();
});

function initBlogSlider() {
  const slider = document.querySelector(".blogs-slider");
  const slides = document.querySelectorAll(".blogs .slide");
  const prevBtn = document.querySelector(".blog-slider-prev");
  const nextBtn = document.querySelector(".blog-slider-next");
  const dotsContainer = document.querySelector(".blog-slider-dots");

  if (!slider || slides.length === 0) {
    console.log("Blog slider not found");
    return;
  }

  console.log("Initializing blog slider, slides:", slides.length);

  let currentIndex = 0;
  let slidesToShow = getSlidesToShow();
  let totalSlides = slides.length;
  let maxIndex = Math.max(0, totalSlides - slidesToShow);

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
      dot.classList.add("blog-dot");
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
    const dots = document.querySelectorAll(".blog-dot");
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
      maxIndex = Math.max(0, totalSlides - slidesToShow);
      currentIndex = Math.min(currentIndex, maxIndex);
      createDots();
    }
    updateSlider();
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);

  // Handle window resize
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshSlider();
    }, 150);
  });

  // Initialize
  createDots();
  updateSlider();

  // Re-initialize after all images load
  window.addEventListener("load", function () {
    refreshSlider();
  });
}
