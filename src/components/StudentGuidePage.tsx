import React, { useState, useMemo } from 'react';
import { BrandMark } from './Brand';
import {
  GraduationCap,
  BookOpen,
  Dna,
  ArrowRight,
  Search,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Info,
  FileText,
  Sparkles,
  HelpCircle,
  GitCompare,
  ChevronDown,
  ChevronUp,
  Workflow,
  Table,
  Compass,
  FileCode2,
  Brain,
  Cpu,
  Globe,
  Database,
  ShieldCheck,
  Box,
  Zap,
  BookMarked,
  CheckCircle2,
  AlertCircle,
  Undo2,
  Calendar,
  Layers3,
  Terminal,
  Activity
} from 'lucide-react';
import {
  CORE_CONCEPTS,
  BIG_TWELVE_DATABASES,
  FILE_FORMATS_DATA,
  HISTORICAL_TIMELINE,
  STUDENT_DECISION_TREE,
  GLOSSARY_DATA,
  FileFormatProfile,
  BigDatabaseProfile
} from '../data/studentGuideData';
import { DatabaseRecord } from '../data/databases';

interface StudentGuidePageProps {
  onBackToExplorer: () => void;
  onOpenDatabaseModal: (db: DatabaseRecord) => void;
  allDatabases: DatabaseRecord[];
}

