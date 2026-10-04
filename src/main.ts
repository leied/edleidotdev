import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-400-italic.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/libre-barcode-39-extended/latin-400.css';
import './style.css';
import './motion.css';
import { profile, notes, project, resumeProjects, otherProjects, skills } from './content';
import type { ProjectLink } from './content';
import { icon, asterisk } from './icons';

const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const note = (key: string, label: string) => `<button type="button" class="text-note" data-note="${key}" aria-describedby="note-${key}">${label}</button>`;
const anchor = (id: string, label: string) => `<a class="section-anchor" href="#${id}" aria-label="Link to ${label}">#</a>`;
const projectLinks = (links: readonly ProjectLink[], name: string) => links.length
  ? `<span class="project-links">${links.map((link) => `<a href="${escape(link.href)}" aria-label="${escape(`${link.label} for ${name}`)}">${escape(link.label)} ${icon('arrow')}</a>`).join('')}</span>`
  : '';
const personalLink = (key: keyof typeof profile.links, label: string, className = '') => profile.links[key]
  ? `<a class="${className}" href="${escape(profile.links[key])}"${key === 'contact' ? ' aria-describedby="academic-contact-note"' : ''}>${label}${icon('arrow')}</a>`
  : `<button class="${className}" type="button" data-dialog="${key}">${label}${icon('arrow')}</button>`;
