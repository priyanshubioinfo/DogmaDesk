import React, { useState, useEffect } from 'react';
import { ExternalLink, ChevronUp, Heart } from 'lucide-react';
import { BrandLockup } from './Brand';

interface FooterProps {
  onNavigateToSection?: (sectionId: string) => void;
  onBrandClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection, onBrandClick }) => {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* ── Scroll-to-top FAB ─────────────────────────────────── */}
      <button
        onClick={scrollTop}
        className={`fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 p-3 rounded-full
          bg-slate-900 hover:bg-slate-800 text-white shadow-lg cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center
          transition-all duration-300 ${
            showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        aria-label="Back to top"
        title="Back to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-[#F8F9FA] border-t border-slate-200 text-slate-600 text-xs py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <button
                onClick={onBrandClick || scrollTop}
                className="flex items-center gap-2.5 cursor-pointer select-none group w-fit text-left"
                aria-label="DogmaDesk Home"
              >
                <BrandLockup />
              </button>
              <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-normal">
                Find trusted biological databases, make sense of accession IDs, and move from a research question
                to the right resource. Built for students and working researchers.
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-700 font-normal">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                  Free &amp; open-access
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 font-normal">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#D95D29]" />
                  No paywalls or tracking
                </span>
                <span className="flex items-center gap-1.5 text-slate-700 font-normal">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600" />
                  55+ curated databases
                </span>
              </div>
            </div>

            {/* Consortia */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                Foundational Consortia
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { href: 'https://www.insdc.org/',       label: 'INSDC (GenBank / ENA / DDBJ)' },
                  { href: 'https://www.wwpdb.org/',       label: 'wwPDB (Worldwide PDB)' },
                  { href: 'https://www.uniprot.org/',     label: 'UniProt Consortium' },
                  { href: 'https://elixir-europe.org/',   label: 'ELIXIR European Infrastructure' },
                  { href: 'https://www.ncbi.nlm.nih.gov/',label: 'NCBI (NIH)' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-[#D95D29] flex items-center gap-1.5 transition-colors group font-normal"
                    >
                      <span className="group-hover:underline">{label}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-[#D95D29]" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[11px]">
                Directory Modules
              </h4>
              <ul className="space-y-2 text-xs">
                {[
                  { id: 'explorer',        label: 'Interactive Database Directory' },
                  { id: 'resolver',        label: 'Universal Accession Detective' },
                  { id: 'workflows',       label: 'Research Workflow Navigator' },
                  { id: 'education-guide', label: 'Database Taxonomy 101' },
                  { id: 'comparisons',     label: 'Head-to-Head Comparisons' },
                  { id: 'cheat-sheet',     label: 'Accession Prefix Cheat-Sheet' },
                  { id: 'subtab-concepts', label: 'Student Curriculum Handbook 101' },
                ].map(({ id, label }) => (
                  <li key={id}>
                    <button
                      onClick={() => onNavigateToSection ? onNavigateToSection(id) : undefined}
                      className="text-slate-600 hover:text-[#D95D29] font-normal transition-colors cursor-pointer text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-normal">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-sans font-bold tracking-tight text-slate-900">
                From sequence to <span className="text-[#D95D29]">insight.</span>
              </span>
              <span>•</span>
              <span>Built with</span>
              <Heart className="w-3.5 h-3.5 text-[#D95D29] fill-current" />
              <span>for the bioinformatics community</span>
            </div>
            <div>
              Data curated from authoritative bioinformatics standards &amp; publications
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
