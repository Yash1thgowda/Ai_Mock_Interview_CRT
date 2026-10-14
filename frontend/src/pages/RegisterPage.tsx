import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, User, Briefcase, AlertCircle, Bot } from 'lucide-react';
import ShapeGrid from '../components/ShapeGrid';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, targetRole);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 overflow-hidden">
      {/* Interactive Animated ShapeGrid Canvas Background */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <ShapeGrid
          shape="hexagon"
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

      {/* Floating Register Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-2xl bg-paper border border-line-strong shadow-soft">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-sage-600 flex items-center justify-center text-white shadow-soft mb-3">
            <Bot className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-semibold text-ink tracking-tight">Create Account</h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">Start practicing with Help Hire</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-mute" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand border border-line-strong text-ink placeholder-mute focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Email Address</label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Target Job Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-3 h-4 w-4 text-mute" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Full-Stack Developer, ML Engineer"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-sand border border-line-strong text-ink placeholder-mute focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500 text-sm transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-mute" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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
            data-cursor-label="Create Account"
            className="w-full mt-2 py-3 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-sm transition shadow-soft disabled:opacity-50 cursor-target"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-soft mt-6">
          Already registered?{' '}
          <Link
            to="/login"
            data-cursor-label="Sign In"
            className="text-sage-700 hover:underline font-semibold cursor-target"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
