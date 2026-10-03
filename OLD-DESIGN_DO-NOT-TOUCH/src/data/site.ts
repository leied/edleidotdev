/**
 * Single source of content for the landing page.
 * Edit here, not in markup. Entries marked TODO are structure-only.
 */

export const site = {
  name: 'Edward L',
  domain: 'edlei.dev',
  location: 'Seattle, WA',
  timezone: 'America/Los_Angeles',
  timezoneLabel: 'Pacific Time',
  license: 'MIT',
  barcodeText: 'Construction in progress...',
} as const;

/**
 * Header navigation. Everything points at an on-page section for now.
 * When a real destination exists, swap `href` and set `external: true` — that
 * flag is what renders the ↗ mark, so it should only ever be true for links
 * that actually leave the page.
 */
export const nav = [
  { label: 'Projects', href: '#projects', external: false },
  { label: 'About', href: '#about', external: false },
  { label: 'Blog', href: '#about-extra', external: false }, // TODO: /blog
  { label: 'Resume', href: '#contact', external: false }, // TODO: resume URL
  { label: 'Contact', href: '#contact', external: false }, // TODO: contact URL
] as const;

/**
 * Tooltip copy, verbatim from the design annotations.
 * Keys are referenced by `term` in the hero prose.
 */
export const tooltips: Record<string, string> = {
  sophomore:
    'UW places students based on credit. I have 59 credits posted on my transcript — this is my first year at UW.',
  cs: 'Computer Science in the Allen School @ UW.',
  researches:
    'I am interested in researching usable S&P, Human–Computer Interaction, and AI/LLMs.',
  intend:
    "I was admitted through UW Robinson Center's UW Academy program, which lets me enter the university after 10th grade. Consequently I am not allowed to apply for a major yet, and I could not request one at the time of application — so I do not have a major. I do intend to major in CS at the Allen School.",
};

/** About Me timeline. */
export const timeline = [
  { id: 'about-academics', title: 'Academics', status: 'In progress' },
  { id: 'about-experiences', title: 'Experiences', status: 'In progress' },
  // Linked from the hero's "read a lot during the day" line.
  { id: 'about-extra', title: 'Extra', status: 'In progress' },
] as const;

export type Project = {
  id: string;
  name: string;
  headline: string;
  description: string;
  links?: { label: string; href: string }[];
  proud?: boolean;
};

export const projects: Project[] = [
  {
    id: 'embedidraw',
    name: 'Embedidraw',
    headline: 'Tool for embedding Excalidraw files anywhere',
    description:
      'Helps embed Excalidraw files into webpages without the dependency of excalidraw.com, with customisations such as disabling editing.',
    links: [
      { label: 'GitHub', href: '#' }, // TODO
      { label: 'Website', href: '#' }, // TODO
      { label: 'Demo', href: '#' }, // TODO
    ],
    proud: true,
  },
  // TODO: replace the two below with real projects.
  {
    id: 'project-two',
    name: 'Project two',
    headline: 'One-line headline',
    description: 'Longer description shown when the card expands on hover or click.',
    links: [{ label: 'GitHub', href: '#' }],
    proud: true,
  },
  {
    id: 'project-three',
    name: 'Project three',
    headline: 'One-line headline',
    description: 'Longer description shown when the card expands on hover or click.',
    links: [{ label: 'GitHub', href: '#' }],
    proud: true,
  },
];

export const footerLinks = [
  { label: 'github', href: '#' }, // TODO
  { label: 'linkinbio', href: '#' }, // TODO
  { label: 'resume', href: '#' }, // TODO
] as const;
