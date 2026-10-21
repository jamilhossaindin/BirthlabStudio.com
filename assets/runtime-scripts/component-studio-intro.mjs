import { F as initializeEnvironment, S as initializeReact, y as React } from './react-core.mjs';
import { S as motion, t as initializeMotion } from './framer-motion.mjs';
import { B as initializeFramer, ut as withAppearEffect } from './framer-runtime.mjs';
import { studioIntro } from './services-content.mjs';

initializeEnvironment();
initializeReact();
initializeFramer();
initializeMotion();

const h = React.createElement;
const AppearImage = withAppearEffect(motion.img);
const AppearText = withAppearEffect(motion.div);
// Match Home's Introduction spring settings and 50% visibility trigger.
const spring = { type: 'spring', damping: 72, mass: 1, stiffness: 400 };
const markTransition = { type: 'spring', bounce: .2, duration: .8, delay: .4 };
const neutral = { opacity: 1, x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0 };
const MarkAnimation = React.createContext(null);

function appearProps(from, transition, once = true) {
  const enter = { ...neutral, opacity: 0, ...from };
  return {
    __framer__animate: { transition },
    __framer__animateOnce: once,
    __framer__enter: enter,
    __framer__exit: { ...enter, transition },
    __framer__styleAppearEffectEnabled: true,
    __framer__threshold: .5,
    __perspectiveFX: false,
    __targetOpacity: 1,
  };
}

function AnimatedArrow(props) {
  // Keep the panel visible throughout the slide; a parent fade hides its travel.
  return h(AppearImage, { ...props, ...appearProps({ x: -60 }, { ...spring, delay: .4 }) });
}

function AnimatedText(props) {
  return h(AppearText, { ...props, ...appearProps({ y: 30 }, { ...spring, delay: .2 }) });
}

function markMotion(corner) {
  const right = corner.endsWith('right');
  return { ...neutral, opacity: 0, x: right ? 30 : -30, rotate: right ? -50 : 50 };
}

function AnimatedMark(props) {
  const { visible, anchor } = React.useContext(MarkAnimation);
  const corner = props['data-intro-corner'];
  const from = markMotion(corner);
  return h(motion.img, {
    ...props,
    ref: corner === 'bottom-left' ? anchor : undefined,
    initial: from,
    animate: visible ? neutral : from,
    transition: markTransition,
  });
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

export function StudioIntro(props) {
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const anchor = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (reducedMotion) {
      setVisible(false);
      return;
    }
    // Observe the stationary bottom row. The animated left mark starts beyond
    // the phone's clipped edge and cannot reach the visibility threshold there.
    const element = anchor.current?.parentElement;
    if (!element) return;
    // All four marks share the bottom-left row's visibility and timing.
    const observer = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio >= .5);
    }, { threshold: [0, .5] });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);
  const animation = React.useMemo(() => ({ visible, anchor }), [visible]);
  return h(MarkAnimation.Provider, { value: animation }, studioIntro(h, props, reducedMotion ? {} : {
    Arrow: AnimatedArrow,
    Text: AnimatedText,
    Mark: AnimatedMark,
  }));
}
