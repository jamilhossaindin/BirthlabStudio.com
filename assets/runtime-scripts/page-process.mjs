import { F as initializeEnvironment, S as initializeReact, y as React } from './react-core.mjs';
import { SharedSmoothScroll } from './main-entrypoint.mjs';
import { StudioNavigation, StudioFooter, ensureStudioStyles, ensureStyles, useStudioActionMotion } from './component-studio-shell.mjs';
import { processContent } from './process-content.mjs';
import { StudioIntro } from './component-studio-intro.mjs';

initializeEnvironment();
initializeReact();
await ensureStudioStyles();
await ensureStyles('/assets/runtime-scripts/page-process.css', 'processStyles');

export default function ProcessPage() {
  useStudioActionMotion();
  React.useEffect(() => {
    document.title = 'Our Process — BirthLab Studio';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'How BirthLab Studio turns a shared brief into thoughtful design, from discovery and creative direction to delivery and ongoing support.';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://birthlabstudio.com/process';
  }, []);
  return processContent(React.createElement, { Navigation: StudioNavigation, Footer: StudioFooter, SmoothScroll: SharedSmoothScroll, Intro: StudioIntro });
}

export const queryParamNames = [];
