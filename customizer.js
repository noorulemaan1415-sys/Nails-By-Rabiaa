/**
 * Nails By Rabiaa - Interactive Virtual Nail Studio & Price Calculator
 */

const PRICING_CONFIG = {
  services: {
    "acrylic-full": { name: "Full Set Acrylic Extensions", basePrice: 4500, duration: "90-120 mins" },
    "acrylic-refill": { name: "Acrylic Refill & Balancing", basePrice: 3000, duration: "60-75 mins" },
    "biab-overlay": { name: "BIAB / Builder Gel Natural Overlay", basePrice: 3500, duration: "60-90 mins" },
    "russian-gel": { name: "Russian Gel Manicure", basePrice: 2800, duration: "45-60 mins" },
    "bridal-couture": { name: "Signature Bridal Couture Set (3D Art)", basePrice: 6500, duration: "120-150 mins" },
    "spa-pedicure": { name: "Deluxe Foot Spa & Gel Pedicure", basePrice: 3200, duration: "60 mins" }
  },
  lengths: {
    "short": { name: "Short / Natural", extra: 0 },
    "medium": { name: "Medium Luxe", extra: 500 },
    "long": { name: "Long Glam", extra: 1000 },
    "xl": { name: "Extra Long Drama", extra: 1500 }
  },
  shapes: {
    "almond": { name: "Almond", icon: "⬭" },
    "coffin": { name: "Coffin / Ballerina", icon: "⏢" },
    "square": { name: "Square", icon: "▢" },
    "stiletto": { name: "Stiletto", icon: "▲" },
    "oval": { name: "Oval", icon: "◯" }
  },
  finishes: {
    "3d-bows": { name: "3D Acrylic Bows & Micro-Pearls (Signature)", extra: 1500, color: "#fbe4ea", effect: "bows" },
    "glazed-chrome": { name: "Hailey Bieber Glazed Chrome", extra: 1000, color: "#f8f0fc", effect: "chrome" },
    "french-ombre": { name: "Soft French Ombré / Baby Boomer", extra: 800, color: "#ffe8ec", effect: "ombre" },
    "velvet-cateye": { name: "9D Velvet Magnetic Cat-Eye", extra: 1200, color: "#d0bfff", effect: "cateye" },
    "gold-minimal": { name: "Minimalist Gold Foil & French", extra: 800, color: "#fff3bf", effect: "gold" },
    "solid-luxe": { name: "High-Gloss Solid Rose/Nude Gel", extra: 0, color: "#fcc2d7", effect: "solid" }
  },
  addons: {
    "swarovski": { name: "Swarovski Crystals (4 accent nails)", price: 800 },
    "charms": { name: "3D Acrylic Heart & Bow Charms", price: 1200 },
    "cuticle-spa": { name: "Deep Cuticle Keratin Hydration", price: 500 },
    "removal": { name: "Previous Gel / Acrylic Safe Removal", price: 800 }
  }
};

let currentCustomization = {
  service: "bridal-couture",
  shape: "almond",
  length: "medium",
  finish: "3d-bows",
  selectedAddons: ["charms"]
};

function calculateTotalPrice() {
  const service = PRICING_CONFIG.services[currentCustomization.service];
  const length = PRICING_CONFIG.lengths[currentCustomization.length];
  const finish = PRICING_CONFIG.finishes[currentCustomization.finish];
  
  let total = service.basePrice + length.extra + finish.extra;
  
  currentCustomization.selectedAddons.forEach(addonKey => {
    if (PRICING_CONFIG.addons[addonKey]) {
      total += PRICING_CONFIG.addons[addonKey].price;
    }
  });

  return {
    total,
    duration: service.duration,
    serviceName: service.name,
    shapeName: PRICING_CONFIG.shapes[currentCustomization.shape].name,
    lengthName: length.name,
    finishName: finish.name
  };
}

