/**
 * Web 2.0 Resume Site - JavaScript Interactions
 * Smooth scrolling, scroll reveal animations, and polished effects
 */

(function() {
  'use strict';

  // ========================================
  // Respect Reduced Motion Preference
  // ========================================

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = prefersReducedMotion.matches;

  prefersReducedMotion.addEventListener('change', () => {
    reducedMotion = prefersReducedMotion.matches;
  });

  // ========================================
  // Smooth Scroll Navigation
  // ========================================

  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const navbar = document.querySelector('.navbar');

    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Skip if just "#"
        if (href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        // Calculate offset for sticky nav
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

        if (reducedMotion) {
          window.scrollTo(0, targetPosition);
        } else {
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  // ========================================
  // Sticky Navigation Enhancement
  // ========================================

  function initStickyNav() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const navOffset = navbar.offsetTop;
    let ticking = false;

    function updateNav() {
      if (window.pageYOffset > navOffset + 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========================================
  // Active Navigation Link Highlighting
  // ========================================

  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const navbar = document.querySelector('.navbar');
    const navHeight = navbar ? navbar.offsetHeight : 0;

    let ticking = false;

    function updateActiveLink() {
      const scrollPos = window.pageYOffset + navHeight + 100;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });

      ticking = false;
    }

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(updateActiveLink);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateActiveLink();
  }

  // ========================================
  // Scroll Reveal Animations
  // ========================================

  function initScrollReveal() {
    if (reducedMotion) {
      // Show all elements immediately
      document.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });
      return;
    }

    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('visible'));
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
  }

  // ========================================
  // Keyboard Navigation Enhancement
  // ========================================

  function initKeyboardNav() {
    // Add visible focus states
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', function() {
      document.body.classList.remove('keyboard-nav');
    });
  }

  // ========================================
  // Initialize All
  // ========================================

  function init() {
    initSmoothScroll();
    initStickyNav();
    initActiveNavHighlight();
    initScrollReveal();
    initKeyboardNav();
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
