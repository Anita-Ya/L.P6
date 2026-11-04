/* ========================================================
   Mobile Landing Page - Staggered Scroll Animation
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initOrderFormValidation();
  initFAQAccordion();
});

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (!animatedElements.length) return;

  // Use Intersection Observer for smooth reveal on scroll
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  animatedElements.forEach(el => observer.observe(el));
}

/* ========================================================
   Section 9: Order Form Validation (Matches User Screenshot)
   ======================================================== */
function initOrderFormValidation() {
  const form = document.getElementById('leadOrderForm');
  const nameInput = document.getElementById('userName');
  const phoneInput = document.getElementById('userPhone');
  const nameWrap = document.getElementById('nameWrap');
  const phoneWrap = document.getElementById('phoneWrap');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const successMsg = document.getElementById('orderSuccessMsg');
  const submitBtn = document.getElementById('orderSubmitBtn');

  if (!form || !nameInput || !phoneInput) return;

  // Real-time phone filtering (digits only, max 10)
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
    if (phoneWrap.classList.contains('has-error')) {
      validatePhone();
    }
  });

  // Real-time name re-validation if previously errored
  nameInput.addEventListener('input', () => {
    if (nameWrap.classList.contains('has-error')) {
      validateName();
    }
  });

  // Name Validation Function
  function validateName() {
    const val = nameInput.value.trim();
    // Allows English alphabets, Hindi/Devanagari characters, and spaces/dots
    const nameRegex = /^[a-zA-Z\u0900-\u097F\s.]+$/;

    if (!val) {
      showError(nameWrap, nameError, 'कृपया अपना नाम दर्ज करें');
      return false;
    } else if (!nameRegex.test(val)) {
      showError(nameWrap, nameError, 'कृपया केवल अक्षरों में नाम लिखें');
      return false;
    } else if (val.length < 2) {
      showError(nameWrap, nameError, 'कृपया अपना पूरा नाम लिखें');
      return false;
    }

    clearError(nameWrap, nameError);
    return true;
  }

  // Phone Validation Function (10 digits starting with 6, 7, 8, or 9)
  function validatePhone() {
    const val = phoneInput.value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(val)) {
      showError(phoneWrap, phoneError, '10 अंकों का सही मोबाइल नंबर डालें (6-9 से शुरू)');
      return false;
    }

    clearError(phoneWrap, phoneError);
    return true;
  }

  function showError(wrap, errorEl, msg) {
    if (wrap) wrap.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.classList.add('is-visible');
    }
  }

  function clearError(wrap, errorEl) {
    if (wrap) wrap.classList.remove('has-error');
    if (errorEl) {
      errorEl.classList.remove('is-visible');
    }
  }

  // Form Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isPhoneValid = validatePhone();

    if (!isNameValid) {
      nameInput.focus();
      return;
    }

    if (!isPhoneValid) {
      phoneInput.focus();
      return;
    }

    // Capture entered values before reset
    const enteredName = nameInput.value.trim();
    const enteredPhone = phoneInput.value.trim();

    // Button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';
    }

    // Open Thank You Modal (Matches User Screenshot)
    setTimeout(() => {
      openThankYouModal(enteredName, enteredPhone);
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
      }
    }, 300);
  });

  // Modal Close Listeners
  initModalListeners();
}

/* ========================================================
   Thank You Modal Controls (Matches User Reference)
   ======================================================== */
function openThankYouModal(name, phone) {
  const modal = document.getElementById('thankyouModal');
  const nameEl = document.getElementById('modalUserName');
  const phoneEl = document.getElementById('modalUserPhone');
  const orderIdEl = document.getElementById('modalOrderId');

  if (!modal) return;

  // Set personalized name (matches "बधाई हो, kuki!")
  if (nameEl) {
    nameEl.textContent = name || 'ग्राहक';
  }

  // Set formatted mobile number (matches "+91 8465567676")
  if (phoneEl) {
    phoneEl.textContent = phone ? `+91 ${phone}` : '+91 ----------';
  }

  // Generate random 6-digit Order ID (matches "RP-593678")
  if (orderIdEl) {
    const randomId = Math.floor(100000 + Math.random() * 900000);
    orderIdEl.textContent = `RP-${randomId}`;
  }

  // Open modal
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeThankYouModal() {
  const modal = document.getElementById('thankyouModal');
  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function initModalListeners() {
  const modal = document.getElementById('thankyouModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const doneBtn = document.getElementById('modalDoneBtn');

  if (closeBtn) closeBtn.addEventListener('click', closeThankYouModal);
  if (doneBtn) doneBtn.addEventListener('click', closeThankYouModal);

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeThankYouModal();
      }
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeThankYouModal();
    }
  });
}

/* ========================================================
   Section 11: FAQ Accordion Toggle
   ======================================================== */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const icon = item.querySelector('.faq-toggle-icon');
    if (!question) return;

    question.addEventListener('click', () => {
      const isCurrentlyActive = item.classList.contains('active');

      // Close all other FAQ items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherIcon = otherItem.querySelector('.faq-toggle-icon');
        if (otherIcon) otherIcon.textContent = '+';
      });

      // Toggle clicked item
      if (!isCurrentlyActive) {
        item.classList.add('active');
        if (icon) icon.textContent = '−';
      }
    });
  });
}
