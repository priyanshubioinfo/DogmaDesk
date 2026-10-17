import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  ExternalLink, 
  Bookmark, 
  Copy, 
  Check, 
  Search, 
  Building2, 
  Calendar, 
  Wrench, 
  Sparkles, 
  Layers, 
  FileCode2, 
  Database,
  ChevronLeft,
  ChevronRight,
  Code2,
  Terminal,
  BookOpen,
  Quote,
  ShieldCheck,
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

const SUB_CATEGORY_STYLES: Record<string, string> = {
  'Genomics & DNA': 'bg-sky-50 text-sky-700 border-sky-200 font-medium',
  'Proteins': 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium',
  '3D Structure': 'bg-cyan-50 text-cyan-700 border-cyan-200 font-medium',
  'Motifs & Domains': 'bg-teal-50 text-teal-700 border-teal-200 font-medium',
  'Pathways & Networks': 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
  'Clinical & Disease': 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
  'Pharmacology & Chemicals': 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
  'RNA & Regulation': 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
  'Model Organisms': 'bg-violet-50 text-violet-700 border-violet-200 font-medium',
  'AI & Predicted Structures': 'bg-orange-50 text-orange-700 border-orange-200 font-medium',
};

const TIER_BEST_FOR_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50/60 border-l-3 border-blue-600 border-t border-r border-b border-blue-200 text-slate-800',
  Secondary:   'bg-emerald-50/60 border-l-3 border-emerald-600 border-t border-r border-b border-emerald-200 text-slate-800',
  Composite:   'bg-orange-50/60 border-l-3 border-[#D95D29] border-t border-r border-b border-orange-200 text-slate-800',
  Tertiary:    'bg-purple-50/60 border-l-3 border-purple-600 border-t border-r border-b border-purple-200 text-slate-800',
  Specialized: 'bg-rose-50/60 border-l-3 border-rose-600 border-t border-r border-b border-rose-200 text-slate-800',
};

