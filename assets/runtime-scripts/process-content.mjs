import { studioPage, studioIntro } from './services-content.mjs';

export const processStages = [
  ['CONVERSATION & DISCOVERY', 'Start with a conversation.', 'Tell us what you’re building, where you are now and what needs to change. We ask questions, explore the context and turn an open conversation into a clear shared brief.', 'A shared brief, project scope and priorities.'],
  ['STRATEGY & CREATIVE DIRECTION', 'Find the right direction.', 'We connect what we’ve learned with visual possibilities. References, ideas and early explorations help us agree on a direction before we get deep into making.', 'An agreed creative direction and a clear rationale.'],
  ['DESIGN & CREATION', 'Give the idea form.', 'This is where the direction becomes something tangible. We develop the identity, interface, imagery or experience, sharing the work with enough context to make thoughtful decisions together.', 'Design concepts, prototypes or first working versions.'],
  ['FEEDBACK & REFINEMENT', 'Make every detail count.', 'We gather your feedback, test the work against the brief and refine what matters. Clear review points keep the conversation focused while leaving room for the idea to get better.', 'A refined solution, ready for final approval.'],
  ['DELIVERY & HANDOVER', 'Get it out into the world.', 'We prepare the final assets, build or production files for their intended use. A considered handover gives your team the files, guidance and understanding to put the work into action.', 'Final files, practical guidelines and a handover.'],
  ['ONGOING SUPPORT', 'Keep the story moving.', 'A launch is a new starting point. When you need new assets, updates or another phase, we can define the next brief together and build on the system we’ve created.', 'A clear next step for updates, extensions or new work.'],
];

export const collaborationPrinciples = [
  ['One shared brief.', 'We agree on the problem, priorities and deliverables so every decision has a point of reference.'],
  ['Open conversations.', 'We explain our thinking and invite focused feedback, making space for your knowledge of the business.'],
  ['A considered handover.', 'We think beyond the presentation, preparing work that your team can use and build on.'],
];

export const briefQuestions = [
  'What are you hoping to change?',
  'Who are we creating for?',
  'What do you already have?',
];

function processMain(h, { Intro } = {}) {
  const intro = props => Intro ? h(Intro, props) : studioIntro(h, props);
  const art = (name, props = {}) => h('img', { src: `/assets/brand-originals/${name}.svg`, alt: '', 'aria-hidden': 'true', ...props });
  return [
    h('section', { className: 'services-introduction', 'aria-labelledby': 'process-title', key: 'introduction' },
      h('div', { className: 'services-identifiers' }, h('span', null, 'BIRTHLAB STUDIO'), h('span', null, 'OUR PROCESS'), h('span', null, 'FORM & FUNCTION')),
      intro({ titleId: 'process-title', title: 'Our process.', description: 'Good work starts with a shared understanding. Great work takes ', ending: 'shape together.' })),
    h('section', { className: 'process-overview', 'aria-labelledby': 'process-overview-title', key: 'overview' },
      h('p', { className: 'services-section-label' }, 'From the first hello:'),
      h('div', null, h('h2', { id: 'process-overview-title' }, 'A clear path. Room to explore.'), h('p', null, 'Every brief is different, but the principles stay the same: listen closely, give ideas space and bring you into the decisions that shape the work.'))),
    h('section', { className: 'process-workflow', 'aria-label': 'Our six-stage workflow', key: 'workflow' },
      h('ol', { className: 'process-stages' }, ...processStages.map(([category, title, description, outcome], index) => h('li', { className: 'process-stage', key: title, 'aria-labelledby': `process-stage-${index + 1}` },
        h('span', { className: 'process-stage-number', 'aria-hidden': 'true' }, String(index + 1).padStart(2, '0')),
        h('div', { className: 'process-stage-heading' }, h('p', { className: 'process-category' }, category), h('h2', { id: `process-stage-${index + 1}` }, title)),
        h('div', { className: 'process-stage-explanation' }, h('p', { className: 'process-stage-description' }, description), h('div', { className: 'process-stage-outcome' }, h('h3', null, 'WHAT WE LEAVE WITH'), h('p', null, outcome))))))),
    h('section', { className: 'process-principles', 'aria-labelledby': 'process-principles-title', key: 'principles' },
      h('div', { className: 'process-principles-heading' }, h('h2', { id: 'process-principles-title' }, 'Collaboration, not guesswork.'), h('span', { className: 'process-principles-mark', 'aria-hidden': 'true' })),
      h('div', { className: 'process-principles-grid' }, ...collaborationPrinciples.map(([title, description]) => h('div', { key: title }, h('h3', null, title), h('p', null, description))))),
    h('section', { className: 'process-brief', 'aria-labelledby': 'process-brief-title', key: 'brief' },
      h('p', { className: 'services-section-label' }, 'A helpful starting point:'),
      h('div', { className: 'process-brief-copy' }, h('h2', { id: 'process-brief-title' }, 'Bring your ambition. We’ll help shape the brief.'), h('p', null, 'You don’t need to have every answer. A little context about your business, the challenge and the kind of support you need is enough to start a useful conversation.'),
        h('ul', { className: 'process-questions' }, ...briefQuestions.map(question => h('li', { key: question }, question))))),
    h('section', { className: 'services-collaborate', 'aria-labelledby': 'process-collaborate-title', key: 'collaborate' },
      h('p', { className: 'services-section-label' }, 'Let’s make it happen.'),
      h('div', { className: 'services-collaborate-copy' }, h('h2', { id: 'process-collaborate-title' }, 'Let’s start a conversation.'), h('p', null, 'Let’s bring your vision to life.'),
        h('a', { href: '#start-a-project', 'data-enquiry-trigger': '', role: 'button', 'aria-haspopup': 'dialog', 'aria-controls': 'birthlab-enquiry', className: 'services-action services-collaborate-action' }, 'Let’s collaborate', art('arrow-up-right-light', { className: 'services-link-arrow' })))),
  ];
}

export function processContent(h, options = {}) {
  return studioPage(h, { ...options, pageClass: 'process-page', mainId: 'process-main', renderMain: processMain });
}
