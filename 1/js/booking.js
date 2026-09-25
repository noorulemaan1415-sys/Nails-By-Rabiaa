/**
 * Nails By Rabiaa - Appointment Booking & WhatsApp Message Generator
 * Direct WhatsApp: +92 333 0213647
 */

const STUDIO_PHONE = "923330213647"; // +92 333 0213647

function initBookingSystem() {
  const bookingForm = document.getElementById("appointment-form");
  const dateInput = document.getElementById("booking-date");
  const confirmationModal = document.getElementById("booking-modal");
  const modalCloseBtn = document.getElementById("close-booking-modal");

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("booking-name")?.value.trim() || "";
      const phone = document.getElementById("booking-phone")?.value.trim() || "";
      const serviceSelect = document.getElementById("booking-service");
      const serviceName = serviceSelect?.options[serviceSelect.selectedIndex]?.text || "Custom Nail Set";
      const date = document.getElementById("booking-date")?.value || "Flexible";
      const time = document.getElementById("booking-time")?.value || "Flexible Slot";
      const notes = document.getElementById("booking-notes")?.value.trim() || "No extra notes";

      if (!name || !phone) {
        alert("Please enter your name and phone number to reserve your appointment slot.");
        return;
      }

      // Format WhatsApp message
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
      });

      const message = 
`🌸 *APPOINTMENT INQUIRY - NAILS BY RABIAA* 🌸
━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${name}
📱 *Phone Number:* ${phone}
💅 *Treatment/Service:* ${serviceName}
📅 *Preferred Date:* ${formattedDate}
⏰ *Preferred Time:* ${time}
📝 *Design & Notes:* 
${notes}
━━━━━━━━━━━━━━━━━━━━
📍 *Studio:* Dalmia Cement Factory Road, Callachi CHS, Karachi
✨ _Sent via Nails By Rabiaa Official Web Studio_`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${STUDIO_PHONE}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Show in-page confirmation
      if (confirmationModal) {
        document.getElementById("modal-client-name").textContent = name;
        document.getElementById("modal-service-name").textContent = serviceName;
        document.getElementById("modal-date-time").textContent = `${formattedDate} at ${time}`;
        confirmationModal.classList.add("active");
      }
    });
  }

  if (modalCloseBtn && confirmationModal) {
    modalCloseBtn.addEventListener("click", () => {
      confirmationModal.classList.remove("active");
    });
  }
}

window.addEventListener("DOMContentLoaded", initBookingSystem);
