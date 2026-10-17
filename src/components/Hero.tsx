import React from 'react';
import { BrandMark } from './Brand';
import {
  Search,
  Database,
  Layers,
  GitBranch,
  Network,
  Microscope,
  X,
  Compass,
} from 'lucide-react';
import { DatabaseTier } from '../data/databases';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTier: DatabaseTier | 'All';
  onSelectTier: (tier: DatabaseTier | 'All') => void;
  counts: {
    total: number;
    primary: number;
    secondary: number;
    composite: number;
    tertiary: number;
    specialized: number;
  };
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  filteredCount: number;
  onFindAccession: () => void;
}

const TIER_STATS = [
  {
    tier: 'All' as const,
    label: 'All Databases',
    desc: 'Full directory',
    icon: Compass,
    accentDot: 'bg-slate-400',
  },
  {
    tier: 'Primary' as const,
    label: 'Primary',
    desc: 'Raw & archival',
    icon: Database,
    accentDot: 'bg-sky-500',
  },
  {
    tier: 'Secondary' as const,
    label: 'Secondary',
    desc: 'Motifs & domains',
    icon: Layers,
    accentDot: 'bg-emerald-500',
  },
  {
    tier: 'Composite' as const,
    label: 'Composite',
    desc: 'Curated standards',
    icon: GitBranch,
    accentDot: 'bg-violet-500',
  },
  {
    tier: 'Tertiary' as const,
    label: 'Tertiary',
    desc: 'Pathways & networks',
    icon: Network,
    accentDot: 'bg-amber-500',
  },
  {
    tier: 'Specialized' as const,
    label: 'Specialized',
    desc: 'Clinical & disease',
    icon: Microscope,
    accentDot: 'bg-rose-500',
  },
] as const;

const countFor = (tier: (typeof TIER_STATS)[number]['tier'], counts: HeroProps['counts']) => {
  const map = {
    All: counts.total,
    Primary: counts.primary,
    Secondary: counts.secondary,
    Composite: counts.composite,
    Tertiary: counts.tertiary,
    Specialized: counts.specialized,
  };
  return map[tier];
};

