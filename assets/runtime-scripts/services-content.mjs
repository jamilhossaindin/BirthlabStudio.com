// One content tree is used by the React page and its static HTML document.
export const serviceCatalogue = [
  ['Brand identity design', 'Build a distinctive identity with a clear idea at its heart. We shape the visual language that makes your brand recognisable, wherever it appears.', 'Logo systems / Typography / Colour palettes / Brand guidelines'],
  ['Digital product design', 'Turn complex needs into intuitive digital experiences. From the first user journey to the final interface, every interaction has a purpose.', 'User journeys / Wireframes / UI systems / Interactive prototypes'],
  ['Web development', 'Bring your digital presence to life with a responsive website. We translate design into a considered experience that works across screens.', 'Responsive websites / Front-end development / CMS setup / Launch handover'],
  ['Graphic design', 'Make every touchpoint feel like part of the same story. Clear, expressive design gives your message a consistent presence in print and on screen.', 'Campaign assets / Editorial layouts / Packaging / Social templates'],
  ['Motion design', 'Give your brand movement, rhythm and personality. We use animation to explain ideas, guide attention and make static identities feel alive.', 'Animated identities / Explainer sequences / UI motion / Social animations'],
  ['Illustration', 'Make an idea unmistakably your own. Bespoke illustration adds character and creates a visual world that stock imagery cannot.', 'Editorial illustration / Icon sets / Brand characters / Campaign artwork'],
  ['Video production', 'Tell your story through moving images. We connect concept, imagery and sound to create films that communicate with clarity and feeling.', 'Concepts & storyboards / Brand films / Editing / Sound & colour finishing'],
  ['3D design and visualization', 'Explore a different dimension of your brand. We create crafted objects, spaces and visual worlds that bring abstract ideas into focus.', '3D modelling / Product renders / Environment visuals / 3D animation'],
];

export const featuredWork = [
  ['ridekind', 'Ridekind', 'Identity meets digital expression'],
  ['threadwell', 'Threadwell', 'Digital experiences, brought to life'],
  ['roam-atlas', 'Roam Atlas', 'New worlds through visual storytelling'],
];

// Static documents and animated pages use the same hero markup and content.
export function studioIntro(h, { titleId, title, description, ending }, { Hero = 'div', Arrow = 'img', Text = 'div', Mark = 'img' } = {}) {
  const registration = (position) => h('div', { className: `services-registration services-registration-${position}`, 'aria-hidden': 'true' },
    ...['left', 'right'].map(side => h(Mark, { key: side, src: '/assets/brand-originals/registration.svg', alt: '', 'aria-hidden': 'true', 'data-intro-corner': `${position}-${side}` })));
  return h(Hero, { className: 'services-hero' },
    h('div', { className: 'services-hero-graphic' }, h(Arrow, { src: '/assets/brand-originals/hero-arrow.svg', alt: '', 'aria-hidden': 'true' })),
    h('div', { className: 'services-hero-copy' },
      registration('top'),
      h(Text, { className: 'services-hero-text' }, h('h1', { id: titleId }, title), h('p', null, description, h('span', { className: 'services-hero-ending' }, ending))),
      registration('bottom')));
}

