import { y as React } from './react-core.mjs';
import { Q as useCurrentRoute } from './framer-runtime.mjs';

let revealKey = 0;
const subscribers = new Set();
let pendingReset;
const snapshot = () => revealKey;
const serverSnapshot = () => 0;

function resetReveal() {
  pendingReset?.disconnect();
  pendingReset = undefined;
  revealKey++;
  subscribers.forEach(notify => notify());
}

function handleLogoClick(event) {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  if (!event.target.closest?.('nav a.framer-VEalv, nav a[data-framer-name="Logo"]')) return;
  pendingReset?.disconnect();
  pendingReset = undefined;
  const icon = [...document.querySelectorAll('a.framer-C2ij3')].find(element => element.getBoundingClientRect().width > 0);
  const bounds = icon?.getBoundingClientRect();
  if (!bounds || bounds.bottom <= 0 || bounds.top >= window.innerHeight) {
    resetReveal();
    return;
  }

  // The shared footer survives client navigation. Wait until it leaves the
  // viewport on the way home before resetting its existing entrance animation.
  pendingReset = new IntersectionObserver(entries => {
    if (entries.some(entry => !entry.isIntersecting)) resetReveal();
  });
  pendingReset.observe(icon);
}

function subscribe(notify) {
  if (subscribers.size === 0) document.addEventListener('click', handleLogoClick, true);
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
    if (subscribers.size === 0) {
      document.removeEventListener('click', handleLogoClick, true);
      pendingReset?.disconnect();
      pendingReset = undefined;
    }
  };
}

export function useFooterRevealKey() {
  const route = useCurrentRoute();
  const resetKey = React.useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  // The shared footer persists between pages, so its animation must also be
  // keyed by Framer's active route, including dynamic case-study parameters.
  const pageKey = route ? `${route.id}:${JSON.stringify(route.pathVariables || {})}` : window.location.pathname;
  return `${pageKey}:${resetKey}`;
}