const barcode = (bottom = false) => `<div class="barcode-rule ${bottom ? 'barcode-rule--bottom' : ''}" role="separator" aria-label="Construction in progress..."><div class="barcode" aria-hidden="true">${'*Construction in progress...*'.repeat(24)}</div></div>`;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="site-shell" id="top">
    <header class="site-header">
      <div class="header-brand">
        <a class="wordmark" href="#top" aria-label="edlei.dev, back to top">edlei<span class="wordmark-dot">.</span>dev</a>
        <span class="wordmark-greeting" aria-hidden="true"></span>
      </div>
      <span class="header-note">A LITTLE CORNER OF THE INTERNET</span>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="navigation" aria-expanded="false">${icon('menu')}</button>
      <nav class="navigation" id="navigation" aria-label="Main navigation">
        <a href="#projects">Projects</a>
        <a href="#about">About</a>
        ${personalLink('blog', 'Blog')}
        ${personalLink('resume', 'Résumé')}
        <a class="nav-contact" href="#contact">Contact ${icon('arrow')}</a>
      </nav>
    </header>

    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        ${profile.portrait ? `<div class="hero-photo" aria-hidden="true"><img src="${escape(profile.portrait)}" alt=""/><div class="hero-scrim"></div></div>` : `
        <div class="portrait-placeholder" aria-label="Placeholder for a future personal photograph">
          <div class="portrait-frame"><span class="frame-cross frame-cross--tl">+</span><span class="frame-cross frame-cross--tr">+</span><span class="frame-cross frame-cross--bl">+</span><span class="frame-cross frame-cross--br">+</span>
            <span class="portrait-coordinate">CURIOUS BY DEFAULT</span>
            <svg class="portrait-sketch" viewBox="0 0 260 280" fill="none" aria-hidden="true"><path d="M41 221c17-35 48-39 79-41m18 0c37 4 59 15 78 41M96 130c-6-11-6-25-3-37 3-23 16-34 37-33 30 1 38 20 35 46-1 25-10 49-31 52-15 2-29-10-34-27m-4-31c13 1 20-12 22-19 6 13 29 19 47 14m-42 64-1 20m16-21 2 21m-19 3 10 17 12-17M60 243l142-2" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="3 5"/></svg>
            <span class="portrait-caption">a photo of me,<br/><em>eventually.</em></span>
            <span class="portrait-index">FIG. 01 &nbsp; / &nbsp; PLACEHOLDER</span>
          </div>
          <svg class="scribble-arrow" viewBox="0 0 100 60" fill="none" aria-hidden="true"><path d="M93 50C64 58 48 29 17 18m0 0 8 18m-8-18 24-5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
        </div>`}
        <div class="hero-copy">
          <p class="hero-greeting"><span class="status-dot"></span> Hey there,</p>
          <h1 id="hero-title">I’m Edward L<span class="name-period">.</span></h1>
          <div class="hero-meta">
            <span>${icon('pin')} ${profile.location}</span>
            <span class="meta-divider" aria-hidden="true">/</span>
            <span>${icon('clock')} ${note('time', '<time data-clock>Pacific Time</time>')}<span class="time-label">LOCAL TIME</span></span>
          </div>
          <div class="hero-prose">
            <p>I’m a ${note('sophomore', 'sophomore')} at the University of Washington who…</p>
            <ul>
              <li><span class="prose-dash">↳</span> ${note('intend', 'intend')} to major in ${note('cs', 'CS')} and is open to collaborating on ${note('research', 'research')};</li>
              <li><span class="prose-dash">↳</span> makes <a href="#projects">things</a> on the side. Maybe you’ll find one useful;</li>
              <li><span class="prose-dash">↳</span> <a href="#about-me-extra">reads</a> a lot during the day and hangs out online at night.</li>
            </ul>
          </div>
          <p class="annotation-hint"><span class="sample-underline">psst.</span> the dotted words have a little more to say.</p>
        </div>
        <div class="hero-bottom"><a class="scroll-link" href="#about">A BIT MORE ABOUT ME ${icon('down')}</a><span class="hero-aside">Curious by default. <em>Still figuring it out.</em></span></div>
      </section>

      ${barcode()}

      <section class="about section-pad" id="about" aria-labelledby="about-title">
        <div class="section-heading"><div><p class="eyebrow"><span>01</span> THE PERSON BEHIND THE SCREEN</p><h2 id="about-title">About me${anchor('about', 'About me')}</h2></div><span class="section-margin-note">a few things, in no particular order</span></div>
        <div class="about-layout">
          <ol class="timeline">
            <li class="timeline-item" id="academics">
              <span class="timeline-node" aria-hidden="true">${icon('book')}</span>
              <div class="timeline-content"><div class="timeline-title"><h3>What I’m learning</h3>${anchor('academics', 'What I’m learning')}</div>
                <p>Computer science, cybersecurity, and how to make technology easier to use safely.</p>
              </div>
            </li>
            <li class="timeline-item" id="experiences">
              <span class="timeline-node" aria-hidden="true">${icon('code')}</span>
              <div class="timeline-content"><div class="timeline-title"><h3>What I’m making</h3>${anchor('experiences', 'What I’m making')}</div><p>Small web tools, research experiments, and things that make everyday tasks a little easier.</p></div>
            </li>
            <li class="timeline-item" id="about-me-extra">
              <span class="timeline-node" aria-hidden="true">${asterisk()}</span>
              <div class="timeline-content"><div class="timeline-title"><h3>The extra bits</h3>${anchor('about-me-extra', 'The extra bits')}</div><p>Usually reading, tinkering, or helping out behind the scenes.</p></div>
            </li>
          </ol>
          <aside class="margin-note"><span class="margin-note-index">CURRENTLY CURIOUS ABOUT</span><p>People, privacy,<br/>and how we use<br/><em>technology.</em></p><svg viewBox="0 0 230 35" fill="none" aria-hidden="true"><path d="M3 16c51-9 117-12 213-8M15 27c45-10 101-13 158-10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span class="margin-note-foot">…and a fair bit of AI / LLMs.</span><dl class="skills-list">${skills.map((skill) => `<div><dt>${escape(skill.label)}</dt><dd>${escape(skill.description)}</dd></div>`).join('')}</dl>${asterisk('margin-star')}</aside>
        </div>
      </section>

      <section class="projects section-pad" id="projects" aria-labelledby="projects-title">
        <div class="section-heading"><div><p class="eyebrow"><span>02</span> MADE OUT OF CURIOSITY</p><h2 id="projects-title">My projects${anchor('projects', 'My projects')}</h2></div><span class="section-margin-note">some useful. some just because.</span></div>
        <div class="projects-layout">
          <div class="projects-copy"><p class="project-lede">When I have free time,<br/>I just <span class="vibe-word">(vibe)<svg viewBox="0 0 90 15" fill="none" aria-hidden="true"><path d="M2 9 86 3M9 14l67-6" stroke="currentColor" stroke-width="2"/></svg></span> code.</p><p>Why? I don’t know. It’s just something<br class="desktop-break"/> I really enjoy doing.</p><p>Here’s a small collection of things I’ve<br class="desktop-break"/> made, and things still taking shape.</p><div class="interaction-note">${icon('arrow')} <span>Open a project<br/>to read a little more.</span></div>
          </div>
          <div class="project-workbench">
            <div class="cup-stage" data-cup-stage aria-hidden="true">
              <div class="cup-object"><div class="cup-assembly"><div class="cup-lid"></div><div class="cup-vessel"><span class="cup-print">bits &<br/>pieces<span>EST. WHENEVER</span></span><div class="cup-smile">:)</div></div></div></div>
              <span class="falling-bit bit-one">${icon('code')}</span><span class="falling-bit bit-two">${asterisk()}</span><span class="falling-bit bit-three">${icon('pencil')}</span><span class="falling-bit bit-four">{ }</span><span class="falling-bit bit-five">${icon('book')}</span><span class="falling-bit bit-six">↗</span>
              <span class="cup-caption">a few things I’ve been pouring myself into</span>
            </div>
            <div class="workbench-topline"><span class="small-label">THE SIDE-PROJECT DRAWER</span><button class="replay-button" type="button" data-replay aria-label="Replay the cup animation"><span class="replay-glyph" aria-hidden="true">↻</span><span>shake things up</span></button></div>
            ${resumeProjects.map((item) => `<article class="project-card resume-project" id="project-${item.id}" data-project>
              <button class="project-toggle" type="button" aria-expanded="false" aria-controls="${item.id}-detail"><span class="project-icon">${icon(item.icon)}</span><span class="project-title"><strong>${escape(item.name)}</strong><span>${escape(item.headline)}</span></span>${icon('plus', 'project-plus')}</button>
              <div class="project-detail" id="${item.id}-detail" inert aria-hidden="true"><div class="project-detail-inner"><div class="resume-project-body">
                <div class="project-illustration"><img src="${escape(item.illustration.src)}" alt="${escape(item.illustration.alt)}" width="480" height="240" loading="lazy" decoding="async"/></div>
                <p>${escape(item.description)}</p><p>${escape(item.detail)}</p>
                <div class="resume-project-footer"><span class="small-label">${escape(item.tags)}</span>${projectLinks(item.links, item.name)}</div>
                ${item.privateSource ? '<span class="project-access-note">Source code is private.</span>' : ''}
              </div></div></div>
            </article>`).join('')}
            <article class="project-card" id="project-embedidraw" data-project>
              <button class="project-toggle" type="button" aria-expanded="false" aria-controls="embedidraw-detail"><span class="project-icon">${icon('pencil')}</span><span class="project-title"><strong>${project.name}</strong><span>Excalidraw, wherever you need it.</span></span>${icon('plus', 'project-plus')}</button>
              <div class="project-detail" id="embedidraw-detail" inert aria-hidden="true"><div class="project-detail-inner">
                <div class="drawing-preview" aria-label="Illustration of a sketch being embedded in a webpage"><div class="sketch-paper"><svg viewBox="0 0 150 96" fill="none" aria-hidden="true"><rect x="11" y="22" width="46" height="42" rx="3" stroke="currentColor" stroke-width="1.5" transform="rotate(-4 11 22)"/><path d="m25 51 9-14 11 16M62 41c15-13 25-8 32 0m-5-9 6 9-10 4" stroke="currentColor" stroke-width="1.5"/><circle cx="119" cy="40" r="20" stroke="currentColor" stroke-width="1.5"/><path d="m110 40 7 7 12-13" stroke="currentColor" stroke-width="1.5"/></svg><span>your next big idea</span></div><span class="embed-arrow">↗</span><div class="sketch-browser"><div><i></i><i></i><i></i></div><span>&lt; your website /&gt;</span><svg viewBox="0 0 100 45" aria-hidden="true"><path d="M8 27h23l12-17 17 24 13-16 19 9" stroke="currentColor" fill="none"/></svg></div></div>
                <p>${project.description}</p><div class="project-detail-footer"><span class="small-label">A SMALL, USEFUL TOOL</span>${projectLinks(project.links, project.name)}</div>
              </div></div>
            </article>
            <p class="drawer-footnote"><span>←</span> Small experiments, loose ends, happy accidents.</p>
          </div>
          <section class="other-projects" id="other-projects" aria-labelledby="other-projects-title">
            <div class="other-projects-heading"><h3 id="other-projects-title">My other projects${anchor('other-projects', 'My other projects')}</h3></div>
            <ul class="other-projects-list">${otherProjects.map((item) => `<li><strong>${escape(item.name)}</strong><p>${escape(item.description)}</p><div class="other-projects-links">${projectLinks(item.links, item.name)}${item.privateSource ? '<span class="project-access-note">Source code is private.</span>' : ''}</div></li>`).join('')}</ul>
          </section>
        </div>
      </section>
      ${barcode(true)}
    </main>

    <footer class="site-footer section-pad" id="contact">
      <div class="footer-top"><div><p class="eyebrow"><span>03</span> THAT’S ME, FOR NOW</p><h2>Let’s cross paths<span class="footer-period">.</span>${anchor('contact', 'Contact')}</h2><p>Interesting ideas, research, or just a hello.</p></div><div class="contact-details">${personalLink('contact', escape(profile.email), 'hello-link')}<p class="academic-contact-note" id="academic-contact-note">For academic correspondence, please use my academic email if you already know it.</p></div></div>
      <div class="footer-bottom"><a class="wordmark" href="#top">edward l<span class="wordmark-dot">.</span></a><span class="copyright">© ${new Date().getFullYear()} Edward L &nbsp;·&nbsp; MIT licensed</span><div class="footer-links">${personalLink('github', 'GitHub')}${personalLink('linkinbio', 'Link in bio')}${personalLink('resume', 'Résumé')}</div><a href="#top" class="back-top" aria-label="Back to top">↑</a></div>
      <p class="footer-colophon">Made slowly. Changed often.</p>
    </footer>
  </div>
  ${Object.entries(notes).map(([key, text]) => `<div class="tooltip" id="note-${key}" role="tooltip" hidden>${escape(text)}</div>`).join('')}
  <div class="tooltip" id="note-time" role="tooltip" hidden><strong>Pacific Time</strong><span>America/Los_Angeles</span><span class="unix-line">Unix time <code data-unix></code></span></div>
  <dialog class="notice-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description"><button class="dialog-close" type="button" aria-label="Close dialog">${icon('close')}</button><span class="eyebrow">STILL UNDER CONSTRUCTION</span><h2 id="dialog-title"></h2><p id="dialog-description"></p><button class="dialog-done" type="button">Back to exploring ${icon('arrow')}</button></dialog>