export function studioPage(h, { Navigation, Footer, SmoothScroll, Intro, renderMain, pageClass = "", mainId = "services-main" } = {}) {
  const intro = props => Intro ? h(Intro, props) : studioIntro(h, props);
  const art = (name, props = {}) => h('img', { src: `/assets/brand-originals/${name}.svg`, alt: '', 'aria-hidden': 'true', ...props });
  const arrow = (light = false) => art(light ? 'arrow-up-right-light' : 'arrow-up-right', { className: 'services-link-arrow' });
  const link = (label, href, className = '', light = false) => h('a', { href, className, ...(href === '#start-a-project' ? { 'data-enquiry-trigger': '', role: 'button', 'aria-haspopup': 'dialog', 'aria-controls': 'birthlab-enquiry' } : {}) }, label, arrow(light));
  const processAction = (className) => link('Our process', '/process/', className);
  const navFallback = () => h('nav', { className: 'services-static-nav', 'aria-label': 'Main navigation' },
    h('a', { href: '/', 'aria-label': 'BirthLab Studio home' }, art('symbol', { width: 30, height: 36 })),
    h('div', null, h('a', { href: '/work/' }, 'Work'), h('a', { href: '/about/' }, 'About'), h('a', { href: '/contact/', className: 'services-static-contact' }, 'Contact')));
  return h('div', { className: 'studio-page-layout' },
    h('div', { key: 'studio-content', className: `services-page${pageClass ? ` ${pageClass}` : ''}` },
    SmoothScroll ? h(SmoothScroll, { intensity: 10 }) : null,
    h('header', { className: 'services-header' }, Navigation ? h(Navigation) : navFallback()),
    h('main', { className: 'services-main', id: mainId }, ...(renderMain ? renderMain(h, { Intro }) : [
      h('section', { className: 'services-introduction', 'aria-labelledby': 'services-title' },
        h('div', { className: 'services-identifiers' }, h('span', null, 'BIRTHLAB STUDIO'), h('span', null, 'OUR SERVICES'), h('span', null, 'FORM & FUNCTION')),
        intro({ titleId: 'services-title', title: 'Our services.', description: 'Bold brands. Thoughtful experiences. Ideas brought to life across ', ending: 'every dimension.' })),
      h('section', { className: 'services-work', 'aria-labelledby': 'services-work-title' },
        h('div', { className: 'services-work-heading' }, h('h2', { id: 'services-work-title' }, 'Brand / Web / Creative'), h('p', null, 'DIFFERENT DISCIPLINES. ONE CONNECTED VISION.')),
        h('div', { className: 'services-work-grid' }, ...featuredWork.map(([slug, name, caption]) => h('figure', { key: slug },
          h('a', { href: `/${slug}/`, 'aria-label': `Explore ${name}` }, h('img', { src: `/assets/work-highlights/${slug}-preview.jpg`, alt: `${name} — BirthLab Studio concept artwork`, width: 580, height: 380, decoding: 'async' })), h('figcaption', null, caption))))),
      h('section', { className: 'services-overview', 'aria-labelledby': 'services-overview-title' },
        h('p', { className: 'services-section-label' }, 'What we do:'),
        h('div', null, h('h2', { id: 'services-overview-title' }, 'From a single touchpoint to a whole new world for your brand.'), h('p', null, 'Choose a focused service or connect disciplines around one brief. We shape the right mix around what your project needs.'))),
      h('section', { className: 'services-catalogue', 'aria-label': 'Our eight services' }, ...serviceCatalogue.map(([title, description, deliverables], index) => h('article', { className: 'services-panel', key: title, 'aria-labelledby': `service-${index + 1}` },
        h('div', { className: 'services-panel-heading' }, h('span', { className: 'services-number' }, String(index + 1).padStart(2, '0')), h('h2', { id: `service-${index + 1}` }, title), arrow()),
        h('p', { className: 'services-description' }, description),
        h('div', { className: 'services-deliverables' }, h('h3', null, 'WHAT WE CAN MAKE'), h('p', null, deliverables))))),
      h('section', { className: 'services-process', 'aria-label': 'Our process' }, h('p', null, 'Curious how an idea becomes a finished experience?'), processAction('services-action services-process-action')),
      h('section', { className: 'services-collaborate', 'aria-labelledby': 'services-collaborate-title' },
        h('p', { className: 'services-section-label' }, 'Let’s make it happen.'),
        h('div', { className: 'services-collaborate-copy' }, h('h2', { id: 'services-collaborate-title' }, 'Have something in mind?'), h('p', null, 'Let’s bring your vision to life.'), link('Let’s collaborate', '#start-a-project', 'services-action services-collaborate-action', true)))]))),
    Footer ? h(Footer, { key: 'shared-footer' }) : h('studio-footer', { key: 'shared-footer' }));
}

export function servicesContent(h, options = {}) {
  return studioPage(h, options);
}
