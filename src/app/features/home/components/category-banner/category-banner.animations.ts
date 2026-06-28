export const EASING_CURVE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export const VIEWPORT_CONFIG = {
  margin: '-40px',
  once: true,
};

export function textAnimationVariants(isMobile: boolean) {
  return {
    scrollY: isMobile ? 20 : 40,
    scrollDuration: isMobile ? 0.45 : 0.6,
  };
}

export const TEXT_TRANSITION_CONFIGS = {
  title: { scrollDelay: 100 },
  description: { scrollDelay: 200 },
  button: { scrollDelay: 300 },
};

export function containerVariants(index: number, isMobile: boolean) {
  return {
    scrollY: isMobile ? 30 : 60,
    scrollDuration: isMobile ? 0.4 : 0.7,
    scrollDelay: index * (isMobile ? 50 : 80),
  };
}

export const floatTransition = {
  duration: 3200,
  easing: 'ease-in-out',
};
