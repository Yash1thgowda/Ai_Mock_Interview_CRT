import React from 'react';

export type RobotExpression = 'happy' | 'cheer' | 'curious';

interface RobotAvatarProps {
  expression?: RobotExpression;
  blinking?: boolean;
  /** Restarts the one-shot hop/wave animation whenever it changes. */
  reactionKey?: number;
  className?: string;
}

const INK = '#2d2d32';

/**
 * Purely presentational robot drawn in SVG (no images, no libraries).
 * Gaze and head tilt are driven by the CSS variables --look-x / --look-y that
 * the parent sets on the element, so pointer tracking never re-renders React.
 */
export const RobotAvatar: React.FC<RobotAvatarProps> = ({
  expression = 'happy',
  blinking = false,
  reactionKey = 0,
  className,
}) => {
  const reacting = reactionKey > 0;
  const eyeShift = expression === 'curious' ? 'translate(3 -2)' : undefined;

  return (
    <svg viewBox="0 0 240 270" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="robot-head-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8f5fd" />
          <stop offset="1" stopColor="#e3ddf3" />
        </linearGradient>
        <linearGradient id="robot-body-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf3ed" />
          <stop offset="1" stopColor="#cddfd3" />
        </linearGradient>
      </defs>

      <ellipse className="robot-ground-shadow" cx="120" cy="257" rx="54" ry="7" fill="#d8cdb9" />

      <g className="robot-float">
        <g key={reactionKey} className={reacting ? 'robot-hop' : undefined}>
          {/* arms */}
          <rect x="60" y="188" width="17" height="42" rx="8.5" fill="#cddfd3" />
          <g className={reacting ? 'robot-arm-wave' : undefined}>
            <rect x="163" y="188" width="17" height="42" rx="8.5" fill="#cddfd3" />
          </g>

          {/* feet */}
          <ellipse cx="101" cy="241" rx="17" ry="9" fill="#dcd5ee" />
          <ellipse cx="139" cy="241" rx="17" ry="9" fill="#dcd5ee" />

          {/* body */}
          <rect x="78" y="170" width="84" height="72" rx="30" fill="url(#robot-body-fill)" />
          <circle cx="120" cy="208" r="11" fill="#fffefb" />
          <circle className="robot-bulb" cx="120" cy="208" r="5.5" fill="#7fa08c" />

          {/* head */}
          <g className="robot-head">
            <line x1="120" y1="60" x2="120" y2="41" stroke="#c9c0e6" strokeWidth="4" strokeLinecap="round" />
            <circle className="robot-bulb" cx="120" cy="34" r="8" fill="#f5c9ab" />
            <circle cx="42" cy="118" r="11" fill="#dcd5ee" />
            <circle cx="198" cy="118" r="11" fill="#dcd5ee" />
            <rect x="46" y="58" width="148" height="118" rx="46" fill="url(#robot-head-fill)" />
            <rect x="62" y="74" width="116" height="86" rx="34" fill="#fffefb" />

            <g className="robot-face">
              <ellipse cx="80" cy="135" rx="9" ry="5.5" fill="#f8c4ac" opacity="0.75" />
              <ellipse cx="160" cy="135" rx="9" ry="5.5" fill="#f8c4ac" opacity="0.75" />

              {expression === 'cheer' ? (
                <>
                  <path d="M90 117 Q98 103 106 117" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M134 117 Q142 103 150 117" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M108 131 Q120 151 132 131 Z" fill="#e9a99b" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <g transform={eyeShift}>
                    <g className="robot-eye" data-blink={blinking}>
                      <ellipse cx="98" cy="112" rx="6.5" ry="9" fill={INK} />
                      <circle cx="100" cy="108" r="2" fill="#fffefb" />
                    </g>
                    <g className="robot-eye" data-blink={blinking}>
                      <ellipse cx="142" cy="112" rx="6.5" ry="9" fill={INK} />
                      <circle cx="144" cy="108" r="2" fill="#fffefb" />
                    </g>
                  </g>
                  {expression === 'curious' ? (
                    <ellipse cx="120" cy="136" rx="4" ry="5" fill={INK} />
                  ) : (
                    <path d="M110 133 Q120 142 130 133" fill="none" stroke={INK} strokeWidth="3.8" strokeLinecap="round" />
                  )}
                </>
              )}
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
