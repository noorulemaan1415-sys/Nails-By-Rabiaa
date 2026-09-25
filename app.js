/**
 * Nails By Rabiaa - Main Application Controller
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initReviewsWall();
  initWriteReviewModal();
  initGalleryLightbox();
  initFAQAccordion();
  initScrollAnimations();
});

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector(".site-header");
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileNav = document.getElementById("primary-navigation");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky header shadow on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  }, { passive: true });

  // Mobile menu toggle
  mobileToggle?.addEventListener("click", () => {
    const isOpen = mobileNav?.classList.toggle("open");
    mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileToggle.innerHTML = isOpen ? "✕" : "☰";
  });

  // Close nav on click
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileNav?.classList.remove("open");
      mobileToggle?.setAttribute("aria-expanded", "false");
      if (mobileToggle) mobileToggle.innerHTML = "☰";
    });
  });
}

/* ==========================================================================
   2. Google Reviews Wall System
   ========================================================================== */
let activeReviewFilter = "all";
let currentReviewSearch = "";
let visibleReviewsCount = 6;

function initReviewsWall() {
  const filterBtns = document.querySelectorAll("[data-review-filter]");
  const searchInput = document.getElementById("review-search-input");
  const loadMoreBtn = document.getElementById("load-more-reviews-btn");

  renderReviews();

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeReviewFilter = btn.getAttribute("data-review-filter");
      visibleReviewsCount = 6; // Reset count on filter change
      renderReviews();
    });
  });

  searchInput?.addEventListener("input", (e) => {
    currentReviewSearch = e.target.value.toLowerCase().trim();
    visibleReviewsCount = 12;
    renderReviews();
  });

  loadMoreBtn?.addEventListener("click", () => {
    visibleReviewsCount += 6;
    renderReviews();
  });
}

function renderReviews() {
  const container = document.getElementById("reviews-grid-container");
  const countBadge = document.getElementById("reviews-count-badge");
  const loadMoreBtn = document.getElementById("load-more-reviews-btn");
  
  if (!container || typeof GOOGLE_REVIEWS_DATA === "undefined") return;

  // Filter reviews
  let filtered = GOOGLE_REVIEWS_DATA.filter(item => {
    // Match filter
    let matchesCategory = true;
    if (activeReviewFilter === "5stars") {
      matchesCategory = item.rating === 5;
    } else if (activeReviewFilter === "bridal") {
      matchesCategory = item.serviceTag.includes("Bridal") || item.serviceTag.includes("3D");
    } else if (activeReviewFilter === "acrylic") {
      matchesCategory = item.serviceTag.includes("Acrylic");
    } else if (activeReviewFilter === "russian") {
      matchesCategory = item.serviceTag.includes("Russian") || item.serviceTag.includes("BIAB");
    } else if (activeReviewFilter === "pedicure") {
      matchesCategory = item.serviceTag.includes("Pedicure");
    }

    // Match search
    let matchesSearch = true;
    if (currentReviewSearch) {
      const haystack = `${item.author} ${item.text} ${item.serviceTag}`.toLowerCase();
      matchesSearch = haystack.includes(currentReviewSearch);
    }

    return matchesCategory && matchesSearch;
  });

  if (countBadge) {
    countBadge.textContent = `Showing ${Math.min(visibleReviewsCount, filtered.length)} of ${filtered.length} matching reviews (240+ Total on Google)`;
  }

  const toDisplay = filtered.slice(0, visibleReviewsCount);

  if (toDisplay.length === 0) {
    container.innerHTML = `
      <div class="empty-reviews-state">
        <p>No Google reviews match your current search.</p>
        <button class="btn btn-secondary btn-sm" onclick="resetReviewFilters()">Reset Filters</button>
      </div>
    `;
    if (loadMoreBtn) loadMoreBtn.style.display = "none";
    return;
  }

  container.innerHTML = toDisplay.map(rev => generateReviewCardHtml(rev)).join("");

  // Manage load more button visibility
  if (loadMoreBtn) {
    if (visibleReviewsCount >= filtered.length) {
      loadMoreBtn.style.display = "none";
    } else {
      loadMoreBtn.style.display = "inline-flex";
      loadMoreBtn.textContent = `Load More Reviews (${filtered.length - visibleReviewsCount} remaining)`;
    }
  }

  // Attach like handlers and photo click handlers
  attachReviewLikeListeners();
}

