const navToggle = document.querySelector('.nav__toggle');
const navList = document.querySelector('.nav__list');
const calculatorModal = document.getElementById('calculator-modal');
const contactModal = document.getElementById('contact-modal');
const openCalculatorBtn = document.getElementById('open-calculator');
const contactBtn = document.getElementById('contact-btn');
const modals = document.querySelectorAll('.modal');

function toggleNav() {
  navList.classList.toggle('is-open');
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
}

if (navToggle) {
  navToggle.addEventListener('click', toggleNav);
}

navList?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navList.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

function openModal(modal) {
  modal?.classList.add('is-open');
  modal?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal?.classList.remove('is-open');
  modal?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

openCalculatorBtn?.addEventListener('click', () => openModal(calculatorModal));
contactBtn?.addEventListener('click', () => openModal(contactModal));

modals.forEach((modal) => {
  modal.addEventListener('click', (event) => {
    if (event.target.dataset.closeModal !== undefined || event.target === modal) {
      closeModal(modal);
    }
  });
  modal.querySelectorAll('[data-close-modal]').forEach((btn) => {
    btn.addEventListener('click', () => closeModal(modal));
  });
});

function initForm(form) {
  if (!form) return;

  const successMessage = form.querySelector('.form__success');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      const error = field.parentElement.querySelector('.form__error');
      if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        field.classList.add('is-invalid');
        if (error) error.style.display = 'block';
      } else if (field.id === 'phone' && field.value.trim() && !field.checkValidity()) {
        isValid = false;
        field.classList.add('is-invalid');
        if (error) error.style.display = 'block';
      } else if (field.id === 'calc-year') {
        const year = parseInt(field.value, 10);
        if (!year || year < 1990 || year > 2025) {
          isValid = false;
          field.classList.add('is-invalid');
          if (error) error.style.display = 'block';
        } else {
          field.classList.remove('is-invalid');
          if (error) error.style.display = 'none';
        }
      } else {
        field.classList.remove('is-invalid');
        if (error) error.style.display = 'none';
      }
    });

    if (isValid && successMessage) {
      successMessage.style.display = 'block';
      form.reset();
      setTimeout(() => {
        successMessage.style.display = 'none';
        const modal = form.closest('.modal');
        if (modal) closeModal(modal);
      }, 4000);
    }
  });

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    const error = field.parentElement.querySelector('.form__error');
    field.addEventListener('input', () => {
      if (!field.hasAttribute('required')) return;
      if (field.value.trim() && (!field.pattern || new RegExp(field.pattern).test(field.value))) {
        field.classList.remove('is-invalid');
        if (error) error.style.display = 'none';
      }
    });
  });
}

initForm(document.getElementById('booking-form'));
initForm(document.getElementById('calculator-form'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

function initSlider(slider) {
  if (!slider) return;

  const track = slider.querySelector('.slider__track');
  const slides = Array.from(track.children);
  const prevBtn = slider.querySelector('.slider__control--prev');
  const nextBtn = slider.querySelector('.slider__control--next');
  const dotsContainer = slider.querySelector('.slider__dots');
  let index = 0;

  function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsContainer.querySelectorAll('.slider__dot').forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  }

  slides.forEach((_, slideIndex) => {
    const dot = document.createElement('button');
    dot.classList.add('slider__dot');
    dot.type = 'button';
    if (slideIndex === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => {
      index = slideIndex;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });

  prevBtn?.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlider();
  });

  nextBtn?.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updateSlider();
  });

  setInterval(() => {
    index = (index + 1) % slides.length;
    updateSlider();
  }, 8000);
}

initSlider(document.querySelector('[data-slider]'));

const accordionItems = document.querySelectorAll('.accordion__item');
accordionItems.forEach((item) => {
  const header = item.querySelector('.accordion__header');
  const content = item.querySelector('.accordion__content');
  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    accordionItems.forEach((accordionItem) => {
      accordionItem.classList.remove('is-open');
      accordionItem.querySelector('.accordion__content').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('is-open');
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  });
});

window.addEventListener('load', () => {
  accordionItems[0]?.classList.add('is-open');
  const firstContent = accordionItems[0]?.querySelector('.accordion__content');
  if (firstContent) firstContent.style.maxHeight = `${firstContent.scrollHeight}px`;
});

