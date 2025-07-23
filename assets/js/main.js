document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.navbar-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }

  // Simple HTML5 validation for contact form consent checkbox
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const consent = contactForm.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        e.preventDefault();
        alert('Пожалуйста, подтвердите согласие с Политикой конфиденциальности.');
      }
    });
  }
});