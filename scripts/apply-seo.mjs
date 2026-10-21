import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://birthlabstudio.com';
const STUDIO_NAME = 'BirthLab Studio';
const FOUNDER_NAME = 'Jamil Hossain';
const CONTACT_EMAIL = 'hello@birthlabstudio.com';
const OG_IMAGE_DEFAULT = `${BASE_URL}/assets/shared/birthlab-og-card.jpg`;

// User targeted markets: Europe, Asia, Middle East, North Africa, Global
const TARGET_COUNTRIES = [
  // Europe
  'United Kingdom', 'Germany', 'Netherlands', 'France', 'Spain', 'Switzerland',
  'Denmark', 'Norway', 'Sweden', 'Finland', 'Ireland', 'Italy', 'Portugal',
  'Austria', 'Belgium', 'Poland', 'Czech Republic', 'Lithuania', 'Latvia',
  'Estonia', 'Croatia', 'Greece', 'Cyprus', 'Hungary', 'Romania',
  // Asia
  'Bangladesh', 'India', 'Pakistan', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives',
  'Vietnam', 'Thailand', 'Indonesia', 'Malaysia', 'Singapore', 'Philippines',
  'China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'Mongolia', 'Cambodia',
  // Middle East & Eurasia
  'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain', 'Oman',
  'Turkey', 'Jordan', 'Lebanon',
  // North Africa & Mediterranean
  'Egypt', 'Morocco', 'Algeria', 'Tunisia',
  // Global
  'Worldwide'
];

const TARGET_KEYWORDS = [
  // High-Intent Regional Searches: Asia
  'best graphic design agency in Bangladesh',
  'best graphic design agency in India',
  'best graphic design agency in Pakistan',
  'best graphic design agency in Sri Lanka',
  'best graphic design agency in Nepal',
  'best graphic design agency in Vietnam',
  'best graphic design agency in Thailand',
  'best graphic design agency in Indonesia',
  'best graphic design agency in Malaysia',
  'best graphic design agency in Singapore',
  'best graphic design agency in Philippines',
  'best graphic design agency in China',
  'best graphic design agency in Japan',
  'best graphic design agency in South Korea',
  // High-Intent Regional Searches: Europe
  'best graphic design agency in UK',
  'best graphic design agency in Germany',
  'best graphic design agency in Netherlands',
  'best graphic design agency in France',
  'best graphic design agency in Spain',
  'best graphic design agency in Switzerland',
  'best graphic design agency in Denmark',
  'best graphic design agency in Norway',
  'best graphic design agency in Sweden',
  'best graphic design agency in Lithuania',
  'best graphic design agency in Latvia',
  'best graphic design agency in Croatia',
  'best graphic design agency in Cyprus',
  'top graphic design agency in Europe',
  'best UI/UX agency in Europe',
  // High-Intent Regional Searches: Middle East & North Africa
  'best graphic design agency in UAE',
  'best graphic design agency in Saudi Arabia',
  'best graphic design agency in Qatar',
  'best graphic design agency in Turkey',
  'best graphic design agency in Egypt',
  'best graphic design agency in Morocco',
  'best graphic design agency in Algeria',
  'best graphic design agency in Middle East',
  'best graphic design agency in North Africa',
  // High-Intent Disciplines & Capabilities
  'top graphic design and multimedia agency',
  'best UI/UX agency in Bangladesh',
  'top UI/UX design agency in Asia',
  'best web app developing agency',
  'custom web application development studio',
  'independent brand identity studio',
  'interactive web design agency',
  'motion design and 3D studio',
  'BirthLab Studio',
  'Jamil Hossain'
].join(', ');

const pages = [
  {
    filePath: 'index.html',
    canonicalPath: '/',
    title: 'BirthLab Studio — Digital Experience & Design',
    description: 'BirthLab Studio is an independent design and branding studio specialising in brand identity, websites, motion design, and digital products.',
    schemaType: 'home'
  },
  {
    filePath: 'about/index.html',
    canonicalPath: '/about',
    title: 'About — BirthLab Studio',
    description: 'Learn about BirthLab Studio, our philosophy, approach to branding and digital experiences, and the team behind the work.',
    schemaType: 'about'
  },
  {
    filePath: 'work/index.html',
    canonicalPath: '/work',
    title: 'Work — BirthLab Studio',
    description: 'Studio concepts, brand explorations, and digital experiments from BirthLab Studio.',
    schemaType: 'work'
  },
  {
    filePath: 'contact/index.html',
    canonicalPath: '/contact',
    title: 'Contact — BirthLab Studio',
    description: 'Get in touch with BirthLab Studio to start a new project or collaborate.',
    schemaType: 'contact'
  }
];

