import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Bookmark, 
  Copy, 
  Check, 
  Info, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
} from 'lucide-react';
import { DatabaseRecord } from '../data/databases';

interface DatabaseTableProps {
  databases: DatabaseRecord[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (id: string) => void;
  onOpenModal: (database: DatabaseRecord) => void;
  onCopyAccession?: () => void;
}

type SortField = 'name' | 'tier' | 'subCategory' | 'host' | 'yearEstablished';
type SortDirection = 'asc' | 'desc';

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

const SUB_CATEGORY_STYLES: Record<string, string> = {
  'Genomics & DNA': 'bg-slate-100 text-slate-700 border-slate-200',
  'Proteins': 'bg-slate-100 text-slate-700 border-slate-200',
  '3D Structure': 'bg-slate-100 text-slate-700 border-slate-200',
  'Motifs & Domains': 'bg-slate-100 text-slate-700 border-slate-200',
  'Pathways & Networks': 'bg-slate-100 text-slate-700 border-slate-200',
  'Clinical & Disease': 'bg-slate-100 text-slate-700 border-slate-200',
  'Pharmacology & Chemicals': 'bg-slate-100 text-slate-700 border-slate-200',
  'RNA & Regulation': 'bg-slate-100 text-slate-700 border-slate-200',
  'Model Organisms': 'bg-slate-100 text-slate-700 border-slate-200',
  'AI & Predicted Structures': 'bg-slate-100 text-slate-700 border-slate-200',
};

export const DatabaseTable: React.FC<DatabaseTableProps> = ({
  databases,
  bookmarkedIds,
  onToggleBookmark,
  onOpenModal,
  onCopyAccession,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDatabases = useMemo(() => {
    return [...databases].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.acronym.localeCompare(b.acronym);
      } else if (sortField === 'tier') {
        comparison = a.tier.localeCompare(b.tier);
      } else if (sortField === 'subCategory') {
        comparison = a.subCategory.localeCompare(b.subCategory);
      } else if (sortField === 'host') {
        comparison = a.host.localeCompare(b.host);
      } else if (sortField === 'yearEstablished') {
        comparison = a.yearEstablished - b.yearEstablished;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [databases, sortField, sortDirection]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onCopyAccession?.();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-40 group-hover/col:opacity-100 shrink-0" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-[#D95D29] shrink-0" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-[#D95D29] shrink-0" />
    );
  };

  return (
    <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-sm">
      <table className="w-full text-left text-xs min-w-[700px]">
        <thead className="sticky top-0 z-10 bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 select-none">
          <tr>
            <th className="py-3 px-3 w-10 text-center">Save</th>
            <th
              className="py-3 px-4 cursor-pointer hover:text-[#0F172A] group/col transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="inline-flex items-center gap-1.5">
                <span>Database</span>
                {renderSortIndicator('name')}
              </div>
            </th>
            <th
              className="py-3 px-3 cursor-pointer hover:text-[#0F172A] group/col transition-colors"
              onClick={() => handleSort('tier')}
            >
              <div className="inline-flex items-center gap-1.5">
                <span>Tier</span>
                {renderSortIndicator('tier')}
              </div>
            </th>
            <th
              className="py-3 px-3 cursor-pointer hover:text-[#0F172A] group/col transition-colors"
              onClick={() => handleSort('subCategory')}
            >
              <div className="inline-flex items-center gap-1.5">
                <span>Discipline</span>
                {renderSortIndicator('subCategory')}
              </div>
            </th>
            <th
              className="py-3 px-4 hidden md:table-cell cursor-pointer hover:text-[#0F172A] group/col transition-colors"
              onClick={() => handleSort('host')}
            >
              <div className="inline-flex items-center gap-1.5">
                <span>Host Organization</span>
                {renderSortIndicator('host')}
              </div>
            </th>
            <th className="py-3 px-3 hidden lg:table-cell">Example ID</th>
            <th className="py-3 px-4">Summary</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-transparent">
          {sortedDatabases.map((db, idx) => {
            const isBookmarked = bookmarkedIds.has(db.id);
            const isEven = idx % 2 === 0;
            const badgeClass = TIER_BADGE_STYLES[db.tier] || 'bg-slate-100 text-slate-700';

            return (
              <tr
                key={db.id}
                onClick={() => onOpenModal(db)}
                className={`${
                  isEven ? 'bg-transparent' : 'bg-slate-50/50'
                } hover:bg-orange-50/40 transition-colors cursor-pointer group`}
              >
                {/* Bookmark */}
                <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onToggleBookmark(db.id)}
                    className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                      isBookmarked
                        ? 'text-[#D95D29] bg-orange-50'
                        : 'text-slate-400 hover:text-[#0F172A]'
                    }`}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark database'}
                  >
                    <Bookmark className="w-4 h-4 fill-current" />
                  </button>
                </td>

                {/* Database Name & Acronym */}
                <td className="py-3 px-4">
                  <div className="font-serif font-bold text-sm text-[#0F172A] group-hover:text-[#D95D29] transition-colors">
                    {db.acronym}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 font-normal">{db.name}</div>
                </td>

                {/* Tier */}
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${badgeClass}`}>
                    {db.tier}
                  </span>
                </td>

                {/* Discipline */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${SUB_CATEGORY_STYLES[db.subCategory] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {db.subCategory}
                  </span>
                </td>

                {/* Host Organization */}
                <td className="py-3 px-4 hidden md:table-cell text-slate-500 font-normal max-w-[180px] truncate" title={db.host}>
                  {db.host}
                </td>

                {/* Example ID */}
                <td className="py-3 px-3 hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleCopy(db.id, db.exampleAccession)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-xs font-mono font-medium text-[#0F172A] border border-slate-200 cursor-pointer transition-colors shadow-2xs"
                    title="Click to copy accession"
                  >
                    <span>{db.exampleAccession}</span>
                    {copiedId === db.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-slate-400" />
                    )}
                  </button>
                </td>

                {/* Short Description */}
                <td className="py-3 px-4 text-slate-600 max-w-[280px]">
                  <p className="line-clamp-2 text-xs leading-relaxed font-normal">{db.shortDesc}</p>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => onOpenModal(db)}
                      className="p-1.5 rounded-full text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      title="Inspect Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <a
                      href={db.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#D95D29] hover:bg-[#C2541C] text-white shadow-xs transition-colors"
                      title="Visit official portal (new tab)"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
