import React, { useState } from 'react';
import {
  Workflow,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Dna,
  Layers,
  Activity,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Flame,
  Search,
} from 'lucide-react';

export interface WorkflowStep {
  stepNumber: number;
  phaseName: string;
  goal: string;
  inputData: string;
  outputArtifact: string;
  recommendedDatabases: Array<{
    id: string;
    acronym: string;
    tier: 'Primary' | 'Secondary' | 'Composite' | 'Tertiary' | 'Specialized';
    roleInStep: string;
  }>;
}

export interface ResearchWorkflow {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  targetUser: string;
  estimatedSteps: number;
  steps: WorkflowStep[];
}

const RESEARCH_WORKFLOWS: ResearchWorkflow[] = [
  // 1. Variant Pathogenicity
  {
    id: 'variant-pathogenicity',
    title: 'Clinical Variant Pathogenicity & Rare Disease',
    subtitle: 'From raw VCF genomic variants to clinical ACMG/AMP pathogenicity classification',
    icon: ShieldAlert,
    tag: 'Genomics & Diagnostics',
    targetUser: 'Clinical geneticists, bioinformaticians, and molecular pathologists',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        phaseName: 'Population Frequency & Filtering',
        goal: 'Rule out benign common polymorphisms and determine rarity across continental populations.',
        inputData: 'Genomic coordinates or rsID (e.g., chr17:7674220 G>A or rs121913529)',
        outputArtifact: 'Global & continental Minor Allele Frequency (MAF < 0.0001)',
        recommendedDatabases: [
          { id: 'gnomad', acronym: 'gnomAD', tier: 'Specialized', roleInStep: 'Filter against 76k whole genomes' },
          { id: 'dbsnp', acronym: 'dbSNP', tier: 'Specialized', roleInStep: 'Retrieve standard rsID & validation status' },
        ],
      },
      {
        stepNumber: 2,
        phaseName: 'Clinical Assertion & Phenotype Matching',
        goal: 'Cross-reference reported disease classifications, phenotype inheritance, and submitter evidence.',
        inputData: 'Variant coordinates or rsID',
        outputArtifact: 'ClinVar Review Status (e.g. Pathogenic, 3 stars) & OMIM Disease ID',
        recommendedDatabases: [
          { id: 'clinvar', acronym: 'ClinVar', tier: 'Specialized', roleInStep: 'Curated clinical pathogenicity assertions' },
          { id: 'omim', acronym: 'OMIM', tier: 'Specialized', roleInStep: 'Mendelian inheritance & phenotype description' },
        ],
      },
      {
        stepNumber: 3,
        phaseName: 'Transcript & Consequence Mapping',
        goal: 'Identify canonical transcripts, splice junctions, codon change, and conservation.',
        inputData: 'Gene Symbol (e.g., TP53) and coordinate',
        outputArtifact: 'HGVS nomenclature (c.743G>A, p.Arg248Gln) & consequence (missense, nonsense)',
        recommendedDatabases: [
          { id: 'ensembl', acronym: 'Ensembl', tier: 'Tertiary', roleInStep: 'VEP transcript impact & splice consequences' },
          { id: 'refseq', acronym: 'RefSeq', tier: 'Composite', roleInStep: 'Gold-standard reference mRNA / protein' },
        ],
      },
      {
        stepNumber: 4,
        phaseName: '3D Structural & Domain Perturbation',
        goal: 'Examine whether the substituted residue disrupts DNA-binding, zinc-coordination, or folding.',
        inputData: 'Protein UniProt ID (P04637) & residue number',
        outputArtifact: 'Structural pocket localization, hydrogen bond disruption, pLDDT metric',
        recommendedDatabases: [
          { id: 'alphafold-db', acronym: 'AlphaFold DB', tier: 'Specialized', roleInStep: 'Full-length predicted model & pLDDT' },
          { id: 'rcsb-pdb', acronym: 'RCSB PDB', tier: 'Primary', roleInStep: 'Experimental co-crystal with bound DNA' },
        ],
      },
      {
        stepNumber: 5,
        phaseName: 'Functional Validation & Tissue Expression',
        goal: 'Verify gene expression in clinically affected tissue sites and inspect eQTL effects.',
        inputData: 'Target Gene ID (ENSG00000141510)',
        outputArtifact: 'Tissue expression profile and regulatory eQTL significance',
        recommendedDatabases: [
          { id: 'gtex', acronym: 'GTEx', tier: 'Specialized', roleInStep: 'Expression across 54 human tissues' },
        ],
      },
    ],
  },

  // 2. Protein Structure & Function
  {
    id: 'protein-structure-function',
    title: 'Protein Structure & Functional Characterization',
    subtitle: 'From novel amino acid sequence to 3D folding, active sites, and interactome networks',
    icon: FlaskConical,
    tag: 'Structural Biology',
    targetUser: 'Biochemists, structural biologists, and computational biophysicists',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        phaseName: 'Sequence Archival & Primary Translation',
        goal: 'Verify raw transcript translation and primary nucleotide accession provenance.',
        inputData: 'Raw FASTA or mRNA accession (U00096)',
        outputArtifact: 'Full primary amino acid sequence & coding sequence verification',
        recommendedDatabases: [
          { id: 'genbank', acronym: 'GenBank', tier: 'Primary', roleInStep: 'Primary archival submission' },
          { id: 'uniprot-trembl', acronym: 'TrEMBL', tier: 'Primary', roleInStep: 'Automated sequence translation' },
        ],
      },
      {
        stepNumber: 2,
        phaseName: 'Expert Functional Curation',
        goal: 'Retrieve reviewed biological function, catalytic active sites, and post-translational marks.',
        inputData: 'Protein identifier (e.g. P04637)',
        outputArtifact: 'Curated Swiss-Prot record with phosphorylation, ubiquitination, and active residues',
        recommendedDatabases: [
          { id: 'uniprot-swissprot', acronym: 'Swiss-Prot', tier: 'Composite', roleInStep: 'Manually reviewed gold standard' },
        ],
      },
      {
        stepNumber: 3,
        phaseName: 'Domain Architecture & Motifs',
        goal: 'Scan for conserved evolutionary domains, zinc fingers, and kinase motifs.',
        inputData: 'Protein sequence',
        outputArtifact: 'InterPro / Pfam domain boundary coordinates and functional classification',
        recommendedDatabases: [
          { id: 'interpro', acronym: 'InterPro', tier: 'Composite', roleInStep: 'Unified domain signatures' },
          { id: 'pfam', acronym: 'Pfam', tier: 'Secondary', roleInStep: 'HMM alignments & domain models' },
        ],
      },
      {
        stepNumber: 4,
        phaseName: '3D Coordinate Modeling & Search',
        goal: 'Inspect high-resolution crystal/cryo-EM structures or obtain full-length AlphaFold predictions.',
        inputData: 'UniProt Accession or PDB ID (1TUP)',
        outputArtifact: 'Atomic coordinates (.mmCIF / .pdb) & structural alignment score',
        recommendedDatabases: [
          { id: 'rcsb-pdb', acronym: 'RCSB PDB', tier: 'Primary', roleInStep: 'Experimental 3D structure' },
          { id: 'alphafold-db', acronym: 'AlphaFold DB', tier: 'Specialized', roleInStep: 'AI predicted structure with pLDDT' },
          { id: 'foldseek', acronym: 'Foldseek', tier: 'Specialized', roleInStep: 'Rapid 3D structural homology search' },
        ],
      },
      {
        stepNumber: 5,
        phaseName: 'Interactome & Network Biology',
        goal: 'Map physical and functional protein-protein interaction networks and cellular complexes.',
        inputData: 'Protein symbol or accession',
        outputArtifact: 'Confidence-scored PPI network and top interacting functional partners',
        recommendedDatabases: [
          { id: 'string', acronym: 'STRING', tier: 'Tertiary', roleInStep: 'Functional association networks' },
          { id: 'intact', acronym: 'IntAct', tier: 'Tertiary', roleInStep: 'Curated physical binary interactions' },
        ],
      },
    ],
  },

  // 3. Cancer Genomics
  {
    id: 'cancer-genomics',
    title: 'Cancer Genomics & Somatic Driver Discovery',
    subtitle: 'From tumor sequencing variants to driver oncogenes, pathways, and therapeutic targets',
    icon: Flame,
    tag: 'Oncology',
    targetUser: 'Translational cancer researchers, oncologists, and tumor bioinformaticians',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        phaseName: 'Somatic Mutation Census',
        goal: 'Filter tumor-specific somatic mutations against known cancer driver hotspots.',
        inputData: 'Somatic VCF callset or gene list (e.g. BRAF, KRAS, TP53)',
        outputArtifact: 'COSMIC mutation ID, recurrence frequency, and tumor tissue histology',
        recommendedDatabases: [
          { id: 'cosmic', acronym: 'COSMIC', tier: 'Specialized', roleInStep: 'Somatic mutations in cancer tissue' },
        ],
      },
      {
        stepNumber: 2,
        phaseName: 'Driver Gene Classification & Pathology',
        goal: 'Determine whether the gene is an oncogene, tumor suppressor, or passenger.',
        inputData: 'Candidate gene symbol',
        outputArtifact: 'Cancer Gene Census classification, mechanism (gain/loss-of-function)',
        recommendedDatabases: [
          { id: 'disgenet', acronym: 'DisGeNET', tier: 'Specialized', roleInStep: 'Tumor-gene association evidence' },
          { id: 'omim', acronym: 'OMIM', tier: 'Specialized', roleInStep: 'Inherited cancer syndrome predisposition' },
        ],
      },
      {
        stepNumber: 3,
        phaseName: 'Oncogenic Signaling Pathways',
        goal: 'Map altered genes onto canonical tumor signaling cascades (e.g. MAPK, PI3K/Akt, p53).',
        inputData: 'List of recurrently mutated cancer genes',
        outputArtifact: 'Enriched signaling pathways and disrupted downstream effectors',
        recommendedDatabases: [
          { id: 'kegg', acronym: 'KEGG', tier: 'Tertiary', roleInStep: 'Canonical cancer pathway diagrams' },
          { id: 'reactome', acronym: 'Reactome', tier: 'Tertiary', roleInStep: 'Detailed biochemical reaction cascades' },
        ],
      },
      {
        stepNumber: 4,
        phaseName: 'Tumor Tissue Expression & Histopathology',
        goal: 'Examine protein over-expression in human tumor samples and patient survival correlation.',
        inputData: 'Gene symbol (TP53)',
        outputArtifact: 'Tumor vs normal tissue immunohistochemistry & pathology staining',
        recommendedDatabases: [
          { id: 'hpa', acronym: 'Human Protein Atlas', tier: 'Specialized', roleInStep: 'Pathology staining across 20 cancers' },
          { id: 'geo', acronym: 'GEO', tier: 'Primary', roleInStep: 'Microarray & RNA-seq tumor cohorts' },
        ],
      },
      {
        stepNumber: 5,
        phaseName: 'Precision Oncology & Targeted Therapy',
        goal: 'Identify FDA-approved targeted therapies or clinical trial molecules for the mutated target.',
        inputData: 'Target protein or mutated residue (e.g. BRAF V600E)',
        outputArtifact: 'Approved oncology inhibitors, resistance mutations, and bioactivity data',
        recommendedDatabases: [
          { id: 'chembl', acronym: 'ChEMBL', tier: 'Specialized', roleInStep: 'Bioactivity (IC50) across cancer cell lines' },
          { id: 'drugbank', acronym: 'DrugBank', tier: 'Specialized', roleInStep: 'Approved targeted therapies & mechanisms' },
        ],
      },
    ],
  },

  // 4. Drug Target Screening
  {
    id: 'drug-screening',
    title: 'Drug Discovery & Target Bioactivity Screening',
    subtitle: 'From therapeutic disease target validation to small molecule screening and pharmacogenomics',
    icon: Activity,
    tag: 'Cheminformatics & Pharmacology',
    targetUser: 'Medicinal chemists, pharmaceutical scientists, and pharmacology researchers',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        phaseName: 'Disease Target Validation & Tractability',
        goal: 'Evaluate genetic evidence supporting target association with disease and druggability.',
        inputData: 'Disease name or gene symbol',
        outputArtifact: 'Target disease association score & small molecule druggability assessment',
        recommendedDatabases: [
          { id: 'disgenet', acronym: 'DisGeNET', tier: 'Specialized', roleInStep: 'Genetic target-disease evidence' },
          { id: 'omim', acronym: 'OMIM', tier: 'Specialized', roleInStep: 'Clinical disease phenotypic link' },
        ],
      },
      {
        stepNumber: 2,
        phaseName: 'Binding Pocket & 3D Structure Retrieval',
        goal: 'Download atomic coordinates of the target receptor for in silico molecular docking.',
        inputData: 'Target Gene / UniProt ID',
        outputArtifact: 'Co-crystal with ligand or high-accuracy AlphaFold coordinate file',
        recommendedDatabases: [
          { id: 'rcsb-pdb', acronym: 'RCSB PDB', tier: 'Primary', roleInStep: 'Receptor-ligand co-crystal structures' },
          { id: 'alphafold-db', acronym: 'AlphaFold DB', tier: 'Specialized', roleInStep: 'Uncrystallized target 3D models' },
        ],
      },
      {
        stepNumber: 3,
        phaseName: 'Bioactivity & Chemical Space Search',
        goal: 'Query millions of bioactive compounds for IC50, Ki, and Kd values against the target.',
        inputData: 'Target UniProt ID or ChEMBL Target ID',
        outputArtifact: 'Ranked list of potent active molecules with nanomolar affinities',
        recommendedDatabases: [
          { id: 'chembl', acronym: 'ChEMBL', tier: 'Specialized', roleInStep: 'Curated bioactivity assays & IC50 data' },
          { id: 'pubchem', acronym: 'PubChem', tier: 'Specialized', roleInStep: 'Chemical structures, SMILES, bioassays' },
        ],
      },
      {
        stepNumber: 4,
        phaseName: 'Pathway Modulation & Off-Target Profiling',
        goal: 'Evaluate biological pathway downstream effects and identify potential off-target toxicities.',
        inputData: 'Validated target protein and lead compound',
        outputArtifact: 'Pathway cascade map and off-target cross-reactivity list',
        recommendedDatabases: [
          { id: 'reactome', acronym: 'Reactome', tier: 'Tertiary', roleInStep: 'Biological pathways modulated by target' },
          { id: 'string', acronym: 'STRING', tier: 'Tertiary', roleInStep: 'Secondary protein binding partners' },
        ],
      },
      {
        stepNumber: 5,
        phaseName: 'Pharmacogenomics & Drug Metabolism',
        goal: 'Assess polymorphic drug-metabolizing enzymes (CYP450) and dosing response variations.',
        inputData: 'Lead drug molecule or target candidate',
        outputArtifact: 'Metabolic pathway, transporter interactions, and clinical guidelines',
        recommendedDatabases: [
          { id: 'pharmgkb', acronym: 'PharmGKB', tier: 'Specialized', roleInStep: 'Clinical pharmacogenomic dosing guidelines' },
          { id: 'drugbank', acronym: 'DrugBank', tier: 'Specialized', roleInStep: 'ADMET properties & drug interactions' },
        ],
      },
    ],
  },

  // 5. Regulatory & Non-Coding Epigenomics
  {
    id: 'regulatory-epigenomics',
    title: 'Regulatory Genomics & Non-Coding Epigenomics',
    subtitle: 'From transcription factor binding sites and enhancer peaks to non-coding RNA biology',
    icon: Dna,
    tag: 'Epigenomics & Non-coding RNA',
    targetUser: 'Functional genomicists, developmental biologists, and gene regulation researchers',
    estimatedSteps: 5,
    steps: [
      {
        stepNumber: 1,
        phaseName: 'Transcription Factor Motif Discovery',
        goal: 'Retrieve position frequency matrices (PFM) for transcription factors regulating the locus.',
        inputData: 'Transcription factor symbol (e.g. TP53, CTCF)',
        outputArtifact: 'JASPAR Matrix ID (MA0107.1) and DNA sequence logo motif',
        recommendedDatabases: [
          { id: 'jaspar', acronym: 'JASPAR', tier: 'Specialized', roleInStep: 'High-confidence TF binding profiles' },
        ],
      },
      {
        stepNumber: 2,
        phaseName: 'Cis-Regulatory Elements & Chromatin Peaks',
        goal: 'Inspect cell-type-specific promoters, proximal enhancers, and DNase hypersensitive sites.',
        inputData: 'Genomic coordinates (hg38)',
        outputArtifact: 'Candidate cis-Regulatory Elements (cCREs) and ChIP-seq peak coordinates',
        recommendedDatabases: [
          { id: 'encode', acronym: 'ENCODE', tier: 'Specialized', roleInStep: 'Histone marks & chromatin accessibility' },
        ],
      },
      {
        stepNumber: 3,
        phaseName: 'Non-Coding RNA Profiling (miRNA & lncRNA)',
        goal: 'Check whether the locus encodes or is targeted by regulatory non-coding RNAs.',
        inputData: 'Sequence or genomic coordinates',
        outputArtifact: 'Annotated microRNA hairpin or structural non-coding RNA family',
        recommendedDatabases: [
          { id: 'mirbase', acronym: 'miRBase', tier: 'Specialized', roleInStep: 'MicroRNA sequences and targets' },
          { id: 'rfam', acronym: 'Rfam', tier: 'Specialized', roleInStep: 'RNA families & secondary structures' },
        ],
      },
      {
        stepNumber: 4,
        phaseName: 'Multi-Species Conservation Tracking',
        goal: 'Evaluate phyloP / phastCons evolutionary conservation across 100 vertebrate genomes.',
        inputData: 'Genomic locus interval',
        outputArtifact: 'Conservation score track and conservation across placental mammals',
        recommendedDatabases: [
          { id: 'ucsc-genome-browser', acronym: 'UCSC Genome Browser', tier: 'Tertiary', roleInStep: '100-way vertebrate conservation' },
        ],
      },
      {
        stepNumber: 5,
        phaseName: 'Functional Gene Ontology Enrichment',
        goal: 'Perform Gene Ontology enrichment for co-regulated downstream targets.',
        inputData: 'Target gene set',
        outputArtifact: 'Statistically enriched Biological Process (BP) and Cellular Component (CC) terms',
        recommendedDatabases: [
          { id: 'reactome', acronym: 'Reactome', tier: 'Tertiary', roleInStep: 'Pathway over-representation analysis' },
        ],
      },
    ],
  },
];

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

