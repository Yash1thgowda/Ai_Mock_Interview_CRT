import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, User, FileText, History, LayoutDashboard, LogOut, PlayCircle } from 'lucide-react';

const linkBase =
  'px-2.5 sm:px-3 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 motion-reduce:transition-none';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;
  const quietLink = (path: string) =>
    `${linkBase} ${isActive(path) ? 'bg-sage-100 text-sage-700' : 'text-ink-soft hover:bg-sand hover:text-ink'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="Adaptive AI Mock Interview, home" className="flex shrink-0 items-center gap-3 rounded-xl">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lav-100 text-lav-700">
            <Bot className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="hidden text-base font-semibold tracking-tight text-ink min-[430px]:inline">Adaptive AI</span>
            <span className="ml-1.5 hidden text-xs font-medium text-mute sm:inline">Mock Interview</span>
          </div>
        </Link>

        {user ? (
          <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
            <Link to="/dashboard" aria-label="Dashboard" className={quietLink('/dashboard')}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden lg:inline">Dashboard</span>
            </Link>
            <Link to="/resumes" aria-label="Resumes" className={quietLink('/resumes')}>
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Resumes</span>
            </Link>
            <Link to="/history" aria-label="History" className={quietLink('/history')}>
              <History className="h-4 w-4" />
              <span className="hidden lg:inline">History</span>
            </Link>
            <Link to="/profile" aria-label="Profile" className={quietLink('/profile')}>
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
            <Link
              to="/setup"
              aria-label="Start Interview"
              className={`${linkBase} ml-1 bg-sage-600 text-white shadow-soft hover:bg-sage-700 sm:ml-2`}
            >
              <PlayCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Start Interview</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 rounded-xl p-2 text-mute transition hover:bg-rose-50 hover:text-rose-700 motion-reduce:transition-none"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-ink-soft transition hover:bg-sand hover:text-ink motion-reduce:transition-none"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-sage-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-sage-700 motion-reduce:transition-none"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