function updateCustomizerUI() {
  const calc = calculateTotalPrice();

  // Update live preview elements
  const nailPreview = document.getElementById("nail-visual-target");
  const shapeLabel = document.getElementById("preview-shape-label");
  const lengthLabel = document.getElementById("preview-length-label");
  const finishLabel = document.getElementById("preview-finish-label");
  const priceDisplay = document.getElementById("customizer-total-price");
  const durationDisplay = document.getElementById("customizer-duration");
  const breakdownList = document.getElementById("customizer-breakdown-list");

  if (nailPreview) {
    // Update classes for visual simulator
    nailPreview.className = `nail-canvas shape-${currentCustomization.shape} length-${currentCustomization.length} finish-${currentCustomization.finish}`;
    
    // Set custom visual decorations
    const finishData = PRICING_CONFIG.finishes[currentCustomization.finish];
    nailPreview.style.setProperty("--nail-bg", finishData.color);

    // Decor inner elements
    const charmElem = nailPreview.querySelector(".nail-charm-overlay");
    if (charmElem) {
      if (currentCustomization.finish === "3d-bows" || currentCustomization.selectedAddons.includes("charms")) {
        charmElem.innerHTML = `
          <div class="charm-bow">🎀</div>
          <div class="charm-pearls">✨ 🦪 ✨</div>
        `;
        charmElem.style.display = "flex";
      } else if (currentCustomization.finish === "glazed-chrome") {
        charmElem.innerHTML = `<div class="chrome-sheen"></div>`;
        charmElem.style.display = "block";
      } else if (currentCustomization.finish === "french-ombre") {
        charmElem.innerHTML = `<div class="french-tip-layer"></div>`;
        charmElem.style.display = "block";
      } else {
        charmElem.innerHTML = ``;
        charmElem.style.display = "none";
      }
    }
  }

  if (shapeLabel) shapeLabel.textContent = calc.shapeName;
  if (lengthLabel) lengthLabel.textContent = calc.lengthName;
  if (finishLabel) finishLabel.textContent = calc.finishName;
  if (priceDisplay) priceDisplay.textContent = `PKR ${calc.total.toLocaleString()}`;
  if (durationDisplay) durationDisplay.textContent = `Approx. ${calc.duration}`;

  if (breakdownList) {
    let items = `
      <div class="summary-line"><span>${calc.serviceName}</span><span>PKR ${PRICING_CONFIG.services[currentCustomization.service].basePrice.toLocaleString()}</span></div>
    `;
    if (PRICING_CONFIG.lengths[currentCustomization.length].extra > 0) {
      items += `<div class="summary-line"><span>Length: ${calc.lengthName}</span><span>+PKR ${PRICING_CONFIG.lengths[currentCustomization.length].extra}</span></div>`;
    }
    if (PRICING_CONFIG.finishes[currentCustomization.finish].extra > 0) {
      items += `<div class="summary-line"><span>Art: ${calc.finishName}</span><span>+PKR ${PRICING_CONFIG.finishes[currentCustomization.finish].extra}</span></div>`;
    }
    currentCustomization.selectedAddons.forEach(addonKey => {
      const addon = PRICING_CONFIG.addons[addonKey];
      if (addon) {
        items += `<div class="summary-line"><span>Add-on: ${addon.name}</span><span>+PKR ${addon.price}</span></div>`;
      }
    });
    breakdownList.innerHTML = items;
  }
}

function initCustomizer() {
  // Service selection buttons
  const serviceButtons = document.querySelectorAll("[data-service-btn]");
  serviceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      serviceButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCustomization.service = btn.getAttribute("data-service-btn");
      updateCustomizerUI();
    });
  });

  // Shape selection
  const shapeButtons = document.querySelectorAll("[data-shape-btn]");
  shapeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      shapeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCustomization.shape = btn.getAttribute("data-shape-btn");
      updateCustomizerUI();
    });
  });

  // Length selection
  const lengthButtons = document.querySelectorAll("[data-length-btn]");
  lengthButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      lengthButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCustomization.length = btn.getAttribute("data-length-btn");
      updateCustomizerUI();
    });
  });

  // Finish / Art selection
  const finishButtons = document.querySelectorAll("[data-finish-btn]");
  finishButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      finishButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCustomization.finish = btn.getAttribute("data-finish-btn");
      updateCustomizerUI();
    });
  });

  // Addon checkboxes
  const addonCheckboxes = document.querySelectorAll("[data-addon-chk]");
  addonCheckboxes.forEach(chk => {
    chk.addEventListener("change", () => {
      const addonKey = chk.getAttribute("data-addon-chk");
      if (chk.checked) {
        if (!currentCustomization.selectedAddons.includes(addonKey)) {
          currentCustomization.selectedAddons.push(addonKey);
        }
      } else {
        currentCustomization.selectedAddons = currentCustomization.selectedAddons.filter(k => k !== addonKey);
      }
      updateCustomizerUI();
    });
  });

  // "Book this customized set" CTA
  const bookCustomBtn = document.getElementById("book-customized-set-btn");
  if (bookCustomBtn) {
    bookCustomBtn.addEventListener("click", () => {
      const calc = calculateTotalPrice();
      const bookingSection = document.getElementById("booking");
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
      }

      // Populate booking form fields
      const serviceSelect = document.getElementById("booking-service");
      const notesField = document.getElementById("booking-notes");
      if (serviceSelect) {
        serviceSelect.value = currentCustomization.service;
      }
      if (notesField) {
        const addonNames = currentCustomization.selectedAddons.map(k => PRICING_CONFIG.addons[k]?.name).filter(Boolean).join(", ");
        notesField.value = `Custom Studio Selection:\n• Shape: ${calc.shapeName}\n• Length: ${calc.lengthName}\n• Art Style: ${calc.finishName}\n• Add-ons: ${addonNames || 'None'}\n• Estimated Total: PKR ${calc.total.toLocaleString()}`;
      }
    });
  }

  updateCustomizerUI();
}

window.addEventListener("DOMContentLoaded", initCustomizer);