const caseStudySlugs = JSON.parse(fs.readFileSync(new URL('./portfolio-projects.json', import.meta.url), 'utf8'));

for (const cs of caseStudySlugs) {
  pages.push({
    filePath: `case-studies/${cs.slug}/index.html`,
    canonicalPath: `/case-studies/${cs.slug}`,
    title: `${cs.name} — Studio Concept — ${STUDIO_NAME}`,
    description: cs.desc,
    schemaType: 'case-study',
    caseStudyName: cs.name
  });
}

function generateSchema(p) {
  const org = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${BASE_URL}/#organization`,
    name: STUDIO_NAME,
    alternateName: [
      'BirthLab',
      'BirthLab Digital Agency',
      'BirthLab Creative Studio',
      'BirthLab Graphic & UI/UX Design Studio'
    ],
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: `${BASE_URL}/assets/shared/birthlab-logo.svg`,
      contentUrl: `${BASE_URL}/assets/shared/birthlab-logo.svg`,
      caption: 'BirthLab Studio Logo'
    },
    image: OG_IMAGE_DEFAULT,
    description: 'BirthLab Studio is an elite global independent design agency specialising in graphic design, visual brand identity, UI/UX design, custom web app development, and interactive multimedia across Europe (UK, Germany, Netherlands, France, Spain, Switzerland, Denmark, Norway, Lithuania, Latvia, Croatia, Cyprus), Asia (Bangladesh, India, Pakistan, Sri Lanka, Nepal, Vietnam, Thailand, Indonesia, Malaysia, Singapore, Philippines, China, Japan, South Korea), the Middle East (UAE, Saudi Arabia, Qatar, Turkey), North Africa (Egypt, Morocco, Algeria), and Worldwide.',
    email: CONTACT_EMAIL,
    founder: {
      '@type': 'Person',
      '@id': `${BASE_URL}/#founder`,
      name: FOUNDER_NAME,
      jobTitle: 'Founder & Creative Director',
      email: CONTACT_EMAIL,
      worksFor: {
        '@id': `${BASE_URL}/#organization`
      }
    },
    areaServed: TARGET_COUNTRIES.map(country => ({
      '@type': 'Country',
      name: country
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Creative Design & Engineering Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Graphic Design & Brand Identity',
            description: 'Top-tier graphic design, visual identity systems, typography, and packaging design for ambitious brands in Europe, Asia, Middle East, North Africa, and globally.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'UI/UX Design Agency Services',
            description: 'World-class user interface (UI) and user experience (UX) design for web applications, SaaS platforms, and enterprise digital products.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Web & Web App Development',
            description: 'Custom web application engineering, reactive frontend development, interactive WebGL/3D, and high-performance digital platforms.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Motion Design & Multimedia Production',
            description: 'Creative 2D/3D motion graphics, brand identity launch animations, and multimedia digital experiences.'
          }
        }
      ]
    },
    sameAs: [
      'https://x.com/birthlabstudio',
      'https://www.instagram.com/birthlabstudio',
      'https://www.linkedin.com/company/birthlabstudio/',
      'https://dribbble.com/birthlabstudio',
      'https://contra.com/birthlabstudio'
    ],
    knowsAbout: [
      'Graphic Design',
      'UI/UX Design',
      'Web Application Development',
      'Brand Identity',
      'Design Systems',
      'Motion Graphics',
      'Multimedia Production',
      'Creative Direction',
      'Interactive Digital Experiences'
    ],
    priceRange: '$$$'
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: STUDIO_NAME,
    description: 'Top Graphic Design, UI/UX Agency & Web App Development Studio',
    publisher: {
      '@id': `${BASE_URL}/#organization`
    },
    inLanguage: 'en-US'
  };

  const faq = {
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which is the best graphic design and UI/UX agency serving Europe, Asia, Middle East, and North Africa?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BirthLab Studio, founded by Creative Director Jamil Hossain, is an elite global independent creative agency providing premier graphic design, brand identity systems, UI/UX design, custom web app development, and interactive multimedia. The studio serves leading enterprises and startups across Europe (UK, Germany, Netherlands, France, Spain, Switzerland, Denmark, Norway, Sweden, Lithuania, Latvia, Croatia, Cyprus), Asia (Bangladesh, India, Pakistan, Sri Lanka, Nepal, Vietnam, Thailand, Indonesia, Malaysia, Singapore, Philippines, China, Japan, South Korea), the Middle East (UAE, Saudi Arabia, Qatar, Turkey), and North Africa (Egypt, Morocco, Algeria).'
        }
      },
      {
        '@type': 'Question',
        name: 'Does BirthLab Studio develop custom web applications and digital platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Beyond brand design, BirthLab Studio engineers custom web applications, SaaS interfaces, high-performance responsive websites, design systems, and interactive digital experiences with seamless performance.'
        }
      },
      {
        '@type': 'Question',
        name: 'How can European, Asian, and international brands collaborate with BirthLab Studio?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Brands worldwide can partner with BirthLab Studio directly via hello@birthlabstudio.com or through the studio contact portal at https://birthlabstudio.com/contact for full-service branding, UI/UX design, and web application development.'
        }
      }
    ]
  };

  if (p.schemaType === 'home') {
    return {
      '@context': 'https://schema.org',
      '@graph': [org, website, faq]
    };
  }

  if (p.schemaType === 'about') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        org,
        website,
        {
          '@type': 'AboutPage',
          '@id': `${BASE_URL}/about#webpage`,
          url: `${BASE_URL}/about`,
          name: p.title,
          description: p.description,
          isPartOf: { '@id': `${BASE_URL}/#website` },
          about: { '@id': `${BASE_URL}/#organization` },
          inLanguage: 'en-US'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/about#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'About', item: `${BASE_URL}/about` }
          ]
        }
      ]
    };
  }

  if (p.schemaType === 'work') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        org,
        website,
        {
          '@type': 'CollectionPage',
          '@id': `${BASE_URL}/work#webpage`,
          url: `${BASE_URL}/work`,
          name: p.title,
          description: p.description,
          isPartOf: { '@id': `${BASE_URL}/#website` },
          inLanguage: 'en-US'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/work#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` }
          ]
        }
      ]
    };
  }

  if (p.schemaType === 'contact') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        org,
        website,
        {
          '@type': 'ContactPage',
          '@id': `${BASE_URL}/contact#webpage`,
          url: `${BASE_URL}/contact`,
          name: p.title,
          description: p.description,
          isPartOf: { '@id': `${BASE_URL}/#website` },
          inLanguage: 'en-US'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}/contact#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Contact', item: `${BASE_URL}/contact` }
          ]
        }
      ]
    };
  }

  if (p.schemaType === 'case-study') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        org,
        website,
        {
          '@type': 'CreativeWork',
          '@id': `${BASE_URL}${p.canonicalPath}#creativework`,
          url: `${BASE_URL}${p.canonicalPath}`,
          name: p.caseStudyName,
          headline: p.title,
          description: p.description,
          creator: { '@id': `${BASE_URL}/#organization` },
          author: { '@id': `${BASE_URL}/#founder` },
          publisher: { '@id': `${BASE_URL}/#organization` },
          isPartOf: { '@id': `${BASE_URL}/#website` },
          image: OG_IMAGE_DEFAULT,
          inLanguage: 'en-US'
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${BASE_URL}${p.canonicalPath}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Work', item: `${BASE_URL}/work` },
            { '@type': 'ListItem', position: 3, name: p.caseStudyName, item: `${BASE_URL}${p.canonicalPath}` }
          ]
        }
      ]
    };
  }
}

