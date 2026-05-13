import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Calendar,
  Check,
} from 'lucide-react';
import { THEME_TAGS, PLATFORMS } from '../data/hackathons';

export type SortOption =
  | 'nearest'
  | 'farthest'
  | 'prize-high'
  | 'prize-low'
  | 'name-az';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedThemes: string[];
  onThemesChange: (themes: string[]) => void;
  selectedFormats: string[];
  onFormatsChange: (formats: string[]) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeFilterCount: number;
  onReset: () => void;
}

const SORT_LABELS: Record<SortOption, string> = {
  nearest: 'Nearest Deadline',
  farthest: 'Farthest Deadline',
  'prize-high': 'Prize Pool (High to Low)',
  'prize-low': 'Prize Pool (Low to High)',
  'name-az': 'Name A-Z',
};

const FORMAT_OPTIONS = ['Online', 'In-person', 'Hybrid'];

export default function FilterBar({
  search,
  onSearchChange,
  selectedThemes,
  onThemesChange,
  selectedFormats,
  onFormatsChange,
  selectedPlatform,
  onPlatformChange,
  sort,
  onSortChange,
  activeFilterCount,
  onReset,
}: FilterBarProps) {
  const [showSort, setShowSort] = useState(false);
  const [showPlatform, setShowPlatform] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSort(false);
      }
      if (platformRef.current && !platformRef.current.contains(e.target as Node)) {
        setShowPlatform(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleTheme = useCallback(
    (theme: string) => {
      if (selectedThemes.includes(theme)) {
        onThemesChange(selectedThemes.filter((t) => t !== theme));
      } else {
        onThemesChange([...selectedThemes, theme]);
      }
    },
    [selectedThemes, onThemesChange]
  );

  const toggleFormat = useCallback(
    (fmt: string) => {
      if (selectedFormats.includes(fmt)) {
        onFormatsChange(selectedFormats.filter((f) => f !== fmt));
      } else {
        onFormatsChange([...selectedFormats, fmt]);
      }
    },
    [selectedFormats, onFormatsChange]
  );

  const allThemesSelected = selectedThemes.length === THEME_TAGS.length;
  const toggleAllThemes = useCallback(() => {
    if (allThemesSelected) {
      onThemesChange([]);
    } else {
      onThemesChange([...THEME_TAGS]);
    }
  }, [allThemesSelected, onThemesChange]);

  const handleSubscribe = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('subscribe-calendar'));
    }
  }, []);

  return (
    <div
      className="sticky top-14 z-40 transition-shadow duration-200"
      style={{
        backgroundColor: 'var(--bg-page)',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="mx-auto max-w-[1200px] px-4 py-3 sm:px-6 lg:px-8">
        {/* Hero text */}
        <div className="mb-3">
          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
            Worldwide Hackathon Deadline Countdowns. To add a hackathon,{' '}
            <a
              href="https://github.com/Just-Agent/hackathon-ddl/pulls"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150 hover:underline"
              style={{ color: 'var(--accent-blue)' }}
            >
              send a pull request
            </a>
          </p>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            Deadlines are shown in your local time.
          </p>
        </div>

        {/* Row 1: Search & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1" style={{ minWidth: '200px', maxWidth: '320px' }}>
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search hackathons..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 w-full rounded-lg border px-3 pl-9 text-[13px] outline-none transition-all duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
                e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-blue-light)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setShowSort((p) => !p)}
              className="flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
              }}
            >
              {SORT_LABELS[sort]}
              <ChevronDown size={14} />
            </button>
            {showSort && (
              <div
                className="absolute right-0 top-full z-20 mt-1 min-w-[200px] overflow-hidden rounded-lg border py-1 shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderColor: 'var(--border-light)',
                }}
              >
                {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onSortChange(option);
                      setShowSort(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors duration-150"
                    style={{
                      color: sort === option ? 'var(--accent-blue)' : 'var(--text-primary)',
                      backgroundColor: sort === option ? 'var(--accent-blue-light)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (sort !== option) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (sort !== option) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {sort === option && <Check size={14} />}
                    {SORT_LABELS[option]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="mt-3 sm:hidden">
          <button
            onClick={() => setShowFiltersMobile((p) => !p)}
            className="flex w-full items-center justify-between rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors duration-150"
            style={{
              borderColor: 'var(--border-medium)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          >
            <span>Filters ({selectedThemes.length} themes{selectedFormats.length > 0 ? `, ${selectedFormats.length} format` : ''})</span>
            {showFiltersMobile ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Row 2: Theme Tags - collapsible on mobile */}
        <div className={`mt-3 ${showFiltersMobile ? 'block' : 'hidden'} sm:block`}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2 lg:grid-cols-3">
            {/* Select All */}
            <label className="col-span-full mb-1 flex cursor-pointer items-center gap-2 border-b pb-2"
              style={{ borderColor: 'var(--border-light)' }}>
              <button
                onClick={toggleAllThemes}
                className="flex h-4 w-4 items-center justify-center rounded transition-colors duration-150"
                style={{
                  border: '1px solid var(--border-medium)',
                  backgroundColor: allThemesSelected ? 'var(--accent-blue)' : 'transparent',
                }}
              >
                {allThemesSelected && <Check size={12} className="text-white" />}
              </button>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                Select All
              </span>
            </label>

            {THEME_TAGS.map((tag) => {
              const checked = selectedThemes.includes(tag);
              return (
                <label
                  key={tag}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <button
                    onClick={() => toggleTheme(tag)}
                    className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded transition-colors duration-150"
                    style={{
                      border: '1px solid var(--border-medium)',
                      backgroundColor: checked ? 'var(--accent-blue)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!checked) e.currentTarget.style.borderColor = 'var(--accent-blue)';
                    }}
                    onMouseLeave={(e) => {
                      if (!checked) e.currentTarget.style.borderColor = 'var(--border-medium)';
                    }}
                  >
                    {checked && <Check size={12} className="text-white" />}
                  </button>
                  <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                    {tag}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Row 3: Format & Platform - collapsible on mobile */}
        <div className={`mt-3 flex flex-wrap items-center gap-3 ${showFiltersMobile ? 'block' : 'hidden'} sm:block`}>
          {/* Format pills */}
          <div className="flex items-center gap-2">
            {FORMAT_OPTIONS.map((fmt) => {
              const active = selectedFormats.includes(fmt);
              return (
                <button
                  key={fmt}
                  onClick={() => toggleFormat(fmt)}
                  className="h-8 rounded-full px-3.5 text-[13px] font-medium transition-all duration-150"
                  style={{
                    border: '1px solid',
                    borderColor: active ? 'var(--accent-blue)' : 'var(--border-medium)',
                    backgroundColor: active ? 'var(--accent-blue)' : 'transparent',
                    color: active ? '#fff' : 'var(--text-secondary)',
                  }}
                >
                  {fmt}
                </button>
              );
            })}
          </div>

          {/* Platform Dropdown */}
          <div className="relative" ref={platformRef}>
            <button
              onClick={() => setShowPlatform((p) => !p)}
              className="flex h-8 items-center gap-2 rounded-lg border px-3 text-[13px] transition-colors duration-150"
              style={{
                borderColor: 'var(--border-medium)',
                backgroundColor: 'var(--bg-page)',
                color: 'var(--text-primary)',
              }}
            >
              {selectedPlatform}
              <ChevronDown size={14} />
            </button>
            {showPlatform && (
              <div
                className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-lg border py-1 shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-page)',
                  borderColor: 'var(--border-light)',
                }}
              >
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      onPlatformChange(p);
                      setShowPlatform(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] transition-colors duration-150"
                    style={{
                      color: selectedPlatform === p ? 'var(--accent-blue)' : 'var(--text-primary)',
                      backgroundColor:
                        selectedPlatform === p ? 'var(--accent-blue-light)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedPlatform !== p) e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (selectedPlatform !== p) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {selectedPlatform === p && <Check size={14} />}
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Action Bar */}
        <div
          className="mt-3 flex items-center justify-between border-t pt-2"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-[13px] transition-colors duration-150"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <RotateCcw size={14} />
            Reset Filters
          </button>

          {activeFilterCount > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                backgroundColor: 'var(--accent-blue-light)',
                color: 'var(--accent-blue)',
              }}
            >
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
            </span>
          )}

          <button
            className="flex h-8 items-center gap-2 rounded-lg px-4 text-[13px] font-medium text-white transition-colors duration-150"
            style={{ backgroundColor: 'var(--accent-green)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16A34A')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-green)')}
            onClick={handleSubscribe}
          >
            <Calendar size={14} />
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
}
