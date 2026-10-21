/**
 * Slide-based scrolling. Each [data-slide] is an area the page comes to rest on: the wheel and keys
 * move one area at a time, an area taller than the screen scrolls freely (with a little friction)
 * before moving on, and any other scroll settles onto the nearest area once it stops.
 */

export type Slide = { element: HTMLElement; start: number; end: number; rest: readonly [number, number] };
export type ScrollFrame = { y: number; velocity: number; progress: number; slides: readonly Slide[]; active: number };
// `aim` finds the destination again whenever the layout moves under the glide.
type Glide = { from: number; to: number; aim: () => number; start: number; duration: number; hash?: string };

const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
// Touch screens snap natively (see slides.css); everything else is driven here.
const coarsePointer = window.matchMedia('(pointer: coarse)');
// Seconds the page takes to cover ~63% of the distance the wheel asked for. Higher feels heavier.
const friction = 0.15;
// An area up to this much taller than the screen still moves as one slide; anything taller scrolls inside.
const overflowAllowance = 32;
// Wheel travel needed to turn a slide: enough to ignore a brush of the trackpad, little enough for a gentle swipe.
const pageIntent = 8;
// Wheel events further apart than this belong to separate gestures.
const gestureGap = 160;
// A delta this many times faded momentum's weakest, and this many pixels above it, may be a fresh swipe.
const surgeRatio = 2.5;
const surgeFloor = 2;
const listeners = new Set<(frame: ScrollFrame) => void>();

let enabled = false;
let target = window.scrollY;
let current = target;
let easing = false;
let glide: Glide | null = null;
let written = target;
let lastY = target;
let velocity = 0;
let lastTime = 0;
let frameId = 0;
let measured: Slide[] | null = null;
// One slide per wheel gesture, however long its momentum runs.
let lastWheelAt = -Infinity;
let lastWheelDirection = 0;
// The gesture's strongest delta, its weakest since, and any deltas rising back out of that.
let wheelPeak = 0;
let wheelTrough = 0;
let rising: number[] = [];
// The axis a gesture starts on, held for the rest of it as the browser's own scrolling does.
let wheelAxis: 'x' | 'y' = 'y';
let wheelAxisAt = -Infinity;
let intent = 0;
let spent = 0;
let settleTimer = 0;
let held = false;
let focusMovedAt = -Infinity;

const maxScroll = () => Math.max(0, root.scrollHeight - root.clientHeight);
const clamp = (y: number, low = 0, high = maxScroll()) => Math.min(Math.max(y, low), high);
const easeInOutQuart = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);
const moving = () => easing || glide !== null;

/** Where each area starts and ends, and the range of positions it can rest at. */
function slides() {
  if (measured) return measured;
  const viewport = root.clientHeight;
  const max = maxScroll();
  const elements = [...document.querySelectorAll<HTMLElement>('[data-slide]')];
  // The first area includes everything above it. Areas are never transformed themselves (only their
  // contents recede), so their boxes are exact.
  const starts = elements.map((element, index) => (index ? element.getBoundingClientRect().top + window.scrollY : 0));
  measured = elements.map((element, index) => {
    const start = starts[index];
    const end = starts[index + 1] ?? root.scrollHeight;
    const first = Math.min(start, max);
    const last = end - start > viewport + overflowAllowance ? Math.min(end - viewport, max) : first;
    return { element, start, end, rest: [first, last] as const };
  });
  if (!measured.length) measured = [{ element: root, start: 0, end: root.scrollHeight, rest: [0, max] }];
  return measured;
}

function nearest(y: number) {
  let best = 0;
  let distance = Infinity;
  slides().forEach(({ rest: [low, high] }, index) => {
    const away = y < low ? low - y : y > high ? y - high : 0;
    if (away < distance) {
      distance = away;
      best = index;
    }
  });
  return best;
}

// Layout position, ignoring the transforms on receding contents.
function layoutTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop + ((node.offsetParent as HTMLElement | null)?.clientTop ?? 0);
  }
  return top;
}

