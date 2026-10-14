/**
 * All robot dialogue lives here so it is easy to tweak or translate.
 * Messages are static and local: nothing here calls an API, and none of them
 * claim to know the user's performance, mood or history.
 */

export const robotMessages = {
  /** Shown once per browsing session, shortly after the home screen loads. */
  firstVisit: ['Hey, welcome! ✨ Ready to get a little more confident today?'],

  /** Shown when the user comes back to the home screen from another section. */
  returning: [
    "Oh, you're back! 😊",
    'Welcome back! Ready for another round?',
    'There you are! What shall we work on today?',
    "Back for some practice? I've got you.",
  ],

  /** Short comments when the user opens a section. Keyed by first URL segment. */
  sections: {
    setup: ["Let's warm up those interview skills!"],
    'device-check': ["Quick camera and mic check, then we're ready."],
    room: ["Alright, let's do this. You've got this!"],
    resumes: ['Your resume helps me shape the questions.'],
    history: ['Your past sessions live here. Take your time.'],
    practice: ['Practice gets easier one question at a time.'],
    profile: ['A few details here help tailor your interviews.'],
  } as Record<string, string[]>,

  /** Shown on the report page only when the user has just finished an interview. */
  finishedInterview: ['Nice work showing up and giving it a try!'],

  /** Shown when the user clicks or taps the robot. */
  poke: [
    'Hi there! 👋',
    'Hehe, that tickles!',
    "I'm right here whenever you're ready.",
    'Take a breath. You can do this.',
    'Ready when you are! ✨',
  ],
};

/** Routes where the big companion lives. */
export const HOME_PATHS = ['/', '/dashboard'];

/** Delay before an automatic greeting so it never interrupts page load. */
export const GREETING_DELAY_MS = 900;

/** How long a bubble stays up before fading away on its own. */
export const BUBBLE_DURATION_MS = 9000;

/** Minimum gap between two "welcome back" messages (stops rapid-nav spam). */
export const RETURN_COOLDOWN_MS = 15000;
