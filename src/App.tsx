import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EducationGuide } from './components/EducationGuide';
import { FilterBar, ViewMode, SortOption } from './components/FilterBar';
import { DatabaseCard } from './components/DatabaseCard';
import { DatabaseTable } from './components/DatabaseTable';
import { TaxonomyView } from './components/TaxonomyView';
import { DatabaseModal } from './components/DatabaseModal';
import { AccessionResolver } from './components/AccessionResolver';
import { WorkflowNavigator } from './components/WorkflowNavigator';
import { AccessionCheatSheet } from './components/AccessionCheatSheet';
import { BookmarksDrawer } from './components/BookmarksDrawer';
import { Footer } from './components/Footer';
import { ToastContainer, useToast } from './components/Toast';
import { StudentGuidePage } from './components/StudentGuidePage';
import { DATABASES_DATA, DatabaseRecord, DatabaseTier, SubCategory } from './data/databases';
import { SearchX } from 'lucide-react';

export const App: React.FC = () => {
  // Toast notifications
  const { toasts, show: showToast, dismiss: dismissToast } = useToast();

  // Primary Page View Mode ('explorer' vs 'student-guide')
  const [currentView, setCurrentView] = useState<'explorer' | 'student-guide'>(() => {
    if (typeof window !== 'undefined') {
      const h = window.location.hash;
      if (h.startsWith('#guide') || h.startsWith('#subtab-')) return 'student-guide';
    }
    return 'explorer';
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<DatabaseTier | 'All'>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | 'All'>('All');
  const [selectedHost, setSelectedHost] = useState<string>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('popular');

  // Bookmarks State (persisted in localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('dogmadesk_bookmarks') ?? localStorage.getItem('omicsvault_bookmarks') ?? localStorage.getItem('biodb_bookmarks');
      return saved ? new Set(JSON.parse(saved)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Modal State
  const [activeModalDb, setActiveModalDb] = useState<DatabaseRecord | null>(null);

  // Search input ref for quick keyboard focus ('/')
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Lock purely in light mode
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    try { 
      localStorage.removeItem('dogmadesk_theme');
      localStorage.removeItem('omicsvault_theme'); 
    } catch {}
  }, []);

  // Persist bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('dogmadesk_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

      // / → focus search
      if (e.key === '/' && !inInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      // Escape → close modal, then drawer
      if (e.key === 'Escape') {
        if (activeModalDb) { setActiveModalDb(null); return; }
        if (isBookmarksOpen) { setIsBookmarksOpen(false); return; }
      }
      // B → toggle bookmarks drawer
      if (e.key === 'b' && !inInput) {
        setIsBookmarksOpen(o => !o);
        return;
      }
      // D → cycle view modes
      if (e.key === 'd' && !inInput) {
        setViewMode(v => v === 'grid' ? 'table' : v === 'table' ? 'taxonomy' : 'grid');
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalDb, isBookmarksOpen]);

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClearAllBookmarks = () => {
    setBookmarkedIds(new Set());
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTier('All');
    setSelectedSubCategory('All');
    setSelectedHost('All');
    setSortOption('popular');
  };

  const handleSelectDatabaseFromWorkflow = useCallback((databaseId: string) => {
    const found = DATABASES_DATA.find((d) => d.id === databaseId);
    if (found) {
      setActiveModalDb(found);
    }
  }, []);

  // Listen to hash changes (e.g. #guide, #explorer, #subtab-...)
  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash;
      if (h.startsWith('#guide') || h.startsWith('#subtab-')) {
        setCurrentView('student-guide');
      } else if (h === '#explorer' || h === '#hero') {
        setCurrentView('explorer');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('subtab-')) {
      if (currentView !== 'student-guide') {
        setCurrentView('student-guide');
        window.location.hash = `#${sectionId}`;
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
        return;
      }
    } else {
      if (currentView !== 'explorer') {
        setCurrentView('explorer');
        window.location.hash = '#explorer';
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }, 60);
        return;
      }
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Tier Counts across the full catalog
  const counts = useMemo(() => {
    return {
      total: DATABASES_DATA.length,
      primary: DATABASES_DATA.filter((d) => d.tier === 'Primary').length,
      secondary: DATABASES_DATA.filter((d) => d.tier === 'Secondary').length,
      composite: DATABASES_DATA.filter((d) => d.tier === 'Composite').length,
      tertiary: DATABASES_DATA.filter((d) => d.tier === 'Tertiary').length,
      specialized: DATABASES_DATA.filter((d) => d.tier === 'Specialized').length,
    };
  }, []);

  // Filtered and Sorted Databases
  const filteredDatabases = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const filtered = DATABASES_DATA.filter((db) => {
      // 1. Search Query filter
      if (q) {
        const matchesName = db.name.toLowerCase().includes(q);
        const matchesAcronym = db.acronym.toLowerCase().includes(q);
        const matchesShortDesc = db.shortDesc.toLowerCase().includes(q);
        const matchesWhenToUse = db.whenToUse.toLowerCase().includes(q);
        const matchesHost = db.host.toLowerCase().includes(q);
        const matchesExample = db.exampleAccession.toLowerCase().includes(q);
        const matchesPrefixes = db.accessionPrefixes.some((p) => p.toLowerCase().includes(q));

        if (!matchesName && !matchesAcronym && !matchesShortDesc && !matchesWhenToUse && !matchesHost && !matchesExample && !matchesPrefixes) {
          return false;
        }
      }

      // 2. Tier filter
      if (selectedTier !== 'All' && db.tier !== selectedTier) {
        return false;
      }

      // 3. SubCategory / Discipline filter
      if (selectedSubCategory !== 'All' && db.subCategory !== selectedSubCategory) {
        return false;
      }

      // 4. Host filter
      if (selectedHost !== 'All' && db.hostCategory !== selectedHost) {
        return false;
      }

      return true;
    });

    // Apply Sorting
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'popular':
          // Sort popular first, then alphabetically
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return a.name.localeCompare(b.name);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'year-desc':
          return b.yearEstablished - a.yearEstablished;
        case 'year-asc':
          return a.yearEstablished - b.yearEstablished;
        case 'tier':
          return a.tier.localeCompare(b.tier);
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedTier, selectedSubCategory, selectedHost, sortOption]);

  const bookmarkedDatabases = useMemo(() => {
    return DATABASES_DATA.filter((db) => bookmarkedIds.has(db.id));
  }, [bookmarkedIds]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedTier !== 'All' ||
    selectedSubCategory !== 'All' ||
    selectedHost !== 'All';

  return (
    <div className="min-h-screen text-[#0F172A] bg-[#F8F9FA]">
      {/* Top Sticky Navigation */}
      <Navbar
        favoritesCount={bookmarkedIds.size}
        onOpenFavorites={() => setIsBookmarksOpen(true)}
        onFocusSearch={() => {
          if (currentView !== 'explorer') setCurrentView('explorer');
          scrollToSection('hero');
          searchInputRef.current?.focus();
        }}
        onNavigateToSection={scrollToSection}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'explorer') {
            window.location.hash = '#explorer';
          } else {
            window.location.hash = '#guide';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      <main>
        {currentView === 'student-guide' ? (
          <StudentGuidePage
            onBackToExplorer={() => {
              setCurrentView('explorer');
              window.location.hash = '#explorer';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDatabaseModal={setActiveModalDb}
            allDatabases={DATABASES_DATA}
          />
        ) : (
          <>
            {/* Dynamic Hero Section */}
            <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTier={selectedTier}
          onSelectTier={(tier) => {
            setSelectedTier(tier);
            scrollToSection('explorer');
          }}
          counts={counts}
          searchInputRef={searchInputRef}
          filteredCount={filteredDatabases.length}
          onFindAccession={() => document.getElementById('accession-resolver')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />

        {/* Database Directory Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <FilterBar
            selectedTier={selectedTier}
            onSelectTier={setSelectedTier}
            selectedSubCategory={selectedSubCategory}
            onSelectSubCategory={setSelectedSubCategory}
            selectedHost={selectedHost}
            onSelectHost={setSelectedHost}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortOption={sortOption}
            onSortChange={setSortOption}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
            totalFiltered={filteredDatabases.length}
          />

          {/* Result Listing */}
          {filteredDatabases.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-white border border-slate-200 space-y-4 max-w-md mx-auto shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto text-[#D95D29] border border-orange-200">
                <SearchX className="w-7 h-7 text-[#D95D29]" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-[#0F172A] mb-1">No databases found</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed font-normal">
                  No results match your filters. Try a different search term or reset the filters.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#0F172A] hover:bg-slate-800 text-white transition-all cursor-pointer shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredDatabases.map((db, i) => (
                    <DatabaseCard
                      key={db.id}
                      database={db}
                      index={i}
                      isBookmarked={bookmarkedIds.has(db.id)}
                      onToggleBookmark={(id) => {
                        handleToggleBookmark(id);
                        const isNowBookmarked = !bookmarkedIds.has(id);
                        showToast(isNowBookmarked ? '✓ Saved to Stack' : 'Removed from Stack', isNowBookmarked ? 'success' : 'error');
                      }}
                      onOpenModal={setActiveModalDb}
                      onCopyAccession={() => showToast('📋 Accession copied!', 'copy')}
                    />
                  ))}
                </div>
              )}

              {viewMode === 'table' && (
                <DatabaseTable
                  databases={filteredDatabases}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={(id) => {
                    handleToggleBookmark(id);
                    const isNowBookmarked = !bookmarkedIds.has(id);
                    showToast(isNowBookmarked ? '✓ Saved to Stack' : 'Removed from Stack', isNowBookmarked ? 'success' : 'error');
                  }}
                  onOpenModal={setActiveModalDb}
                  onCopyAccession={() => showToast('📋 Accession copied!', 'copy')}
                />
              )}

              {viewMode === 'taxonomy' && (
                <TaxonomyView
                  databases={filteredDatabases}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  onOpenModal={setActiveModalDb}
                />
              )}
            </>
          )}
        </section>

        {/* Universal Accession Detective & Multi-DB Resolver */}
        <div id="accession-resolver" className="scroll-mt-24">
          <AccessionResolver />
        </div>

        {/* Interactive Research Workflow Navigator */}
        <WorkflowNavigator onSelectDatabase={handleSelectDatabaseFromWorkflow} />

        {/* Educational 101 Guide & Comparison Matrices */}
        <EducationGuide
          onSelectTier={(tier) => {
            setSelectedTier(tier);
            scrollToSection('explorer');
          }}
        />

        {/* Accession Prefix & Identifier Cheat-Sheet */}
        <AccessionCheatSheet />
      </>
    )}
  </main>

      {/* Footer */}
      <Footer
        onNavigateToSection={scrollToSection}
        onBrandClick={() => scrollToSection('hero')}
      />

      {/* Detail Modal Dialog */}
      <DatabaseModal
        database={activeModalDb}
        allDatabases={DATABASES_DATA}
        onClose={() => setActiveModalDb(null)}
        onNavigate={setActiveModalDb}
        isBookmarked={activeModalDb ? bookmarkedIds.has(activeModalDb.id) : false}
        onToggleBookmark={(id) => {
          handleToggleBookmark(id);
          const isNowBookmarked = !bookmarkedIds.has(id);
          showToast(isNowBookmarked ? '✓ Saved to Stack' : 'Removed from Stack', isNowBookmarked ? 'success' : 'error');
        }}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarkedDatabases={bookmarkedDatabases}
        onRemoveBookmark={(id) => {
          handleToggleBookmark(id);
          showToast('Removed from Stack', 'error');
        }}
        onClearAll={handleClearAllBookmarks}
        onOpenModal={(db) => {
          setIsBookmarksOpen(false);
          setActiveModalDb(db);
        }}
        onExport={() => showToast('⬇ Export downloaded', 'download')}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

export default App;
