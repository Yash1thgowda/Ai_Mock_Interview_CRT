import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PlayCircle, TrendingUp, FileText, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { RobotCompanion } from '../components/robot';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.getHistory();
        setHistory(res.history || []);
      } catch (err) {
        console.error(err);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const completedSessions = history.filter(s => s.status === 'completed');
  const latestSession = completedSessions.length > 0 ? completedSessions[0] : null;

  // Chart data
  const chartData = completedSessions
    .slice()
    .reverse()
    .map((s, idx) => ({
      name: `Session ${idx + 1}`,
      score: s.overall_score || 0,
      role: s.target_role,
    }));

  const displayName = user?.profile?.full_name || user?.email?.split('@')[0] || 'there';
  const targetRole = user?.profile?.target_role;
  const pending = loading ? '…' : null;

  const stats = [
    {
      label: 'Completed interviews',
      value: pending ?? String(completedSessions.length),
    },
    {
      label: 'Latest score',
      value: pending ?? (latestSession?.overall_score ? `${latestSession.overall_score}%` : '—'),
    },
    {
      label: 'Latest difficulty',
      value: pending ?? (latestSession?.final_difficulty ? `Level ${latestSession.final_difficulty}` : '—'),
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
        {/* Left: robot companion (about 40%) */}
        <aside className="lg:sticky lg:top-24">
          <RobotCompanion />
        </aside>

        {/* Right: dashboard content (about 60%) */}
        <div className="min-w-0 space-y-10">
          {/* Welcome and the one primary action */}
          <section>
            <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Hello, {displayName}</h1>
            <p className="mt-2 max-w-xl text-ink-soft">
              {targetRole ? (
                <>Preparing for <span className="font-medium text-ink">{targetRole}</span>. Pick up where you left off, or start fresh.</>
              ) : (
                <>
                  Tell us your target role in your{' '}
                  <Link to="/profile" className="font-medium text-sage-700 underline underline-offset-2 hover:text-sage-600">profile</Link>{' '}
                  to tailor your questions.
                </>
              )}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/setup"
                className="inline-flex items-center gap-2 rounded-xl bg-sage-600 px-6 py-3 text-sm font-medium text-white shadow-soft transition hover:bg-sage-700 motion-reduce:transition-none"
              >
                <PlayCircle className="h-5 w-5" /> Start a new interview
              </Link>
              <Link
                to="/resumes"
                className="inline-flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition hover:bg-sand hover:text-ink motion-reduce:transition-none"
              >
                <FileText className="h-4 w-4" /> Manage resumes
              </Link>
            </div>
          </section>

          {loadFailed && (
            <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              We couldn&apos;t load your sessions just now. Please refresh in a moment.
            </p>
          )}

          {/* Real numbers only */}
          <section aria-label="Summary" className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-paper shadow-soft">
            {stats.map(({ label, value }) => (
              <div key={label} className="px-4 py-5 sm:px-6">
                <p className="text-xs font-medium text-mute">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">{value}</p>
              </div>
            ))}
          </section>

          {/* Trend */}
          <section className="rounded-2xl border border-line bg-paper p-6 shadow-soft">
            <h2 className="text-base font-semibold text-ink">Score trend</h2>
            <p className="text-xs text-mute">Overall score across your completed interviews</p>

            {chartData.length > 0 ? (
              <div className="mt-4 h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ebe5da" />
                    <XAxis dataKey="name" stroke="#ddd5c7" tick={{ fill: '#6d6d76', fontSize: 12 }} />
                    <YAxis domain={[0, 100]} stroke="#ddd5c7" tick={{ fill: '#6d6d76', fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#fffefb', borderColor: '#ddd5c7', borderRadius: '12px' }}
                      itemStyle={{ color: '#44654f' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#547a62"
                      strokeWidth={2.5}
                      dot={{ fill: '#547a62', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="mt-4 flex h-56 flex-col items-center justify-center rounded-xl bg-sand/70 p-6 text-center">
                <TrendingUp className="mb-2 h-7 w-7 text-mute" />
                <p className="text-sm font-medium text-ink">
                  {loading ? 'Loading your sessions…' : 'No completed interviews yet'}
                </p>
                {!loading && (
                  <>
                    <p className="mt-1 text-xs text-ink-soft">Finish your first mock interview and your progress shows up here.</p>
                    <Link
                      to="/setup"
                      className="mt-4 rounded-xl bg-sage-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-sage-700 motion-reduce:transition-none"
                    >
                      Start your first interview
                    </Link>
                  </>
                )}
              </div>
            )}
          </section>

          {/* Recent sessions */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Recent sessions</h2>
              <Link to="/history" className="inline-flex items-center gap-1 text-sm font-medium text-sage-700 hover:text-sage-600">
                See all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {history.length > 0 ? (
              <ul className="divide-y divide-line rounded-2xl border border-line bg-paper shadow-soft">
                {history.slice(0, 4).map((s) => (
                  <li key={s.session_id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <h3 className="text-sm font-semibold text-ink">{s.target_role}</h3>
                      <p className="text-xs text-mute">
                        {new Date(s.created_at).toLocaleDateString()} • {s.total_questions} questions
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        s.status === 'completed' ? 'bg-sage-100 text-sage-700' : 'bg-peach-100 text-peach-700'
                      }`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                      {s.has_report && (
                        <Link
                          to={`/reports/${s.session_id}`}
                          className="rounded-xl bg-sand px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-line motion-reduce:transition-none"
                        >
                          View report
                        </Link>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-2xl border border-dashed border-line-strong px-5 py-8 text-center text-sm text-mute">
                {loading ? 'Loading…' : 'No sessions yet. Your interviews will appear here.'}
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
