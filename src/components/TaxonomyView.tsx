import React, { useState } from 'react';
import { 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  ExternalLink, 
  Info, 
  Bookmark
} from 'lucide-react';
import { DatabaseRecord, DatabaseTier } from '../data/databases';

interface TaxonomyViewProps {
  databases: DatabaseRecord[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
  onOpenModal: (database: DatabaseRecord) => void;
}

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

const TIER_HEADER_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border-b border-blue-200',
  Secondary:   'bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-900 border-b border-emerald-200',
  Composite:   'bg-orange-50/70 hover:bg-orange-100/70 text-orange-900 border-b border-orange-200',
  Tertiary:    'bg-purple-50/70 hover:bg-purple-100/70 text-purple-900 border-b border-purple-200',
  Specialized: 'bg-rose-50/70 hover:bg-rose-100/70 text-rose-900 border-b border-rose-200',
};

const SUB_CATEGORY_DOT_STYLES: Record<string, string> = {
  'Genomics & DNA': 'bg-sky-600',
  'Proteins': 'bg-indigo-600',
  '3D Structure': 'bg-cyan-600',
  'Motifs & Domains': 'bg-teal-600',
  'Pathways & Networks': 'bg-purple-600',
  'Clinical & Disease': 'bg-rose-600',
  'Pharmacology & Chemicals': 'bg-amber-600',
  'RNA & Regulation': 'bg-emerald-600',
  'Model Organisms': 'bg-violet-600',
  'AI & Predicted Structures': 'bg-[#D95D29]',
};

export const TaxonomyView: React.FC<TaxonomyViewProps> = ({
  databases,
  bookmarkedIds,
  onToggleBookmark,
  onOpenModal,
}) => {
  const [openTiers, setOpenTiers] = useState<Record<string, boolean>>({
    Primary: true,
    Secondary: true,
    Composite: true,
    Tertiary: true,
    Specialized: true,
  });

  const toggleTier = (tier: string) => {
    setOpenTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  const tiers: DatabaseTier[] = ['Primary', 'Secondary', 'Composite', 'Tertiary', 'Specialized'];

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-2 shadow-xs">
        <FolderTree className="w-4 h-4 text-[#D95D29] shrink-0" />
        <span>
          Hierarchical Taxonomy: Databases grouped by tier and biological sub-discipline. Click any tier header to collapse or expand.
        </span>
      </div>

      <div className="space-y-3.5">
        {tiers.map((tier) => {
          const tierDbs = databases.filter((db) => db.tier === tier);
          if (tierDbs.length === 0) return null;

          const isOpen = openTiers[tier] ?? true;

          // Group by SubCategory within this tier
          const subGroups = tierDbs.reduce((acc, db) => {
            acc[db.subCategory] = acc[db.subCategory] || [];
            acc[db.subCategory].push(db);
            return acc;
          }, {} as Record<string, DatabaseRecord[]>);

          const badgeClass = TIER_BADGE_STYLES[tier] || 'bg-slate-100 text-slate-700 border-slate-200';

          return (
            <div
              key={tier}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs"
            >
              {/* Tier Header Toggle */}
              <button
                onClick={() => toggleTier(tier)}
                className={`w-full p-3.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
                  TIER_HEADER_STYLES[tier] || 'bg-slate-50 hover:bg-slate-100 border-b border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}>
                    {tier} Databases
                  </span>
                  <span className="text-xs text-[#0F172A] font-medium">
                    ({tierDbs.length} {tierDbs.length === 1 ? 'database' : 'databases'})
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-normal hidden sm:block">
                  {isOpen ? 'Click to collapse' : 'Click to expand'}
                </span>
              </button>

              {/* SubCategory Branches */}
              {isOpen && (
                <div className="p-4 sm:p-5 space-y-5">
                  {Object.entries(subGroups).map(([subCat, dbs]) => (
                    <div key={subCat} className="border-l-2 border-slate-200 pl-3.5 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${SUB_CATEGORY_DOT_STYLES[subCat] || 'bg-[#D95D29]'}`} />
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
                          {subCat}
                        </h4>
                        <span className="text-xs text-slate-400 font-mono font-medium">({dbs.length})</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {dbs.map((db) => {
                          const isBookmarked = bookmarkedIds.has(db.id);
                          return (
                            <div
                              key={db.id}
                              onClick={() => onOpenModal(db)}
                              className="p-3.5 rounded-xl bg-white hover:border-[#D95D29]/50 border border-slate-200 transition-all flex flex-col justify-between cursor-pointer group shadow-2xs"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-serif font-bold text-sm text-[#0F172A] group-hover:text-[#D95D29] transition-colors">
                                    {db.acronym}
                                  </span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onToggleBookmark(db.id);
                                    }}
                                    className={`p-1 rounded-full cursor-pointer ${
                                      isBookmarked ? 'text-[#D95D29] bg-orange-50' : 'text-slate-400 hover:text-[#0F172A]'
                                    }`}
                                  >
                                    <Bookmark className="w-3.5 h-3.5 fill-current" />
                                  </button>
                                </div>
                                <p className="text-xs text-slate-700 line-clamp-1 mb-1 font-medium">{db.name}</p>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                                  {db.shortDesc}
                                </p>
                              </div>

                              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                                <span className="px-2 py-0.5 rounded font-mono text-[11px] font-medium bg-slate-100 text-[#0F172A] border border-slate-200 truncate max-w-[120px] sm:max-w-none">
                                  {db.exampleAccession}
                                </span>
                                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => onOpenModal(db)}
                                    className="p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                                    title="View Details"
                                  >
                                    <Info className="w-3.5 h-3.5" />
                                  </button>
                                  <a
                                    href={db.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center text-[#D95D29] hover:text-[#C2541C] hover:bg-orange-50 rounded-full transition-colors"
                                    title="Open website"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