interface PresetStyle {
  inactive: string;
  active: string;
  iconInactive: string;
  iconActive: string;
  badge: string;
  canvasAccent: string;
  stepActive: string;
  stepNumberActive: string;
}

const WORKFLOW_PRESET_STYLES: Record<string, PresetStyle> = {
  'variant-pathogenicity': {
    inactive: 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]',
    active: 'bg-[#D95D29] text-white border-[#D95D29] shadow-sm',
    iconInactive: 'bg-orange-50 text-[#D95D29]',
    iconActive: 'bg-white/20 text-white',
    badge: 'bg-orange-50 text-[#D95D29] border-orange-200',
    canvasAccent: 'border-orange-200',
    stepActive: 'bg-orange-50/40 border-orange-200 ring-1 ring-orange-200/50',
    stepNumberActive: 'bg-[#D95D29] text-white',
  },
  'structure-pocket-docking': {
    inactive: 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]',
    active: 'bg-[#059669] text-white border-[#059669] shadow-sm',
    iconInactive: 'bg-emerald-50 text-emerald-700',
    iconActive: 'bg-white/20 text-white',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    canvasAccent: 'border-emerald-200',
    stepActive: 'bg-emerald-50/40 border-emerald-200 ring-1 ring-emerald-200/50',
    stepNumberActive: 'bg-[#059669] text-white',
  },
  'cancer-driver-mutations': {
    inactive: 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]',
    active: 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm',
    iconInactive: 'bg-blue-50 text-blue-700',
    iconActive: 'bg-white/20 text-white',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    canvasAccent: 'border-blue-200',
    stepActive: 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-200/50',
    stepNumberActive: 'bg-[#2563EB] text-white',
  },
  'target-validation-druggability': {
    inactive: 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]',
    active: 'bg-[#E11D48] text-white border-[#E11D48] shadow-sm',
    iconInactive: 'bg-rose-50 text-rose-700',
    iconActive: 'bg-white/20 text-white',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    canvasAccent: 'border-rose-200',
    stepActive: 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-200/50',
    stepNumberActive: 'bg-[#E11D48] text-white',
  },
  'epigenomics-regulome': {
    inactive: 'bg-white hover:bg-slate-50 border-slate-200 text-[#0F172A]',
    active: 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm',
    iconInactive: 'bg-purple-50 text-purple-700',
    iconActive: 'bg-white/20 text-white',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    canvasAccent: 'border-purple-200',
    stepActive: 'bg-purple-50/40 border-purple-200 ring-1 ring-purple-200/50',
    stepNumberActive: 'bg-[#7C3AED] text-white',
  },
};