export const StudentGuidePage: React.FC<StudentGuidePageProps> = ({
  onBackToExplorer,
  onOpenDatabaseModal,
  allDatabases
}) => {
  // Navigation tabs within the student guide
  const [activeSubTab, setActiveSubTab] = useState<'concepts' | 'dbs' | 'formats' | 'flowcharts' | 'history' | 'glossary'>('concepts');

  // Big 12 filter search
  const [dbSearch, setDbSearch] = useState<string>('');

  // File Format selector
  const [selectedFormatId, setSelectedFormatId] = useState<string>('fastq');

  // Decision Tree active question
  const [activeDecisionId, setActiveDecisionId] = useState<string>('query-gene-symbol');

  // Flowchart interactive active step
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);

  // Glossary filter search
  const [glossarySearch, setGlossarySearch] = useState<string>('');

  // Copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFindAndOpenDb = (dbId: string) => {
    const found = allDatabases.find((d) => d.id === dbId);
    if (found) {
      onOpenDatabaseModal(found);
    }
  };

  const filteredDbs = useMemo(() => {
    if (!dbSearch.trim()) return BIG_TWELVE_DATABASES;
    const q = dbSearch.toLowerCase();
    return BIG_TWELVE_DATABASES.filter(
      (d) =>
        d.acronym.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.analogy.toLowerCase().includes(q) ||
        d.whatProblemDoesItSolve.toLowerCase().includes(q) ||
        d.keyDataTypes.some((t) => t.toLowerCase().includes(q))
    );
  }, [dbSearch]);

  const selectedFormat: FileFormatProfile = useMemo(() => {
    return FILE_FORMATS_DATA.find((f) => f.id === selectedFormatId) || FILE_FORMATS_DATA[0];
  }, [selectedFormatId]);

  const activeDecision = useMemo(() => {
    return STUDENT_DECISION_TREE.find((d) => d.id === activeDecisionId) || STUDENT_DECISION_TREE[0];
  }, [activeDecisionId]);

  const filteredGlossary = useMemo(() => {
    if (!glossarySearch.trim()) return GLOSSARY_DATA;
    const q = glossarySearch.toLowerCase();
    return GLOSSARY_DATA.filter(
      (g) =>
        g.term.toLowerCase().includes(q) ||
        g.simpleDefinition.toLowerCase().includes(q) ||
        g.studentAnalogy.toLowerCase().includes(q) ||
        g.practicalExample.toLowerCase().includes(q)
    );
  }, [glossarySearch]);

  // Wet-Lab to Database Flowchart Steps
  const PIPELINE_STEPS = [
    {
      step: 1,
      title: 'Biological Tissue Extraction',
      file: 'Biological Sample',
      tool: 'Wet-Lab Extraction Kit',
      desc: 'DNA or RNA is isolated from human blood, tissue biopsy, soil, or cell culture. Quality check verifies purity (A260/A280 ratio).',
      badge: 'Wet Lab',
      color: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      step: 2,
      title: 'Next-Gen Sequencing (NGS)',
      file: 'Raw Signal Data',
      tool: 'Illumina / PacBio / Oxford Nanopore',
      desc: 'Flowcells optically detect fluorescent nucleotides or electric current changes as polymerase synthesizes DNA copies.',
      badge: 'Instrumentation',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    {
      step: 3,
      title: 'Base Calling & Quality Scores',
      file: 'Raw .FASTQ (.fq.gz)',
      tool: 'Illumina RTA / Guppy / FastQC',
      desc: 'Sequencing signals are translated into nucleotide letters (A, C, G, T) with per-base Phred confidence scores Q (Q30 = 99.9% accurate).',
      badge: 'Primary Data',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      step: 4,
      title: 'Reference Genome Alignment',
      file: 'Aligned .BAM (.bam.bai)',
      tool: 'BWA-MEM / Bowtie2 / STAR / samtools',
      desc: 'Millions of short reads are mapped against the 3.1 billion base pair human reference genome (GRCh38), generating coordinate positions.',
      badge: 'Alignment',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      step: 5,
      title: 'Variant Calling & Filtering',
      file: 'Variant Calls .VCF (.vcf.gz)',
      tool: 'GATK HaplotypeCaller / DeepVariant',
      desc: 'Algorithms compare mapped reads against the reference to identify single nucleotide variants (SNVs), indels, and structural mutations.',
      badge: 'Genomics',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
      step: 6,
      title: 'Clinical & Functional Annotation',
      file: 'Annotated Report',
      tool: 'Ensembl VEP / ANNOVAR / ClinVar / dbSNP',
      desc: 'Mutations are annotated: Does it hit an exon? Does it change an amino acid? Has it been seen in ClinVar as pathogenic?',
      badge: 'Clinical Impact',
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      step: 7,
      title: 'Systems & Pathway Integration',
      file: 'Biological Discovery',
      tool: 'KEGG / Reactome / STRING / PDB',
      desc: 'Perturbed genes are mapped onto metabolic reaction maps, protein-protein complexes, and 3D atomic structures for drug discovery.',
      badge: 'Systems Biology',
      color: 'bg-teal-50 text-teal-700 border-teal-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 text-[#0F172A]">
      {/* ── Top Header Hero Banner ─────────────────────────────── */}
      <section className="relative pt-8 pb-10 border-b border-slate-200 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <button
              onClick={onBackToExplorer}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0F172A] border border-slate-200 text-xs font-medium transition-all shadow-xs cursor-pointer w-fit min-h-[36px]"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Back to Database Explorer</span>
            </button>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-orange-50 border border-orange-200 text-[#D95D29] shadow-2xs">
                Beginner to Advanced
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700 shadow-2xs">
                Curriculum Ready
              </span>
            </div>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#D95D29] border border-orange-200 text-[11px] sm:text-xs font-semibold mb-3 shadow-xs">
              <BrandMark className="h-6 w-6" />
              <span className="font-bold text-[#0F172A]">Dogma<span className="text-[#D95D29]">Desk</span></span>
              <span className="text-slate-300">/</span>
              <span>Student handbook</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0F172A] tracking-tight leading-tight">
              The Essential Student Handbook
              <span className="block italic text-[#D95D29] mt-1 font-serif">To Biological Databases &amp; Formats.</span>
            </h1>
            <p className="mt-3 text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              Written specifically for students, newcomers, and bench scientists. Understand the central dogma
              data pipeline, dissect essential raw file formats line-by-line, study the Big 12 core repositories,
              and explore the 60-year history of computational biology.
            </p>
          </div>
        </div>
      </section>

      {/* ── Sticky Sub-Navigation Pill Bar ──────────────────────── */}
      <div className="sticky top-16 z-30 bg-[#F8F9FA]/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-max">
            {[
              { id: 'concepts', label: '1. Foundations', icon: Dna },
              { id: 'dbs', label: '2. Big 12 Databases', icon: Database },
              { id: 'formats', label: '3. File Formats', icon: FileCode2 },
              { id: 'flowcharts', label: '4. Visual Flowcharts', icon: Workflow },
              { id: 'history', label: '5. History (1965–2026)', icon: Calendar },
              { id: 'glossary', label: '6. Student Glossary', icon: BookOpen }
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeSubTab === id;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setActiveSubTab(id as any);
                    const el = document.getElementById(`subtab-${id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all cursor-pointer min-h-[36px] ${
                    isActive
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0F172A] border border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Content Container ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-6 sm:mt-8 space-y-12 sm:space-y-16">

        {/* ── SECTION 1: CORE FOUNDATIONAL CONCEPTS ────────────── */}
        <section id="subtab-concepts" className="scroll-mt-32 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D95D29] mb-1">
              <Dna className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Module 1</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
              Foundational Concepts Every Student Must Master
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Before running any bioinformatics tool or script, understand how biological data flows and why databases are structured this way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {CORE_CONCEPTS.map((concept) => (
              <div
                key={concept.id}
                className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
              >
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#0F172A] tracking-tight">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5 mb-3">
                    {concept.subtitle}
                  </p>

                  {/* Analogy Box */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 border-l-2 border-[#D95D29] border-t border-r border-b border-slate-200 mb-4 space-y-1">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-orange-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#D95D29]" />
                      Beginner Analogy:
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {concept.analogy}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider block">
                      Key Takeaways:
                    </span>
                    <ul className="space-y-1.5">
                      {concept.keyPoints.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#D95D29] shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Golden Rule Footer */}
                <div className="pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-700 bg-orange-50/60 p-2.5 rounded-xl border border-orange-100">
                  <AlertCircle className="w-4 h-4 text-[#D95D29] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#0F172A]">Student Golden Rule: </span>
                    <span className="text-slate-600">{concept.takeaway}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: THE BIG 12 CORE DATABASES ─────────────── */}
        <section id="subtab-dbs" className="scroll-mt-32 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D95D29] mb-1">
                <Database className="w-3.5 h-3.5 text-[#D95D29]" />
                <span>Module 2</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
                The Big 12 Biological Databases Explained for Students
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Every biology and bioinformatics student encounters these 12 pillars. Here is what they actually store, when to use them, and their analogies.
              </p>
            </div>

            {/* Quick search within Big 12 */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={dbSearch}
                onChange={(e) => setDbSearch(e.target.value)}
                placeholder="Filter the Big 12..."
                className="w-full h-9 pl-9 pr-3 text-xs rounded-full bg-white border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D95D29]/15 focus:border-[#D95D29] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredDbs.map((db) => {
              const matchingDb = allDatabases.find((d) => d.id === db.id);

              return (
                <div
                  key={db.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-3.5 sm:space-y-4"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="font-serif text-lg font-semibold text-[#0F172A] tracking-tight">
                          {db.acronym}
                        </span>
                        <div className="text-[11px] text-slate-500 font-normal line-clamp-1">
                          {db.name}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        Est. {db.yearEstablished}
                      </span>
                    </div>

                    {/* Analogy Pill */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border-l-2 border-[#D95D29] border-t border-r border-b border-slate-200 mb-3 space-y-0.5">
                      <span className="text-[10px] font-semibold text-orange-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-[#D95D29]" />
                        Student Analogy:
                      </span>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed">
                        {db.analogy}
                      </p>
                    </div>

                    {/* What Problem Does It Solve */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal mb-3">
                      {db.whatProblemDoesItSolve}
                    </p>

                    {/* What is Stored (Bullets) */}
                    <div className="space-y-1.5 mb-3">
                      <span className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider block">
                        What is inside:
                      </span>
                      <ul className="space-y-1">
                        {db.whatIsStored.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D95D29] mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Student Gotchas Alert */}
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 space-y-0.5">
                      <span className="font-semibold uppercase text-[10px] text-rose-700 block flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        Common Student Trap:
                      </span>
                      <p className="leading-relaxed">
                        {db.studentGotchas[0]}
                      </p>
                    </div>
                  </div>

                  {/* Footer & Actions */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    {/* Copy Example Button */}
                    <button
                      onClick={() => handleCopy(db.exampleAccession)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-[#0F172A] transition-colors cursor-pointer min-h-[36px]"
                      title="Copy example accession"
                    >
                      <span className="text-slate-400 text-[10px]">eg.</span>
                      <span className="truncate max-w-[90px] sm:max-w-[120px]">{db.exampleAccession}</span>
                      {copiedText === db.exampleAccession ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    {/* Inspect in Directory Modal Bridge */}
                    {matchingDb && (
                      <button
                        onClick={() => onOpenDatabaseModal(matchingDb)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D95D29] hover:bg-[#C2541C] text-white text-xs font-medium transition-colors cursor-pointer shadow-xs shrink-0 min-h-[36px]"
                      >
                        <span>Inspect in Directory</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 3: FILE FORMATS DISSECTED ────────────────── */}
        <section id="subtab-formats" className="scroll-mt-32 space-y-5 sm:space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D95D29] mb-1">
              <FileCode2 className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Module 3</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
              Mastering Bioinformatics File Formats
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Click through the essential biological formats to see real snippet dissections, column breakdown tables, and common pitfalls.
            </p>
          </div>

          {/* Format Selector Tab Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {FILE_FORMATS_DATA.map((fmt) => {
              const isSelected = selectedFormatId === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormatId(fmt.id)}
                  className={`px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all cursor-pointer shrink-0 border min-h-[36px] ${
                    isSelected
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>{fmt.name}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Format Dissection Card */}
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 sm:space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedFormat.badgeColor}`}>
                    {selectedFormat.category} Format
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Extensions: {selectedFormat.extensions.join(', ')}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-3xl font-normal text-[#0F172A]">
                  {selectedFormat.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-normal">
                  {selectedFormat.oneLineSummary}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs w-full md:max-w-xs shrink-0">
                <span className="font-semibold text-[#0F172A] block mb-0.5">When You Encounter It:</span>
                <span className="text-slate-600">{selectedFormat.whenYouEncounterIt}</span>
              </div>
            </div>

            {/* Code Snippet with Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                <span>Real-World Snippet Sample:</span>
                <button
                  onClick={() => handleCopy(selectedFormat.sampleCode)}
                  className="flex items-center gap-1 text-slate-700 hover:text-[#0F172A] transition-colors cursor-pointer text-xs min-h-[32px] px-2 py-1 rounded-lg hover:bg-slate-100"
                >
                  {copiedText === selectedFormat.sampleCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0F172A] text-slate-50 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                <pre>{selectedFormat.sampleCode}</pre>
              </div>
            </div>

            {/* Line / Column Breakdown Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Line &amp; Column Anatomy Breakdown:
              </h4>
              <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs min-w-[480px]">
                  <thead className="bg-slate-50 text-[#0F172A] font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 sm:px-4 w-36 sm:w-48">Field / Line</th>
                      <th className="py-2.5 px-3 sm:px-4">Biological Meaning</th>
                      <th className="py-2.5 px-3 sm:px-4 w-44 sm:w-56 font-mono">Example Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {selectedFormat.fieldsOrLines.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 sm:px-4 font-semibold text-[#0F172A]">{item.field}</td>
                        <td className="py-2.5 px-3 sm:px-4 text-slate-600 font-normal">{item.meaning}</td>
                        <td className="py-2.5 px-3 sm:px-4 font-mono text-[11px] text-[#D95D29] font-medium truncate max-w-xs">{item.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Rules & Common Traps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-50/50 border-l-2 border-emerald-600 border-t border-r border-b border-slate-200 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Golden Student Rules:
                </span>
                <ul className="space-y-1.5">
                  {selectedFormat.studentRules.map((r, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-50/50 border-l-2 border-rose-600 border-t border-r border-b border-slate-200 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  Common Traps &amp; Mistakes:
                </span>
                <ul className="space-y-1.5">
                  {selectedFormat.commonMistakes.map((m, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: VISUAL FLOWCHARTS & DECISION TREE ─────── */}
        <section id="subtab-flowcharts" className="scroll-mt-32 space-y-6 sm:space-y-8">
          <div className="border-b border-slate-200 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D95D29] mb-1">
              <Workflow className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Module 4</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
              Interactive Flowcharts &amp; Student Decision Tree
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Step through the biological data pipeline from wet-lab bench to published database, and use the decision tree to find which database you need.
            </p>
          </div>

          {/* Flowchart 1: The Wet-Lab to Database Pipeline */}
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-[#D95D29] mb-2">
                <Activity className="w-3.5 h-3.5 text-[#D95D29]" />
                <span>End-to-End Pipeline</span>
              </div>
              <h3 className="font-serif text-xl sm:text-3xl font-normal text-[#0F172A]">
                The Journey of Biological Data: From Wet-Lab to Database Record
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
                Click any phase below to inspect the data files produced, the computational tools used, and the underlying biological logic.
              </p>
            </div>

            {/* Step Pipeline Bar - swipeable on mobile, grid on desktop */}
            <div className="flex overflow-x-auto no-scrollbar py-1 gap-2 sm:grid sm:grid-cols-4 lg:grid-cols-7">
              {PIPELINE_STEPS.map((s) => {
                const isSelected = activePipelineStep === s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActivePipelineStep(s.step)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between shrink-0 sm:shrink min-w-[140px] sm:min-w-0 ${
                      isSelected
                        ? 'bg-[#D95D29] text-white border-[#D95D29] shadow-xs ring-2 ring-[#D95D29]/25'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-mono font-medium ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          0{s.step}
                        </span>
                        <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-white' : s.color
                        }`}>
                          {s.badge}
                        </span>
                      </div>
                      <div className={`text-xs font-semibold line-clamp-2 ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                        {s.title}
                      </div>
                    </div>
                    <div className={`text-[10px] font-mono mt-2 truncate ${isSelected ? 'text-white/80' : 'text-[#D95D29] font-medium'}`}>
                      {s.file}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Active Step Inspector */}
            {(() => {
              const current = PIPELINE_STEPS.find((s) => s.step === activePipelineStep) || PIPELINE_STEPS[0];
              return (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-fade-up">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-[#D95D29] text-white font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {current.step}
                      </span>
                      <div>
                        <h4 className="font-serif text-base sm:text-lg font-semibold text-[#0F172A]">
                          Phase {current.step}: {current.title}
                        </h4>
                        <span className="text-xs text-slate-500 font-normal">{current.badge}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono font-medium text-[#0F172A]">
                        File: {current.file}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-medium text-slate-700">
                        Tools: {current.tool}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {current.desc}
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Interactive Decision Tree Widget: "Which Database Do I Need?" */}
          <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 sm:space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-50 border border-orange-200 text-[#D95D29] mb-2">
                <Compass className="w-3.5 h-3.5 text-[#D95D29]" />
                <span>Interactive Student Decision Tree</span>
              </div>
              <h3 className="font-serif text-xl sm:text-3xl font-normal text-[#0F172A]">
                Which Database Should I Use for My Question?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 font-normal">
                Select what information you currently hold in your hands to get the exact recommended database and next action.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              {/* Left Column: Questions List */}
              <div className="lg:col-span-6 space-y-2">
                {STUDENT_DECISION_TREE.map((node) => {
                  const isSelected = activeDecisionId === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveDecisionId(node.id)}
                      className={`w-full p-3 sm:p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between min-h-[44px] ${
                        isSelected
                          ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="pr-2">
                        <div className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                          {node.question}
                        </div>
                        <div className={`text-[11px] mt-0.5 line-clamp-1 font-normal ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {node.subtext}
                        </div>
                      </div>
                      <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-0.5 text-white' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Answer Recommendation Card */}
              <div className="lg:col-span-6 p-4 sm:p-6 rounded-2xl bg-orange-50 border border-orange-200 space-y-3.5 sm:space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D95D29] text-white shadow-xs">
                    Recommended Database
                  </span>
                  <span className="text-xs font-semibold text-orange-700">
                    {activeDecision.dbAcronym}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg sm:text-xl font-semibold text-[#0F172A]">
                    {activeDecision.dbName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed font-normal">
                    {activeDecision.whyThisOne}
                  </p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-orange-200 text-xs text-[#0F172A] space-y-1">
                  <span className="font-semibold text-[#0F172A] block flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D95D29]" />
                    Recommended Next Action:
                  </span>
                  <p className="text-slate-600 font-normal">{activeDecision.nextStep}</p>
                </div>

                <button
                  onClick={() => handleFindAndOpenDb(activeDecision.recommendedDbId)}
                  className="w-full py-2.5 rounded-full bg-[#D95D29] hover:bg-[#C2541C] text-white font-medium text-xs transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <span>Inspect {activeDecision.dbAcronym} in DogmaDesk</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: HISTORICAL MILESTONES (1965 – 2026) ──── */}
        <section id="subtab-history" className="scroll-mt-32 space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D95D29] mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#D95D29]" />
              <span>Module 5</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
              History &amp; Milestones of Bioinformatics (1965 – 2026)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              From Margaret Dayhoff's first printed book of protein sequences to the AlphaFold 3D revolution and AI agents.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200 space-y-6 sm:space-y-8 my-4 ml-3 sm:ml-4">
            {HISTORICAL_TIMELINE.map((m, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Dot Marker */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-[#D95D29] group-hover:scale-125 transition-transform shadow-xs" />

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0F172A] text-white font-mono shadow-xs">
                        {m.year}
                      </span>
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                        {m.tierTag}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 font-normal">
                      Pioneers: <strong className="text-[#0F172A] font-medium">{m.pioneers}</strong> ({m.organization})
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-semibold text-[#0F172A] tracking-tight">
                    {m.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {m.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-200 flex items-start gap-1.5 text-xs text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-[#D95D29] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#0F172A] font-semibold">Why it matters: </strong>
                      <span className="text-slate-600">{m.significance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 6: STUDENT GLOSSARY ──────────────────────── */}
        <section id="subtab-glossary" className="scroll-mt-32 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D95D29] mb-1">
                <BookOpen className="w-3.5 h-3.5 text-[#D95D29]" />
                <span>Module 6</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F172A]">
                Bioinformatics Student Exam &amp; Research Glossary
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Quick plain-English definitions with analogies and real-world examples for confusing terminology.
              </p>
            </div>

            {/* Quick search within glossary */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                placeholder="Search glossary terms..."
                className="w-full h-9 pl-9.5 pr-3 text-xs rounded-full bg-white border border-slate-200 text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D95D29]/15 focus:border-[#D95D29] shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGlossary.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-serif text-base sm:text-lg font-semibold text-[#0F172A]">
                      {item.term}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Tool: {item.relatedDbOrTool}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-2.5">
                    {item.simpleDefinition}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border-l-2 border-[#D95D29] border-t border-r border-b border-slate-200 text-xs space-y-0.5">
                    <span className="text-[10px] font-semibold text-orange-700 uppercase tracking-wider block">
                      Analogy:
                    </span>
                    <p className="leading-relaxed text-slate-600 font-normal">{item.studentAnalogy}</p>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200 text-xs text-slate-600">
                  <strong className="text-[#0F172A] font-semibold">Example: </strong>
                  <span>{item.practicalExample}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
