// ═══════════════════════════════════════════════════════
// ENHANCED CONTACT FORM HANDLER
// ═══════════════════════════════════════════════════════

export function initEnhancedForm() {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const formResponse = document.getElementById("formResponse");

  if (!form || !submitBtn) return;

  // Real-time validation
  const inputs = form.querySelectorAll(".form-input, .form-ta");

  inputs.forEach((input) => {
    // Validate on blur
    input.addEventListener("blur", () => {
      validateField(input);
    });

    // Clear error on input
    input.addEventListener("input", () => {
      if (input.classList.contains("is-invalid")) {
        input.classList.remove("is-invalid");
        const errorSpan = input.parentElement.querySelector(".error-text");
        if (errorSpan) {
          errorSpan.textContent = "";
          errorSpan.style.opacity = "0";
          errorSpan.style.height = "0";
        }
      }
    });
  });

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("userName");
    const email = document.getElementById("userEmail");
    const subject = document.getElementById("userSubject");
    const message = document.getElementById("userMessage");

    // Validate all fields
    const isNameValid = validateField(name);
    const isEmailValid = validateField(email);
    const isSubjectValid = validateField(subject);
    const isMsgValid = validateField(message);

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMsgValid) {
      showFormResponse("Please fix the errors above", "error");
      return;
    }

    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;

    try {
      const formData = new FormData(form);
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      submitBtn.classList.remove("loading");

      if (response.status === 200) {
        // Success state
        submitBtn.classList.add("success");
        submitBtn.textContent = "✓ Message Sent!";
        submitBtn.style.background = "linear-gradient(90deg, #22c55e, #10b981)";

        // Mark all fields as valid
        inputs.forEach((input) => input.classList.add("is-valid"));

        // Show success message
        showFormResponse(
          "Thank you! Your message has been sent successfully. I'll get back to you soon.",
          "success",
        );

        // Reset form after delay
        setTimeout(() => {
          form.reset();
          inputs.forEach((input) => input.classList.remove("is-valid"));
          submitBtn.classList.remove("success");
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          hideFormResponse();
        }, 5000);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      submitBtn.classList.remove("loading");
      submitBtn.textContent = originalText;

      showFormResponse(
        "Oops! Something went wrong. Please try again or contact me directly via email.",
        "error",
      );

      setTimeout(() => {
        hideFormResponse();
      }, 6000);
    } finally {
      submitBtn.disabled = false;
    }
  });

  // ─── VALIDATION FUNCTIONS ───

  function validateField(input) {
    const errorSpan = input.parentElement.querySelector(".error-text");
    if (!errorSpan) return true;

    let isValid = false;
    let errorMsg = "";

    const value = input.value.trim();
    const inputId = input.id;

    switch (inputId) {
      case "userName":
        isValid = /^[a-zA-Z\s]{3,50}$/.test(value);
        errorMsg = isValid
          ? ""
          : "Name must be 3-50 letters (no numbers or special characters)";
        break;

      case "userEmail":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        errorMsg = isValid ? "" : "Please enter a valid email address";
        break;

      case "userSubject":
        isValid = value.length >= 4 && value.length <= 100;
        errorMsg = isValid
          ? ""
          : "Subject must be between 4 and 100 characters";
        break;

      case "userMessage":
        isValid = value.length >= 10 && value.length <= 1000;
        errorMsg = isValid
          ? ""
          : "Message must be between 10 and 1000 characters";
        break;

      default:
        isValid = value.length > 0;
        errorMsg = isValid ? "" : "This field is required";
    }

    if (isValid) {
      input.classList.remove("is-invalid");
      errorSpan.textContent = "";
      errorSpan.style.opacity = "0";
      errorSpan.style.height = "0";
    } else {
      input.classList.add("is-invalid");
      errorSpan.textContent = errorMsg;
      errorSpan.style.opacity = "1";
      errorSpan.style.height = "auto";
    }

    return isValid;
  }

  function showFormResponse(message, type) {
    if (!formResponse) return;

    formResponse.textContent = message;
    formResponse.className = `show ${type}`;
  }

  function hideFormResponse() {
    if (!formResponse) {
      formResponse.classList.remove("show");
      setTimeout(() => {
        formResponse.textContent = "";
        formResponse.className = "";
      }, 300);
    }
  }

  // ─── CHARACTER COUNTER (Optional Enhancement) ───
  const message = document.getElementById("userMessage");
  if (message) {
    const counter = document.createElement("div");
    counter.className = "char-counter";
    counter.style.cssText = `
      font-size: 0.75rem;
      color: var(--text3);
      text-align: right;
      margin-top: 0.25rem;
      font-family: var(--ff-mono);
    `;
    message.parentElement.appendChild(counter);

    message.addEventListener("input", () => {
      const length = message.value.length;
      const maxLength = 1000;
      counter.textContent = `${length} / ${maxLength}`;

      if (length > maxLength * 0.9) {
        counter.style.color = "var(--gold)";
      } else if (length > maxLength) {
        counter.style.color = "var(--red)";
      } else {
        counter.style.color = "var(--text3)";
      }
    });
  }
}

// ═══════════════════════════════════════════════════════
// ENHANCED SOCIAL LINKS (Add copy-to-clipboard feature)
// ═══════════════════════════════════════════════════════

export function initSocialLinks() {
  const emailLink = document.querySelector('.cl-item[href*="mailto"]');
  const phoneLink = document.querySelector('.cl-item[href^="tel:"]');

  // Add copy functionality for email
  if (emailLink) {
    addCopyFeature(emailLink, "Email address copied!");
  }

  // Add copy functionality for phone
  if (phoneLink) {
    addCopyFeature(phoneLink, "Phone number copied!");
  }

  function addCopyFeature(element, successMsg) {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerHTML = "📋";
    copyBtn.style.cssText = `
      position: absolute;
      right: 3rem;
      background: var(--surface2);
      border: 1px solid var(--border);
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      opacity: 0;
      transition: all 0.3s var(--ease);
      cursor: pointer;
    `;

    element.style.position = "relative";
    element.appendChild(copyBtn);

    element.addEventListener("mouseenter", () => {
      copyBtn.style.opacity = "1";
    });

    element.addEventListener("mouseleave", () => {
      copyBtn.style.opacity = "0";
    });

    copyBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const href = element.getAttribute("href");
      let textToCopy = "";

      if (href.startsWith("mailto:")) {
        textToCopy = href.replace("mailto:", "").split("?")[0];
      } else if (href.startsWith("tel:")) {
        textToCopy = href.replace("tel:", "").trim();
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        copyBtn.innerHTML = "✓";
        copyBtn.style.background = "var(--green)";
        copyBtn.style.color = "white";

        // Show tooltip
        showTooltip(copyBtn, successMsg);

        setTimeout(() => {
          copyBtn.innerHTML = "📋";
          copyBtn.style.background = "var(--surface2)";
          copyBtn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    });
  }

  function showTooltip(element, message) {
    const tooltip = document.createElement("div");
    tooltip.className = "copy-tooltip";
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: var(--surface2);
      color: var(--text);
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      white-space: nowrap;
      border: 1px solid var(--border);
      animation: tooltipFade 2s ease forwards;
      pointer-events: none;
      z-index: 1000;
    `;

    element.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
    }, 2000);
  }

  // Add CSS for tooltip animation
  if (!document.getElementById("tooltip-styles")) {
    const style = document.createElement("style");
    style.id = "tooltip-styles";
    style.textContent = `
      @keyframes tooltipFade {
        0%, 80% { opacity: 1; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}