const TIER_CARD_STYLES: Record<string, { inactive: string; active: string; iconActive: string; iconInactive: string; numActive: string; numInactive: string }> = {
  All: {
    inactive: 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50',
    active: 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm ring-2 ring-[#0F172A]/15',
    iconActive: 'text-white/80',
    iconInactive: 'text-slate-500',
    numActive: 'text-white',
    numInactive: 'text-[#0F172A]',
  },
  Primary: {
    inactive: 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/70 text-blue-900 hover:border-blue-300',
    active: 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-blue-600',
    numActive: 'text-white',
    numInactive: 'text-blue-800',
  },
  Secondary: {
    inactive: 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70 text-emerald-900 hover:border-emerald-300',
    active: 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-emerald-600',
    numActive: 'text-white',
    numInactive: 'text-emerald-800',
  },
  Composite: {
    inactive: 'bg-orange-50/70 border-orange-200 hover:bg-orange-100/70 text-orange-900 hover:border-orange-300',
    active: 'bg-[#D95D29] text-white border-[#D95D29] shadow-sm ring-2 ring-[#D95D29]/25',
    iconActive: 'text-white/90',
    iconInactive: 'text-[#D95D29]',
    numActive: 'text-white',
    numInactive: 'text-[#D95D29]',
  },
  Tertiary: {
    inactive: 'bg-purple-50/70 border-purple-200 hover:bg-purple-100/70 text-purple-900 hover:border-purple-300',
    active: 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-purple-600',
    numActive: 'text-white',
    numInactive: 'text-purple-800',
  },
  Specialized: {
    inactive: 'bg-rose-50/70 border-rose-200 hover:bg-rose-100/70 text-rose-900 hover:border-rose-300',
    active: 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-rose-600',
    numActive: 'text-white',
    numInactive: 'text-rose-800',
  },
};

const PROMPT_SUGGESTIONS = [
  { label: 'Primary Archival', query: 'GenBank' },
  { label: 'AlphaFold 3D', query: 'AlphaFold' },
  { label: 'ClinVar & Pathogenicity', query: 'ClinVar' },
  { label: 'Metabolic Pathways', query: 'KEGG' },
  { label: 'UniProt Swiss-Prot', query: 'UniProt' },
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedTier,
  onSelectTier,
  counts,
  searchInputRef,
  filteredCount,
  onFindAccession,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-14 sm:pb-16 border-b border-slate-200 bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 text-center">

        {/* Category Pill Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white py-1.5 pl-1.5 pr-3.5 text-[11px] sm:text-xs shadow-xs mb-4 sm:mb-5">
          <BrandMark className="h-7 w-7" />
          <span className="font-bold text-[#0F172A]">Dogma<span className="text-[#D95D29]">Desk</span></span>
          <span className="h-4 w-px bg-slate-200" />
          <span className="font-semibold text-slate-600">55+ trusted databases</span>
        </div>

        {/* Clean, Editorial Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#0F172A] font-normal tracking-tight max-w-4xl mx-auto leading-[1.18] text-balance">
          The right database for{' '}
          <span className="italic text-[#D95D29] font-normal block sm:inline">every biological question.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal px-2 text-pretty">
          Search trusted resources, identify accession formats, and follow guided research workflows—all in one place.
        </p>

        {/* Claude-Style Prompt Search Box */}
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto relative px-1 sm:px-0">
          <div className="relative flex items-center rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.04)] focus-within:border-[#D95D29] focus-within:ring-4 focus-within:ring-[#D95D29]/15 transition-all">
            <div className="pl-4 sm:pl-5 pr-2 text-slate-400 shrink-0">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, accession (NM_, P04637, 1TUP), host, or keyword…"
              className="w-full py-3.5 sm:py-4 px-1 text-xs sm:text-sm bg-transparent text-[#0F172A] placeholder:text-slate-400 focus:outline-none font-medium min-w-0"
              aria-label="Search bioinformatics databases"
            />
            <div className="flex items-center gap-1.5 pr-3 sm:pr-4 shrink-0">
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-1 text-slate-400 hover:text-[#0F172A] rounded-full transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium text-slate-500 bg-slate-100 rounded-full border border-slate-200">
                /
              </kbd>
            </div>
          </div>

          {/* Claude Prompt Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 sm:mt-3 px-1">
            <span className="text-[11px] font-medium text-slate-500 mr-1 hidden sm:inline">Try exploring:</span>
            {PROMPT_SUGGESTIONS.map(({ label, query }) => (
              <button
                key={label}
                onClick={() => onSearchChange(query)}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-orange-50/70 text-slate-600 hover:text-[#D95D29] border border-slate-200 hover:border-orange-200 transition-colors cursor-pointer shadow-2xs"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active Search Count */}
          {searchQuery && (
            <div className="mt-2 text-[11px] sm:text-xs text-slate-500 flex items-center justify-between px-2 font-medium">
              <span className="truncate mr-2">
                Found <strong className="text-[#0F172A] font-bold">{filteredCount}</strong> result{filteredCount !== 1 ? 's' : ''} for "{searchQuery}"
              </span>
              <button
                onClick={() => onSearchChange('')}
                className="text-[#D95D29] font-semibold hover:underline cursor-pointer shrink-0"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onFindAccession}
          className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs transition-colors hover:border-orange-200 hover:bg-orange-50/70 hover:text-[#D95D29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D95D29] focus-visible:ring-offset-2"
        >
          Looking up an accession? <span className="text-[#D95D29]">Open the ID resolver ↓</span>
        </button>

        {/* Tier Stats Segment Bar */}
        <div className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 max-w-4xl mx-auto px-1 sm:px-0">
          {TIER_STATS.map(({ tier, label, desc, icon: Icon }) => {
            const isActive = selectedTier === tier;
            const style = TIER_CARD_STYLES[tier] || TIER_CARD_STYLES.All;
            return (
              <button
                key={tier}
                onClick={() => onSelectTier(tier)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all cursor-pointer shadow-xs min-h-[72px] sm:min-h-[80px] flex flex-col justify-between ${
                  isActive ? style.active : style.inactive
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? style.iconActive : style.iconInactive}`} />
                  </div>
                  <span className={`font-mono text-sm sm:text-base font-bold ${isActive ? style.numActive : style.numInactive}`}>
                    {countFor(tier, counts)}
                  </span>
                </div>
                <div>
                  <div className={`text-[11px] sm:text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-[#0F172A]'}`}>
                    {label}
                  </div>
                  <div className={`text-[10px] sm:text-[11px] font-medium truncate ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                    {desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
