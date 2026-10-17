export interface CategoryInfo {
  id: 'Primary' | 'Secondary' | 'Composite' | 'Tertiary' | 'Specialized';
  title: string;
  badgeColor: string;
  glowClass: string;
  borderColor: string;
  accentBg: string;
  textColor: string;
  shortDesc: string;
  definition: string;
  characteristics: string[];
  workflowRole: string;
  curationType: string;
  canonicalExamples: string[];
}

export const CATEGORIES_DATA: Record<string, CategoryInfo> = {
  Primary: {
    id: 'Primary',
    title: 'Primary Databases',
    badgeColor: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
    glowClass: 'glow-primary',
    borderColor: 'border-cyan-500/30',
    accentBg: 'from-cyan-500/10 to-transparent',
    textColor: 'text-cyan-700 dark:text-cyan-400',
    shortDesc: 'Original, archival repositories storing direct experimental data submitted by researchers worldwide.',
    definition: 'Primary databases (often referred to as archival databases) contain raw or minimally modified sequence and structural records deposited directly by experimenters. They serve as the legal and historical record of scientific discovery.',
    characteristics: [
      'Direct user submission: Data is contributed directly by researchers before publication.',
      'Archival integrity: Records are rarely modified or deleted without the author\'s request.',
      'Redundancy: Multiple independent entries for the same gene or protein may coexist from different laboratories.',
      'International synchronization: Core nucleotide archives (INSDC: GenBank, ENA, DDBJ) synchronize daily.'
    ],
    workflowRole: 'The starting bedrock for all bioinformatics analysis; the primary ingest point from wet-lab sequencers and spectrometers.',
    curationType: 'Author-driven metadata checking; minimal biological annotation editing.',
    canonicalExamples: ['GenBank (NCBI)', 'ENA (EMBL-EBI)', 'DDBJ', 'UniProtKB/TrEMBL', 'PDB', 'SRA', 'GEO']
  },
  Secondary: {
    id: 'Secondary',
    title: 'Secondary Databases',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
    glowClass: 'glow-secondary',
    borderColor: 'border-purple-500/30',
    accentBg: 'from-purple-500/10 to-transparent',
    textColor: 'text-purple-700 dark:text-purple-400',
    shortDesc: 'Derived and analytical databases extracted by computational analysis of primary records (motifs, domains, signatures).',
    definition: 'Secondary databases (or derived databases) result from computationally analyzing and curating primary sequence or structural data. They catalog conserved motifs, regular expressions, Hidden Markov Models (HMMs), and structural classifications.',
    characteristics: [
      'Value-added computational analysis: Built using sequence alignments, profile HMMs, and clustering algorithms.',
      'Domain & Motif signatures: Helps predict the biochemical function of uncharacterized novel proteins.',
      'Conserved feature focus: Distills thousands of homologous sequences down to consensus motifs or statistical models.',
      'Structural hierarchies: Groups 3D structures into homologous superfamilies, folds, and topologies.'
    ],
    workflowRole: 'Functional prediction and annotation engine; translates raw sequences into domain architecture and structural classes.',
    curationType: 'Algorithmic calculation combined with specialized curator model definitions.',
    canonicalExamples: ['PROSITE', 'Pfam', 'PRINTS', 'SMART', 'CDD', 'CATH', 'SCOP2', 'InterPro']
  },
  Composite: {
    id: 'Composite',
    title: 'Composite Databases',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    glowClass: 'glow-composite',
    borderColor: 'border-emerald-500/30',
    accentBg: 'from-emerald-500/10 to-transparent',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    shortDesc: 'Integrated and curated non-redundant databases consolidating multiple primary sources into gold-standard reference sets.',
    definition: 'Composite databases amalgamate data from multiple primary or secondary sources into a unified, non-redundant, and harmonized repository. Redundant submissions are merged into canonical master reference entries with expert annotations.',
    characteristics: [
      'Non-redundancy: Merges duplicate submissions for the same locus into single canonical representative records.',
      'Expert human curation: Biologists verify literature evidence, functional descriptions, and post-translational modifications.',
      'Cross-database federation: Links sequence records directly to literature (PubMed), structure, pathways, and phenotypes.',
      'Standard reference benchmarks: Widely used as trusted references for sequence alignment, BLAST queries, and variant calling.'
    ],
    workflowRole: 'The canonical standard reference used for benchmarking, BLAST search databases, and molecular modeling.',
    curationType: 'Deep manual curation by expert PhD biocurators supplemented with rigorous quality filters.',
    canonicalExamples: ['UniProtKB/Swiss-Prot', 'NCBI RefSeq', 'NRDB / NCBI nr', 'Ensembl', 'UCSC Genome Browser', 'NCBI Entrez']
  },
  Tertiary: {
    id: 'Tertiary',
    title: 'Tertiary Databases',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
    glowClass: 'glow-tertiary',
    borderColor: 'border-amber-500/30',
    accentBg: 'from-amber-500/10 to-transparent',
    textColor: 'text-amber-700 dark:text-amber-400',
    shortDesc: 'High-level systems biology knowledgebases mapping biochemical reactions, metabolic pathways, and interaction networks.',
    definition: 'Tertiary databases integrate primary sequences, secondary functional domains, and literature evidence into systemic, higher-order cellular networks. They represent pathways, molecular interactions, and multi-component systems.',
    characteristics: [
      'Systems-level perspective: Maps individual proteins and genes into interactive metabolic and signaling cascades.',
      'Reaction mechanics & kinetics: Details stoichiometry, chemical reactants, enzymes, and regulatory feedback loops.',
      'Network topology: Employs graph models to predict protein-protein physical and functional interaction clusters.',
      'Cross-species pathway mapping: Maps orthologous genes onto shared biochemical pathway wiring diagrams.'
    ],
    workflowRole: 'Translates gene expression and proteomics lists into actionable biological mechanism insights.',
    curationType: 'Biochemical literature synthesis, pathway drafting, and expert peer review.',
    canonicalExamples: ['KEGG PATHWAY', 'Reactome', 'MetaCyc / BioCyc', 'STRING', 'BioGRID', 'IntAct', 'WikiPathways']
  },
  Specialized: {
    id: 'Specialized',
    title: 'Specialized Databases',
    badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
    glowClass: 'glow-specialized',
    borderColor: 'border-rose-500/30',
    accentBg: 'from-rose-500/10 to-transparent',
    textColor: 'text-rose-700 dark:text-rose-400',
    shortDesc: 'Niche, domain-specific resources dedicated to particular organisms, diseases, clinical variations, bioactive drugs, or non-coding RNAs.',
    definition: 'Specialized databases focus on a specific sub-discipline, taxonomic group, disease etiology, or molecule type. They provide rich, granular metadata not feasible in broad universal repositories.',
    characteristics: [
      'Deep domain specificity: Concentrated on single model organisms (e.g. FlyBase, SGD) or clinical phenotypes (ClinVar, OMIM).',
      'Targeted experimental assays: Catalogs drug bioactivity (IC50, Ki in ChEMBL), non-coding RNAs (miRBase), or TF binding sites (JASPAR).',
      'Community curation: Deeply integrated with specialized researcher consortia and clinical geneticists.',
      'Next-Gen AI models: Integrates artificial intelligence protein structural models (AlphaFold Database).'
    ],
    workflowRole: 'Deep domain queries for targeted research in drug discovery, clinical genetics, model organism biology, and oncology.',
    curationType: 'Specialist clinical and academic consortia curation with targeted assays.',
    canonicalExamples: ['OMIM', 'ClinVar', 'ChEMBL', 'DrugBank', 'FlyBase', 'miRBase', 'AlphaFold DB', 'GTEx']
  }
};

