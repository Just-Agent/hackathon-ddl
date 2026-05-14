import { useState, useEffect } from 'react';
import { Sun, Moon, GitPullRequest } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-9 left-0 right-0 z-50 transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-page)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Hackathon-DDL"
              className="h-7 w-7"
              style={{ filter: isDark ? 'invert(1)' : 'none' }}
            />
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Hackathon-DDL
            </span>
          </Link>
          <span
            className="hidden items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium sm:inline-flex"
            style={{
              backgroundColor: 'var(--bg-hover)',
              color: 'var(--text-secondary)',
            }}
          >
            GitHub Pages
          </span>
        </div>

        {/* Center: GitHub star badge (mobile visible) */}
        <div className="flex items-center gap-3">
          {/* Right: Theme toggle + Contribute */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = 'transparent')
            }
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span className="transition-transform duration-300" style={{ transform: isDark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </span>
          </button>

          <Link
            to="/contribute"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors duration-150"
            style={{ color: 'var(--accent-blue)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            <GitPullRequest size={14} />
            <span className="hidden sm:inline">Contribute</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
