// استدعاء ملفات الـ CSS (Vite Way)
import "../css/variables.css";
import "../css/reset.css";
import "../css/main.css";

import { initCursor } from "./cursor.js";
import { initAnimations } from "./animations.js";

document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initAnimations();
});

// ── PROJECT FILTER (Global function for inline onclick) ──
window.doFilter = function (cat, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  document.querySelectorAll(".proj-card").forEach((c) => {
    const match = cat === "all" || (c.dataset.cat || "").includes(cat);
    c.style.display = match ? "flex" : "none";
  });

  const featured = document.querySelector(".proj-card.featured");
  if (featured && featured.style.display !== "none") {
    featured.style.gridColumn = window.innerWidth > 1024 ? "span 2" : "span 1";
  }
};

// ── FORM SUBMIT (Global function for inline onclick) ──
window.submitForm = function (btn) {
  btn.textContent = "✓ Sent!";
  btn.style.background = "var(--green)";
  setTimeout(() => {
    btn.textContent = "Send Message →";
    btn.style.background = "";
  }, 3000);
};