function generateReviewCardHtml(rev) {
  const starsHtml = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
  
  return `
    <article class="google-review-card" data-review-id="${rev.id}">
      <div class="review-card-header">
        <div class="reviewer-avatar" style="background-color: ${rev.avatarColor}">
          ${rev.initials}
        </div>
        <div class="reviewer-meta">
          <div class="reviewer-name-row">
            <h4 class="reviewer-name">${rev.author}</h4>
            <span class="google-verified-icon" title="Verified Google Review">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="#1a73e8"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </span>
          </div>
          <div class="reviewer-sub">
            ${rev.isLocalGuide ? `<span class="local-guide-badge">★ Local Guide • ${rev.reviewsCount} reviews</span>` : `<span class="verified-reviewer-tag">Google Customer • ${rev.reviewsCount} reviews</span>`}
          </div>
        </div>
        <div class="google-g-logo">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
          </svg>
        </div>
      </div>

      <div class="review-rating-row">
        <span class="stars-gold">${starsHtml}</span>
        <span class="review-time">${rev.relativeTime}</span>
        <span class="service-pill">${rev.serviceTag}</span>
      </div>

      <div class="review-body">
        <p>${rev.text}</p>
      </div>

      ${rev.attachedPhoto ? `
        <div class="review-attached-photo-wrap">
          <img src="${rev.attachedPhoto}" alt="Client nail photo by ${rev.author}" class="review-thumbnail-img" onclick="openLightboxFromReview('${rev.attachedPhoto}', '${rev.author}\\'s Nails', '${rev.serviceTag}')">
          <span class="photo-client-tag">📷 Photo uploaded by ${rev.author}</span>
        </div>
      ` : ''}

      ${rev.responseFromOwner ? `
        <div class="owner-response">
          <div class="owner-header">
            <strong>Response from Rabiaa (Owner)</strong>
          </div>
          <p>${rev.responseFromOwner}</p>
        </div>
      ` : ''}

      <div class="review-card-footer">
        <button class="btn-like-review" data-like-id="${rev.id}">
          <span class="like-heart">🤍</span> Helpful (<span class="like-count">${rev.likesCount}</span>)
        </button>
        <span class="posted-on-google">Posted on Google Maps</span>
      </div>
    </article>
  `;
}

function attachReviewLikeListeners() {
  document.querySelectorAll(".btn-like-review").forEach(btn => {
    btn.addEventListener("click", function () {
      const countSpan = this.querySelector(".like-count");
      const heart = this.querySelector(".like-heart");
      let current = parseInt(countSpan.textContent, 10);
      if (!this.classList.contains("liked")) {
        this.classList.add("liked");
        heart.textContent = "💖";
        countSpan.textContent = current + 1;
      } else {
        this.classList.remove("liked");
        heart.textContent = "🤍";
        countSpan.textContent = current - 1;
      }
    });
  });
}

function openLightboxFromReview(src, title, desc) {
  const lightboxModal = document.getElementById("gallery-lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDesc = document.getElementById("lightbox-description");

  if (lightboxImg) lightboxImg.src = src;
  if (lightboxTitle) lightboxTitle.textContent = title;
  if (lightboxDesc) lightboxDesc.textContent = desc;

  lightboxModal?.classList.add("active");
}

function resetReviewFilters() {
  activeReviewFilter = "all";
  currentReviewSearch = "";
  visibleReviewsCount = 6;
  const searchInput = document.getElementById("review-search-input");
  if (searchInput) searchInput.value = "";
  document.querySelectorAll("[data-review-filter]").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-review-filter") === "all");
  });
  renderReviews();
}