interface WorkflowNavigatorProps {
  onSelectDatabase?: (databaseId: string) => void;
}

export const WorkflowNavigator: React.FC<WorkflowNavigatorProps> = ({ onSelectDatabase }) => {
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>('variant-pathogenicity');
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  const activeWorkflow = RESEARCH_WORKFLOWS.find((w) => w.id === activeWorkflowId) || RESEARCH_WORKFLOWS[0];
  const currentTheme = WORKFLOW_PRESET_STYLES[activeWorkflow.id] || WORKFLOW_PRESET_STYLES['variant-pathogenicity'];

  return (
    <section id="workflows" className="py-14 border-t border-slate-200 bg-[#F8F9FA] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#D95D29] text-xs font-semibold mb-3 shadow-xs">
            <span className="font-serif text-xs font-bold leading-none select-none">✻</span>
            <span>Interactive Research Workflow Navigator</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-normal tracking-tight">
            Which Databases Do You Need for Your Analysis?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-normal leading-relaxed text-pretty">
            Follow canonical multi-tier bioinformatics workflows designed for clinical genetics, structural biology,
            oncology, and drug discovery. Step through the progression from raw data to biological discovery.
          </p>
        </div>

        {/* Workflow Presets Bar */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-1 mb-8 no-scrollbar">
          {RESEARCH_WORKFLOWS.map((wf) => {
            const Icon = wf.icon;
            const isActive = wf.id === activeWorkflowId;
            const theme = WORKFLOW_PRESET_STYLES[wf.id] || WORKFLOW_PRESET_STYLES['variant-pathogenicity'];
            return (
              <button
                key={wf.id}
                onClick={() => {
                  setActiveWorkflowId(wf.id);
                  setExpandedStep(1);
                }}
                className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border text-left shrink-0 transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? theme.active
                    : theme.inactive
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? theme.iconActive : theme.iconInactive
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold line-clamp-1">{wf.title}</div>
                  <div className={`text-[10px] font-medium ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {wf.tag}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Workflow Canvas */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.04)] p-5 sm:p-8 space-y-6 sm:space-y-8 animate-fade-up">
          {/* Header Description of Active Workflow */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentTheme.badge}`}>
                  {activeWorkflow.tag}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {activeWorkflow.steps.length} Sequenced Phases
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
                {activeWorkflow.title}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {activeWorkflow.subtitle}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs shrink-0 max-w-xs">
              <span className="font-semibold text-[#0F172A] block mb-0.5">Target Audience:</span>
              <span className="text-slate-600">{activeWorkflow.targetUser}</span>
            </div>
          </div>

          {/* Step Progression Timeline */}
          <div className="space-y-4">
            {activeWorkflow.steps.map((step) => {
              const isExpanded = expandedStep === step.stepNumber;
              return (
                <div
                  key={step.stepNumber}
                  className={`rounded-2xl border transition-all ${
                    isExpanded
                      ? currentTheme.stepActive
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {/* Step Header Accordion Toggle */}
                  <div
                    onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isExpanded
                            ? currentTheme.stepNumberActive
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        0{step.stepNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-sm sm:text-base font-bold text-[#0F172A]">
                            {step.phaseName}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {step.goal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5">
                        {step.recommendedDatabases.map((db) => (
                          <span
                            key={db.id}
                            className="px-2 py-0.5 rounded-full text-[11px] font-medium font-mono bg-white text-slate-700 border border-slate-200"
                          >
                            {db.acronym}
                          </span>
                        ))}
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isExpanded ? 'rotate-90 text-[#0F172A]' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded Step Body */}
                  {isExpanded && (
                    <div className="px-4 pb-5 sm:px-5 pt-0 space-y-4 border-t border-slate-200 mt-1">
                      {/* Detailed Goal */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal pt-3">
                        {step.goal}
                      </p>

                      {/* Input / Output Data Pill Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-semibold text-blue-700 uppercase tracking-wider text-[10px]">
                            Input Data:
                          </span>
                          <div className="font-mono text-[#0F172A] font-medium">{step.inputData}</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                          <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[10px]">
                            Expected Deliverable:
                          </span>
                          <div className="text-[#0F172A] font-normal">{step.outputArtifact}</div>
                        </div>
                      </div>

                      {/* Databases Involved */}
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#D95D29]" />
                          <span>Recommended Databases for this Phase</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {step.recommendedDatabases.map((db) => {
                            const badgeStyle = TIER_BADGE_STYLES[db.tier] || 'bg-slate-100 text-slate-700 border-slate-200';
                            return (
                              <div
                                key={db.id}
                                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-xs hover:border-[#D95D29]/40 transition-all"
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-serif font-bold text-sm text-[#0F172A]">
                                      {db.acronym}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${badgeStyle}`}>
                                      {db.tier}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-600 font-normal leading-relaxed">
                                    {db.roleInStep}
                                  </p>
                                </div>

                                <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-end">
                                  {onSelectDatabase && (
                                    <button
                                      onClick={() => onSelectDatabase(db.id)}
                                      className="text-xs font-semibold text-[#D95D29] hover:text-[#C2541C] flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>Inspect {db.acronym} details</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
