/** Personal content and links. */
const email = 'im@edlei.dev';

export type ProjectLink = { label: string; href: string };

export const profile = {
  name: 'Edward L',
  email,
  location: 'Pacific Northwest',
  timezone: 'America/Los_Angeles',
  // Put your photo in public/images and set its path here, e.g. '/images/edward.jpg'.
  // The hero places the subject on the right beneath an 80% black overlay.
  portrait: '',
  links: {
    github: 'https://github.com/leied',
    linkinbio: '',
    resume: '',
    contact: `mailto:${email}`,
    blog: '',
  },
};

export const notes = {
  sophomore: 'Class standing is based on credits.',
  intend: 'I’m planning to study computer science; I haven’t declared a major yet.',
  cs: 'Computer science.',
  research: 'I’m interested in usable security & privacy, human–computer interaction, and AI / large language models.',
};

export const project = {
  name: 'Embedidraw',
  headline: 'Your sketches. Anywhere on the web.',
  description: 'A tool for embedding Excalidraw files in webpages without depending on excalidraw.com. Make a drawing your own, with customizations like disabling editing.',
  links: [
    { label: 'Website', href: 'https://embedidraw.edlei.dev' },
    { label: 'GitHub', href: 'https://github.com/leied/embedidraw' },
  ],
};


export const resumeProjects = [
  {
    id: 'advanced-paper-reader',
    name: 'Advanced Paper Reader',
    icon: 'book',
    illustration: {
      src: '/images/projects/paper-reader.svg',
      alt: 'A stack of papers branches into a citation graph and an audio player.',
    },
    headline: 'More ways to discover and understand research.',
    description: 'A paper reading platform with a personalized discovery feed, citation graphs built from OpenAlex, podcast generation, and retrieval-augmented Q&A grounded in paper content.',
    detail: 'Built on Cloudflare Workers with serverless PostgreSQL, rate limiting, and a Material 3 interface.',
    tags: 'RESEARCH TOOLS · CLOUDFLARE · POSTGRESQL',
    links: [{ label: 'Website', href: 'https://archypapers.edlei.dev' }],
    privateSource: true,
  },
  {
    id: 'qgen',
    name: 'qgen',
    icon: 'questions',
    illustration: {
      src: '/images/projects/qgen.svg',
      alt: 'Source material becomes questions for review, then moves into a database with a rollback path.',
    },
    headline: 'From learning materials to question workflows.',
    description: 'An AI console for generating questions from supplied materials, connecting to production databases, publishing questions, and benchmarking LLMs with defined pipelines.',
    detail: 'Database snapshots, a recycle bin, audit logs, and administrator rollback help make the workflow easier to manage and recover.',
    tags: 'AI TOOLING · DATABASES · LLM BENCHMARKING',
    links: [],
    privateSource: true,
  },
  {
    id: 'dailycalsync',
    name: 'DailyCalSync',
    icon: 'calendar',
    illustration: {
      src: '/images/projects/dailycalsync.svg',
      alt: 'Colored calendar events sync into matching checkboxes and footnotes in an Obsidian daily note.',
    },
    headline: 'Your calendar, at home in Obsidian.',
    description: 'An Obsidian plugin that brings Google Calendar events into daily notes using OAuth 2.0 and a bring-your-own-key model, without a centralized server.',
    detail: 'Choose calendars, preserve their colors, link event descriptions through footnotes, and control how multi-day events are marked complete.',
    tags: 'OBSIDIAN · OAUTH 2.0 · PRIVACY',
    links: [
      { label: 'GitHub', href: 'https://github.com/leied/obcaldian' },
      { label: 'Download', href: 'https://github.com/leied/obcaldian/releases/latest' },
    ],
  },
  {
    id: 'midnight',
    name: 'Midnight',
    icon: 'moon',
    illustration: {
      src: '/images/projects/midnight.svg',
      alt: 'A configuration file becomes a dark link-in-bio page with keyboard shortcuts for each link.',
    },
    headline: 'A small page for everything you make.',
    description: 'A minimal, AMOLED link-in-bio page with a true-black background, automatic brand icons, and keyboard shortcuts for every link.',
    detail: 'A single configuration file controls the page, from links to Markdown bios. The build produces one static HTML file with its styles and icons included, plus tactile hover and press feedback.',
    tags: 'STATIC WEB · KEYBOARD NAVIGATION · UI DESIGN',
    links: [],
    privateSource: true,
  },
];

export const otherProjects = [
  {
    name: 'RedBlurer',
    description: 'A browser extension that blurs images and videos, with controls for where and when to reveal them.',
    links: [],
    privateSource: true,
  },
  {
    name: 'Bookmark Bot',
    description: 'Save Discord messages to your DMs, with a link back to the original and controls to organize them.',
    links: [{ label: 'GitHub', href: 'https://github.com/leied/bookmark-bot' }],
  },
  {
    name: 'TransitCast',
    description: 'Turn RSS feeds and research papers into a personal audio briefing, ready for offline listening.',
    links: [
      { label: 'Website', href: 'https://transitcast.edlei.dev' },
      { label: 'GitHub', href: 'https://github.com/leied/transitcast' },
    ],
  },
  {
    name: 'cf-browser-mcp',
    description: 'Give AI assistants browser tools for reading pages, taking snapshots, and crawling sites through Cloudflare.',
    links: [{ label: 'Server', href: 'https://headless.mcp.edlei.dev' }],
    privateSource: true,
  },
];

export const skills = [
  { label: 'Code', description: 'Python, TypeScript & the web' },
  { label: 'Systems', description: 'Linux, networking & security' },
  { label: 'Design', description: 'Usable privacy & thoughtful interfaces' },
];