export interface ComparisonItem {
  id: string;
  title: string;
  db1Name: string;
  db1Type: string;
  db2Name: string;
  db2Type: string;
  keyDistinctions: {
    aspect: string;
    db1Val: string;
    db2Val: string;
  }[];
  verdict: string;
}

export const COMPARISONS_DATA: ComparisonItem[] = [
  {
    id: 'genbank-vs-refseq',
    title: 'GenBank vs. NCBI RefSeq',
    db1Name: 'GenBank',
    db1Type: 'Primary (Archival)',
    db2Name: 'NCBI RefSeq',
    db2Type: 'Composite (Curated Reference)',
    keyDistinctions: [
      {
        aspect: 'Data Provenance',
        db1Val: 'Direct author submissions; uncurated',
        db2Val: 'Synthesized and curated by NCBI computational and expert staff'
      },
      {
        aspect: 'Redundancy',
        db1Val: 'High (multiple entries for same gene/organism)',
        db2Val: 'Strictly non-redundant (single standard per transcript/protein)'
      },
      {
        aspect: 'Accession Pattern',
        db1Val: 'Letter + digits without underscores (e.g., U12345, AF086833)',
        db2Val: 'Explicit two-letter prefix + underscore (e.g., NM_000546, NP_000537)'
      },
      {
        aspect: 'Updates & Revisions',
        db1Val: 'Author owns entry; cannot be modified without permission',
        db2Val: 'Regularly updated to reflect newest consensus genome assemblies'
      }
    ],
    verdict: 'Use GenBank when submitting experimental sequences or retrieving original historical data. Use RefSeq when needing a clean, standard, non-redundant reference for alignment, primer design, or variant calling.'
  },
  {
    id: 'trembl-vs-swissprot',
    title: 'TrEMBL vs. Swiss-Prot (UniProtKB)',
    db1Name: 'UniProtKB / TrEMBL',
    db1Type: 'Primary (Computer-Translated)',
    db2Name: 'UniProtKB / Swiss-Prot',
    db2Type: 'Composite (Manually Curated)',
    keyDistinctions: [
      {
        aspect: 'Curation Level',
        db1Val: 'Unreviewed; automated pipeline translation from EMBL/GenBank/DDBJ CDS',
        db2Val: 'Reviewed; manual expert PhD biocurator literature synthesis'
      },
      {
        aspect: 'Scale & Size',
        db1Val: '>250,000,000 entries (vast, exponential growth)',
        db2Val: '~570,000 entries (smaller, highest quality)'
      },
      {
        aspect: 'Biological Annotations',
        db1Val: 'Automated predictions from computational rules (UniRule)',
        db2Val: 'Detailed literature evidence, active sites, PTMs, isoforms, and variants'
      },
      {
        aspect: 'Error & Quality',
        db1Val: 'Prone to pseudogenes, sequencing frameshifts, and partial fragments',
        db2Val: 'Extensively verified sequence accuracy with literature references'
      }
    ],
    verdict: 'Swiss-Prot is the gold standard for reliable molecular biology. TrEMBL ensures sequence coverage for newly sequenced non-model organisms and environmental metagenomes.'
  },
  {
    id: 'pfam-vs-interpro',
    title: 'Pfam vs. InterPro',
    db1Name: 'Pfam',
    db1Type: 'Secondary (HMM Domain Families)',
    db2Name: 'InterPro',
    db2Type: 'Secondary / Meta-Consortium',
    keyDistinctions: [
      {
        aspect: 'Scope & Basis',
        db1Val: 'Individual database focusing on Hidden Markov Models (profile HMMs)',
        db2Val: 'Unified meta-platform integrating 13 member databases (Pfam, PROSITE, SMART, PRINTS, etc.)'
      },
      {
        aspect: 'Model Types',
        db1Val: 'Exclusively profile HMMs built from Clustal/HMMER alignments',
        db2Val: 'Combines HMMs, regular expression patterns, fingerprints, and structural domains'
      },
      {
        aspect: 'Cross-Mapping',
        db1Val: 'Provides individual Pfam domain accession (e.g. PF00069)',
        db2Val: 'Unifies multiple member models under one master InterPro Entry (e.g. IPR000719) with GO terms'
      }
    ],
    verdict: 'InterPro is the ultimate entry point for comprehensive functional annotation. Pfam is one of InterPro\'s most influential, high-resolution HMM engines.'
  },
  {
    id: 'pdb-vs-alphafold',
    title: 'RCSB PDB vs. AlphaFold Database',
    db1Name: 'RCSB PDB',
    db1Type: 'Primary (Experimental 3D)',
    db2Name: 'AlphaFold DB',
    db2Type: 'Specialized (AI-Predicted 3D)',
    keyDistinctions: [
      {
        aspect: 'Methodology',
        db1Val: 'Experimental physical techniques (X-ray crystallography, Cryo-EM, NMR)',
        db2Val: 'Deep learning machine learning predictions (AlphaFold 2 neural network)'
      },
      {
        aspect: 'Coverage',
        db1Val: '~230,000 macromolecular structures',
        db2Val: '>214,000,000 predicted proteome structures'
      },
      {
        aspect: 'Accuracy Metric',
        db1Val: 'Physical resolution (Ångströms), R-free, electron density map quality',
        db2Val: 'Confidence score metric (pLDDT: per-residue confidence 0-100; PAE)'
      },
      {
        aspect: 'Ligands & Complexes',
        db1Val: 'Features co-crystallized drugs, ions, nucleic acids, and oligomers',
        db2Val: 'Primarily monomeric single-chain predictions (in AFDB v1-v2)'
      }
    ],
    verdict: 'Use PDB for experimental ground truth, active-site ligand binding conformations, and drug docking validation. Use AlphaFold DB for uncharacterized proteins and genome-wide structural proteome coverage.'
  }
];
