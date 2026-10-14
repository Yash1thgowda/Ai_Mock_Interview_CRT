import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { RobotAvatar } from './RobotAvatar';
import { RobotSpeechBubble } from './RobotSpeechBubble';
import { decideSectionMessage, isHomePath, markAwayFromHome } from './robotSession';

interface HelperMessage {
  path: string;
  id: number;
  text: string;
}

const SECTION_DELAY_MS = 700;

/**
 * Mounted once at the app root. It does two small jobs:
 *  1. Remembers (in sessionStorage) that the user left the home screen, so the
 *     home companion can say "welcome back" later.
 *  2. On non-home screens, shows a short contextual comment from a tiny robot in
 *     the bottom-left corner. It fades away by itself and can be dismissed.
 * It renders nothing on the home screen, where the big companion lives.
 */
export const RobotRouteHelper: React.FC = () => {
  const { pathname, state } = useLocation();
  const [message, setMessage] = useState<HelperMessage | null>(null);

  useEffect(() => {
    markAwayFromHome(pathname);
    if (isHomePath(pathname)) return;

    // Decide inside the timer and clean it up, so Strict Mode's double effect
    // and quick navigation cannot produce duplicate messages.
    const timer = window.setTimeout(() => {
      const text = decideSectionMessage(pathname, state);
      if (text) setMessage({ path: pathname, id: Date.now(), text });
    }, SECTION_DELAY_MS);
    return () => window.clearTimeout(timer);
    // `state` is intentionally read once per navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!message || message.path !== pathname || isHomePath(pathname)) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex max-w-[calc(100vw-2rem)] items-end gap-2">
      <RobotAvatar className="h-auto w-14 shrink-0 drop-shadow-sm" />
      <RobotSpeechBubble
        key={message.id}
        message={message.text}
        tail="left"
        durationMs={6500}
        onDismiss={() => setMessage(null)}
        className="pointer-events-auto mb-3 w-64 max-w-full"
      />
    </div>
  );
};
