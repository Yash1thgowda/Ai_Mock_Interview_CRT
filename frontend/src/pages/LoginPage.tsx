import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Bot, Sparkles } from 'lucide-react';
import ShapeGrid from '../components/ShapeGrid';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ShapeGrid customization options
  const [shape, setShape] = useState<'hexagon' | 'square' | 'triangle' | 'circle'>('hexagon');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 overflow-hidden">
      {/* Interactive Animated ShapeGrid Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ShapeGrid
          shape={shape}
          direction="diagonal"
          speed={0.6}
          squareSize={45}
          borderColor="#e9e2d6"
          hoverFillColor="rgba(127, 160, 140, 0.28)"
          vignetteInner="rgba(250, 247, 242, 0)"
          vignetteOuter="#faf7f2"
          hoverTrailAmount={6}
        />
      </div>

      {/* Floating Login Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl bg-paper border border-line-strong shadow-soft">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-sage-600 flex items-center justify-center text-white shadow-soft mb-3">
            <Bot className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-ink tracking-tight">Welcome Back</h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">Sign in to your adaptive mock interview portal</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-mute" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand border border-line-strong text-ink placeholder-mute focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-mute" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-sand border border-line-strong text-ink placeholder-mute focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500 text-sm transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-ink-soft hover:text-ink transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-cursor-label="Sign In"
            className="w-full mt-2 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition shadow-soft disabled:opacity-50 cursor-target"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Interactive Shape Switcher Pill */}
        <div className="mt-6 pt-5 border-t border-line flex items-center justify-between text-[11px] text-ink-soft">
          <span className="flex items-center gap-1 text-ink-soft">
            <Sparkles className="h-3.5 w-3.5 text-sage-700" /> Grid Style:
          </span>
          <div className="flex items-center gap-1 bg-sand p-1 rounded-lg border border-line-strong">
            {(['hexagon', 'square', 'triangle', 'circle'] as const).map((s) => (
              <button
                key={s}
                type="button"
                data-cursor-label={s}
                onClick={() => setShape(s)}
                className={`px-2 py-0.5 rounded capitalize transition cursor-target ${
                  shape === s ? 'bg-sage-600 text-white font-semibold' : 'text-ink-soft hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-ink-soft mt-5">
          Don't have an account?{' '}
          <Link
            to="/register"
            data-cursor-label="Sign Up"
            className="text-sage-700 hover:underline font-semibold cursor-target"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
