import { useMemo } from 'react';
import { Calendar, MapPin, Globe, Trophy, ExternalLink } from 'lucide-react';
import type { Hackathon } from '../data/hackathons';
import { getPlatformColor, getThemeTagStyle, getNextDeadline } from '../data/hackathons';
import { useCountdown } from '../hooks/useCountdown';

interface HackathonCardProps {
  hackathon: Hackathon;
  onOpenDetail: (h: Hackathon) => void;
}

const URGENCY_STYLES = {
  critical: {
    color: 'var(--accent-red)',
    borderLeft: '3px solid var(--accent-red)',
  },
  warning: {
    color: 'var(--accent-yellow)',
    borderLeft: '3px solid var(--accent-yellow)',
  },
  safe: {
    color: 'var(--accent-green)',
    borderLeft: '3px solid var(--accent-green)',
  },
  ended: {
    color: 'var(--text-muted)',
    borderLeft: '3px solid var(--border-light)',
  },
};

export default function HackathonCard({ hackathon, onOpenDetail }: HackathonCardProps) {
  const { phase: nextPhase } = useMemo(() => getNextDeadline(hackathon), [hackathon]);
  const countdown = useCountdown(nextPhase.deadline);
  const platformColor = getPlatformColor(hackathon.platform);

  const urgencyStyle = countdown.isEnded
    ? URGENCY_STYLES.ended
    : URGENCY_STYLES[countdown.urgency];

  const now = Date.now();
  const currentPhaseIndex = hackathon.phases.findIndex(
    (p) => new Date(p.deadline).getTime() > now
  );
  const activeIndex = currentPhaseIndex === -1 ? hackathon.phases.length : currentPhaseIndex;

  const prizePercent = Math.min((hackathon.prizeValue / 150000) * 100, 100);

  const formatLabel = hackathon.isOnline
    ? 'Online'
    : hackathon.isHybrid
    ? 'Hybrid'
    : 'In-person';

  const phaseShortNames = hackathon.phases.map((p) => {
    if (p.name.includes('Registration Open')) return 'Reg Open';
    if (p.name.includes('Registration Close')) return 'Reg Close';
    if (p.name.includes('Hacking')) return 'Hack';
    if (p.name.includes('Submission')) return 'Submit';
    if (p.name.includes('Demo')) return 'Demo';
    return p.name;
  });

  return (
    <div
      className="flex cursor-pointer flex-col gap-3 rounded-xl p-4 transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-light)',
        borderLeft: urgencyStyle.borderLeft,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        e.currentTarget.style.borderColor = 'var(--border-medium)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
        e.currentTarget.style.borderColor = 'var(--border-light)';
      }}
      onClick={() => onOpenDetail(hackathon)}
    >
      {/* Header: Platform + Title + Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: platformColor }}
          >
            {hackathon.platform[0]}
          </span>
          <h3
            className="truncate text-base font-semibold leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {hackathon.title}
          </h3>
        </div>
        <span
          className="flex-shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{
            backgroundColor:
              hackathon.status === 'upcoming'
                ? 'var(--accent-blue-light)'
                : hackathon.status === 'ongoing'
                ? 'var(--accent-yellow-light)'
                : 'var(--bg-hover)',
            color:
              hackathon.status === 'upcoming'
                ? 'var(--accent-blue)'
                : hackathon.status === 'ongoing'
                ? 'var(--accent-yellow)'
                : 'var(--text-muted)',
          }}
        >
          {hackathon.status}
        </span>
      </div>

      {/* Meta: Date, Location, Format */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {hackathon.dateRange}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {hackathon.location}
        </span>
        <span className="flex items-center gap-1">
          <Globe size={12} />
          {formatLabel}
        </span>
      </div>

      {/* Theme Tags */}
      <div className="flex flex-wrap gap-1.5">
        {hackathon.themes.map((theme) => {
          const style = getThemeTagStyle(theme);
          return (
            <span
              key={theme}
              className={`inline-flex items-center rounded-full px-2.5 py-[3px] text-[11px] font-medium ${style.bg} ${style.text}`}
            >
              {theme}
            </span>
          );
        })}
      </div>

      {/* Prize + Heat Bar */}
      <div className="flex items-center gap-2">
        <Trophy size={14} style={{ color: 'var(--accent-purple)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--accent-purple)' }}>
          {hackathon.prizePool} {hackathon.currency}
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: 'var(--border-light)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${prizePercent}%`,
            background:
              prizePercent <= 33
                ? 'var(--accent-blue)'
                : prizePercent <= 66
                ? 'var(--accent-purple)'
                : 'var(--accent-orange)',
          }}
        />
      </div>

      {/* Countdown */}
      <div className="mt-1">
        <div
          className="font-mono text-[22px] font-bold leading-none tracking-tight"
          style={{ color: urgencyStyle.color }}
        >
          {countdown.isEnded ? (
            'Ended'
          ) : (
            <>
              {String(countdown.days).padStart(2, '0')}d{' '}
              {String(countdown.hours).padStart(2, '0')}h{' '}
              {String(countdown.minutes).padStart(2, '0')}m{' '}
              {String(countdown.seconds).padStart(2, '0')}s
            </>
          )}
        </div>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
          {nextPhase.name}
        </p>
      </div>

      {/* Mini Phase Timeline */}
      <div className="mt-1 flex items-center gap-0">
        {hackathon.phases.map((_phase, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isFuture = idx > activeIndex;
          const dotColor = isCompleted
            ? 'var(--accent-green)'
            : isCurrent
            ? urgencyStyle.color
            : 'var(--border-medium)';

          return (
            <div key={idx} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {idx > 0 && (
                  <div
                    className="h-px flex-1"
                    style={{
                      backgroundColor:
                        idx <= activeIndex
                          ? 'var(--accent-green)'
                          : 'var(--border-medium)',
                    }}
                  />
                )}
                <div
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: isFuture ? 'transparent' : dotColor,
                    border:
                      isFuture
                        ? '1.5px solid var(--border-medium)'
                        : 'none',
                    boxShadow: isCurrent
                      ? `0 0 0 3px ${dotColor}33`
                      : 'none',
                  }}
                />
                {idx < hackathon.phases.length - 1 && (
                  <div
                    className="h-px flex-1"
                    style={{
                      backgroundColor:
                        idx < activeIndex
                          ? 'var(--accent-green)'
                          : 'var(--border-medium)',
                    }}
                  />
                )}
              </div>
              <span
                className="mt-1 text-center text-[10px] leading-tight"
                style={{ color: 'var(--text-muted)' }}
              >
                {phaseShortNames[idx]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer: Details link */}
      <div
        className="mt-1 flex items-center gap-1 text-xs font-medium"
        style={{ color: 'var(--accent-blue)' }}
      >
        <ExternalLink size={12} />
        <span>Details</span>
      </div>
    </div>
  );
}
