import { useEffect, useCallback, useState, useRef } from 'react';
import { X, Calendar, MapPin, Globe, Trophy, ExternalLink, Share2, ChevronDown } from 'lucide-react';
import type { Hackathon } from '../data/hackathons';
import { getPlatformColor, getThemeTagStyle } from '../data/hackathons';

interface DetailModalProps {
  hackathon: Hackathon | null;
  onClose: () => void;
}

function generateICS(hackathon: Hackathon): string {
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hackathon-DDL//EN',
    'BEGIN:VEVENT',
    `UID:${hackathon.id}@hackathon-ddl.com`,
    `DTSTAMP:${dtStamp}`,
    `SUMMARY:${hackathon.title}`,
    `DESCRIPTION:Register at: ${hackathon.url}\\nPrize Pool: ${hackathon.prizePool} ${hackathon.currency}\\nEligibility: ${hackathon.eligibility}`,
    `LOCATION:${hackathon.location}`,
    `URL:${hackathon.url}`,
  ];
  const startPhase = hackathon.phases[0];
  const endPhase = hackathon.phases[hackathon.phases.length - 1];
  if (startPhase && endPhase) {
    const start = new Date(startPhase.deadline).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(endPhase.deadline).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
  }
  lines.push('END:VEVENT', 'END:VCALENDAR', '');
  return lines.join('\r\n');
}

