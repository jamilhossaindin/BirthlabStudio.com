// Keep the viewport-correct navigation visible until the React navigation settles.
(() => {
  let mounted = false;
  let menuOpen = false;
  let checking = false;
  const header = () => document.querySelector('.birthlab-initial-header');
  function labelMenu(element, expanded) {
    const toggle = element?.querySelector('.framer-cz9Ch');
    if (!toggle) return;
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
    toggle.setAttribute('aria-expanded', String(expanded));
  }
  function toggleMenu(event) {
    const initial = header();
    if (!initial || !event.target.closest('.birthlab-initial-header .framer-cz9Ch')) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    menuOpen = !menuOpen;
    const template = initial.querySelector(menuOpen ? '[data-startup-phone-open]' : '[data-startup-phone-closed]');
    initial.querySelector('[data-startup-variant="phone"]').replaceChildren(template.content.cloneNode(true));
    labelMenu(initial.querySelector('[data-startup-variant="phone"]'), menuOpen);
  }
  document.addEventListener('click', toggleMenu);
  document.addEventListener('keydown', toggleMenu);
  document.addEventListener('DOMContentLoaded', () => labelMenu(header()?.querySelector('[data-startup-variant="phone"]'), false), { once: true });

  function visibleOpacity(element) {
    while (element && element.id !== 'main') {
      if (Number(getComputedStyle(element).opacity) < 0.99) return false;
      element = element.parentElement;
    }
    return true;
  }
  function handoff() {
    const initial = header();
    if (!initial) return;
    const nav = document.querySelector('#main nav.framer-kxv43');
    const name = nav?.dataset.framerName || '';
    const correctVariant = innerWidth < 768 ? name.includes('Phone Closed') : innerWidth < 1200 ? name.includes('Tablet') : name.includes('Desktop');
    const logo = nav?.querySelector('.framer-1vba1q7-container');
    const toggle = nav?.querySelector('.framer-cz9Ch');
    if (mounted && correctVariant && logo && visibleOpacity(logo) && (!toggle || visibleOpacity(toggle)) && !(menuOpen && innerWidth < 768)) {
      document.documentElement.dataset.birthlabReady = '';
      initial.remove();
      document.removeEventListener('click', toggleMenu);
      document.removeEventListener('keydown', toggleMenu);
      return;
    }
    requestAnimationFrame(handoff);
  }
  document.addEventListener('birthlab:mounted', () => {
    mounted = true;
    if (!header()) {
      document.documentElement.dataset.birthlabReady = '';
      document.removeEventListener('click', toggleMenu);
      document.removeEventListener('keydown', toggleMenu);
      return;
    }
    if (!checking) { checking = true; requestAnimationFrame(handoff); }
  });
})();
