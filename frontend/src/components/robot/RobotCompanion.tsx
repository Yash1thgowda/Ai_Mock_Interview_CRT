import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RobotAvatar, RobotExpression } from './RobotAvatar';
import { RobotSpeechBubble } from './RobotSpeechBubble';
import { GREETING_DELAY_MS, robotMessages } from './robotMessages';
import { decideHomeMessage, pickMessage } from './robotSession';
import { useReducedMotion } from './useReducedMotion';

interface Message {
  id: number;
  text: string;
}

interface RobotCompanionProps {
  className?: string;
}

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

/**
 * The big home-screen buddy: idles (float, blink, occasional curious look),
 * glances toward the pointer, reacts when clicked, and says short hellos in a
 * speech bubble. All motion is skipped for users who prefer reduced motion.
 */
export const RobotCompanion: React.FC<RobotCompanionProps> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLButtonElement | null>(null);

  const [message, setMessage] = useState<Message | null>(null);
  const [blinking, setBlinking] = useState(false);
  const [expression, setExpression] = useState<RobotExpression>('happy');
  const [reactionKey, setReactionKey] = useState(0);
  const lastPokeAt = useRef(0);
  const cheerTimer = useRef<number | undefined>(undefined);

  const cheer = useCallback((ms = 1400) => {
    setExpression('cheer');
    window.clearTimeout(cheerTimer.current);
    cheerTimer.current = window.setTimeout(() => setExpression('happy'), ms);
  }, []);

  // Greeting. The decision is made inside the timer (not at render/mount), and the
  // timer is cleared on cleanup, so React Strict Mode's double-mount only greets once.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const text = decideHomeMessage();
      if (text) {
        setMessage({ id: Date.now(), text });
        if (!reducedMotion) cheer(1200);
      }
    }, GREETING_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [cheer, reducedMotion]);

  // Occasional blink.
  useEffect(() => {
    if (reducedMotion) return;
    let wait: number | undefined;
    let close: number | undefined;
    const schedule = () => {
      wait = window.setTimeout(() => {
        setBlinking(true);
        close = window.setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 140);
      }, 2600 + Math.random() * 3600);
    };
    schedule();
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(close);
    };
  }, [reducedMotion]);

  // Rare curious glance.
  useEffect(() => {
    if (reducedMotion) return;
    let wait: number | undefined;
    let back: number | undefined;
    const schedule = () => {
      wait = window.setTimeout(() => {
        setExpression((current) => (current === 'happy' ? 'curious' : current));
        back = window.setTimeout(() => {
          setExpression((current) => (current === 'curious' ? 'happy' : current));
          schedule();
        }, 1500);
      }, 14000 + Math.random() * 10000);
    };
    schedule();
    return () => {
      window.clearTimeout(wait);
      window.clearTimeout(back);
    };
  }, [reducedMotion]);

  // Look toward the pointer via CSS variables (no React re-render per move).
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const rect = stage.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
        const dy = (event.clientY - (rect.top + rect.height / 3)) / (window.innerHeight / 2);
        stage.style.setProperty('--look-x', clamp(dx).toFixed(2));
        stage.style.setProperty('--look-y', clamp(dy).toFixed(2));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  useEffect(() => () => window.clearTimeout(cheerTimer.current), []);

  const handlePoke = () => {
    const now = Date.now();
    if (now - lastPokeAt.current < 700) return;
    lastPokeAt.current = now;
    const text = pickMessage('poke', robotMessages.poke);
    if (text) setMessage({ id: now, text });
    if (!reducedMotion) {
      setReactionKey((k) => k + 1);
      cheer();
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Reserved slot so the layout does not jump when the bubble appears. */}
      <div className="flex min-h-[5.5rem] w-full max-w-xs items-end justify-center px-1 pb-2 sm:min-h-[7rem] sm:pb-3">
        {message && (
          <RobotSpeechBubble
            key={message.id}
            message={message.text}
            onDismiss={() => setMessage((current) => (current?.id === message.id ? null : current))}
            className="w-full"
          />
        )}
      </div>

      <button
        ref={stageRef}
        type="button"
        onClick={handlePoke}
        aria-label="Say hi to your interview buddy"
        className="cursor-pointer rounded-[2rem] p-2 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.99] motion-reduce:transition-none"
      >
        <RobotAvatar
          expression={expression}
          blinking={blinking}
          reactionKey={reactionKey}
          className="h-auto w-32 sm:w-48 lg:w-60"
        />
      </button>
    </div>
  );
};
