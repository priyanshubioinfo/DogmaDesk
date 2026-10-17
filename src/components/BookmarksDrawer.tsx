import React from 'react';
import { 
  X, 
  Bookmark, 
  ExternalLink, 
  Trash2, 
  Download, 
  FileText,
} from 'lucide-react';
import { DatabaseRecord } from '../data/databases';

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedDatabases: DatabaseRecord[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onOpenModal: (database: DatabaseRecord) => void;
  onExport?: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarkedDatabases,
  onRemoveBookmark,
  onClearAll,
  onOpenModal,
  onExport,
}) => {
  if (!isOpen) return null;

  const exportMarkdown = () => {
    const lines = [
      '# DogmaDesk | Bioinfo Workstation - My Database Stack',
      '',
      `Exported on: ${new Date().toLocaleDateString()}`,
      '',
      '| Database | Acronym | Tier | Host | URL |',
      '|---|---|---|---|---|',
      ...bookmarkedDatabases.map(
        (db) => `| ${db.name} | ${db.acronym} | ${db.tier} | ${db.host} | [Visit](${db.url}) |`
      ),
    ];
    const md = lines.join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dogmadesk-bioinfo-workstation-stack.md';
    a.click();
    URL.revokeObjectURL(url);
    onExport?.();
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(bookmarkedDatabases, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dogmadesk-bioinfo-workstation-stack.json';
    a.click();
    URL.revokeObjectURL(url);
    onExport?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-full sm:max-w-md h-full bg-[#F8F9FA] border-l border-slate-200 shadow-2xl p-4 sm:p-6 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Saved Databases Stack"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-2.5 text-[#0F172A]">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#D95D29] text-white shadow-xs shrink-0">
                <span className="font-serif text-xs font-bold leading-none select-none">✻</span>
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold tracking-tight text-[#0F172A] leading-tight">
                  My Stack
                </h2>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                  Bioinfo Workstation
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-orange-50 text-[#D95D29] border border-orange-200 ml-1">
                {bookmarkedDatabases.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 bg-white border border-slate-200 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-2 font-normal leading-relaxed">
            Your customized collection of bioinformatics tools saved in your browser storage.
          </p>
        </div>

        {/* List of saved databases */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 my-2">
          {bookmarkedDatabases.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3 font-normal">
              <Bookmark className="w-10 h-10 opacity-30 stroke-1 text-[#D95D29]" />
              <p className="text-xs text-slate-600">No databases saved yet. Click the bookmark icon on any database card to add it here.</p>
            </div>
          ) : (
            bookmarkedDatabases.map((db) => (
              <div
                key={db.id}
                onClick={() => onOpenModal(db)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-semibold text-base text-[#0F172A] group-hover:text-[#D95D29] transition-colors">
                      {db.acronym}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium border ${TIER_BADGE_STYLES[db.tier] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {db.tier}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 font-normal mt-0.5">{db.name}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={db.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-400 hover:text-[#D95D29] rounded-lg hover:bg-slate-100 transition-colors"
                    title="Open website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => onRemoveBookmark(db.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {bookmarkedDatabases.length > 0 && (
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={exportMarkdown}
                className="py-2.5 px-3 rounded-full bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#D95D29]" />
                <span>Export .MD</span>
              </button>
              <button
                onClick={exportJSON}
                className="py-2.5 px-3 rounded-full bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export .JSON</span>
              </button>
            </div>
            <button
              onClick={onClearAll}
              className="w-full py-2 text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
            >
              Clear All Saved Databases
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
