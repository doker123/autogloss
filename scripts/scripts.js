document.addEventListener('DOMContentLoaded', () => {
    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-toggle__icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        themeIcon.innerHTML = theme === 'dark' ? '&#9790;' : '&#9728;';
    }

    // ===== BURGER MENU =====
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        nav.classList.toggle('active');
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== SCROLL REVEAL =====
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== BEFORE/AFTER SLIDER (OOP) =====
    class BeforeAfterSlider {
        constructor(el) {
            this.el = el;
            this.input = el.querySelector('.ba-slider__input');
            this.afterEl = el.querySelector('.ba-slider__after');
            this.handle = el.querySelector('.ba-slider__handle');
            this.isDragging = false;

            this._bindEvents();
        }

        _bindEvents() {
            this.input.addEventListener('input', (e) => this._update(e.target.value));

            this.el.addEventListener('mousedown', (e) => this._onDragStart(e));
            this.el.addEventListener('touchstart', () => this._onDragStart(), { passive: true });

            const onMove = (e) => this._onDragMove(e);
            const onEnd = () => this._onDragEnd();

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: true });
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        }

        _update(value) {
            this.afterEl.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
            this.handle.style.left = value + '%';
        }

        _getPosition(e) {
            const rect = this.el.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        }

        _onDragStart(e) {
            this.isDragging = true;
            if (e) this._applyPosition(e);
        }

        _onDragMove(e) {
            if (!this.isDragging) return;
            this._applyPosition(e);
        }

        _onDragEnd() {
            this.isDragging = false;
        }

        _applyPosition(e) {
            const pos = this._getPosition(e);
            this.input.value = pos;
            this._update(pos);
        }
    }

    document.querySelectorAll('.ba-slider').forEach(el => new BeforeAfterSlider(el));

    // ===== CONTACT FORM =====
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = form.querySelector('#name').value.trim();
        const phone = form.querySelector('#phone').value.trim();

        if (!name || !phone) {
            alert('Пожалуйста, заполните обязательные поля: имя и телефон.');
            return;
        }

        successMsg.classList.add('show');
        form.reset();

        setTimeout(() => {
            successMsg.classList.remove('show');
        }, 5000);
    });

    // ===== YANDEX MAP =====
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(() => {
            const map = new ymaps.Map('map', {
                center: [55.7558, 37.6173],
                zoom: 15,
                controls: ['zoomControl', 'fullscreenControl']
            });
            const placemark = new ymaps.Placemark([55.7558, 37.6173], {
                balloonContentHeader: 'AutoGloss Detailing',
                balloonContentBody: 'Москва, ул. Примерная, д. 1',
                balloonContentFooter: '+7 (999) 999-99-99'
            }, {
                preset: 'islands#redAutoIcon'
            });
            map.geoObjects.add(placemark);
        });
    }
});
