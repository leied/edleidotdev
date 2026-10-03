const paths: Record<string, string> = {
  arrow: '<path d="M5 19 19 5M5 5h14v14"/>',
  down: '<path d="M12 4v16m-6-6 6 6 6-6"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.4"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  pencil: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0-4-4L5 15l-1 5Z"/>',
  book: '<path d="M12 6C9 3 4 4 2 5v14c3-1 7-1 10 1 3-2 7-2 10-1V5c-2-1-7-2-10 1Zm0 0v14"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
};

export function icon(name: string, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
}

export function asterisk(className = '') {
  return `<svg class="asterisk ${className}" viewBox="0 0 100 100" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-width="7" stroke-linecap="square"><path d="m48 5 4 90M5 49l90 2M18 17l65 66M17 82l66-65"/></g></svg>`;
}
