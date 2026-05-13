import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ExternalLink, Download, RotateCcw, Filter } from 'lucide-react';
import { hackathons, getNextDeadline, THEME_TAGS } from '../data/hackathons';
import type { Hackathon } from '../data/hackathons';
import type { SortOption } from '../components/FilterBar';
import FilterBar from '../components/FilterBar';
import HackathonCard from '../components/HackathonCard';
import DetailModal from '../components/DetailModal';

function generateAllICS(events: Hackathon[]): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hackathon-DDL//EN',
    'X-WR-CALNAME:Hackathon Deadlines',
  ];
  const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  for (const h of events) {
    for (const phase of h.phases) {
      const start = new Date(phase.deadline);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const uid = `${h.id}-${phase.name.toLowerCase().replace(/\s+/g, '-')}@hackathon-ddl.com`;
      lines.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtStamp}`,
        `SUMMARY:${h.title} — ${phase.name}`,
        `DESCRIPTION:Hackathon: ${h.title}\\nPhase: ${phase.name}\\nPrize Pool: ${h.prizePool} ${h.currency}\\nEligibility: ${h.eligibility}\\nURL: ${h.url}`,
        `LOCATION:${h.location}`,
        `URL:${h.url}`,
        `DTSTART;VALUE=DATE-TIME:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTEND;VALUE=DATE-TIME:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        'END:VEVENT'
      );
    }
  }
  lines.push('END:VCALENDAR', '');
  return lines.join('\r\n');
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [selectedThemes, setSelectedThemes] = useState<string[]>([...THEME_TAGS]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [sort, setSort] = useState<SortOption>('nearest');
  const [detailHackathon, setDetailHackathon] = useState<Hackathon | null>(null);

  // Subscribe to calendar event
  useEffect(() => {
    const handler = () => {
      const ics = generateAllICS(hackathons);
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hackathon-deadlines.ics';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };
    window.addEventListener('subscribe-calendar', handler);
    return () => window.removeEventListener('subscribe-calendar', handler);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (search) count++;
    if (selectedThemes.length > 0) count++;
    if (selectedFormats.length > 0) count++;
    if (selectedPlatform !== 'All Platforms') count++;
    return count;
  }, [search, selectedThemes, selectedFormats, selectedPlatform]);

  const handleReset = useCallback(() => {
    setSearch('');
    setSelectedThemes([]);
    setSelectedFormats([]);
    setSelectedPlatform('All Platforms');
    setSort('nearest');
  }, []);

  const filtered = useMemo(() => {
    let result = [...hackathons];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q) ||
          h.platform.toLowerCase().includes(q) ||
          h.themes.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Theme filter (OR logic within themes)
    if (selectedThemes.length > 0) {
      result = result.filter((h) =>
        h.themes.some((t) => selectedThemes.includes(t))
      );
    }

    // Format filter (OR logic within formats)
    if (selectedFormats.length > 0) {
      result = result.filter((h) => {
        const fmt = h.isOnline ? 'Online' : h.isHybrid ? 'Hybrid' : 'In-person';
        return selectedFormats.includes(fmt);
      });
    }

    // Platform filter
    if (selectedPlatform !== 'All Platforms') {
      result = result.filter((h) => h.platform === selectedPlatform);
    }

    // Sort
    switch (sort) {
      case 'nearest':
        result.sort((a, b) => {
          const aNext = getNextDeadline(a).phase.deadline;
          const bNext = getNextDeadline(b).phase.deadline;
          return new Date(aNext).getTime() - new Date(bNext).getTime();
        });
        break;
      case 'farthest':
        result.sort((a, b) => {
          const aNext = getNextDeadline(a).phase.deadline;
          const bNext = getNextDeadline(b).phase.deadline;
          return new Date(bNext).getTime() - new Date(aNext).getTime();
        });
        break;
      case 'prize-high':
        result.sort((a, b) => b.prizeValue - a.prizeValue);
        break;
      case 'prize-low':
        result.sort((a, b) => a.prizeValue - b.prizeValue);
        break;
      case 'name-az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [search, selectedThemes, selectedFormats, selectedPlatform, sort]);

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Filter Bar */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        selectedThemes={selectedThemes}
        onThemesChange={setSelectedThemes}
        selectedFormats={selectedFormats}
        onFormatsChange={setSelectedFormats}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
        sort={sort}
        onSortChange={setSort}
        activeFilterCount={activeFilterCount}
        onReset={handleReset}
      />

      {/* Card Grid */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border py-16"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <Filter size={48} style={{ color: 'var(--text-muted)' }} />
              <h3
                className="mt-4 text-base font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                No hackathons match your filters
              </h3>
              <p className="mt-1 max-w-sm px-4 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                {selectedThemes.length < THEME_TAGS.length && selectedThemes.length > 0
                  ? `Themes: ${selectedThemes.join(', ')}. `
                  : null}
                {selectedFormats.length > 0
                  ? `Format: ${selectedFormats.join(', ')}. `
                  : null}
                {selectedPlatform !== 'All Platforms'
                  ? `Platform: ${selectedPlatform}. `
                  : null}
                Try selecting different combinations or reset all filters.
              </p>
              <button
                onClick={handleReset}
                className="mt-4 flex h-9 items-center gap-2 rounded-lg px-4 text-[13px] font-medium text-white transition-colors duration-150"
                style={{ backgroundColor: 'var(--accent-blue)' }}
              >
                <RotateCcw size={14} />
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((hackathon, index) => (
                <motion.div
                  key={hackathon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.05, 0.8),
                    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                  }}
                >
                  <HackathonCard
                    hackathon={hackathon}
                    onOpenDetail={setDetailHackathon}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subscription CTA */}
      <div className="mx-auto max-w-[1200px] px-4 pb-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="flex flex-col items-center rounded-2xl border p-8 text-center"
          style={{
            borderColor: 'var(--border-light)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          <Calendar size={32} style={{ color: 'var(--accent-green)' }} />
          <h3
            className="mt-3 text-lg font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            Never Miss a Deadline
          </h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Subscribe to get all hackathon deadlines in your calendar.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                const ics = generateAllICS(hackathons);
                const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'hackathon-deadlines.ics';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="flex h-9 items-center gap-2 rounded-lg border px-4 text-[13px] font-medium transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            >
              <Download size={14} />
              Download .ics file
            </button>
            <a
              href="https://calendar.google.com/calendar/render?cid=webcal://hackathon-ddl.com/calendar.ics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 items-center gap-2 rounded-lg border px-4 text-[13px] font-medium transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            >
              <ExternalLink size={14} />
              Google Calendar
            </a>
            <a
              href="webcal://hackathon-ddl.com/calendar.ics"
              className="flex h-9 items-center gap-2 rounded-lg border px-4 text-[13px] font-medium transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                color: 'var(--text-primary)',
              }}
            >
              <ExternalLink size={14} />
              Apple Calendar
            </a>
          </div>
          <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            Updates automatically when new hackathons are added.
          </p>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {detailHackathon && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <DetailModal
              hackathon={detailHackathon}
              onClose={() => setDetailHackathon(null)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
