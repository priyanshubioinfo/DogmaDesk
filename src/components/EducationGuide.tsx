import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  Layers, 
  GitBranch, 
  Database, 
  Network, 
  Microscope, 
  CheckCircle2, 
  HelpCircle,
  GitCompare,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CATEGORIES_DATA, COMPARISONS_DATA, CategoryInfo, ComparisonItem } from '../data/categories';
import { DatabaseTier } from '../data/databases';

interface EducationGuideProps {
  onSelectTier: (tier: DatabaseTier) => void;
}

const TIER_META: Record<string, { icon: typeof Database; dot: string; num: string }> = {
  Primary:     { icon: Database,   dot: 'bg-blue-600', num: 'Tier 1' },
  Secondary:   { icon: Layers,     dot: 'bg-emerald-600', num: 'Tier 2' },
  Composite:   { icon: GitBranch,  dot: 'bg-[#D95D29]', num: 'Tier 3' },
  Tertiary:    { icon: Network,    dot: 'bg-purple-600', num: 'Tier 4' },
  Specialized: { icon: Microscope, dot: 'bg-rose-600', num: 'Tier 5' },
};

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

const TIER_PIPELINE_STYLES: Record<string, { inactive: string; active: string; iconActive: string; iconInactive: string; tabActive: string }> = {
  Primary: {
    inactive: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800',
    active: 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-blue-600',
    tabActive: 'bg-blue-50 border-2 border-blue-600 text-slate-900',
  },
  Secondary: {
    inactive: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800',
    active: 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-emerald-600',
    tabActive: 'bg-emerald-50 border-2 border-emerald-600 text-slate-900',
  },
  Composite: {
    inactive: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800',
    active: 'bg-[#D95D29] text-white border-[#D95D29] shadow-sm ring-2 ring-[#D95D29]/25',
    iconActive: 'text-white/90',
    iconInactive: 'text-[#D95D29]',
    tabActive: 'bg-orange-50 border-2 border-[#D95D29] text-slate-900',
  },
  Tertiary: {
    inactive: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800',
    active: 'bg-purple-600 text-white border-purple-600 shadow-sm ring-2 ring-purple-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-purple-600',
    tabActive: 'bg-purple-50 border-2 border-purple-600 text-slate-900',
  },
  Specialized: {
    inactive: 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800',
    active: 'bg-rose-600 text-white border-rose-600 shadow-sm ring-2 ring-rose-600/20',
    iconActive: 'text-white/90',
    iconInactive: 'text-rose-600',
    tabActive: 'bg-rose-50 border-2 border-rose-600 text-slate-900',
  },
};