`;

// Pick one greeting per visit with the pointer or keyboard; keep the logo still.
const greetings = ["What's up?", 'Hey there!', ';D', "How's your day?", 'Hello hello!'] as const;
const headerBrand = document.querySelector<HTMLElement>('.header-brand')!;
const headerWordmark = headerBrand.querySelector<HTMLAnchorElement>('.wordmark')!;
const wordmarkGreeting = headerBrand.querySelector<HTMLElement>('.wordmark-greeting')!;
let wordmarkHovered = false;
let wordmarkFocused = false;
function updateGreeting() {
  const visible = wordmarkHovered || wordmarkFocused;
  // Keep the same greeting when a quick re-entry reverses its exit transition.
  if (visible && !headerBrand.classList.contains('is-greeting') && getComputedStyle(wordmarkGreeting).visibility === 'hidden') {
    wordmarkGreeting.textContent = greetings[Math.floor(Math.random() * greetings.length)];
  }
  headerBrand.classList.toggle('is-greeting', visible);
}
headerWordmark.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
    wordmarkHovered = true;
    updateGreeting();
  }
});
headerWordmark.addEventListener('pointerleave', () => { wordmarkHovered = false; updateGreeting(); });
headerWordmark.addEventListener('focus', () => {
  wordmarkFocused = headerWordmark.matches(':focus-visible');
  updateGreeting();
});
headerWordmark.addEventListener('blur', () => { wordmarkFocused = false; updateGreeting(); });

// Live Pacific time, including daylight saving time and a real Unix timestamp.
const clock = document.querySelector<HTMLTimeElement>('[data-clock]')!;
const unix = document.querySelector<HTMLElement>('[data-unix]')!;
const timeFormat = new Intl.DateTimeFormat('en-US', { timeZone: profile.timezone, hour: 'numeric', minute: '2-digit' });
function updateClock() {
  const now = new Date();
  clock.textContent = timeFormat.format(now);
  clock.dateTime = now.toISOString();
  unix.textContent = String(Math.floor(now.getTime() / 1000));
}
updateClock();
window.setInterval(updateClock, 1000);

// Notes work with a mouse, a keyboard, or a tap, and stay inside the viewport.
let activeNote: { button: HTMLButtonElement; tip: HTMLElement } | null = null;
let notePinned = false;
let noteCloseTimer: number | undefined;
function positionNote() {
  if (!activeNote) return;
  const { button, tip } = activeNote;
  const rect = button.getBoundingClientRect();
  const width = tip.offsetWidth;
  const height = tip.offsetHeight;
  const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
  const top = rect.bottom + height + 20 > window.innerHeight ? Math.max(12, rect.top - height - 12) : rect.bottom + 12;
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}
function closeNote() {
  clearTimeout(noteCloseTimer);
  if (activeNote) activeNote.tip.hidden = true;
  activeNote = null;
  notePinned = false;
}
function showNote(button: HTMLButtonElement) {
  clearTimeout(noteCloseTimer);
  if (activeNote?.button !== button) closeNote();
  const tip = document.getElementById(`note-${button.dataset.note}`)!;
  activeNote = { button, tip };
  tip.hidden = false;
  positionNote();
}
function scheduleNoteClose() {
  clearTimeout(noteCloseTimer);
  noteCloseTimer = window.setTimeout(() => {
    if (!notePinned && document.activeElement !== activeNote?.button) closeNote();
  }, 150);
}
document.querySelectorAll<HTMLButtonElement>('[data-note]').forEach((button) => {
  button.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse' && !notePinned) showNote(button); });
  button.addEventListener('pointerleave', scheduleNoteClose);
  button.addEventListener('focus', () => showNote(button));
  button.addEventListener('blur', () => { if (!notePinned) closeNote(); });
  button.addEventListener('click', () => {
    if (activeNote?.button === button && notePinned) closeNote();
    else { showNote(button); notePinned = true; }
  });
});
document.querySelectorAll<HTMLElement>('.tooltip').forEach((tip) => {
  tip.addEventListener('pointerenter', () => clearTimeout(noteCloseTimer));
  tip.addEventListener('pointerleave', scheduleNoteClose);
});
document.addEventListener('pointerdown', (event) => { if (activeNote && !activeNote.button.contains(event.target as Node) && !activeNote.tip.contains(event.target as Node)) closeNote(); });
window.addEventListener('resize', positionNote);
window.addEventListener('scroll', positionNote, { passive: true });

// Each project previews on hover; a click pins it open until clicked again.
document.querySelectorAll<HTMLElement>('[data-project]').forEach((projectCard) => {
  const projectButton = projectCard.querySelector<HTMLButtonElement>('.project-toggle')!;
  const projectDetail = projectCard.querySelector<HTMLElement>('.project-detail')!;
  let projectPinned = false;
  let projectHovered = false;
  function setProjectOpen(open: boolean) {
    projectCard.classList.toggle('is-open', open);
    projectCard.classList.toggle('is-pinned', projectPinned);
    projectButton.setAttribute('aria-expanded', String(open));
    projectDetail.inert = !open;
    projectDetail.setAttribute('aria-hidden', String(!open));
  }
  projectCard.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') { projectHovered = true; setProjectOpen(true); }
  });
  projectCard.addEventListener('pointerleave', () => {
    projectHovered = false;
    if (!projectPinned && !projectCard.contains(document.activeElement)) setProjectOpen(false);
  });
  projectButton.addEventListener('click', () => { projectPinned = !projectPinned; setProjectOpen(projectPinned); });
  projectCard.addEventListener('focusin', () => setProjectOpen(true));
  projectCard.addEventListener('focusout', () => {
    queueMicrotask(() => { if (!projectPinned && !projectHovered && !projectCard.contains(document.activeElement)) setProjectOpen(false); });
  });
  projectCard.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { projectPinned = false; projectButton.focus(); setProjectOpen(false); }
  });
  if (window.location.hash === `#${projectCard.id}`) { projectPinned = true; setProjectOpen(true); }
});