/* ==========================================================================
   3. Write a Google Review Modal
   ========================================================================== */
function initWriteReviewModal() {
  const openBtn = document.getElementById("open-write-review-btn");
  const modal = document.getElementById("write-review-modal");
  const closeBtn = document.getElementById("close-review-modal");
  const form = document.getElementById("new-review-form");
  const starInputs = document.querySelectorAll(".star-rating-selector span");

  let selectedStars = 5;

  openBtn?.addEventListener("click", () => {
    modal?.classList.add("active");
  });

  closeBtn?.addEventListener("click", () => {
    modal?.classList.remove("active");
  });

  starInputs.forEach(star => {
    star.addEventListener("click", () => {
      selectedStars = parseInt(star.getAttribute("data-star"), 10);
      starInputs.forEach(s => {
        const val = parseInt(s.getAttribute("data-star"), 10);
        s.classList.toggle("selected", val <= selectedStars);
      });
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("new-reviewer-name")?.value.trim();
    const service = document.getElementById("new-reviewer-service")?.value;
    const text = document.getElementById("new-reviewer-text")?.value.trim();

    if (!name || !text) {
      alert("Please fill in your name and review message.");
      return;
    }

    const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "NC";
    const colors = ["#d6336c", "#9351b6", "#e06287", "#2b8a3e", "#e67700", "#1098ad"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newRev = {
      id: "rev-new-" + Date.now(),
      author: name,
      avatarColor: randomColor,
      initials: initials,
      isLocalGuide: true,
      reviewsCount: 1,
      rating: selectedStars,
      relativeTime: "Just now",
      serviceTag: service || "Nail Art Studio",
      text: text,
      attachedPhoto: "assets/images/signature-bridal-3d-nails.png",
      likesCount: 1,
      responseFromOwner: "Thank you so much for sharing your feedback with Nails By Rabiaa! 💖"
    };

    GOOGLE_REVIEWS_DATA.unshift(newRev);
    modal?.classList.remove("active");
    form.reset();
    renderReviews();

    alert("✨ Thank you! Your review has been successfully posted to our customer reviews wall.");
  });
}

/* ==========================================================================
   4. Lookbook Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll(".gallery-card");
  const filterBtns = document.querySelectorAll("[data-gallery-filter]");
  const lightboxModal = document.getElementById("gallery-lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-image");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDesc = document.getElementById("lightbox-description");
  const closeLightbox = document.getElementById("close-lightbox-btn");
  const bookLookBtn = document.getElementById("lightbox-book-look-btn");

  let currentLookTitle = "";

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-gallery-filter");

      galleryItems.forEach(item => {
        const category = item.getAttribute("data-category");
        if (filter === "all" || category === filter) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  galleryItems.forEach(item => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      const title = item.querySelector(".look-title")?.textContent || "Custom Nail Art Design";
      const desc = item.querySelector(".look-desc")?.textContent || "Handcrafted luxury nail set by Rabiaa.";

      currentLookTitle = title;
      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightboxModal?.classList.add("active");
    });
  });

  closeLightbox?.addEventListener("click", () => {
    lightboxModal?.classList.remove("active");
  });

  lightboxModal?.addEventListener("click", (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove("active");
    }
  });

  bookLookBtn?.addEventListener("click", () => {
    lightboxModal?.classList.remove("active");
    const bookingSection = document.getElementById("booking");
    bookingSection?.scrollIntoView({ behavior: "smooth" });

    const notes = document.getElementById("booking-notes");
    if (notes) {
      notes.value = `I'd love to get the "${currentLookTitle}" design from your Lookbook!`;
    }
  });
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    question?.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach(i => i.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}

/* ==========================================================================
   6. Scroll Reveal Observer
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    animatedElements.forEach(el => el.classList.add("is-visible"));
  }
}