export const EducationGuide: React.FC<EducationGuideProps> = ({ onSelectTier }) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('Primary');
  const [activeComparisonId, setActiveComparisonId] = useState<string>('genbank-vs-refseq');
  const [expandedSection, setExpandedSection] = useState<boolean>(true);

  const currentCategory: CategoryInfo = CATEGORIES_DATA[selectedCategoryKey];
  const currentComparison: ComparisonItem | undefined = COMPARISONS_DATA.find(
    (c) => c.id === activeComparisonId
  );

  return (
    <section id="education-guide" className="scroll-mt-20 py-14 bg-[#F8F9FA] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-[#D95D29] shadow-xs mb-3">
              <span className="font-serif text-xs font-bold leading-none select-none">✻</span>
              <span>Bioinformatics Data Architecture Guide</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-normal tracking-tight">
              Understanding the 5 Tiers of Biological Databases
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal text-pretty">
              How bioinformatics resources are categorized, from direct sequencer archives to curated standard references and systems pathways.
            </p>
          </div>

          <button
            onClick={() => setExpandedSection(!expandedSection)}
            className="self-start md:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:text-[#D95D29] bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-xs transition-colors cursor-pointer"
          >
            <span>{expandedSection ? 'Collapse Guide' : 'Expand Guide'}</span>
            {expandedSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expandedSection && (
          <div className="space-y-8">
            {/* 1. Visual Biological Data Flow Pipeline */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 sm:mb-4 flex items-center gap-2">
                <span>The Biological Data Ingestion &amp; Synthesis Pipeline</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 relative">
                {(['Primary', 'Secondary', 'Composite', 'Tertiary', 'Specialized'] as const).map((tierKey) => {
                  const meta = TIER_META[tierKey];
                  const Icon = meta.icon;
                  const isSelected = selectedCategoryKey === tierKey;
                  const cat = CATEGORIES_DATA[tierKey];

                  const style = TIER_PIPELINE_STYLES[tierKey] || TIER_PIPELINE_STYLES.Primary;
                  return (
                    <div
                      key={tierKey}
                      onClick={() => setSelectedCategoryKey(tierKey)}
                      className={`p-3 sm:p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs ${
                        isSelected ? style.active : style.inactive
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                          <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSelected ? style.iconActive : style.iconInactive}`} />
                        </div>
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{meta.num}</span>
                      </div>
                      <h4 className={`font-serif text-sm sm:text-base font-semibold ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>{tierKey} DB</h4>
                      <p className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed font-normal ${isSelected ? 'text-white/85' : 'text-slate-500'}`}>
                        {cat.shortDesc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Interactive Deep Dive into the Selected Category */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Category Selector Tabs */}
              <div className="lg:col-span-4 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block px-1">
                  Select Classification Tier
                </span>
                {Object.values(CATEGORIES_DATA).map((cat) => {
                  const isSelected = selectedCategoryKey === cat.id;
                  const meta = TIER_META[cat.id];
                  const style = TIER_PIPELINE_STYLES[cat.id] || TIER_PIPELINE_STYLES.Primary;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryKey(cat.id)}
                      className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? style.tabActive
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                          <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-[#0F172A]' : 'text-slate-700'}`}>
                            {cat.title}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 line-clamp-1 font-normal ${isSelected ? 'text-slate-600' : 'text-slate-400'}`}>{cat.shortDesc}</p>
                      </div>
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-[#0F172A]' : 'text-slate-300'}`} />
                    </button>
                  );
                })}

                <div className="pt-1.5">
                  <button
                    onClick={() => onSelectTier(currentCategory.id as DatabaseTier)}
                    className="w-full py-2.5 px-4 rounded-full text-xs font-medium bg-[#D95D29] hover:bg-[#C2541C] text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Filter Directory for {currentCategory.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown Card */}
              <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${TIER_BADGE_STYLES[currentCategory.id] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {currentCategory.id} Tier
                    </span>
                    <span className="text-xs text-slate-500 font-normal">
                      Curation: <strong className="text-[#0F172A] font-semibold">{currentCategory.curationType}</strong>
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
                    {currentCategory.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {currentCategory.definition}
                  </p>
                </div>

                {/* Characteristics Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Core Architectural Properties
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {currentCategory.characteristics.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 leading-relaxed font-normal"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D95D29]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Role */}
                <div className="p-3.5 rounded-xl bg-slate-50 border-l-3 border-[#D95D29] border-t border-r border-b border-slate-200 text-xs flex items-start gap-2.5">
                  <div className="p-1 rounded bg-orange-100 text-[#D95D29] shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#0F172A] block mb-0.5">Where it fits in analysis:</span>
                    <p className="text-slate-600 leading-relaxed font-normal">{currentCategory.workflowRole}</p>
                  </div>
                </div>

                {/* Canonical Examples */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Industry Standard Examples
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {currentCategory.canonicalExamples.map((ex, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-[#0F172A] border border-slate-200"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. High-Value Head-to-Head Comparisons */}
            <div id="comparisons" className="scroll-mt-20 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider mb-0.5">
                    <GitCompare className="w-3.5 h-3.5 text-[#D95D29]" />
                    <span>Side-by-Side Comparisons</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#0F172A]">
                    Frequently Confused Database Pairs
                  </h3>
                </div>

                {/* Comparison selector pill buttons */}
                <div className="flex flex-wrap gap-1">
                  {COMPARISONS_DATA.map((comp) => (
                    <button
                      key={comp.id}
                      onClick={() => setActiveComparisonId(comp.id)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                        activeComparisonId === comp.id
                          ? 'bg-[#0F172A] text-white font-medium shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-medium shadow-2xs'
                      }`}
                    >
                      {comp.title}
                    </button>
                  ))}
                </div>
              </div>

              {currentComparison && (
                <div className="space-y-3.5">
                  {/* Desktop Comparison Table (sm and up) */}
                  <div className="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[#0F172A] font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-4 w-1/4">Evaluation Aspect</th>
                          <th className="py-2.5 px-4 w-3/8 text-[#0F172A] font-semibold">
                            {currentComparison.db1Name} <span className="text-[11px] text-slate-500 font-normal">({currentComparison.db1Type})</span>
                          </th>
                          <th className="py-2.5 px-4 w-3/8 text-[#0F172A] font-semibold">
                            {currentComparison.db2Name} <span className="text-[11px] text-slate-500 font-normal">({currentComparison.db2Type})</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {currentComparison.keyDistinctions.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-4 font-medium text-[#0F172A]">{row.aspect}</td>
                            <td className="py-2.5 px-4 text-slate-600 leading-relaxed font-normal">{row.db1Val}</td>
                            <td className="py-2.5 px-4 text-slate-600 leading-relaxed font-normal">{row.db2Val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Comparison Cards (screens < sm) */}
                  <div className="sm:hidden space-y-2.5">
                    {currentComparison.keyDistinctions.map((row, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
                        <div className="font-semibold text-[#0F172A] border-b border-slate-200 pb-1.5 flex items-center justify-between">
                          <span>{row.aspect}</span>
                        </div>
                        <div className="space-y-1.5 pt-0.5">
                          <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-200">
                            <span className="font-semibold text-[11px] text-blue-900 block mb-0.5">
                              {currentComparison.db1Name}:
                            </span>
                            <span className="text-slate-700 leading-relaxed">{row.db1Val}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200">
                            <span className="font-semibold text-[11px] text-emerald-900 block mb-0.5">
                              {currentComparison.db2Name}:
                            </span>
                            <span className="text-slate-700 leading-relaxed">{row.db2Val}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Practical Verdict Box */}
                  <div className="p-3.5 rounded-xl bg-orange-50/80 border-l-3 border-[#D95D29] border-t border-r border-b border-orange-200 text-xs text-[#0F172A] flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#D95D29] shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold block mb-0.5 text-[#D95D29]">Practical Guidance:</strong>
                      <p className="leading-relaxed text-slate-600 font-normal">{currentComparison.verdict}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
