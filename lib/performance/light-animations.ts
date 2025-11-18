/**
 * Light Animations Utility
 * 
 * Provides CSS classes and utilities for light animations that work well
 * in mobile lite mode without impacting performance.
 * Uses opacity/transform with will-change for optimal performance.
 */

/**
 * CSS class names for light animations
 */
export const lightAnimationClasses = {
  fadeIn: 'animate-fade-in-light',
  fadeOut: 'animate-fade-out-light',
  pulse: 'animate-pulse-light',
  slideUp: 'animate-slide-up-light',
  slideDown: 'animate-slide-down-light',
}

/**
 * Apply light animation styles to an element
 * 
 * @param element - HTML element to animate
 * @param animationType - Type of animation to apply
 */
export function applyLightAnimation(
  element: HTMLElement,
  animationType: 'fade' | 'pulse' | 'slide'
): void {
  // Add will-change for performance optimization
  element.style.willChange = 'opacity, transform'
  
  switch (animationType) {
    case 'fade':
      element.style.transition = 'opacity 300ms ease-in-out'
      break
    case 'pulse':
      element.style.transition = 'opacity 200ms ease-in-out, transform 200ms ease-in-out'
      break
    case 'slide':
      element.style.transition = 'transform 300ms ease-in-out, opacity 300ms ease-in-out'
      break
  }
}

/**
 * Remove light animation styles from an element
 * 
 * @param element - HTML element to clean up
 */
export function removeLightAnimation(element: HTMLElement): void {
  element.style.willChange = ''
  element.style.transition = ''
}