const state = (): ScrollFrame => {
  const max = maxScroll();
  const y = window.scrollY;
  return { y, velocity, progress: max ? Math.min(y / max, 1) : 0, slides: slides(), active: nearest(y) };
};

function kick() {
  if (!frameId) frameId = requestAnimationFrame(frame);
}

// The root uses `scroll-behavior: auto` while this is enabled, so each write lands immediately.
function write(y: number) {
  written = y;
  window.scrollTo(0, y);
}

// A link's glide finishes by navigating to its hash for :target, history, and the focus starting point,
// then holds the slide's position over the browser's own in the same frame.
function arrive(y: number, hash?: string) {
  if (!hash || location.hash === hash) return;
  location.hash = hash;
  write(y);
}

// Hand the page back to the browser, keeping the URL honest if a link's glide was cut short.
function stop() {
  if (glide?.hash && location.hash !== glide.hash) history.pushState(null, '', glide.hash);
  easing = false;
  glide = null;
  current = target = window.scrollY;
}

const glideProgress = (time: number) => (glide ? Math.min(Math.max((time - glide.start) / glide.duration, 0), 1) : 1);

function slideTo(aim: () => number, hash?: string) {
  const from = window.scrollY;
  const to = clamp(aim());
  const distance = Math.abs(to - from);
  easing = false;
  glide = null;
  if (distance < 1) {
    arrive(to, hash);
    return;
  }
  glide = { from, to, aim, start: performance.now(), duration: Math.min(1200, 480 + Math.sqrt(distance) * 15), hash };
  kick();
}

// The layout moved mid-glide (a resize, a project closing): bend the rest of the glide toward where its
// destination is now, starting from where the page already is, so it neither jumps nor lands on the old spot.
function reaim() {
  if (!glide) return;
  const to = clamp(glide.aim());
  if (Math.abs(to - glide.to) < 0.5) return;
  const eased = easeInOutQuart(glideProgress(performance.now()));
  glide.from = eased < 1 ? (current - to * eased) / (1 - eased) : to;
  glide.to = to;
}

function frame(time: number) {
  frameId = 0;
  const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
  lastTime = time;

  if (glide) {
    const t = glideProgress(time);
    current = glide.from + (glide.to - glide.from) * easeInOutQuart(t);
    write(current);
    if (t === 1) {
      const { hash } = glide;
      glide = null;
      target = current;
      arrive(current, hash);
    }
  } else if (easing) {
    target = clamp(target);
    current += (target - current) * (1 - Math.exp(-dt / friction));
    if (Math.abs(target - current) < 0.5) {
      current = target;
      easing = false;
    }
    write(current);
  }

  // Velocity is smoothed so scroll-linked motion leans into a scroll and relaxes after it.
  const y = window.scrollY;
  velocity += ((y - lastY) / dt - velocity) * Math.min(1, dt * 10);
  lastY = y;
  const active = moving() || Math.abs(velocity) > 1;
  if (!active) {
    velocity = 0;
    lastTime = 0;
  }
  const frameState = state();
  listeners.forEach((listener) => listener(frameState));
  if (active) kick();
}

/** Scroll inside a tall area. 0: not inside one, or already at its edge. 1: moved. 2: moved up to its edge. */
function scrollWithin(y: number, direction: number, amount: number) {
  const { rest: [low, high] } = slides()[nearest(y)];
  if (high - low <= 1 || y < low - 1 || y > high + 1) return 0;
  const edge = direction > 0 ? high : low;
  if (Math.abs(edge - y) <= 1) return 0;
  if (!easing) current = window.scrollY;
  target = clamp(y + direction * amount, low, high);
  easing = true;
  kick();
  return Math.abs(edge - target) <= 1 ? 2 : 1;
}

