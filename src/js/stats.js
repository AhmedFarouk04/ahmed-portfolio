export function initStats() {
  const statsSection = document.getElementById("quick-stats");
  if (!statsSection) return;

  const statNums = document.querySelectorAll(".stat-num");
  let hasAnimated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasAnimated) {
          hasAnimated = true;
          animateCounters();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(statsSection);

  function animateCounters() {
    statNums.forEach((el) => {
      // 1. استخدام parseFloat بدلاً من parseInt للحفاظ على الكسور
      const targetStr = el.getAttribute("data-count");
      const target = parseFloat(targetStr);
      const suffix = el.getAttribute("data-suffix") || "";

      const isDecimal = targetStr.includes(".");

      let current = 0;
      const increment = target / 40;
      const duration = 28;

      const interval = setInterval(() => {
        current += increment;

        if (current >= target) {
          current = target;
          clearInterval(interval);
        }

        if (isDecimal) {
          el.textContent = current.toFixed(2) + suffix;
        } else {
          el.textContent = Math.floor(current) + suffix;
        }
      }, duration);
    });
  }
}
