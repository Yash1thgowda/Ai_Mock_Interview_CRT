import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { RobotCompanion } from '../components/robot';

const pillars = [
  {
    icon: Mic,
    tint: 'bg-sage-100 text-sage-700',
    title: 'Voice-first practice',
    body: 'A trained NLP model recognises whether you are answering, asking for a repeat, or asking for clarification, so you are never penalised for needing a second listen.',
  },
  {
    icon: TrendingUp,
    tint: 'bg-lav-100 text-lav-700',
    title: 'Adapts as you go',
    body: 'Questions scale from difficulty 1 to 5 and follow-up probes appear when a key concept is missed, much like a real interviewer.',
  },
  {
    icon: Award,
    tint: 'bg-peach-100 text-peach-700',
    title: 'Evidence-based feedback',
    body: 'Five scoring dimensions backed by quotes from your own answers, missing concepts, a PDF report and retry coaching.',
  },
];

const steps = [
  { n: '01', title: 'Upload your resume', body: 'Skills and projects are extracted and matched to your target role.' },
  { n: '02', title: 'Choose your rounds', body: 'Pick Technical, Behavioral, Situational and HR lengths and difficulty.' },
  { n: '03', title: 'Talk it through', body: 'Answer out loud with your webcam and mic, with questions read aloud.' },
  { n: '04', title: 'Review your report', body: 'See your scores, download the PDF and practice the weaker spots.' },
];

export const LandingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero: robot on the left (~40%), message on the right (~60%) */}
      <section className="grid items-center gap-6 pt-8 pb-16 sm:pt-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14 lg:pt-16 lg:pb-24">
        <div className="order-1 lg:order-none">
          <RobotCompanion />
        </div>

        <div className="order-2 text-center lg:order-none lg:text-left">
          <p className="inline-flex items-center rounded-full bg-lav-100 px-3 py-1 text-xs font-medium text-lav-700">
            Help Hire
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            Practice interviews with a calm, friendly buddy.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0">
            Upload your resume, pick a role, and talk through a realistic mock interview. Your buddy listens,
            adapts the questions to you, and shows exactly where your answers can grow.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sage-600 px-7 py-3.5 text-base font-medium text-white shadow-soft transition hover:bg-sage-700 sm:w-auto motion-reduce:transition-none"
            >
              {user ? 'Go to your dashboard' : 'Start practicing free'} <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-base font-medium text-ink-soft transition hover:bg-sand hover:text-ink sm:w-auto motion-reduce:transition-none"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section aria-label="Highlights" className="grid gap-10 border-t border-line py-16 md:grid-cols-3">
        {pillars.map(({ icon: Icon, tint, title, body }) => (
          <div key={title}>
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-line py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">How it works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, title, body }) => (
            <li key={n}>
              <span className="text-sm font-semibold text-sage-600">{n}</span>
              <h4 className="mt-2 font-semibold text-ink">{title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{body}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};
