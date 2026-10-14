import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { BUBBLE_DURATION_MS } from './robotMessages';

interface RobotSpeechBubbleProps {
  message: string;
  /** Called after the bubble has faded out (auto-dismiss or the close button). */
  onDismiss: () => void;
  /** Which side the little tail sits on, pointing at the robot. */
  tail?: 'bottom' | 'left';
  durationMs?: number;
  className?: string;
}

const FADE_MS = 250;

/**
 * Soft speech bubble that fades and rises in, pauses its timer while hovered
 * or focused, and fades out on its own. It lives in normal layout flow (or in
 * a fixed corner for the helper), so it is never clipped by a container.
 */
export const RobotSpeechBubble: React.FC<RobotSpeechBubbleProps> = ({
  message,
  onDismiss,
  tail = 'bottom',
  durationMs = BUBBLE_DURATION_MS,
  className = '',
}) => {
  const [leaving, setLeaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  // Auto-dismiss timer (restarts when un-paused).
  useEffect(() => {
    if (paused || leaving) return;
    const timer = window.setTimeout(() => setLeaving(true), durationMs);
    return () => window.clearTimeout(timer);
  }, [paused, leaving, durationMs]);

  // Once fading out, remove it after the transition.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => onDismissRef.current(), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  const tailClasses =
    tail === 'bottom'
      ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-b border-r'
      : 'top-1/2 -left-1.5 -translate-y-1/2 border-b border-l';

  return (
    <div
      role="status"
      data-testid="robot-bubble"
      aria-live="polite"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`bubble-enter relative max-w-full ${className}`}
    >
      <div
        className={`relative rounded-[1.6rem] border border-line bg-paper pl-5 pr-9 py-3 text-sm leading-relaxed text-ink shadow-lift transition duration-200 motion-reduce:transition-none ${
          leaving ? 'translate-y-1 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {message}
        <button
          type="button"
          onClick={() => setLeaving(true)}
          aria-label="Dismiss message"
          className="absolute right-2 top-2 rounded-full p-1 text-mute transition hover:bg-sand hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <span
          aria-hidden="true"
          className={`absolute h-3 w-3 rotate-45 border-line bg-paper ${tailClasses}`}
        />
      </div>
    </div>
  );
};