let updatedCount = 0;

for (const p of pages) {
  if (!fs.existsSync(p.filePath)) {
    console.warn(`File not found: ${p.filePath}`);
    continue;
  }

  let html = fs.readFileSync(p.filePath, 'utf8');
  const canonicalUrl = p.canonicalPath === '/' ? `${BASE_URL}/` : `${BASE_URL}${p.canonicalPath}`;

  // 1. Clean out previous JSON-LD scripts to avoid duplicates
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');

  // 2. Build multi-engine SEO head block (Google, Brave, DuckDuckGo, Bing)
  const schemaJson = JSON.stringify(generateSchema(p), null, 2);
  const seoBlock = [
    `<!-- Primary SEO & Canonical -->`,
    `<link rel="canonical" href="${canonicalUrl}">`,
    `<meta name="author" content="${STUDIO_NAME}, ${FOUNDER_NAME}">`,
    `<meta name="keywords" content="${TARGET_KEYWORDS}">`,
    `<meta name="coverage" content="Worldwide">`,
    `<meta name="distribution" content="Global">`,
    `<meta name="rating" content="General">`,
    `<meta name="revisit-after" content="7 days">`,
    `<meta name="theme-color" content="#121212">`,
    `<!-- Multi-Search Engine Crawler Directives (Google, Brave, DuckDuckGo, Bing) -->`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`,
    `<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`,
    `<meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`,
    `<!-- Open Graph Enhancements -->`,
    `<meta property="og:site_name" content="${STUDIO_NAME}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:type" content="image/jpeg">`,
    `<meta property="og:image:alt" content="${p.title}">`,
    `<!-- Twitter Card Enhancements -->`,
    `<meta name="twitter:site" content="@birthlabstudio">`,
    `<meta name="twitter:creator" content="@birthlabstudio">`,
    `<meta name="twitter:image:alt" content="${p.title}">`,
    `<!-- Structured Data (JSON-LD) -->`,
    `<script type="application/ld+json">\n${schemaJson}\n</script>`
  ].join('\n    ');

  // Replace relative OG/Twitter images with absolute URLs
  html = html.replace(/(<meta property="og:image" content=")[^"]+(")/gi, `$1${OG_IMAGE_DEFAULT}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]+(")/gi, `$1${OG_IMAGE_DEFAULT}$2`);

  // Ensure og:url is absolute and matches canonical
  html = html.replace(/(<meta property="og:url" content=")[^"]+(")/gi, `$1${canonicalUrl}$2`);

  // Remove stale tags
  html = html.replace(/<link rel="canonical"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="author"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="keywords"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="coverage"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="distribution"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="rating"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="revisit-after"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="theme-color"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="robots"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="googlebot"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="bingbot"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:site_name"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:locale"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:image:width"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:image:height"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:image:type"[^>]*>\s*/gi, '');
  html = html.replace(/<meta property="og:image:alt"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="twitter:site"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="twitter:creator"[^>]*>\s*/gi, '');
  html = html.replace(/<meta name="twitter:image:alt"[^>]*>\s*/gi, '');

  // Insert SEO block immediately after the twitter:image tag
  if (html.includes('name="twitter:image"')) {
    html = html.replace(/(<meta name="twitter:image"[^>]*>)/i, `$1\n    ${seoBlock}`);
  } else if (html.includes('</title>')) {
    html = html.replace(/(<\/title>)/i, `$1\n    ${seoBlock}`);
  }

  fs.writeFileSync(p.filePath, html, 'utf8');
  updatedCount++;
}

// 404 Route Hardening
if (fs.existsSync('404/index.html')) {
  let html404 = fs.readFileSync('404/index.html', 'utf8');
  html404 = html404.replace(/<meta name="robots"[^>]*>/i, '<meta name="robots" content="noindex, follow">');
  html404 = html404.replace(/(<meta property="og:image" content=")[^"]+(")/gi, `$1${OG_IMAGE_DEFAULT}$2`);
  html404 = html404.replace(/(<meta name="twitter:image" content=")[^"]+(")/gi, `$1${OG_IMAGE_DEFAULT}$2`);
  fs.writeFileSync('404/index.html', html404, 'utf8');
  console.log('Successfully hardened 404/index.html with noindex, follow');
}

console.log(`Successfully expanded European, North African, Middle Eastern & Asian SEO coverage across ${updatedCount} pages.`);
