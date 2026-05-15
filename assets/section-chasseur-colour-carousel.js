class ChasseurColourCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-carousel-track]');
    this.slides = Array.from(this.querySelectorAll('[data-carousel-slide]'));
    this.prevBtn = this.querySelector('[data-carousel-prev]');
    this.nextBtn = this.querySelector('[data-carousel-next]');
    this.dots = Array.from(this.querySelectorAll('[data-carousel-dot]'));
    this.current = 0;
    this.itemsPerSlide = this.getItemsPerSlide();
    this.totalSlides = Math.ceil(this.slides.length / this.itemsPerSlide);

    this.setSlideWidths();
    this.updateButtons();
    this.bindEvents();
    this.setupA11y();
    this.setupDrag();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  getItemsPerSlide() {
    if (window.innerWidth >= 990) return 6;
    if (window.innerWidth >= 750) return 3;
    return 2;
  }

  setSlideWidths() {
    const gap = 24;
    const trackW = this.track.parentElement.offsetWidth;
    const itemW = (trackW - gap * (this.itemsPerSlide - 1)) / this.itemsPerSlide;
    this.slides.forEach(s => {
      s.style.width = itemW + 'px';
      const circle = s.querySelector('.chasseur-colour-carousel__swatch-circle');
      const link = s.querySelector('.chasseur-colour-carousel__swatch-link');
      if (circle) { circle.style.width = itemW + 'px'; circle.style.height = itemW + 'px'; }
      if (link) { link.style.width = itemW + 'px'; }
    });
    this.itemWidth = itemW;
    this.slideWidth = itemW * this.itemsPerSlide + gap * (this.itemsPerSlide - 1) + gap;
  }

  goTo(index) {
    this.current = Math.max(0, Math.min(this.totalSlides - 1, index));
    const gap = 24;
    const offset = this.current * (this.itemWidth * this.itemsPerSlide + gap * this.itemsPerSlide);
    this.track.style.transform = `translateX(-${offset}px)`;
    this.updateButtons();
    this.updateDots();
  }

  updateButtons() {
    if (this.prevBtn) this.prevBtn.disabled = this.current === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.current >= this.totalSlides - 1;
  }

  updateDots() {
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === this.current);
    });
  }

  bindEvents() {
    this.prevBtn?.addEventListener('click', () => this.goTo(this.current - 1));
    this.nextBtn?.addEventListener('click', () => this.goTo(this.current + 1));
    this.dots.forEach((dot, i) => {
      dot.addEventListener('click', () => this.goTo(i));
    });
  }

  setupA11y() {
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', 'Colours carousel');
  }

  setupDrag() {
    let startX = 0;
    let isDragging = false;

    this.track.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    this.track.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 50) this.goTo(diff < 0 ? this.current + 1 : this.current - 1);
    });

    this.track.addEventListener('pointercancel', () => { isDragging = false; });
  }

  onResize() {
    const newItemsPerSlide = this.getItemsPerSlide();
    if (newItemsPerSlide !== this.itemsPerSlide) {
      this.itemsPerSlide = newItemsPerSlide;
      this.totalSlides = Math.ceil(this.slides.length / this.itemsPerSlide);
      this.current = 0;
    }
    this.setSlideWidths();
    this.goTo(this.current);
  }
}

customElements.define('chasseur-colour-carousel', ChasseurColourCarousel);

document.querySelectorAll('[data-colour-carousel]').forEach(el => {
  const carousel = document.createElement('chasseur-colour-carousel');
  el.parentNode.insertBefore(carousel, el);
  carousel.appendChild(el.querySelector('[data-carousel-track]').parentNode);
  el.remove();
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.chasseur-colour-carousel__track-wrap[data-colour-carousel]').forEach(wrap => {
    const section = wrap.closest('.chasseur-colour-carousel__inner');
    if (!section) return;
    const instance = new ChasseurColourCarousel();
    instance.track = wrap.querySelector('[data-carousel-track]');
    instance.slides = Array.from(wrap.querySelectorAll('[data-carousel-slide]'));
    instance.prevBtn = section.querySelector('[data-carousel-prev]');
    instance.nextBtn = section.querySelector('[data-carousel-next]');
    instance.dots = Array.from(section.querySelectorAll('[data-carousel-dot]'));
    instance.current = 0;
    instance.itemsPerSlide = instance.getItemsPerSlide.call(instance);
    instance.totalSlides = Math.ceil(instance.slides.length / instance.itemsPerSlide);
    instance.setSlideWidths.call(instance);
    instance.updateButtons.call(instance);
    instance.bindEvents.call(instance);
    instance.setupA11y.call(instance);
    instance.setupDrag.call(instance);
    window.addEventListener('resize', instance.onResize.bind(instance));
  });
});
