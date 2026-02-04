/**
 * Navigation Component
 * Handles mobile menu toggle, smooth scrolling, and header scroll effects
 */

const Navigation = (function() {
  'use strict';

  // DOM Elements
  let header = null;
  let mobileMenuBtn = null;
  let mobileMenuClose = null;
  let mobileMenu = null;
  let navLinks = null;

  // State
  let isMenuOpen = false;
  let lastScrollY = 0;

  /**
   * Initialize the navigation component
   */
  function init() {
    // Cache DOM elements
    header = document.getElementById('header');
    mobileMenuBtn = document.getElementById('mobile-menu-btn');
    mobileMenuClose = document.getElementById('mobile-menu-close');
    mobileMenu = document.getElementById('mobile-menu');
    navLinks = document.querySelectorAll('a[href^="#"]');

    if (!header) {
      console.warn('Navigation: Header element not found');
      return;
    }

    // Bind events
    bindEvents();

    // Initialize header state
    updateHeaderOnScroll();
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking on nav links
    if (mobileMenu) {
      const menuLinks = mobileMenu.querySelectorAll('a');
      menuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', handleOutsideClick);

    // Escape key to close menu
    document.addEventListener('keydown', handleEscapeKey);

    // Smooth scroll for anchor links
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Header scroll effect
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /**
   * Toggle mobile menu open/closed
   */
  function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    updateMenuState();
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    if (isMenuOpen) {
      isMenuOpen = false;
      updateMenuState();
    }
  }

  /**
   * Update mobile menu DOM state
   */
  function updateMenuState() {
    if (!mobileMenu || !mobileMenuBtn) return;

    if (isMenuOpen) {
      mobileMenu.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    } else {
      mobileMenu.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }

  /**
   * Handle clicks outside mobile menu
   */
  function handleOutsideClick(event) {
    if (!isMenuOpen || !mobileMenu) return;

    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnToggle = mobileMenuBtn && mobileMenuBtn.contains(event.target);

    if (!isClickInsideMenu && !isClickOnToggle) {
      closeMobileMenu();
    }
  }

  /**
   * Handle escape key press
   */
  function handleEscapeKey(event) {
    if (event.key === 'Escape' && isMenuOpen) {
      closeMobileMenu();
    }
  }

  /**
   * Handle smooth scrolling for anchor links
   */
  function handleSmoothScroll(event) {
    const href = event.currentTarget.getAttribute('href');

    if (href && href.startsWith('#') && href.length > 1) {
      const targetElement = document.querySelector(href);

      if (targetElement) {
        event.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, href);
      }
    }
  }

  /**
   * Handle scroll events for header styling
   */
  function handleScroll() {
    requestAnimationFrame(updateHeaderOnScroll);
  }

  /**
   * Update header appearance based on scroll position
   */
  function updateHeaderOnScroll() {
    if (!header) return;

    const scrollY = window.scrollY;
    const scrollThreshold = 100;

    // Add shadow when scrolled
    if (scrollY > scrollThreshold) {
      header.classList.add('shadow-md');
      header.classList.remove('bg-white/70');
      header.classList.add('bg-white/95');
    } else {
      header.classList.remove('shadow-md');
      header.classList.add('bg-white/70');
      header.classList.remove('bg-white/95');
    }

    lastScrollY = scrollY;
  }

  /**
   * Get current menu state
   */
  function getState() {
    return {
      isMenuOpen,
      scrollY: lastScrollY
    };
  }

  // Public API
  return {
    init,
    closeMobileMenu,
    getState
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', Navigation.init);
} else {
  Navigation.init();
}
