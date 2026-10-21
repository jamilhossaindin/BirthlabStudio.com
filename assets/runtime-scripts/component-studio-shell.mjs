import { F as initializeEnvironment, S as initializeReact, y as React } from './react-core.mjs';
import { f as animate, t as initializeMotion } from './framer-motion.mjs';
import { SharedNavigation, SharedSiteLayout } from './main-entrypoint.mjs';
import { sharedFooterStyles } from './shared-footer-styles.mjs';

initializeEnvironment();
initializeReact();
initializeMotion();

export function ensureStudioStyles() {
  // These routes mount with createRoot and retain older exported layout CSS.
  // Keep Home's canonical shared layout rules on direct loads and navigation.
  if (typeof document !== 'undefined' && !document.querySelector('style[data-studio-footer-layout]')) {
    const stylesheet = document.createElement('style');
    stylesheet.dataset.studioFooterLayout = '';
    stylesheet.textContent = sharedFooterStyles;
    document.head.append(stylesheet);
  }
  return ensureStyles('/assets/runtime-scripts/page-services.css?v=mobile-startup-20261022', 'servicesStyles');
}

export function ensureStyles(href, marker) {
  if (typeof document === 'undefined' || document.querySelector(`link[data-${marker.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}]`)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = href;
    stylesheet.dataset[marker] = '';
    stylesheet.onload = resolve;
    stylesheet.onerror = reject;
    document.head.append(stylesheet);
  });
}

export function useStudioActionMotion() {
  React.useEffect(() => {
    const actions = document.querySelectorAll('.services-page .services-action');
    const phone = window.matchMedia('(max-width:767px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');
    const animations = new Map();
    // Use the canonical desktop footer link's exact spring and 405-degree travel.
    const transition = { type: 'spring', bounce: .2, delay: 0, duration: .4 };
    const updateArrow = action => {
      const arrow = action.querySelector('.services-link-arrow');
      if (!arrow) return;
      animations.get(arrow)?.stop();
      animations.delete(arrow);
      if (!phone.matches || reducedMotion.matches) {
        arrow.style.removeProperty('transform');
        return;
      }
      animations.set(arrow, animate(arrow, { rotate: action.hasAttribute('data-action-in-view') ? 405 : 0 }, transition));
    };
    const updateMotion = () => actions.forEach(updateArrow);
    // Observe the stationary link, so the arrow's rotation cannot affect entry.
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.toggleAttribute('data-action-in-view', entry.isIntersecting && entry.intersectionRatio >= .6);
        updateArrow(entry.target);
      }
    }, { threshold: [0, .6] });
    actions.forEach(action => observer.observe(action));
    phone.addEventListener('change', updateMotion);
    reducedMotion.addEventListener('change', updateMotion);
    return () => {
      observer.disconnect();
      phone.removeEventListener('change', updateMotion);
      reducedMotion.removeEventListener('change', updateMotion);
      animations.forEach(animation => animation.stop());
      actions.forEach(action => action.removeAttribute('data-action-in-view'));
    };
  }, []);
}

export function StudioNavigation() {
  const navigation = React.useRef(null);
  const [variant, setVariant] = React.useState(() => window.innerWidth < 768 ? 'k1vpeEcqE' : window.innerWidth < 1200 ? 'YDnluOSmc' : 'f5wupLZ1N');
  React.useEffect(() => {
    const update = () => setVariant(window.innerWidth < 768 ? 'k1vpeEcqE' : window.innerWidth < 1200 ? 'YDnluOSmc' : 'f5wupLZ1N');
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  React.useEffect(() => {
    const element = navigation.current;
    if (!element) return;
    const labelToggle = () => {
      const toggle = element.querySelector('.framer-cz9Ch');
      if (!toggle) return;
      const expanded = element.dataset.framerName === 'Phone';
      toggle.setAttribute('role', 'button');
      toggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
      toggle.setAttribute('aria-expanded', String(expanded));
    };
    labelToggle();
    const observer = new MutationObserver(labelToggle);
    observer.observe(element, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-framer-name'] });
    return () => observer.disconnect();
  }, [variant]);
  return React.createElement(SharedNavigation, { ref: navigation, variant, style: { width: '100%' } });
}

// Render the Home layout's footer without mounting another header or scroller.
export function StudioFooter() {
  const getVariant = () => window.innerWidth < 768 ? 'Phone' : window.innerWidth < 1200 ? 'Tablet' : 'Desktop';
  const [variant, setVariant] = React.useState(getVariant);
  React.useEffect(() => {
    const update = () => setVariant(getVariant());
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return React.createElement('div', { className: 'studio-shared-footer', style: { background: '#fcfcfa' } },
    React.createElement(SharedSiteLayout, { footerOnly: true, variant, style: { display: 'contents' } }));
}