// The cup settles in place after playing and stays visible between replays.
const cupStage = document.querySelector<HTMLElement>('[data-cup-stage]')!;
const cupObject = cupStage.querySelector<HTMLElement>('.cup-object')!;
const replayButton = document.querySelector<HTMLButtonElement>('[data-replay]')!;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function finishCup() {
  cupStage.classList.remove('is-playing');
  replayButton.disabled = false;
}
function playCup() {
  if (reducedMotion.matches || cupStage.classList.contains('is-playing')) return;
  cupStage.querySelectorAll<HTMLElement>('.falling-bit').forEach((bit, index) => {
    bit.style.setProperty('--fall-x', `${Math.round((Math.random() - 0.5) * 130)}px`);
    bit.style.setProperty('--fall-turn', `${Math.round((Math.random() - 0.5) * 100)}deg`);
    bit.style.setProperty('--fall-delay', `${450 + index * 230 + Math.random() * 100}ms`);
  });
  replayButton.disabled = true;
  cupStage.classList.add('is-playing');
}
// Return to the static cup when its animation finishes.
cupObject.addEventListener('animationend', (event) => {
  if (event.target === cupObject && event.animationName === 'cup-visit') finishCup();
});
const cupObserver = new IntersectionObserver((entries) => {
  if (entries.some((entry) => entry.isIntersecting)) { playCup(); cupObserver.disconnect(); }
}, { threshold: 0.6 });
if (reducedMotion.matches) finishCup();
else cupObserver.observe(cupStage);
replayButton.addEventListener('click', playCup);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) { cupObserver.disconnect(); finishCup(); }
});

