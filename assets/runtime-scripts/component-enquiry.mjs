import {
  F as initializeEnvironment,
  S as initializeReact,
  n as initializeReactDOM,
  y as React,
  r as createRoot,
} from './react-core.mjs';
import { S as motion, t as initializeMotion } from './framer-motion.mjs';
import { submitEnquiry } from './enquiry-integration.mjs';
import { enquiryServices as services } from './enquiry-services.mjs';

const triggerSelector = '[data-enquiry-trigger], a[href$="#start-a-project"], a[href*="/collaborate"]';
const emptyDraft = () => ({ name: '', email: '', phone: '', service: '' });

export function installEnquiry() {
  if (document.getElementById('birthlab-enquiry-root')) return;
  initializeEnvironment();
  initializeReact();
  initializeReactDOM();
  initializeMotion();
  const host = document.createElement('div');
  host.id = 'birthlab-enquiry-root';
  document.body.append(host);
  createRoot(host).render(React.createElement(EnquiryModal));
}

function EnquiryModal() {
  const h = React.createElement;
  const supportsHover = useMediaQuery('(hover: hover)');
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const dialog = React.useRef(null);
  const form = React.useRef(null);
  const selector = React.useRef(null);
  const menu = React.useRef(null);
  const serviceOptions = React.useRef(null);
  const openingTrigger = React.useRef(null);
  const restoreScroll = React.useRef(null);
  const submitting = React.useRef(false);
  const search = React.useRef({ text: '', time: 0 });
  // This root survives client-side navigation; personal details stay in memory.
  const [values, setValues] = React.useState(emptyDraft);
  const [errors, setErrors] = React.useState({});
  const [expanded, setExpanded] = React.useState(false);
  const [activeOption, setActiveOption] = React.useState(-1);
  const [status, setStatus] = React.useState('idle');
  const [menuPosition, setMenuPosition] = React.useState({});

  function close() {
    setExpanded(false);
    if (dialog.current.open) dialog.current.close();
    releasePage();
  }

  function releasePage() {
    if (!restoreScroll.current && !openingTrigger.current) return;
    restoreScroll.current?.();
    restoreScroll.current = null;
    const trigger = openingTrigger.current;
    openingTrigger.current = null;
    const target = trigger?.isConnected ? trigger : document.querySelector('[data-enquiry-trigger], a[href$="#start-a-project"]');
    target?.focus({ preventScroll: true });
  }

  React.useEffect(() => {
    function open(trigger) {
      if (dialog.current.open) return;
      openingTrigger.current = trigger;
      restoreScroll.current = lockPageScroll();
      dialog.current.showModal();
      form.current.scrollTop = 0;
      dialog.current.querySelector('.bl-enquiry__panel').scrollTop = 0;
      form.current.elements.namedItem('name').focus({ preventScroll: true });
      requestAnimationFrame(revealActiveControl);
    }

    function handleTrigger(event) {
      const trigger = event.target.closest?.(triggerSelector);
      if (!trigger) return;
      if (!trigger.hasAttribute('data-enquiry-trigger')) {
        const target = new URL(trigger.href, location.href);
        if (target.origin !== location.origin || (target.hash !== '#start-a-project' && !/^\/collaborate(?:\/(?:index(?:\.html)?)?)?$/.test(target.pathname))) return;
      }
      if (event.type === 'keydown' && event.key !== ' ') return;
      if (event.type === 'click' && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      open(trigger);
    }

    function consumeOpenRequest() {
      const url = new URL(location.href);
      if (!/^\/contact(?:\/(?:index(?:\.html)?)?)?$/.test(url.pathname) || url.searchParams.get('enquiry') !== 'start-a-project') return;
      url.searchParams.delete('enquiry');
      history.replaceState(history.state, '', url.pathname + url.search + url.hash);
      open(document.querySelector('[data-enquiry-trigger], a[href$="#start-a-project"]'));
    }

    document.addEventListener('click', handleTrigger, true);
    document.addEventListener('keydown', handleTrigger, true);
    window.addEventListener('popstate', consumeOpenRequest);
    consumeOpenRequest();
    return () => {
      document.removeEventListener('click', handleTrigger, true);
      document.removeEventListener('keydown', handleTrigger, true);
      window.removeEventListener('popstate', consumeOpenRequest);
      restoreScroll.current?.();
    };
  }, []);

  function updateField(name, value) {
    if (submitting.current) return;
    setValues(previous => ({ ...previous, [name]: value }));
    setErrors(previous => ({ ...previous, [name]: undefined }));
    if (status !== 'pending') setStatus('idle');
  }

  function openOptions(index = services.indexOf(values.service)) {
    if (submitting.current) return;
    positionMenu();
    const nextOption = index < 0 ? 0 : index;
    setActiveOption(nextOption);
    setExpanded(true);
    if (expanded) revealOption(nextOption);
    search.current = { text: '', time: 0 };
  }

  function chooseOption(index) {
    if (submitting.current || index < 0 || index >= services.length) return;
    updateField('service', services[index]);
    setExpanded(false);
    selector.current.focus({ preventScroll: true });
  }

  function handleServiceKey(event) {
    if (submitting.current) return;
    const key = event.key;
    if (key === 'Escape' && expanded) {
      event.preventDefault();
      event.stopPropagation();
      setExpanded(false);
    } else if (key === 'Tab') {
      setExpanded(false);
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      if (!expanded) openOptions(values.service ? services.indexOf(values.service) : key === 'ArrowUp' ? services.length - 1 : 0);
      else setActiveOption(index => (index + (key === 'ArrowDown' ? 1 : -1) + services.length) % services.length);
    } else if (key === 'Home' || key === 'End') {
      event.preventDefault();
      openOptions(key === 'Home' ? 0 : services.length - 1);
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (expanded) chooseOption(activeOption);
      else openOptions();
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const text = (now - search.current.time < 700 ? search.current.text : '') + key.toLowerCase();
      search.current = { text, time: now };
      const index = services.findIndex(service => service.toLowerCase().startsWith(text));
      if (index >= 0) {
        positionMenu();
        setActiveOption(index);
        setExpanded(true);
        if (expanded) revealOption(index);
      }
    }
  }

  // Scroll only the options viewport; keep the modal and its fields stationary.
  function revealOption(index) {
    const viewport = serviceOptions.current;
    const option = document.getElementById(`bl-enquiry-service-${index}`);
    if (!viewport || !option) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < viewport.scrollTop) viewport.scrollTop = top;
    else if (bottom > viewport.scrollTop + viewport.clientHeight) viewport.scrollTop = bottom - viewport.clientHeight;
  }

  React.useLayoutEffect(() => {
    if (expanded && activeOption >= 0) revealOption(activeOption);
  }, [expanded, activeOption]);

  // The menu is a dialog child rather than a child of the scrolling form.
  // Fixed coordinates keep it anchored without clipping or changing card size.
  function positionMenu() {
    const control = selector.current?.getBoundingClientRect();
    if (!control) return;
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop || 0;
    const bottom = top + (viewport?.height || window.innerHeight);
    const above = control.top - 184;
    const below = control.bottom + 8;
    const next = {
      left: control.left, width: control.width,
      top: above >= top + 8 ? above : below + 176 <= bottom - 8 ? below : Math.max(top + 8, Math.min(above, bottom - 184)),
    };
    setMenuPosition(previous => previous.left === next.left && previous.top === next.top && previous.width === next.width ? previous : next);
  }

  function scrollArea() {
    return dialog.current.dataset.shortViewport === 'true' ? dialog.current.querySelector('.bl-enquiry__panel') : form.current;
  }

  function revealActiveControl() {
    if (!dialog.current.open || !form.current.contains(document.activeElement)) return;
    const input = document.activeElement.getBoundingClientRect();
    const viewport = scrollArea();
    const area = viewport.getBoundingClientRect();
    if (input.bottom > area.bottom - 8) viewport.scrollTop += input.bottom - area.bottom + 8;
    else if (input.top < area.top + 8) viewport.scrollTop -= area.top - input.top + 8;
  }

  React.useEffect(() => {
    const viewport = window.visualViewport;
    let focusFrame;
    function syncViewport() {
      const node = dialog.current;
      node.style.setProperty('--bl-viewport-height', `${viewport?.height || window.innerHeight}px`);
      node.style.setProperty('--bl-viewport-top', `${viewport?.offsetTop || 0}px`);
      node.dataset.shortViewport = String((viewport?.height || window.innerHeight) < 480);
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(revealActiveControl);
    }
    syncViewport();
    window.addEventListener('resize', syncViewport);
    viewport?.addEventListener('resize', syncViewport);
    viewport?.addEventListener('scroll', syncViewport);
    return () => {
      cancelAnimationFrame(focusFrame);
      window.removeEventListener('resize', syncViewport);
      viewport?.removeEventListener('resize', syncViewport);
      viewport?.removeEventListener('scroll', syncViewport);
    };
  }, []);

  React.useEffect(() => {
    if (!expanded) return;
    const service = selector.current.parentElement;
    function dismissOutside(event) {
      if (!service.contains(event.target) && !menu.current.contains(event.target)) setExpanded(false);
    }
    function reposition(event) {
      if (event.target === serviceOptions.current) return;
      const control = selector.current.getBoundingClientRect();
      const area = scrollArea().getBoundingClientRect();
      if (control.bottom <= area.top || control.top >= area.bottom) setExpanded(false);
      else positionMenu();
    }
    document.addEventListener('pointerdown', dismissOutside, true);
    document.addEventListener('focusin', dismissOutside, true);
    dialog.current.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', positionMenu);
    window.visualViewport?.addEventListener('resize', positionMenu);
    window.visualViewport?.addEventListener('scroll', positionMenu);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside, true);
      document.removeEventListener('focusin', dismissOutside, true);
      dialog.current?.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', positionMenu);
      window.visualViewport?.removeEventListener('resize', positionMenu);
      window.visualViewport?.removeEventListener('scroll', positionMenu);
    };
  }, [expanded]);

  React.useLayoutEffect(() => {
    if (status === 'idle' || !dialog.current.open) return;
    const message = form.current.querySelector('.bl-enquiry__status');
    if (!message) return;
    const bottom = message.getBoundingClientRect().bottom;
    const viewport = scrollArea();
    const viewportBottom = viewport.getBoundingClientRect().bottom;
    if (bottom > viewportBottom) viewport.scrollTop += bottom - viewportBottom;
  }, [status]);

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled), input:not([type="hidden"]):not(:disabled), a[href]')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting.current) return;
    setExpanded(false);
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Please enter your full name.';
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address.';
    else if (form.current.elements.namedItem('email').validity.typeMismatch) nextErrors.email = 'Please enter a valid email address.';
    if (!services.includes(values.service)) nextErrors.service = 'Please select a service.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus('idle');
      const firstError = Object.keys(nextErrors)[0];
      (firstError === 'service' ? selector.current : form.current.elements.namedItem(firstError)).focus();
      return;
    }
    if (typeof submitEnquiry !== 'function') {
      setStatus('unconfigured');
      return;
    }
    submitting.current = true;
    setStatus('pending');
    try {
      const result = await submitEnquiry({ ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim() });
      if (result?.ok !== true) throw new Error('Delivery was not confirmed');
      setValues(emptyDraft());
      setErrors({});
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      submitting.current = false;
    }
  }

  function field(name, label, placeholder, type, autoComplete, required = false) {
    return h('div', { className: 'bl-enquiry__field' },
      h('label', { className: 'bl-enquiry__label', htmlFor: `bl-enquiry-${name}` }, label),
      h('div', {
        className: 'bl-enquiry__control',
        'data-error': errors[name] ? 'true' : undefined,
        'data-filled': values[name] ? 'true' : undefined,
      },
        h('input', {
          id: `bl-enquiry-${name}`, className: 'bl-enquiry__input', name, type, autoComplete, required,
          placeholder: errors[name] || placeholder,
          value: values[name], readOnly: status === 'pending',
          'aria-invalid': errors[name] ? 'true' : undefined,
          'aria-describedby': errors[name] ? `bl-enquiry-${name}-error` : undefined,
          onChange: event => updateField(name, event.target.value),
        }),
        errors[name] && h('span', {
          id: `bl-enquiry-${name}-error`, className: 'bl-enquiry__field-message bl-enquiry__input-message', role: 'alert',
        }, errors[name]),
      ),
    );
  }

  const statusMessages = {
    pending: 'Sending your enquiry…',
    success: 'Thank you. Your enquiry has been sent.',
    error: 'We couldn’t send your enquiry. Please try again or email ',
    unconfigured: 'Enquiry delivery isn’t connected yet. Please email ',
  };

  return h('dialog', {
    id: 'birthlab-enquiry', className: 'bl-enquiry', ref: dialog,
    'aria-labelledby': 'bl-enquiry-title', 'aria-describedby': 'bl-enquiry-description', 'aria-modal': 'true',
    'data-lenis-prevent': '',
    onClose: () => { if (!dialog.current.open) { setExpanded(false); releasePage(); } },
    onCancel: event => { event.preventDefault(); if (expanded) setExpanded(false); else close(); },
    onKeyDown: event => {
      if (event.key === 'Escape') {
        event.preventDefault(); event.stopPropagation();
        if (expanded) setExpanded(false); else close();
      } else trapFocus(event);
    },
    onClick: event => {
      if (event.target === dialog.current && dialog.current.dataset.backdropPointer === 'true') close();
    },
    onPointerDown: event => { dialog.current.dataset.backdropPointer = String(event.target === dialog.current); },
  }, h('div', { className: 'bl-enquiry__panel' },
    h('div', { className: 'bl-enquiry__intro' },
      h('div', { className: 'bl-enquiry__title-row' },
        h('h2', { id: 'bl-enquiry-title', className: 'bl-enquiry__title' }, 'Start a Project'),
        h('button', { type: 'button', className: 'bl-enquiry__close', 'aria-label': 'Close enquiry form', onClick: close },
          h('svg', { viewBox: '0 0 22 22', fill: 'none', 'aria-hidden': 'true' },
            h('path', { d: 'M5.5 5.5 16.5 16.5M16.5 5.5 5.5 16.5', stroke: 'currentColor', strokeWidth: 1.5 }),
          ),
        ),
      ),
      h('p', { id: 'bl-enquiry-description', className: 'bl-enquiry__description' }, 'Have something in mind? Let’s bring your vision to life.'),
    ),
    h('form', { ref: form, className: 'bl-enquiry__form', noValidate: true, onSubmit: handleSubmit, 'aria-busy': status === 'pending' },
      h('div', { className: 'bl-enquiry__fields' },
        field('name', 'Name', 'Your full name', 'text', 'name', true),
        h('div', { className: 'bl-enquiry__pair' },
          field('email', 'Email', 'you@company.com', 'email', 'email', true),
          field('phone', 'Phone number', '+1 555 000 0000', 'tel', 'tel'),
        ),
        h('div', { className: 'bl-enquiry__field' },
          h('label', { id: 'bl-enquiry-service-label', className: 'bl-enquiry__label', htmlFor: 'bl-enquiry-service' }, 'Service you’re interested in'),
          h('div', { className: 'bl-enquiry__service', onKeyDown: handleServiceKey },
            h('button', {
              type: 'button', id: 'bl-enquiry-service', className: 'bl-enquiry__select', ref: selector,
              role: 'combobox', 'aria-haspopup': 'listbox', 'aria-controls': 'bl-enquiry-services',
              'aria-labelledby': 'bl-enquiry-service-label', 'aria-expanded': expanded, 'aria-required': 'true',
              'aria-activedescendant': expanded && activeOption >= 0 ? `bl-enquiry-service-${activeOption}` : undefined,
              'aria-invalid': errors.service ? 'true' : undefined,
              'aria-describedby': errors.service ? 'bl-enquiry-service-error' : undefined,
              disabled: status === 'pending',
              onClick: () => expanded ? setExpanded(false) : openOptions(),
            },
            h('span', {
              id: errors.service ? 'bl-enquiry-service-error' : undefined,
              className: errors.service ? 'bl-enquiry__field-message' : values.service ? undefined : 'bl-enquiry__placeholder',
              role: errors.service ? 'alert' : undefined,
            }, errors.service || values.service || 'Select a service'),
            h('svg', { className: 'bl-enquiry__chevron', viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' },
              h('path', { d: 'm5 7.5 5 5 5-5', stroke: 'currentColor', strokeWidth: 1.5 }),
            )),
          ),
        ),
      ),
      h(motion.button, {
        type: 'submit', className: 'bl-enquiry__submit', disabled: status === 'pending',
        initial: 'rest', animate: 'rest', whileHover: 'active', whileFocus: 'active',
        whileInView: supportsHover ? undefined : 'active', viewport: { amount: .6 },
      },
        h('span', null, status === 'pending' ? 'Sending enquiry…' : 'Send enquiry'),
        h(motion.svg, {
          viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true',
          variants: { rest: { rotate: reducedMotion ? 45 : 0 }, active: { rotate: reducedMotion ? 45 : 405 } },
          transition: reducedMotion ? { duration: 0 } : { type: 'spring', bounce: .2, delay: 0, duration: .4 },
          style: { transformOrigin: '50% 50%' },
        },
          h('path', { d: 'M7 17 17 7M7 7h10v10', stroke: 'currentColor', strokeWidth: 1.5 }),
        ),
      ),
      status !== 'idle' && h('p', { className: 'bl-enquiry__status', role: status === 'error' ? 'alert' : 'status', 'aria-live': 'polite' },
        statusMessages[status],
        (status === 'unconfigured' || status === 'error') && h('a', { href: 'mailto:hello@birthlabstudio.com' }, 'hello@birthlabstudio.com'),
        (status === 'unconfigured' || status === 'error') && '. Your details are still here.',
      ),
    ),
  ), h('div', { id: 'bl-enquiry-services', className: 'bl-enquiry__menu', ref: menu, style: menuPosition, role: 'listbox', 'aria-labelledby': 'bl-enquiry-service-label', hidden: !expanded },
    h('div', { className: 'bl-enquiry__options', ref: serviceOptions, tabIndex: -1, 'data-lenis-prevent': '' },
      services.map((service, index) => h('div', {
        key: service, id: `bl-enquiry-service-${index}`, className: 'bl-enquiry__option', role: 'option',
        'aria-selected': service === values.service, 'data-active': expanded && index === activeOption,
        onPointerDown: event => event.preventDefault(),
        onMouseMove: () => setActiveOption(index), onClick: () => chooseOption(index),
      }, service)))));
}

function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
  React.useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

function lockPageScroll() {
  const root = document.documentElement;
  const body = document.body;
  const rootStyle = root.getAttribute('style');
  const bodyStyle = body.getAttribute('style');
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  // Reserve the page's scrollbar gutter for both normal and fixed elements.
  // Body padding alone cannot compensate the viewport-fixed navigation.
  if (window.innerWidth > root.clientWidth) root.style.scrollbarGutter = 'stable';
  root.style.overflow = 'hidden';
  Object.assign(body.style, {
    position: 'fixed', top: `-${scrollY}px`, left: `-${scrollX}px`, width: '100%',
  });
  return () => {
    if (rootStyle === null) root.removeAttribute('style'); else root.setAttribute('style', rootStyle);
    if (bodyStyle === null) body.removeAttribute('style'); else body.setAttribute('style', bodyStyle);
    window.scrollTo({ left: scrollX, top: scrollY, behavior: 'instant' });
  };
}
