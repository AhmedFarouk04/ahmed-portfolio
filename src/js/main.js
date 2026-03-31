import "../css/variables.css";
import "../css/reset.css";
import "../css/main.css";
import "../css/theme-toggle.css";
import "../css/theme-light.css";
import "../css/stats.css"; // ← NEW

import { initCursor } from "./cursor.js";
import { initAnimations } from "./animations.js";
import { initThemeToggle } from "./theme-toggle.js";
import { initStats } from "./stats.js"; // ← NEW

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initStats(); // ← NEW (after theme but before other animations)
  initCursor();
  initAnimations();
  initFilters();
  initForm();
  initScrollSpy();
});

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], div[id='about']");
  const navLinks = document.querySelectorAll(".nav-links a");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${activeId}`,
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

// ── PROJECT FILTER ──
function initFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projCards = document.querySelectorAll(".proj-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const cat = btn.getAttribute("data-filter");

      projCards.forEach((c) => {
        const match = cat === "all" || (c.dataset.cat || "").includes(cat);
        c.style.display = match ? "flex" : "none";
      });

      const featured = document.querySelector(".proj-card.featured");
      if (featured && featured.style.display !== "none") {
        featured.style.gridColumn =
          window.innerWidth > 1024 ? "span 2" : "span 1";
      }
    });
  });
}

function initForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) return;

  const validateField = (input, condition, errorMsg) => {
    const errorSpan = input.parentElement.querySelector(".error-text");
    if (condition) {
      input.classList.remove("is-invalid");
      errorSpan.textContent = "";
      return true;
    } else {
      input.classList.add("is-invalid");
      errorSpan.textContent = errorMsg;
      return false;
    }
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("userName");
    const email = document.getElementById("userEmail");
    const subject = document.getElementById("userSubject");
    const message = document.getElementById("userMessage");

    const isNameValid = validateField(
      name,
      /^[a-zA-Z\s]{3,50}$/.test(name.value.trim()),
      "Please enter a valid name (min 3 letters)",
    );
    const isEmailValid = validateField(
      email,
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()),
      "Please enter a real email address",
    );
    const isSubjectValid = validateField(
      subject,
      subject.value.trim().length >= 4,
      "Subject is too short",
    );
    const isMsgValid = validateField(
      message,
      message.value.trim().length >= 10,
      "Message must be at least 10 characters",
    );

    if (isNameValid && isEmailValid && isSubjectValid && isMsgValid) {
      submitBtn.textContent = "Processing...";
      submitBtn.disabled = true;

      const formData = new FormData(form);
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })
        .then(async (res) => {
          if (res.status === 200) {
            submitBtn.textContent = "✓ Success!";
            submitBtn.style.background = "#22c55e";
            form.reset();
          }
        })
        .finally(() => {
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send Message →";
            submitBtn.style.background = "";
          }, 4000);
        });
    }
  });
}
