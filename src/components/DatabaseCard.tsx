import React, { useState } from 'react';
import {
  ExternalLink,
  Bookmark,
  Copy,
  Check,
  Info,
  Building2,
  Calendar,
  Star,
  Code2,
} from 'lucide-react';
import { DatabaseRecord } from '../data/databases';

interface DatabaseCardProps {
  database: DatabaseRecord;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpenModal: (database: DatabaseRecord) => void;
  index?: number;
  onCopyAccession?: () => void;
}

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

const TIER_CARD_ACCENT: Record<string, string> = {
  Primary:     'card-tier-primary',
  Secondary:   'card-tier-secondary',
  Composite:   'card-tier-composite',
  Tertiary:    'card-tier-tertiary',
  Specialized: 'card-tier-specialized',
};

const TIER_BEST_FOR_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50/60 border-l-3 border-blue-600 text-slate-700',
  Secondary:   'bg-emerald-50/60 border-l-3 border-emerald-600 text-slate-700',
  Composite:   'bg-orange-50/60 border-l-3 border-[#D95D29] text-slate-700',
  Tertiary:    'bg-purple-50/60 border-l-3 border-purple-600 text-slate-700',
  Specialized: 'bg-rose-50/60 border-l-3 border-rose-600 text-slate-700',
};

export const DatabaseCard: React.FC<DatabaseCardProps> = ({
  database,
  isBookmarked,
  onToggleBookmark,
  onOpenModal,
  onCopyAccession,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(database.exampleAccession);
    setCopied(true);
    onCopyAccession?.();
    setTimeout(() => setCopied(false), 2000);
  };

  const badgeClass = TIER_BADGE_STYLES[database.tier] || 'bg-slate-100 text-slate-700 border-slate-200';
  const cardAccent = TIER_CARD_ACCENT[database.tier] || '';
  const bestForClass = TIER_BEST_FOR_STYLES[database.tier] || 'bg-orange-50/60 border-l-3 border-[#D95D29] text-slate-700';

  return (
    <div
      onClick={() => onOpenModal(database)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpenModal(database);
      }}
      tabIndex={0}
      role="button"
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl
        bg-white border border-slate-200 ${cardAccent}
        hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-[#D95D29]/50 hover:-translate-y-0.5
        shadow-sm
        transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D95D29]/30`}
    >
      <div>
        {/* ── Top Header: Badges & Bookmark ── */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2 py-0.5 text-xs rounded-full border ${badgeClass}`}>
              {database.tier}
            </span>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full border border-slate-200 bg-slate-100 text-slate-700 truncate max-w-[140px]">
              {database.subCategory}
            </span>
            {database.isPopular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-orange-50 text-[#D95D29] border border-orange-200">
                <Star className="w-2.5 h-2.5 fill-current text-[#D95D29]" />
                Core
              </span>
            )}
            {(database.apiDocsUrl || database.apiUrlTemplate) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200" title="Programmatic REST API available">
                <Code2 className="w-2.5 h-2.5 text-slate-500" />
                API
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(database.id);
            }}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-[#D95D29] bg-orange-50 border border-orange-200'
                : 'text-slate-400 hover:text-[#0F172A] hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Saved in Stack' : 'Save to Stack'}
            aria-label="Save to Stack"
            aria-pressed={isBookmarked}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* ── Title & Host ── */}
        <div className="mb-2">
          <h3 className="font-serif text-xl font-bold text-[#0F172A] group-hover:text-[#D95D29] transition-colors">
            {database.acronym}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-1 font-normal mt-0.5">
            {database.name}
          </p>
        </div>

        {/* ── Organization & Year Meta ── */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3 font-normal">
          <span className="flex items-center gap-1.5 truncate max-w-[180px]" title={database.host}>
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{database.host}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0 font-mono text-[11px] text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400" />
            {database.yearEstablished}
          </span>
        </div>

        {/* ── Summary ── */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2 font-normal">
          {database.shortDesc}
        </p>

        {/* ── When to use block ── */}
        <div className={`p-2.5 rounded-r-xl text-xs mb-3 leading-relaxed ${bestForClass}`}>
          <span className="font-semibold block mb-0.5 text-[#0F172A]">
            Best for:
          </span>
          <p className="line-clamp-2 font-normal text-slate-600">
            {database.whenToUse}
          </p>
        </div>

        {/* ── Accession Prefix Tags ── */}
        {database.accessionPrefixes && database.accessionPrefixes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5 mb-1.5">
            <span className="text-[11px] text-slate-400 font-medium mr-0.5">IDs:</span>
            {database.accessionPrefixes.slice(0, 3).map((pfx, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200"
              >
                {pfx}
              </span>
            ))}
            {database.accessionPrefixes.length > 3 && (
              <span className="text-[11px] text-slate-400 font-mono font-medium">
                +{database.accessionPrefixes.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Formats & License Badges ── */}
        {database.dataFormats && database.dataFormats.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-1">
            <span className="text-[11px] text-slate-400 font-medium mr-0.5">Formats:</span>
            {database.dataFormats.slice(0, 3).map((fmt, i) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded text-[10px] font-mono font-normal bg-slate-50 text-slate-600 border border-slate-200"
              >
                {fmt}
              </span>
            ))}
            {database.dataFormats.length > 3 && (
              <span className="text-[10px] text-slate-400 font-mono">
                +{database.dataFormats.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Card Footer ── */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Copy Example Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
            bg-slate-50 hover:bg-slate-100
            border border-slate-200
            text-xs font-mono text-[#0F172A]
            transition-colors cursor-pointer group/copy min-w-0 max-w-[140px] sm:max-w-[200px]"
          title={`Copy accession: ${database.exampleAccession}`}
        >
          <span className="text-slate-400 text-[10px] sm:text-[11px] font-medium shrink-0">eg.</span>
          <span className="font-semibold text-[#0F172A] truncate">{database.exampleAccession}</span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover/copy:text-[#0F172A] shrink-0" />
          )}
        </button>

        {/* Actions: Details & External Visit */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(database);
            }}
            className="p-1.5 rounded-full text-slate-500 hover:text-[#0F172A] hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            title="Database Details"
            aria-label="View database details"
          >
            <Info className="w-4 h-4" />
          </button>
          <a
            href={database.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
              bg-[#D95D29] hover:bg-[#C2541C] text-white
              shadow-xs transition-colors cursor-pointer min-h-[32px]"
            title={`Open official ${database.acronym} portal`}
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
