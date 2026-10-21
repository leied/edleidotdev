/** Scroll reveals: content waits just out of view, then settles into place once. */

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const noise = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*+/<>';

// Start once the display faces are in, so nothing rises in a fallback font and swaps mid-flight.
const fontsReady = () => Promise.race([
  Promise.all(['400 1em "Archivo Black"', '400 1em Roboto', '700 1em Roboto'].map((font) => document.fonts.load(font))),
  new Promise((resolve) => window.setTimeout(resolve, 900)),
]).catch(() => undefined);

/** Wrap each word of a heading so it can rise out of its own mask. Links and line breaks stay put. */
function splitWords(heading: HTMLElement) {
  let count = 0;
  let open: HTMLElement | null = null;
  const word = () => {
    const outer = document.createElement('span');
    const inner = document.createElement('span');
    outer.className = 'split-word';
    inner.className = 'split-inner';
    outer.style.setProperty('--word-index', String(count++));
    outer.append(inner);
    return { outer, inner };
  };
  for (const node of [...heading.childNodes]) {
    if (node.nodeType === Node.TEXT_NODE) {
      const pieces: Node[] = [];
      for (const part of (node.textContent ?? '').split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          pieces.push(document.createTextNode(part));
          open = null;
        } else if (open) {
          open.append(part);
        } else {
          const { outer, inner } = word();
          inner.append(part);
          pieces.push(outer);
          open = inner;
        }
      }
      node.replaceWith(...pieces);
    } else if (node instanceof HTMLElement && !node.matches('a, br')) {
      // Trailing punctuation like the accent period travels with its word.
      if (open) open.append(node);
      else {
        const { outer, inner } = word();
        node.replaceWith(outer);
        inner.append(node);
        open = inner;
      }
    } else {
      open = null;
    }
  }
  heading.style.setProperty('--word-count', String(count));
}

/** Decode a short label one character at a time, over the real text, which stays in place for layout and assistive technology. */
function scramble(label: HTMLElement) {
  const text = label.textContent ?? '';
  const layer = document.createElement('span');
  layer.className = 'scramble-layer';
  layer.setAttribute('aria-hidden', 'true');
  label.append(layer);
  const step = 24; // ms between characters settling
  const hold = 300; // ms each character spends as noise
  const end = Math.max(0, text.length - 1) * step + hold;
  const start = performance.now();
  let glyphs: string[] = [];
  let swapped = -Infinity;
  const frame = (now: number) => {
    const elapsed = now - start;
    if (elapsed >= end || reducedMotion.matches) {
      layer.remove();
      label.removeAttribute('data-scramble');
      return;
    }
    // Swap the noise a little slower than the frame rate, so it flickers rather than blurs.
    if (now - swapped > 55) {
      swapped = now;
      glyphs = Array.from(text, () => noise[Math.floor(Math.random() * noise.length)]);
    }
    layer.textContent = Array.from(text, (char, index) => {
      const begin = index * step;
      if (!/[A-Za-z0-9]/.test(char) || elapsed >= begin + hold) return char;
      return elapsed >= begin ? glyphs[index] : ' ';
    }).join('');
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

export function initReveal() {
  const pending = new Set(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  const unscramble = (scope: ParentNode) => scope.querySelectorAll('[data-scramble]').forEach((label) => label.removeAttribute('data-scramble'));
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    unscramble(document);
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-reveal="split"]').forEach(splitWords);
  root.classList.add('motion-ready');
  let introEnds = 0;

  // Things already scrolled past are simply there, rather than performing for nobody.
  function settle(element: HTMLElement) {
    pending.delete(element);
    observer.unobserve(element);
    element.removeAttribute('data-reveal');
    unscramble(element);
  }

  function show(element: HTMLElement, delay: number) {
    if (!pending.delete(element)) return;
    observer.unobserve(element);
    element.style.setProperty('--reveal-delay', `${delay}ms`);
    element.classList.add('is-inview');
    // Only this element's own labels; nested reveals decode when they arrive.
    element.querySelectorAll<HTMLElement>('[data-scramble]').forEach((label) => {
      if (label.parentElement?.closest('[data-reveal]') !== element) return;
      window.setTimeout(() => { if (label.hasAttribute('data-scramble')) scramble(label); }, delay + 150);
    });
  }

  // Elements arriving together queue up top to bottom. During the intro, the hero keeps its own timing
  // and anything else already on screen waits for it.
  function reveal(elements: HTMLElement[]) {
    const intro = performance.now() < introEnds;
    const afterHero = intro && elements.some((element) => element.dataset.revealDelay) ? 700 : 0;
    let queue = 0;
    elements
      .map((element) => ({ element, box: element.getBoundingClientRect() }))
      .sort((a, b) => a.box.top - b.box.top || a.box.left - b.box.left)
      .forEach(({ element }) => {
        const scheduled = intro ? element.dataset.revealDelay : undefined;
        show(element, scheduled ? Number(scheduled) : afterHero + Math.min(queue++, 6) * 80);
      });
  }

  const observer = new IntersectionObserver((entries) => {
    const entering: HTMLElement[] = [];
    for (const entry of entries) {
      const element = entry.target as HTMLElement;
      if (entry.isIntersecting) entering.push(element);
      else if (entry.boundingClientRect.bottom < 0) settle(element);
    }
    if (entering.length) reveal(entering);
  }, { rootMargin: '0px 0px -10% 0px' });

  let lastY = window.scrollY;
  function onScroll() {
    if (!pending.size) return;
    const y = window.scrollY;
    // A jump (fragment load, restored position, Home/End, scrollbar drag) never crosses the
    // observer's threshold for what it skipped, so settle anything it left above the viewport.
    if (Math.abs(y - lastY) > root.clientHeight) {
      [...pending].forEach((element) => { if (element.getBoundingClientRect().bottom < 0) settle(element); });
    }
    lastY = y;
    // The last few lines can never cross the trigger line, so reveal what's left once the page bottoms out.
    if (y + root.clientHeight < root.scrollHeight - 2) return;
    reveal([...pending].filter((element) => {
      const box = element.getBoundingClientRect();
      return box.height > 0 && box.bottom > 0 && box.top < root.clientHeight;
    }));
  }

  fontsReady().then(() => requestAnimationFrame(() => {
    introEnds = performance.now() + 1000;
    root.classList.add('is-loaded');
    document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((label) => {
      if (!label.closest('[data-reveal]')) window.setTimeout(() => scramble(label), 380);
    });
    pending.forEach((element) => observer.observe(element));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }));

  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    [...pending].forEach(settle);
    unscramble(document);
  });
}
