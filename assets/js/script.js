document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.getElementById('site-nav-links');

  if (navToggle && navLinks) {
    const closeNav = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    };

    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) closeNav();
    });
  }

  // Fullscreen Lightbox Image Viewer
  const dialog = document.getElementById('lightbox-dialog');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  const triggers = document.querySelectorAll('.annotated-media__stage, .screenshot-frame, .lightbox-trigger');

  triggers.forEach((trigger) => {
    trigger.classList.add('lightbox-trigger');

    trigger.addEventListener('click', (e) => {
      // Don't trigger if clicked on an interactive marker button
      if (e.target.closest('.annotation-marker')) return;

      e.preventDefault();
      let imgSrc = '';
      let altText = '';
      let captionText = '';

      const img = trigger.querySelector('img') || (trigger.tagName && trigger.tagName.toLowerCase() === 'img' ? trigger : null);

      if (img) {
        imgSrc = img.getAttribute('src');
        altText = img.getAttribute('alt') || '';
      }

      const figure = trigger.closest('figure, .annotated-media, .three-image-card, .process-step-card');
      if (figure) {
        const caption = figure.querySelector('.editorial-caption, figcaption, .annotation-card__body p');
        if (caption) {
          captionText = caption.textContent;
        }
      }

      if (imgSrc && dialog && lightboxImg) {
        lightboxImg.src = imgSrc;
        lightboxImg.alt = altText;
        if (lightboxCaption) {
          lightboxCaption.textContent = captionText || altText;
        }
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      }
    });
  });

  const closeLightbox = () => {
    if (!dialog) return;
    if (typeof dialog.close === 'function') {
      dialog.close();
    } else {
      dialog.removeAttribute('open');
    }
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  if (dialog) {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dialog && dialog.hasAttribute('open')) {
      closeLightbox();
    }
  });

  // Interactive Flow Demo
  const flowDemo = document.querySelector('[data-flow-demo]');

  if (flowDemo) {
    const flowImage = flowDemo.querySelector('[data-flow-image]');
    const flowSteps = Array.from(flowDemo.querySelectorAll('[data-flow-step]'));
    const prevBtn = flowDemo.querySelector('[data-flow-prev]');
    const nextBtn = flowDemo.querySelector('[data-flow-next]');
    let currentStep = 0;

    const goToStep = (index) => {
      const total = flowSteps.length;
      currentStep = (index + total) % total;
      const step = flowSteps[currentStep];

      flowImage.src = step.getAttribute('data-image');
      flowImage.alt = step.getAttribute('data-alt') || '';
      flowImage.style.animation = 'none';
      // Force reflow so the fade-in animation replays on every step change.
      void flowImage.offsetWidth;
      flowImage.style.animation = '';

      flowSteps.forEach((s, i) => {
        const isActive = i === currentStep;
        s.classList.toggle('is-active', isActive);
        s.setAttribute('aria-selected', String(isActive));
      });
    };

    flowSteps.forEach((step, index) => {
      step.addEventListener('click', () => goToStep(index));
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => goToStep(currentStep + 1));
    }
  }
});
