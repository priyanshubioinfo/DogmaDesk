import React, { useState } from 'react';
import { BrandLockup } from './Brand';
import {
  Dna,
  Search,
  Bookmark,
  BookOpen,
  Table,
  Layers,
  Menu,
  X,
  Compass,
  Workflow,
  GraduationCap,
  FileCode2,
  Calendar,
  Database,
  ArrowLeft
} from 'lucide-react';

interface NavbarProps {
  favoritesCount: number;
  onOpenFavorites: () => void;
  onFocusSearch: () => void;
  onNavigateToSection: (sectionId: string) => void;
  activeSection?: string;
  currentView: 'explorer' | 'student-guide';
  onViewChange: (view: 'explorer' | 'student-guide') => void;
}

const EXPLORER_NAV_LINKS = [
  { id: 'explorer',        label: 'Databases',    icon: Layers },
  { id: 'resolver',        label: 'ID Detective', icon: Compass },
  { id: 'workflows',       label: 'Workflows',    icon: Workflow },
  { id: 'education-guide', label: 'Taxonomy',     icon: BookOpen },
  { id: 'cheat-sheet',     label: 'Accessions',   icon: Table },
];

const STUDENT_NAV_LINKS = [
  { id: 'subtab-concepts',   label: 'Foundations',  icon: Dna },
  { id: 'subtab-dbs',        label: 'Big 12 DBs',   icon: Database },
  { id: 'subtab-formats',    label: 'File Formats', icon: FileCode2 },
  { id: 'subtab-flowcharts', label: 'Flowcharts',   icon: Workflow },
  { id: 'subtab-history',    label: 'History',      icon: Calendar },
  { id: 'subtab-glossary',   label: 'Glossary',     icon: BookOpen },
];

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  onOpenFavorites,
  onFocusSearch,
  onNavigateToSection,
  currentView,
  onViewChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleBrandClick = () => {
    if (currentView !== 'explorer') {
      onViewChange('explorer');
    }
    onNavigateToSection('hero');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">

        {/* ── Brand (Left) ────────────────────────────────── */}
        <button
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 text-left group"
          aria-label="DogmaDesk Home"
        >
          <BrandLockup />
        </button>

        {/* ── Unified Center Navigation (Desktop) ─────────── */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 text-xs font-medium text-slate-600 shrink-0">
          {currentView === 'explorer' ? (
            <>
              {EXPLORER_NAV_LINKS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigateToSection(id)}
                  className="px-3 py-1.5 rounded-full text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{label}</span>
                </button>
              ))}

              {/* Student Handbook Pill Trigger */}
              <button
                onClick={() => onViewChange('student-guide')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100/80 text-[#D95D29] border border-orange-200 font-semibold transition-all shadow-xs cursor-pointer ml-1.5 shrink-0"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#D95D29]" />
                <span>Student Handbook</span>
                <span className="text-[10px] bg-[#D95D29] text-white px-1.5 py-0.5 rounded-full font-mono font-bold leading-none">
                  101
                </span>
              </button>
            </>
          ) : (
            <>
              {/* Return to Explorer Pill Button */}
              <button
                onClick={() => onViewChange('explorer')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold transition-all cursor-pointer mr-1.5 shrink-0 shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Directory Explorer</span>
              </button>

              {STUDENT_NAV_LINKS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigateToSection(id)}
                  className="px-3 py-1.5 rounded-full text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        {/* ── Right Actions ───────────────────────────────── */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Search Button (Mobile icon & Desktop pill) */}
          {currentView === 'explorer' && (
            <>
              {/* Desktop search pill */}
              <button
                onClick={onFocusSearch}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600
                  bg-white hover:bg-slate-50 border border-slate-200
                  rounded-full transition-colors cursor-pointer shadow-xs font-medium"
                title="Focus search (press /)"
              >
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline font-semibold text-[#0F172A]">Search</span>
                <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded-full border border-slate-200 font-mono font-bold">/</kbd>
              </button>

              {/* Mobile search icon button */}
              <button
                onClick={onFocusSearch}
                className="sm:hidden p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#0F172A] transition-colors cursor-pointer shadow-xs"
                title="Search databases"
                aria-label="Search databases"
              >
                <Search className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}

          {/* Quick Page Toggle Button (Tablet / Mobile screens < lg) */}
          <button
            onClick={() => onViewChange(currentView === 'explorer' ? 'student-guide' : 'explorer')}
            className="lg:hidden flex items-center gap-1 px-3 py-1.5 min-h-[36px] rounded-full bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-[#D95D29] font-semibold text-xs shadow-xs cursor-pointer"
          >
            {currentView === 'explorer' ? (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-[#D95D29] shrink-0" />
                <span className="text-[11px] sm:text-xs">Handbook</span>
              </>
            ) : (
              <>
                <Layers className="w-3.5 h-3.5 text-[#D95D29] shrink-0" />
                <span className="text-[11px] sm:text-xs">Explorer</span>
              </>
            )}
          </button>

          {/* Bookmarks */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-white hover:bg-slate-50
              border border-slate-200
              text-slate-600 hover:text-[#D95D29] transition-colors cursor-pointer shadow-xs"
            title={`Saved databases (${favoritesCount})`}
            aria-label="Saved databases"
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center
                text-[9px] font-bold bg-[#D95D29] text-white rounded-full shadow-xs">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </button>

          {/* Hamburger (mobile / tablet < lg) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full bg-white border border-slate-200
              text-slate-600 hover:text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Mobile / Tablet flyout ──────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 py-3.5 px-4 space-y-3.5 shadow-lg animate-fade-down max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Mode Switcher inside flyout */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => { onViewChange('explorer'); setMobileOpen(false); }}
              className={`min-h-[40px] py-2 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                currentView === 'explorer'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#D95D29]" />
              <span>Explorer</span>
            </button>
            <button
              onClick={() => { onViewChange('student-guide'); setMobileOpen(false); }}
              className={`min-h-[40px] py-2 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                currentView === 'student-guide'
                  ? 'bg-[#D95D29] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#0F172A]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Handbook 101</span>
            </button>
          </div>

          {/* Mode-specific nav links with generous touch targets */}
          <div className="space-y-1">
            {(currentView === 'explorer' ? EXPLORER_NAV_LINKS : STUDENT_NAV_LINKS).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { onNavigateToSection(id); setMobileOpen(false); }}
                className="w-full min-h-[44px] flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                  text-xs font-medium text-slate-600 hover:text-[#0F172A] hover:bg-slate-100 transition-colors text-left cursor-pointer"
              >
                <Icon className="w-4 h-4 text-[#D95D29] shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Quick Stack Action inside Drawer */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={() => { onOpenFavorites(); setMobileOpen(false); }}
              className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-[#D95D29] font-semibold text-xs cursor-pointer hover:bg-orange-100/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#D95D29] fill-current" />
                <span>My Saved Stack</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#D95D29] text-white font-mono text-[10px]">
                {favoritesCount} saved
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
