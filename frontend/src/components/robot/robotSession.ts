import { HOME_PATHS, RETURN_COOLDOWN_MS, robotMessages } from './robotMessages';

/**
 * Tiny sessionStorage-backed memory for the robot. It exists so the robot can
 * tell "first visit this session" from "came back from another section" even
 * though the big companion unmounts whenever the user leaves the home screen.
 * Every access is wrapped because storage can be unavailable (private mode).
 */

const K = {
  greeted: 'robot:greeted',
  away: 'robot:away',
  lastReturnAt: 'robot:lastReturnAt',
  seenSections: 'robot:seenSections',
  last: (category: string) => `robot:last:${category}`,
};

const read = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const write = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
};

export const isHomePath = (pathname: string) => HOME_PATHS.includes(pathname);

/** First path segment, e.g. "/reports/abc" -> "reports". */
export const sectionOf = (pathname: string) => pathname.split('/').filter(Boolean)[0] ?? '';

/** Auth screens are not "sections" the user wandered off to. */
const isAuthPath = (pathname: string) => ['login', 'register'].includes(sectionOf(pathname));

/** Pick a message, avoiding the one used last time for this category. */
export const pickMessage = (category: string, options: string[]): string | null => {
  if (options.length === 0) return null;
  if (options.length === 1) return options[0];
  const lastIndex = Number(read(K.last(category)) ?? -1);
  let index = Math.floor(Math.random() * options.length);
  if (index === lastIndex) index = (index + 1) % options.length;
  write(K.last(category), String(index));
  return options[index];
};

/** Called when the user is on a non-home screen so a later return is noticed. */
export const markAwayFromHome = (pathname: string) => {
  if (isHomePath(pathname) || isAuthPath(pathname)) return;
  write(K.away, '1');
};

/**
 * Decide what (if anything) the home companion should say right now.
 * Reads and updates the session flags, so call it only when you are about to
 * actually show the result (inside the delayed callback, not during render).
 */
export const decideHomeMessage = (): string | null => {
  if (!read(K.greeted)) {
    write(K.greeted, '1');
    write(K.away, '0');
    return pickMessage('firstVisit', robotMessages.firstVisit);
  }

  if (read(K.away) === '1') {
    write(K.away, '0');
    const lastAt = Number(read(K.lastReturnAt) ?? 0);
    if (Date.now() - lastAt < RETURN_COOLDOWN_MS) return null;
    write(K.lastReturnAt, String(Date.now()));
    return pickMessage('returning', robotMessages.returning);
  }

  return null;
};

/**
 * Decide what the small helper should say when a section opens.
 * Sections are commented on once per session, except the interview room,
 * which gets its pep talk every time a new interview begins.
 */
export const decideSectionMessage = (pathname: string, state: unknown): string | null => {
  const section = sectionOf(pathname);

  if (section === 'reports') {
    const finished = Boolean((state as { fromInterview?: boolean } | null)?.fromInterview);
    return finished ? pickMessage('finishedInterview', robotMessages.finishedInterview) : null;
  }

  const options = robotMessages.sections[section];
  if (!options) return null;

  if (section !== 'room') {
    let seen: string[] = [];
    try {
      seen = JSON.parse(read(K.seenSections) ?? '[]');
    } catch {
      seen = [];
    }
    if (seen.includes(section)) return null;
    write(K.seenSections, JSON.stringify([...seen, section]));
  }

  return pickMessage(`section:${section}`, options);
};
