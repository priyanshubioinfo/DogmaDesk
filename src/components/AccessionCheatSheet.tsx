import React, { useState } from 'react';
import { 
  Table, 
  Copy, 
  Check, 
  ExternalLink, 
  Search,
} from 'lucide-react';
import { ACCESSION_CHEAT_SHEET } from '../data/databases';

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

export const AccessionCheatSheet: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedPrefix, setCopiedPrefix] = useState<string | null>(null);

  const filteredItems = ACCESSION_CHEAT_SHEET.filter((item) => {
    const q = filterQuery.toLowerCase();
    return (
      item.prefix.toLowerCase().includes(q) ||
      item.sourceDb.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.example.toLowerCase().includes(q)
    );
  });

  const handleCopy = (prefix: string, example: string) => {
    navigator.clipboard.writeText(example);
    setCopiedPrefix(prefix);
    setTimeout(() => setCopiedPrefix(null), 2000);
  };

  return (
    <section id="cheat-sheet" className="scroll-mt-20 py-14 bg-[#F8F9FA] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-[#D95D29] shadow-xs mb-3">
              <span className="font-serif text-xs font-bold leading-none select-none">✻</span>
              <span>Identifier Reference &amp; Prefix Registry</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#0F172A] tracking-tight">
              Accession Prefix &amp; Identifier Cheat-Sheet
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
              Quickly identify bioinformatics database records by their accession prefix, formatting standard, and source repository.
            </p>
          </div>

          {/* Quick search input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter prefix (NM_, P04637, rs...)..."
              className="w-full h-10 pl-9.5 pr-4 text-xs font-medium rounded-full bg-white border border-slate-200 hover:border-slate-300 text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D95D29]/15 focus:border-[#D95D29] shadow-xs transition-colors"
            />
          </div>
        </div>

        {/* Cheat sheet table (Desktop sm and up) */}
        <div className="hidden sm:block overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[#0F172A] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Prefix / Pattern</th>
                <th className="py-3 px-4">Origin Database</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Biological Meaning</th>
                <th className="py-3 px-4">Example Identifier</th>
                <th className="py-3 px-4 text-right">Resolve Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  {/* Prefix */}
                  <td className="py-3.5 px-4 font-mono font-medium text-[#0F172A]">
                    <span className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-700">
                      {item.prefix}
                    </span>
                  </td>

                  {/* Origin DB */}
                  <td className="py-3.5 px-4 font-serif text-sm sm:text-base font-semibold text-[#0F172A]">
                    {item.sourceDb}
                  </td>

                  {/* Category Tier */}
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${TIER_BADGE_STYLES[item.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {item.category}
                    </span>
                  </td>

                  {/* Meaning */}
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs leading-relaxed font-normal">
                    {item.description}
                  </td>

                  {/* Example with copy */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleCopy(item.prefix, item.example)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 font-mono text-xs font-medium text-slate-700 border border-slate-200 cursor-pointer transition-colors shadow-xs"
                      title="Click to copy example accession"
                    >
                      <span>{item.example}</span>
                      {copiedPrefix === item.prefix ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Direct link */}
                  <td className="py-3.5 px-4 text-right">
                    <a
                      href={item.exampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D95D29] hover:bg-[#C2541C] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs"
                      title={`Inspect ${item.example}`}
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cheat Sheet Cards (screens < sm) */}
        <div className="sm:hidden space-y-3">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-700 font-mono font-medium text-xs">
                  {item.prefix}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${TIER_BADGE_STYLES[item.category] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                  {item.category}
                </span>
              </div>

              <div>
                <h4 className="font-serif text-base font-semibold text-[#0F172A]">{item.sourceDb}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleCopy(item.prefix, item.example)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 font-mono text-xs font-medium text-slate-700 border border-slate-200 cursor-pointer transition-colors shadow-xs truncate max-w-[170px]"
                >
                  <span className="truncate">{item.example}</span>
                  {copiedPrefix === item.prefix ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                </button>

                <a
                  href={item.exampleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D95D29] hover:bg-[#C2541C] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
