/**
 * Total Care Landing Page - Main JavaScript
 * Entry point for all page functionality
 */

(function() {
  'use strict';

  /**
   * App Configuration
   */
  const App = {
    config: {
      loadingClass: 'loading',
      loadedClass: 'loaded'
    },

    /**
     * Initialize the application
     */
    init() {
      // Remove loading state
      this.setLoaded();

      // Initialize Lucide icons
      this.initIcons();

      // Initialize active navigation state
      this.initActiveNavigation();

      // Log ready state
      console.log('Total Care website initialized');
    },

    /**
     * Set page as loaded (removes loading overlay/state)
     */
    setLoaded() {
      const body = document.body;
      body.classList.remove(this.config.loadingClass);
      body.classList.add(this.config.loadedClass);
    },

    /**
     * Initialize Lucide icons
     */
    initIcons() {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      } else {
        console.warn('Lucide icons library not loaded');
      }
    },

    /**
     * Initialize active navigation state based on scroll position
     */
    initActiveNavigation() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('nav a[href^="#"]');

      if (sections.length === 0 || navLinks.length === 0) return;

      const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.setActiveNavLink(id, navLinks);
          }
        });
      }, observerOptions);

      sections.forEach(section => observer.observe(section));
    },

    /**
     * Set active state on navigation link
     */
    setActiveNavLink(sectionId, navLinks) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
          link.classList.add('text-primary-dark');
        } else {
          link.classList.remove('text-primary-dark');
        }
      });
    }
  };

  /**
   * Utility Functions
   */
  const Utils = {
    /**
     * Debounce function calls
     */
    debounce(func, wait = 100) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    /**
     * Throttle function calls
     */
    throttle(func, limit = 100) {
      let inThrottle;
      return function executedFunction(...args) {
        if (!inThrottle) {
          func(...args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
  };

  /**
   * Form Handling (for future contact form implementation)
   */
  const FormHandler = {
    /**
     * Initialize form handling
     */
    init() {
      const forms = document.querySelectorAll('form[data-ajax]');
      forms.forEach(form => {
        form.addEventListener('submit', this.handleSubmit.bind(this));
      });
    },

    /**
     * Handle form submission
     */
    async handleSubmit(event) {
      event.preventDefault();
      const form = event.target;
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');

      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        // Placeholder for actual form submission
        // Replace with your actual API endpoint
        console.log('Form data:', Object.fromEntries(formData));

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        this.showMessage(form, 'success', 'Thank you! We\'ll be in touch soon.');
        form.reset();
      } catch (error) {
        console.error('Form submission error:', error);
        this.showMessage(form, 'error', 'Something went wrong. Please try again.');
      } finally {
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit';
        }
      }
    },

    /**
     * Show form message
     */
    showMessage(form, type, message) {
      // Remove existing messages
      const existingMsg = form.querySelector('.form-message');
      if (existingMsg) existingMsg.remove();

      // Create message element
      const msgElement = document.createElement('div');
      msgElement.className = `form-message mt-4 p-4 rounded ${
        type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`;
      msgElement.textContent = message;

      // Insert after form
      form.appendChild(msgElement);

      // Auto-remove after 5 seconds
      setTimeout(() => msgElement.remove(), 5000);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      App.init();
      FormHandler.init();
    });
  } else {
    App.init();
    FormHandler.init();
  }

  // Expose to global scope for debugging (optional)
  window.TotalCareApp = {
    App,
    Utils,
    FormHandler
  };
})();
