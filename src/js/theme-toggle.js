export function initThemeToggle() {
  const html = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  // Set initial theme
  setTheme(initialTheme);

  // Theme toggle button handler
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = html.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    });
  }

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    });

  function setTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateButtonIcon(theme);
  }

  function updateButtonIcon(theme) {
    if (!themeBtn) return;
    const icon = themeBtn.querySelector(".theme-icon");
    const label = themeBtn.querySelector(".theme-label");

    if (theme === "dark") {
      if (icon) icon.textContent = "☀️";
      if (label) label.textContent = "Light";
    } else {
      if (icon) icon.textContent = "🌙";
      if (label) label.textContent = "Dark";
    }
  }
}