// Unprovided URLs have an honest, accessible placeholder rather than dead links.
const notice = document.querySelector<HTMLDialogElement>('.notice-dialog')!;
const noticeCopy: Record<string, [string, string]> = {
  blog: ['A blank page, for now.', 'This is where the writing will go. There aren’t any posts to share just yet.'],
  resume: ['Résumé in progress.', 'A résumé will be linked here when it’s ready. In the meantime, the About section has a little more about me.'],
  linkinbio: ['More places, soon.', 'A few more corners of the internet will be linked here. This one is still taking shape.'],
};
document.querySelectorAll<HTMLButtonElement>('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const [title, description] = noticeCopy[button.dataset.dialog!] || ['A link for later.', 'This project link hasn’t been added yet. The preview is here; the destination is still to come.'];
    notice.querySelector('#dialog-title')!.textContent = title;
    notice.querySelector('#dialog-description')!.textContent = description;
    closeNote();
    notice.showModal();
  });
});
notice.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => notice.close()));
notice.addEventListener('click', (event) => {
  const rect = notice.getBoundingClientRect();
  if (event.target === notice && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) notice.close();
});

const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle')!;
const navigation = document.querySelector<HTMLElement>('.navigation')!;
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation'); navigation.classList.remove('is-open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a, button').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('pointerdown', (event) => { if (!navigation.contains(event.target as Node) && !menuButton.contains(event.target as Node)) closeMenu(); });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeNote();
    if (navigation.classList.contains('is-open')) { closeMenu(); menuButton.focus(); }
  }
});