/** Move to the neighbouring area: its top going down, or its last resting place going up. */
function turnPage(y: number, direction: number) {
  const list = slides();
  const index = direction > 0
    ? list.findIndex(({ rest }) => rest[0] > y + 1)
    : list.length - 1 - [...list].reverse().findIndex(({ rest }) => rest[1] < y - 1);
  if (index >= 0 && index < list.length) slideTo(() => slides()[index].rest[direction > 0 ? 0 : 1]);
}

// A pause or a change of direction starts a gesture, and so does a swipe rising out of momentum that has faded
// to half its peak, however gentle: momentum only fades, and while the page rests it can't be seen. It takes two
// rising deltas in a row, as one alone may be several momentum events delivered together. Returns how far a new
// gesture has already come, or null when the event continues the current one.
function gestureStart(time: number, magnitude: number, direction: number) {
  const pause = time - lastWheelAt > gestureGap || direction !== lastWheelDirection;
  lastWheelAt = time;
  lastWheelDirection = direction;
  const surge = wheelTrough <= wheelPeak / 2 && magnitude >= wheelTrough * surgeRatio && magnitude - wheelTrough >= surgeFloor;
  const risen = rising.reduce((sum, value) => sum + value, 0);
  rising = surge ? [...rising, magnitude] : [];
  if (pause || rising.length >= 2) {
    wheelPeak = wheelTrough = magnitude;
    rising = [];
    return pause ? 0 : risen;
  }
  // Peak and trough hold still while a delta might be the start of a new swipe.
  if (!rising.length) {
    wheelTrough = magnitude > wheelPeak ? magnitude : Math.min(wheelTrough, magnitude);
    wheelPeak = Math.max(wheelPeak, magnitude);
  }
  return null;
}

// Leave the wheel alone over anything that scrolls on its own and still has room to.
function scrollsInside(start: EventTarget | null, delta: number) {
  for (let element = start instanceof Element ? start : null; element && element !== document.body; element = element.parentElement) {
    const { overflowY } = getComputedStyle(element);
    if ((overflowY === 'auto' || overflowY === 'scroll') && element.scrollHeight > element.clientHeight + 1) {
      if (delta > 0 ? element.scrollTop + element.clientHeight < element.scrollHeight - 1 : element.scrollTop > 0) return true;
    }
  }
  return false;
}

function onWheel(event: WheelEvent) {
  if (!enabled || event.defaultPrevented || event.ctrlKey || event.shiftKey || document.querySelector('dialog[open]')) return;
  // A sideways gesture stays the browser's. A stray sideways event in a vertical one stays ours, or the page
  // would scroll natively under a slide and cut it short.
  if (event.timeStamp - wheelAxisAt > gestureGap) wheelAxis = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? 'x' : 'y';
  wheelAxisAt = event.timeStamp;
  if (wheelAxis === 'x') return;
  const scale = event.deltaMode === 1 ? 100 / 3 : event.deltaMode === 2 ? root.clientHeight : 1;
  const delta = event.deltaY * scale;
  if (delta && scrollsInside(event.target, delta)) return;
  event.preventDefault();
  if (!delta) return;
  const direction = Math.sign(delta);
  const covered = gestureStart(event.timeStamp, Math.abs(delta), direction);
  if (covered !== null) {
    spent = 0;
    intent = direction * covered;
  }
  // While a slide lands, and for the rest of the gesture that turned it, the wheel only rests.
  if (glide || spent === direction) return;
  const y = easing ? target : window.scrollY;
  const within = scrollWithin(y, direction, Math.abs(delta));
  // Reaching the edge of a tall area is a soft stop: the next gesture turns the page.
  if (within === 2) spent = direction;
  if (within) return;
  intent += delta;
  if (Math.abs(intent) < pageIntent) return;
  spent = direction;
  turnPage(y, direction);
}

