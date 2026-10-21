import { F as initializeEnvironment, S as initializeReact, y as React } from './react-core.mjs';
import { SharedSmoothScroll } from './main-entrypoint.mjs';
import { StudioNavigation, StudioFooter, ensureStudioStyles, useStudioActionMotion } from './component-studio-shell.mjs';
import { servicesContent } from './services-content.mjs';
import { StudioIntro } from './component-studio-intro.mjs';

initializeEnvironment();
initializeReact();

await ensureStudioStyles();

export default function ServicesPage() {
  useStudioActionMotion();
  React.useEffect(() => {
    document.title = 'Our Services — BirthLab Studio';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'Brand identity, digital product design, web development, graphic design, motion, illustration, video and 3D by BirthLab Studio.';
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://birthlabstudio.com/services';
  }, []);
  return servicesContent(React.createElement, { Navigation: StudioNavigation, Footer: StudioFooter, SmoothScroll: SharedSmoothScroll, Intro: StudioIntro });
}

export const queryParamNames = [];
