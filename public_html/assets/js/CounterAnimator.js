class TCounterAnimator {
    constructor(selector, options = {}) {
      this.elements = document.querySelectorAll(selector);
      this.duration = options.duration || 2000;
      this.threshold = options.threshold || 0.4;
      this.started = false;

      this.initObserver();
    }

    // easing-функція для плавної анімації
    easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    // Запуск анімації
    animate() {
      const startTime = performance.now();
      const duration = this.duration;
      const elements = this.elements;
      const easeFunc = this.easeOutCubic;

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeFunc(progress);

        elements.forEach(el => {
          const target = parseInt(el.dataset.target, 10) || 0;
          const value = Math.floor(target * eased);
          el.textContent = value.toLocaleString();
        });

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          elements.forEach(el => {
            el.textContent = parseInt(el.dataset.target, 10).toLocaleString();
          });
        }
      }
      requestAnimationFrame(update);
    }

    initObserver() {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.started) {
            this.started = true;
            this.animate();
            obs.disconnect();
          }
        });
      }, { threshold: this.threshold });

      if (this.elements.length > 0) {
        const container = this.elements[0].closest('.counters') || this.elements[0];
        observer.observe(container);
      }
    }
}
