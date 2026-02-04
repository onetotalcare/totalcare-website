/**
 * Scroll Animations Component
 * Handles fade-in animations on scroll using Intersection Observer
 */

const ScrollAnimations = (function() {
  'use strict';

  // Configuration
  const config = {
    selector: '.fade-in',
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  // State
  let observer = null;
  let animatedElements = [];

  /**
   * Initialize the scroll animations
   */
  function init() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      // Fallback: Show all elements immediately
      showAllElements();
      return;
    }

    // Get all elements to animate
    animatedElements = document.querySelectorAll(config.selector);

    if (animatedElements.length === 0) {
      return;
    }

    // Create observer
    observer = new IntersectionObserver(handleIntersection, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });

    // Observe all elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  /**
   * Handle intersection observer callback
   */
  function handleIntersection(entries, observerInstance) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class with a small delay for staggered effect
        const element = entry.target;
        const delay = getStaggerDelay(element);

        setTimeout(() => {
          element.classList.add('visible');
        }, delay);

        // Stop observing once animated
        observerInstance.unobserve(element);
      }
    });
  }

  /**
   * Calculate stagger delay based on element position in its parent
   */
  function getStaggerDelay(element) {
    const siblings = element.parentElement.querySelectorAll(config.selector);
    const index = Array.from(siblings).indexOf(element);
    return index * 100; // 100ms delay per element
  }

  /**
   * Fallback for browsers without Intersection Observer
   */
  function showAllElements() {
    const elements = document.querySelectorAll(config.selector);
    elements.forEach(element => {
      element.classList.add('visible');
    });
  }

  /**
   * Manually trigger animation for an element
   */
  function animateElement(element) {
    if (element && element.classList.contains(config.selector.replace('.', ''))) {
      element.classList.add('visible');
    }
  }

  /**
   * Reset animations (useful for dynamic content)
   */
  function reset() {
    if (observer) {
      observer.disconnect();
    }
    init();
  }

  /**
   * Destroy the observer
   */
  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    animatedElements = [];
  }

  // Public API
  return {
    init,
    animateElement,
    reset,
    destroy
  };
})();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ScrollAnimations.init);
} else {
  ScrollAnimations.init();
}