interface DatabaseModalProps {
  database: DatabaseRecord | null;
  allDatabases?: DatabaseRecord[];
  onClose: () => void;
  onNavigate?: (database: DatabaseRecord) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  database,
  allDatabases = [],
  onClose,
  onNavigate,
  isBookmarked,
  onToggleBookmark,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copiedAccession, setCopiedAccession] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);
  const [copiedApiUrl, setCopiedApiUrl] = useState(false);
  const [codeLang, setCodeLang] = useState<'python' | 'r'>('python');
  const [queryInput, setQueryInput] = useState('');

  // Find index in allDatabases for previous/next navigation
  const currentIndex = useMemo(() => {
    if (!database || allDatabases.length === 0) return -1;
    return allDatabases.findIndex((d) => d.id === database.id);
  }, [database, allDatabases]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < allDatabases.length - 1;

  const handlePrev = () => {
    if (hasPrev && onNavigate) {
      onNavigate(allDatabases[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onNavigate) {
      onNavigate(allDatabases[currentIndex + 1]);
    }
  };

  // Keep keyboard focus inside the dialog and restore it to the opener on close.
  useEffect(() => {
    if (!database) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditable = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowLeft' && !isEditable) handlePrev();
      if (e.key === 'ArrowRight' && !isEditable) handleNext();
      if (e.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dialogRef.current?.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !dialogRef.current?.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [database?.id]);

  // Related databases (same subCategory or tier, max 3)
  const relatedDatabases = useMemo(() => {
    if (!database || allDatabases.length === 0) return [];
    return allDatabases
      .filter((d) => d.id !== database.id && (d.subCategory === database.subCategory || d.tier === database.tier))
      .slice(0, 3);
  }, [database, allDatabases]);

  if (!database) return null;

  const handleCopyAccession = () => {
    navigator.clipboard.writeText(database.exampleAccession);
    setCopiedAccession(true);
    setTimeout(() => setCopiedAccession(false), 2000);
  };

  const handleCopyCode = () => {
    const code = codeLang === 'python' ? (database.pythonSnippet || '') : (database.rSnippet || '');
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const generateBibTeX = (): string => {
    if (!database.citation) return '';
    const c = database.citation;
    const citeKey = `${database.id}_${c.year}`;
    let bib = `@article{${citeKey},\n  author = {${c.authors}},\n  title = {${c.title}},\n  journal = {${c.journal}},\n  year = {${c.year}}`;
    if (c.doi) bib += `,\n  doi = {${c.doi}}`;
    if (c.pmid) bib += `,\n  pmid = {${c.pmid}}`;
    bib += `\n}`;
    return bib;
  };

  const handleCopyBibtex = () => {
    const bib = generateBibTeX();
    if (!bib) return;
    navigator.clipboard.writeText(bib);
    setCopiedBibtex(true);
    setTimeout(() => setCopiedBibtex(false), 2000);
  };

  const handleCopyApiUrl = () => {
    if (!database.apiUrlTemplate) return;
    navigator.clipboard.writeText(database.apiUrlTemplate);
    setCopiedApiUrl(true);
    setTimeout(() => setCopiedApiUrl(false), 2000);
  };

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;

    if (database.searchUrlTemplate) {
      const searchUrl = database.searchUrlTemplate.replace('{query}', encodeURIComponent(queryInput.trim()));
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(database.url, '_blank', 'noopener,noreferrer');
    }
  };

  const activeSnippet = codeLang === 'python' ? database.pythonSnippet : database.rSnippet;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/50 backdrop-blur-xs animate-fade-up"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        ref={dialogRef}
        className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-[#F8F9FA] border border-slate-200 shadow-2xl p-4 sm:p-8 space-y-4 sm:space-y-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-database-title"
      >
        {/* Top bar controls: Prev/Next pagination & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            {allDatabases.length > 0 && currentIndex >= 0 && (
              <>
                <button
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Previous database (Left Arrow)"
                  aria-label="Previous database"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-slate-600 px-1 font-medium">
                  {currentIndex + 1} of {allDatabases.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-1.5 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                  title="Next database (Right Arrow)"
                  aria-label="Next database"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-[#0F172A] bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
            title="Close (Esc)"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${TIER_BADGE_STYLES[database.tier] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {database.tier} Database
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${SUB_CATEGORY_STYLES[database.subCategory] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {database.subCategory}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-slate-500 bg-white border border-slate-200">
              Est. {database.yearEstablished}
            </span>
            {database.license && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {database.license}
              </span>
            )}
          </div>

          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div>
              <h2 id="modal-database-title" className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#0F172A] leading-tight">
                {database.name}{' '}
                <span className="text-[#D95D29] font-serif italic">({database.acronym})</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 font-normal">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-[#0F172A]">{database.host}</span>
                <span>•</span>
                <span>Curation: <strong className="text-[#0F172A] font-semibold">{database.curationType}</strong></span>
              </div>
            </div>

            {/* Bookmark inside modal */}
            <button
              onClick={() => onToggleBookmark(database.id)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? 'bg-orange-50 text-[#D95D29] border-orange-200 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-[#0F172A] shadow-xs'
              }`}
              title={isBookmarked ? 'Saved in Stack' : 'Save to Stack'}
              aria-label="Save to Stack"
            >
              <Bookmark className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Supported Data Formats Badges */}
          {database.dataFormats && database.dataFormats.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#D95D29]" />
                Data Formats:
              </span>
              {database.dataFormats.map((fmt, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {fmt}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Comprehensive Description */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#D95D29]" />
            <span>Comprehensive Overview</span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            {database.longDesc}
          </p>
        </div>

        {/* When To Use */}
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${TIER_BEST_FOR_STYLES[database.tier] || 'bg-[#F8F9FA] border-l-2 border-[#D95D29] border-t border-r border-b border-slate-200 text-[#0F172A]'}`}>
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#D95D29]">
            <Sparkles className="w-3.5 h-3.5 text-[#D95D29]" />
            <span>Recommended Research Use Cases</span>
          </h3>
          <p className="text-sm leading-relaxed font-normal text-slate-600">
            {database.whenToUse}
          </p>
        </div>

        {/* Accession ID & Query Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Accession Details */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Accession ID Standard</span>
            </h4>
            <div>
              <div className="text-xs text-slate-500 font-normal mb-1">Common Prefix Patterns:</div>
              <div className="flex flex-wrap gap-1.5">
                {database.accessionPrefixes.map((pfx, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 font-mono text-xs font-semibold border border-orange-200"
                  >
                    {pfx}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <div className="text-xs text-slate-500 font-normal mb-1">Example Accession:</div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-mono text-sm font-semibold text-[#0F172A]">{database.exampleAccession}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{database.exampleLabel}</div>
                </div>
                <button
                  onClick={handleCopyAccession}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedAccession ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedAccession ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Computational Tools */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Integrated Tools &amp; Services</span>
            </h4>
            <div className="space-y-1.5">
              {database.keyTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-normal"
                >
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Developer & Programmatic API Access ──────────────── */}
        {(database.apiDocsUrl || database.apiUrlTemplate || activeSnippet) && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#D95D29]" />
                <span>Programmatic &amp; REST API Access</span>
              </h4>
              {database.apiDocsUrl && (
                <a
                  href={database.apiDocsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-[#D95D29] hover:text-[#C2541C] flex items-center gap-1 cursor-pointer"
                >
                  <span>Official API Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Example REST Endpoint */}
            {database.apiUrlTemplate && (
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  REST API Endpoint:
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#0F172A] overflow-x-auto gap-2">
                  <span className="truncate">{database.apiUrlTemplate}</span>
                  <button
                    onClick={handleCopyApiUrl}
                    className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-[11px] font-medium text-slate-700 border border-slate-200 flex items-center gap-1 shrink-0 cursor-pointer"
                    title="Copy API URL"
                  >
                    {copiedApiUrl ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    <span>{copiedApiUrl ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Code Snippets (Python / R) */}
            {activeSnippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-full border border-slate-200">
                    <button
                      onClick={() => setCodeLang('python')}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                        codeLang === 'python'
                          ? 'bg-[#0F172A] text-white shadow-xs'
                          : 'text-slate-600 hover:text-[#0F172A]'
                      }`}
                    >
                      Python
                    </button>
                    {database.rSnippet && (
                      <button
                        onClick={() => setCodeLang('r')}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all cursor-pointer ${
                          codeLang === 'r'
                            ? 'bg-[#0F172A] text-white shadow-xs'
                            : 'text-slate-600 hover:text-[#0F172A]'
                        }`}
                      >
                        R
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedCode ? 'Code Copied!' : 'Copy Snippet'}</span>
                  </button>
                </div>

                <div className="relative rounded-xl bg-[#0F172A] text-slate-50 p-3.5 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed border border-slate-800">
                  <pre className="font-mono whitespace-pre-wrap">{activeSnippet}</pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Academic Citation & BibTeX Generator ────────────── */}
        {database.citation && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Quote className="w-4 h-4 text-[#D95D29]" />
                <span>Canonical Academic Citation &amp; BibTeX</span>
              </h4>
              <button
                onClick={handleCopyBibtex}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copiedBibtex ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedBibtex ? 'BibTeX Copied!' : 'Copy BibTeX'}</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-medium text-[#0F172A] leading-relaxed">
                {database.citation.authors} ({database.citation.year}). {database.citation.title}.{' '}
                <em className="text-slate-600">{database.citation.journal}</em>.
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                {database.citation.pmid && (
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${database.citation.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D95D29] hover:underline flex items-center gap-1"
                  >
                    <span>PMID: {database.citation.pmid}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
                {database.citation.doi && (
                  <a
                    href={`https://doi.org/${database.citation.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D95D29] hover:underline flex items-center gap-1"
                  >
                    <span>DOI: {database.citation.doi}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Live Query Launcher */}
        {database.searchUrlTemplate && (
          <form onSubmit={handleDirectSearch} className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <label className="text-xs font-semibold text-[#0F172A] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#D95D29]" />
                Query {database.acronym} directly
              </span>
              <span className="text-[10px] text-slate-400">Opens official website in new tab</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={`Search ${database.acronym} (e.g. ${database.exampleAccession})...`}
                className="w-full sm:flex-1 py-2.5 px-4 text-xs bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D95D29]/15 focus:border-[#D95D29] transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium bg-[#D95D29] hover:bg-[#C2541C] text-white transition-colors cursor-pointer shrink-0 shadow-xs text-center"
              >
                Search
              </button>
            </div>
          </form>
        )}

        {/* Related Databases Section */}
        {relatedDatabases.length > 0 && (
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Related Databases</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {relatedDatabases.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => onNavigate && onNavigate(rel)}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif text-sm font-semibold text-[#0F172A] group-hover:text-[#D95D29]">
                      {rel.acronym}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{rel.tier}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">
                    {rel.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Close
          </button>

          <a
            href={database.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium bg-[#D95D29] hover:bg-[#C2541C] text-white shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Visit {database.acronym} Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
