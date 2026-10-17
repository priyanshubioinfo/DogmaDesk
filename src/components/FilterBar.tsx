import React from 'react';
import { 
  LayoutGrid, 
  Table as TableIcon, 
  GitFork, 
  ChevronDown, 
  RotateCcw,
} from 'lucide-react';
import { DatabaseTier, SubCategory } from '../data/databases';

export type ViewMode = 'grid' | 'table' | 'taxonomy';
export type SortOption = 'popular' | 'name-asc' | 'name-desc' | 'year-desc' | 'year-asc' | 'tier';

interface FilterBarProps {
  selectedTier: DatabaseTier | 'All';
  onSelectTier: (tier: DatabaseTier | 'All') => void;
  selectedSubCategory: SubCategory | 'All';
  onSelectSubCategory: (sub: SubCategory | 'All') => void;
  selectedHost: string;
  onSelectHost: (host: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalFiltered: number;
}

const TIERS: { id: DatabaseTier | 'All'; label: string; dot?: string }[] = [
  { id: 'All',         label: 'All Tiers' },
  { id: 'Primary',     label: 'Primary',     dot: 'bg-blue-600' },
  { id: 'Secondary',   label: 'Secondary',   dot: 'bg-emerald-600' },
  { id: 'Composite',   label: 'Composite',   dot: 'bg-[#D95D29]' },
  { id: 'Tertiary',    label: 'Tertiary',    dot: 'bg-purple-600' },
  { id: 'Specialized', label: 'Specialized', dot: 'bg-rose-600' },
];

const SUB_CATEGORIES: (SubCategory | 'All')[] = [
  'All',
  'Genomics & DNA',
  'Proteins',
  '3D Structure',
  'Motifs & Domains',
  'Pathways & Networks',
  'Clinical & Disease',
  'Pharmacology & Chemicals',
  'RNA & Regulation',
  'Model Organisms',
  'AI & Predicted Structures'
];

const HOST_OPTIONS = [
  { label: 'All Organizations', value: 'All' },
  { label: 'NCBI / NIH', value: 'NCBI' },
  { label: 'EMBL-EBI', value: 'EMBL-EBI' },
  { label: 'SIB (Swiss)', value: 'SIB' },
  { label: 'PDB Consortia', value: 'PDB Consortia' },
  { label: 'Model Organisms', value: 'Model Organisms' },
  { label: 'Academic & Other', value: 'Academic/Independent' }
];

const TIER_BUTTON_STYLES: Record<string, string> = {
  All:         'bg-white text-[#0F172A] shadow-xs font-semibold border border-slate-200',
  Primary:     'bg-blue-50 text-blue-700 shadow-xs font-semibold border border-blue-200',
  Secondary:   'bg-emerald-50 text-emerald-700 shadow-xs font-semibold border border-emerald-200',
  Composite:   'bg-orange-50 text-orange-700 shadow-xs font-semibold border border-orange-200',
  Tertiary:    'bg-purple-50 text-purple-700 shadow-xs font-semibold border border-purple-200',
  Specialized: 'bg-rose-50 text-rose-700 shadow-xs font-semibold border border-rose-200',
};

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedTier,
  onSelectTier,
  selectedSubCategory,
  onSelectSubCategory,
  selectedHost,
  onSelectHost,
  viewMode,
  onViewModeChange,
  sortOption,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
  totalFiltered,
}) => {
  return (
    <div id="explorer" className="pt-6 pb-6 space-y-3.5 scroll-mt-20">
      {/* ── Top Row: Tier Segmented Control + Dropdowns + View Switcher ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Tier Segmented Control */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs overflow-x-auto no-scrollbar shrink-0 shadow-xs max-w-full">
          {TIERS.map(({ id, label, dot }) => {
            const isSelected = selectedTier === id;
            return (
              <button
                key={id}
                onClick={() => onSelectTier(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? (TIER_BUTTON_STYLES[id] || 'bg-white text-[#0F172A] shadow-xs font-semibold border border-slate-200')
                    : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/70 font-medium'
                }`}
              >
                {dot && <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Host Dropdown + Sort Dropdown + View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Host & Sort Group (2-column on mobile, inline on tablet/desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 flex-1">
            {/* Host Filter Dropdown */}
            <div className="relative inline-flex items-center w-full sm:w-auto">
              <select
                value={selectedHost}
                onChange={(e) => onSelectHost(e.target.value)}
                className="w-full sm:w-auto appearance-none h-9 pl-3 pr-8 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-[#0F172A] hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D95D29]/20 focus:border-[#D95D29] cursor-pointer shadow-xs transition-colors truncate"
                aria-label="Filter by Host Organization"
              >
                {HOST_OPTIONS.map((host) => (
                  <option key={host.value} value={host.value} className="bg-white text-[#0F172A] font-medium">
                    {host.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative inline-flex items-center w-full sm:w-auto">
              <select
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full sm:w-auto appearance-none h-9 pl-3 pr-8 text-xs font-semibold rounded-xl bg-white border border-slate-200 text-[#0F172A] hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#D95D29]/20 focus:border-[#D95D29] cursor-pointer shadow-xs transition-colors"
                aria-label="Sort databases"
              >
                <option value="popular">Most Popular</option>
                <option value="name-asc">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
                <option value="tier">Sort by Tier</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="h-9 flex items-center justify-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-xs self-end sm:self-auto shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`h-7 px-2.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-400 hover:text-[#0F172A]'
              }`}
              title="Card Grid"
              aria-label="Card Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`h-7 px-2.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-400 hover:text-[#0F172A]'
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('taxonomy')}
              className={`h-7 px-2.5 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                viewMode === 'taxonomy'
                  ? 'bg-white text-[#0F172A] shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-400 hover:text-[#0F172A]'
              }`}
              title="Taxonomy Hierarchy"
              aria-label="Taxonomy Hierarchy"
            >
              <GitFork className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Second Row: Discipline Topic Filter Chips + Pinned Reset ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar flex-1 min-w-0">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider shrink-0 mr-1">
            Topic:
          </span>
          {SUB_CATEGORIES.map((sub) => {
            const isSelected = selectedSubCategory === sub;
            return (
              <button
                key={sub}
                onClick={() => onSelectSubCategory(sub)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0F172A] text-white font-medium shadow-xs border border-[#0F172A]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0F172A] font-medium border border-slate-200 shadow-xs'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Pinned Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#D95D29] hover:bg-orange-50 border border-orange-200 bg-white flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset ({totalFiltered})</span>
          </button>
        )}
      </div>
    </div>
  );
};