export default function DetailModal({ hackathon, onClose }: DetailModalProps) {
  const [showCalendarMenu, setShowCalendarMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setShowCalendarMenu(false);
    setCopied(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (hackathon) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [hackathon, handleClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowCalendarMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!hackathon) return null;

  const platformColor = getPlatformColor(hackathon.platform);
  const prizePercent = Math.min((hackathon.prizeValue / 150000) * 100, 100);

  const now = Date.now();
  const currentPhaseIdx = hackathon.phases.findIndex(
    (p) => new Date(p.deadline).getTime() > now
  );
  const activeIndex = currentPhaseIdx === -1 ? hackathon.phases.length : currentPhaseIdx;

  const handleDownloadICS = () => {
    const ics = generateICS(hackathon);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${hackathon.id}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowCalendarMenu(false);
  };

  const handleGoogleCalendar = () => {
    const start = new Date(hackathon.phases[0]?.deadline || '');
    const end = new Date(hackathon.phases[hackathon.phases.length - 1]?.deadline || '');
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: hackathon.title,
      details: `Register at: ${hackathon.url}\nPrize: ${hackathon.prizePool} ${hackathon.currency}`,
      location: hackathon.location,
      dates: `${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    });
    window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
    setShowCalendarMenu(false);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#/${hackathon.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatLabel = hackathon.isOnline
    ? 'Online'
    : hackathon.isHybrid
    ? 'Hybrid'
    : 'In-person';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div
        className="relative mx-4 max-h-[90vh] w-full max-w-[800px] overflow-y-auto rounded-2xl p-4 sm:p-8"
        style={{
          backgroundColor: 'var(--bg-page)',
          animation: 'modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 sm:right-6 sm:top-6"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-10">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: platformColor }}
          >
            {hackathon.platform[0]}
          </span>
          <h2
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {hackathon.title}
          </h2>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: 'var(--accent-blue-light)',
              color: 'var(--accent-blue)',
            }}
          >
            {hackathon.status}
          </span>
        </div>

        <div
          className="my-4 h-px w-full"
          style={{ backgroundColor: 'var(--border-light)' }}
        />

        {/* Overview Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Dates</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
              {hackathon.dateRange}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Location</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
              {hackathon.location}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Format</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              <Globe size={14} style={{ color: 'var(--text-muted)' }} />
              {formatLabel}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Platform</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: platformColor }} />
              {hackathon.platform}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Prize Pool</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--accent-purple)' }}>
              <Trophy size={14} />
              {hackathon.prizePool} {hackathon.currency}
            </p>
          </div>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Website</p>
            <a
              href={hackathon.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              <ExternalLink size={14} />
              Visit website
            </a>
          </div>
        </div>

        {/* Prize Heat Bar */}
        <div className="mt-6">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Prize Pool
          </h3>
          <p
            className="mt-1 text-[28px] font-bold"
            style={{ color: 'var(--accent-purple)' }}
          >
            {hackathon.prizePool} {hackathon.currency}
          </p>
          <div
            className="mt-2 h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--border-light)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${prizePercent}%`,
                background: 'linear-gradient(to right, var(--accent-blue), var(--accent-purple), var(--accent-orange))',
              }}
            />
          </div>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            Top {Math.max(1, Math.round((1 - prizePercent / 100) * 100))}% of tracked hackathons
          </p>
        </div>

        {/* Full Phase Timeline */}
        <div className="mt-6">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Phase Timeline
          </h3>
          <div className="relative mt-3 pl-6">
            <div
              className="absolute left-[5px] top-0 h-full w-0.5"
              style={{ backgroundColor: 'var(--border-light)' }}
            />
            {hackathon.phases.map((phase, idx) => {
              const isCompleted = idx < activeIndex;
              const isCurrent = idx === activeIndex;
              const isFuture = idx > activeIndex;
              const nodeColor = isCompleted
                ? 'var(--accent-green)'
                : isCurrent
                ? 'var(--accent-blue)'
                : 'var(--border-medium)';

              return (
                <div
                  key={idx}
                  className="relative mb-4 flex items-start gap-4 last:mb-0"
                  style={
                    isCurrent
                      ? {
                          backgroundColor: 'var(--accent-blue-light)',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          marginLeft: '-24px',
                        }
                      : {}
                  }
                >
                  <div
                    className="absolute -left-[19px] top-1.5 h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: isFuture ? 'var(--bg-page)' : nodeColor,
                      border: `2px solid ${nodeColor}`,
                      boxShadow: isCurrent
                        ? '0 0 0 4px rgba(59,130,246,0.2)'
                        : 'none',
                    }}
                  />
                  <div className="flex-1">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {phase.name}
                    </p>
                    <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      {new Date(phase.deadline).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {isCurrent && (
                      <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        Current phase — don&apos;t miss this deadline!
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme Tags */}
        <div className="mt-6">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Themes
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {hackathon.themes.map((theme) => {
              const style = getThemeTagStyle(theme);
              return (
                <span
                  key={theme}
                  className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium ${style.bg} ${style.text}`}
                >
                  {theme}
                </span>
              );
            })}
          </div>
        </div>

        {/* Sponsors */}
        {hackathon.sponsors.length > 0 && (
          <div className="mt-6">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Sponsors
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {hackathon.sponsors.map((sponsor) => (
                <span
                  key={sponsor}
                  className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm"
                  style={{
                    borderColor: 'var(--border-light)',
                    color: 'var(--text-primary)',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  {sponsor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility */}
        <div className="mt-6">
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Eligibility
          </h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {hackathon.eligibility}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={hackathon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center gap-2 rounded-[10px] px-6 text-sm font-semibold text-white transition-all duration-150 hover:scale-[1.02]"
            style={{ backgroundColor: 'var(--accent-orange)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EA580C')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-orange)')}
          >
            <ExternalLink size={16} />
            Register Now
          </a>

          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowCalendarMenu((prev) => !prev)}
              className="flex h-11 items-center gap-2 rounded-[10px] border px-5 text-sm font-medium transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
              }}
            >
              <Calendar size={16} />
              Add to Calendar
              <ChevronDown size={14} />
            </button>

            {showCalendarMenu && (
              <div
                className="absolute left-0 top-full z-10 mt-1 overflow-hidden rounded-lg border py-1 shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderColor: 'var(--border-light)',
                }}
              >
                <button
                  onClick={handleGoogleCalendar}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <ExternalLink size={14} />
                  Google Calendar
                </button>
                <button
                  onClick={handleDownloadICS}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <Calendar size={14} />
                  Download .ics file
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="relative flex h-11 w-11 items-center justify-center rounded-[10px] border transition-colors duration-150"
            style={{
              borderColor: 'var(--border-medium)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Share2 size={16} />
            {copied && (
              <span
                className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs text-white"
                style={{ backgroundColor: 'var(--text-primary)' }}
              >
                Link copied!
              </span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