function onKeydown(event: KeyboardEvent) {
  if (!enabled || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
  const origin = event.target instanceof Element ? event.target : null;
  if (origin?.closest('input, textarea, select, [contenteditable]')) return;
  if (event.key === ' ' && origin?.closest('button, summary, [role="button"]')) return;
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    const home = event.key === 'Home';
    slideTo(() => {
      const list = slides();
      return home ? list[0].rest[0] : list[list.length - 1].rest[1];
    });
    return;
  }
  const page = root.clientHeight * 0.85;
  const moves: Record<string, readonly [number, number]> = {
    ArrowDown: [1, 90], ArrowUp: [-1, 90], PageDown: [1, page], PageUp: [-1, page], ' ': [event.shiftKey ? -1 : 1, page],
  };
  const move = moves[event.key];
  if (!move) return;
  event.preventDefault();
  if (glide) return;
  const [direction, amount] = move;
  const y = easing ? target : window.scrollY;
  if (!scrollWithin(y, direction, amount)) turnPage(y, direction);
}

// In-page links glide to the area holding their destination, as near the browser's own position as it allows.
function onClick(event: MouseEvent) {
  if (!enabled || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
  // The skip link keeps the browser's instant jump and focus behavior.
  if (!link || link.classList.contains('skip-link')) return;
  const hash = link.getAttribute('href')!;
  const destination = hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (!destination) return;
  event.preventDefault();
  slideTo(() => {
    const top = layoutTop(destination);
    const native = top - (parseFloat(getComputedStyle(destination).scrollMarginTop) || 0) - (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0);
    const list = slides();
    const { rest: [low, high] } = [...list].reverse().find(({ start }) => start <= top + 1) ?? list[0];
    return clamp(native, low, high);
  }, hash);
}

// Anything else that moved the page (scrollbar, find in page, a restored position) settles onto an area.
function scheduleSettle() {
  window.clearTimeout(settleTimer);
  settleTimer = window.setTimeout(() => {
    // Leave keyboard focus where the browser scrolled it, and never pull against a held pointer.
    if (!enabled || moving() || held || performance.now() - focusMovedAt < 600 || document.querySelector('dialog[open]')) return;
    const y = window.scrollY;
    const index = nearest(y);
    const aim = () => clamp(y, ...slides()[index].rest);
    if (Math.abs(aim() - y) > 1) slideTo(aim);
  }, gestureGap);
}

function setMode() {
  enabled = !reducedMotion.matches && !coarsePointer.matches;
  root.classList.toggle('has-slides', !reducedMotion.matches);
  root.classList.toggle('has-smooth-scroll', enabled);
  measured = null;
  if (!enabled && moving()) stop();
}

export function initSmoothScroll() {
  setMode();
  reducedMotion.addEventListener('change', setMode);
  coarsePointer.addEventListener('change', setMode);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKeydown);
  document.addEventListener('click', onClick);
  document.addEventListener('focusin', () => { focusMovedAt = performance.now(); });
  const hold = (on: boolean) => () => {
    held = on;
    if (!on) scheduleSettle();
  };
  // Touch uses its own events: pointercancel fires as soon as the browser takes over a pan.
  window.addEventListener('mousedown', hold(true));
  window.addEventListener('touchstart', hold(true), { passive: true });
  ['mouseup', 'touchend', 'touchcancel', 'blur'].forEach((type) => window.addEventListener(type, hold(false)));
  window.addEventListener('scroll', () => {
    // Something else moved the page (scrollbar, find in page, touch): let it win.
    if (moving() && Math.abs(window.scrollY - written) > 2) stop();
    if (!moving()) {
      current = target = window.scrollY;
      scheduleSettle();
    }
    kick();
  }, { passive: true });
  const relayout = () => {
    measured = null;
    reaim();
    kick();
    scheduleSettle();
  };
  window.addEventListener('resize', relayout);
  // Opening a project changes the page height, and with it every area below.
  new ResizeObserver(relayout).observe(document.body);
}

export function onScrollFrame(listener: (frame: ScrollFrame) => void) {
  listeners.add(listener);
  listener(state());
}
