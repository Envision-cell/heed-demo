import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Kill all ScrollTriggers whose trigger is a given container element
 */
export const killSectionScrollTriggers = (container) => {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.trigger === container) {
      trigger.kill();
    }
  });
};
