export interface CoreConcept {
  id: string;
  title: string;
  subtitle: string;
  analogy: string;
  keyPoints: string[];
  takeaway: string;
}

export interface BigDatabaseProfile {
  id: string; // matches databases.ts id
  acronym: string;
  name: string;
  host: string;
  yearEstablished: number;
  tier: 'Primary' | 'Secondary' | 'Composite' | 'Tertiary' | 'Specialized';
  analogy: string;
  whatProblemDoesItSolve: string;
  keyDataTypes: string[];
  whatIsStored: string[];
  studentGotchas: string[];
  typicalStudentUseCases: string[];
  exampleAccession: string;
  exampleLabel: string;
}

export interface FileFormatColumn {
  field: string;
  meaning: string;
  example: string;
}

export interface FileFormatProfile {
  id: string;
  name: string;
  extensions: string[];
  category: 'Sequence' | 'Alignment' | 'Variation' | 'Annotation' | 'Structure';
  badgeColor: string;
  oneLineSummary: string;
  whenYouEncounterIt: string;
  sampleCode: string;
  fieldsOrLines: FileFormatColumn[];
  studentRules: string[];
  commonMistakes: string[];
}

export interface HistoryMilestone {
  year: number;
  title: string;
  pioneers: string;
  organization: string;
  summary: string;
  significance: string;
  tierTag: string;
  iconName: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  subtext: string;
  recommendedDbId: string;
  dbAcronym: string;
  dbName: string;
  whyThisOne: string;
  nextStep: string;
}

export interface GlossaryItem {
  term: string;
  pronunciation?: string;
  simpleDefinition: string;
  studentAnalogy: string;
  practicalExample: string;
  relatedDbOrTool: string;
}

// ──────────────────────────────────────────────────────────
// 1. CORE FOUNDATIONAL CONCEPTS
// ──────────────────────────────────────────────────────────
export const CORE_CONCEPTS: CoreConcept[] = [
  {
    id: 'central-dogma',
    title: 'The Central Dogma & Database Mapping',
    subtitle: 'How information flows in living cells and which database catalogs each step',
    analogy: 'Think of DNA as an archival master cookbook stored in the vault, mRNA as a temporary photocopied recipe sent to the kitchen, and proteins as the actual meals cooked that carry out real biochemical work.',
    keyPoints: [
      'DNA Level: Stored in archival nucleotide vaults (GenBank, ENA, DDBJ). These contain genomic DNA, introns, exons, promoters, and non-coding regions.',
      'RNA Level: Cataloged in transcript references (NCBI RefSeq, Ensembl transcripts, RNAcentral). Shows splicing isoforms and mature mRNA.',
      'Protein Sequence Level: Curated in protein encyclopedias (UniProtKB). Captures amino acid sequences, active sites, and post-translational modifications.',
      '3D Atomic Structure: Deposited in structural archives (PDB, AlphaFold DB). Shows the spatial 3D folds where drugs bind and enzymes catalyze reactions.',
      'System & Pathways: Mapped in network databases (KEGG, Reactome, STRING). Connects individual molecules into cellular circuits and metabolism.'
    ],
    takeaway: 'Never use a genomic DNA database when you need active site residues of an enzyme; always pick the database that matches the biological level of your question.'
  },
  {
    id: 'archival-vs-curated',
    title: 'Archival (Primary) vs. Curated (Secondary) Databases',
    subtitle: 'Why some databases have massive duplicates while others have only one golden entry',
    analogy: 'An Archival database is like the town registry of births — every birth is entered as filed, with potential typos or duplicate name variants. A Curated database is like an edited biographical encyclopedia — experts verify fact-checks, remove redundancies, and synthesize everything into one authoritative article.',
    keyPoints: [
      'Primary (Archival): GenBank, SRA, GEO, PDB. Data is submitted directly by bench scientists as proof of their published research. Redundant (20 labs submitting the same gene = 20 entries). The database team rarely alters original author submissions.',
      'Secondary (Curated): RefSeq, UniProt/Swiss-Prot, Pfam, InterPro. Curators and automated algorithms compare all primary submissions, remove redundancy, verify biological consistency, and create one standard reference record.',
      'The Swiss-Prot vs TrEMBL Division: UniProtKB contains two sections: Swiss-Prot (~570k manually reviewed, gold-standard entries curated by PhDs) and TrEMBL (~250M automated computational translations that haven\'t been manually checked).'
    ],
    takeaway: 'When looking for a quick, trusted standard reference for a gene or protein, always choose Curated (RefSeq or Swiss-Prot). When you need raw experimental reads or historical original evidence, go to Archival (GenBank, SRA).'
  },
  {
    id: 'coordinate-systems',
    title: '0-Based vs. 1-Based Genomic Coordinates',
    subtitle: 'The infamous off-by-one trap that confuses every bioinformatics student',
    analogy: 'Imagine measuring a ruler. 0-based counting measures the spaces between ticks (like road mileage markers). 1-based counting counts the actual tick marks or square boxes themselves (like calendar days).',
    keyPoints: [
      '1-Based Fully-Closed: Used by biologists, VCF, GFF3, SAM, Ensembl, and BLAST. The first base of a chromosome is position 1. The region [1, 100] includes both base 1 and base 100 (total 100 nucleotides).',
      '0-Based Half-Open: Used by computer scientists, Python, BED format, BAM C-libraries, and the UCSC Genome Browser database tables. The first base is position 0. The interval [0, 100) includes position 0 up to 99, excluding 100 (length is simply 100 - 0 = 100).',
      'Why it matters: If you take a position from a BED file and query a VCF without adjusting (+1), you will be inspecting the wrong nucleotide residue!'
    ],
    takeaway: 'Always check your file specification: BED and Python slices are [0, end); VCF, GFF, and SAM are [1, end].'
  },
  {
    id: 'accession-anatomy',
    title: 'Anatomy of Accession Numbers & Versioning',
    subtitle: 'Decoding what the letters and dots actually mean',
    analogy: 'An accession number is like a biological passport number: it never changes for that record, while the version dot indicates whether the passport was renewed with updated annotations.',
    keyPoints: [
      'Stable Accession: The base identifier (e.g. NM_000546) permanently refers to that biological entity.',
      'Version Suffix: The decimal dot (e.g. NM_000546.6) indicates the 6th version of that sequence. If even a single base or intron boundary is corrected, the version number increments to .7 while the accession remains NM_000546.',
      'RefSeq Prefixes: NM_ = Curated mRNA; NP_ = Curated Protein; NC_ = Complete Chromosome; NR_ = Non-coding RNA; XM_ = Computationally Predicted mRNA.',
      'UniProt Accessions: 6 or 10 alphanumeric characters (e.g., P04637 for human Tumor Protein P53, Q9Y6K1).',
      'PDB IDs: Exactly 4 alphanumeric characters (e.g., 1HHO for hemoglobin, 4HHB, 7RKU).'
    ],
    takeaway: 'Always cite the full accession with version (e.g. NM_000546.6) in scientific papers to guarantee perfect experimental reproducibility.'
  }
];

// ──────────────────────────────────────────────────────────
// 2. THE BIG 12 CORE DATABASES FOR STUDENTS
// ──────────────────────────────────────────────────────────
export const BIG_TWELVE_DATABASES: BigDatabaseProfile[] = [
  {
    id: 'genbank',
    acronym: 'GenBank',
    name: 'GenBank Nucleotide Sequence Database',
    host: 'NCBI (National Center for Biotechnology Information, USA)',
    yearEstablished: 1982,
    tier: 'Primary',
    analogy: 'The Universal Public Library of All DNA Sequences Ever Submitted.',
    whatProblemDoesItSolve: 'Provides an open, permanent, legal public archive where researchers must deposit every sequenced piece of DNA before publishing in any peer-reviewed scientific journal.',
    keyDataTypes: ['Genomic DNA', 'cDNA / mRNA', 'ESTs', 'Synthetic constructs', 'Organelle genomes'],
    whatIsStored: [
      'Raw and assembled nucleotide sequences with author annotations.',
      'Bibliographical citation of the publication discovering the sequence.',
      'Feature table detailing coding regions (CDS), origins, and translation to amino acids.',
      'Daily synchronized copies with European (ENA) and Japanese (DDBJ) archives under the INSDC treaty.'
    ],
    studentGotchas: [
      'High redundancy: You might find 50 different entries for "human insulin" deposited by 50 different groups.',
      'Annotation quality varies: GenBank does not correct biological errors made by the original submitter.'
    ],
    typicalStudentUseCases: [
      'Downloading the original sequence submitted in a research paper.',
      'Submitting your own laboratory cloning or PCR sequencing data.'
    ],
    exampleAccession: 'U54998.1',
    exampleLabel: 'Cloning vector sequence'
  },
  {
    id: 'refseq',
    acronym: 'RefSeq',
    name: 'NCBI Reference Sequence Database',
    host: 'NCBI (Bethesda, MD, USA)',
    yearEstablished: 2000,
    tier: 'Composite',
    analogy: 'The Encyclopedia Britannica of Gene & Protein Standards (Curated, Non-Redundant).',
    whatProblemDoesItSolve: 'Eliminates GenBank\'s wild duplication by providing exactly one curated, high-quality, representative reference sequence for each normal gene, transcript, and chromosome.',
    keyDataTypes: ['Reference genomes', 'Curated mRNAs (NM_)', 'Curated Proteins (NP_)', 'Non-coding RNAs (NR_)'],
    whatIsStored: [
      'Standard reference transcript models with confirmed exon/intron junctions.',
      'Curated splice variants with uniform biological nomenclature.',
      'Full genomic assembly standards for major model organisms (Human, Mouse, Zebrafish, Yeast).'
    ],
    studentGotchas: [
      'Do not confuse with GenBank: RefSeq accessions always feature an underscore (NM_123456, NP_123456), whereas GenBank accessions never have an underscore (e.g. U54998, BC001234).'
    ],
    typicalStudentUseCases: [
      'Finding the official standard mRNA or protein sequence for a gene in your project.',
      'Designing PCR primers against the canonical reference transcript.'
    ],
    exampleAccession: 'NM_000546.6',
    exampleLabel: 'Canonical human TP53 transcript'
  },
  {
    id: 'uniprot-swissprot',
    acronym: 'UniProtKB',
    name: 'UniProt Knowledgebase (Swiss-Prot / TrEMBL)',
    host: 'UniProt Consortium (SIB, EMBL-EBI, PIR)',
    yearEstablished: 1986,
    tier: 'Composite',
    analogy: 'The Gold-Standard Medical & Biochemical Dossier for Every Known Protein.',
    whatProblemDoesItSolve: 'Translates raw amino acid sequences into comprehensive biological understanding: what the protein does, where it lives in the cell, how it is modified, and which diseases it causes.',
    keyDataTypes: ['Protein sequence', 'Enzymatic function', 'Subcellular localization', 'Post-translational modifications (PTMs)', 'Mutations'],
    whatIsStored: [
      'Evidence-based functional descriptions with PubMed literature links.',
      'Active sites, binding pockets, catalytic triads, and transmembrane domains.',
      'Pathogenic mutations and non-synonymous natural polymorphisms.',
      'Cross-references to 150+ other bioinformatics databases (PDB, AlphaFold, Ensembl, KEGG).'
    ],
    studentGotchas: [
      'Remember the gold distinction: Swiss-Prot (Golden icon) = reviewed by human curators; TrEMBL (Blue/gray icon) = unreviewed computational translation.'
    ],
    typicalStudentUseCases: [
      'Studying what an unfamiliar protein does for your biochemistry or genetics homework.',
      'Checking phosphorylation sites or signal peptides before designing a recombinant expression experiment.'
    ],
    exampleAccession: 'P04637',
    exampleLabel: 'Human Cellular tumor antigen p53'
  },
  {
    id: 'rcsb-pdb',
    acronym: 'RCSB PDB',
    name: 'Protein Data Bank (wwPDB)',
    host: 'Worldwide PDB (RCSB, PDBe, PDBj, BMRB)',
    yearEstablished: 1971,
    tier: 'Primary',
    analogy: 'The Architectural 3D Blueprint Vault for All Biological Molecules.',
    whatProblemDoesItSolve: 'Stores the exact 3D Cartesian coordinates (X, Y, Z coordinates in Angstroms) of every atom in proteins, DNA, RNA, and drug-bound complexes determined by wet-lab experiments.',
    keyDataTypes: ['Atomic coordinates', 'X-ray diffraction crystallographic data', 'Cryo-EM 3D density maps', 'NMR ensembles'],
    whatIsStored: [
      'PDB/mmCIF files containing ATOM and HETATM records for every heavy atom.',
      'Experimental quality metrics (Resolution in Ångströms, R-free, Ramachandran plot scores).',
      'Bound small molecules, ligands, co-factors, and therapeutic drug candidates.'
    ],
    studentGotchas: [
      'PDB structures are experimentally determined models, not absolute truths! Always check the resolution (e.g. 1.5 Å is sharp; 3.5 Å is fuzzy). Missing residues are common in disordered flexible loops.'
    ],
    typicalStudentUseCases: [
      'Visualizing where an FDA-approved drug binds inside an enzyme pocket using PyMOL or 3D Mol*.',
      'Inspecting the structural impact of a missense mutation (e.g. sickle-cell Glu6Val).'
    ],
    exampleAccession: '4HHB',
    exampleLabel: 'Deoxy human hemoglobin crystal structure'
  },
  {
    id: 'ensembl',
    acronym: 'Ensembl',
    name: 'Ensembl Genome Browser',
    host: 'EMBL-EBI & Wellcome Sanger Institute (Hinxton, UK)',
    yearEstablished: 1999,
    tier: 'Composite',
    analogy: 'The Google Maps of Eukaryotic Chromosomes with Satellite View, Gene Layers & Traffic.',
    whatProblemDoesItSolve: 'Provides a fully unified, automatically and manually annotated genome browser for vertebrate and eukaryotic species, showing genes, regulatory switches, variants, and evolutionary trees.',
    keyDataTypes: ['Genome assemblies', 'Gene models (GENCODE)', 'Comparative genomics (Orthologues)', 'Regulatory features (Promoters, Enhancers)'],
    whatIsStored: [
      'Chromosome tracks showing coordinate-based genomic features.',
      'Variant Effect Predictor (VEP) tool calculations for interpreting genomic mutations.',
      'Synteny and gene conservation across 300+ vertebrate species.'
    ],
    studentGotchas: [
      'Ensembl uses stable identifiers starting with ENS (e.g. ENSG for Gene, ENST for Transcript, ENSP for Protein). Human genes start with ENSG; mouse with ENSMUSG.'
    ],
    typicalStudentUseCases: [
      'Checking exon/intron boundaries and 5\' / 3\' UTR lengths of a gene.',
      'Running Variant Effect Predictor (VEP) to see if a mutation causes a missense or splice-site error.'
    ],
    exampleAccession: 'ENSG00000141510',
    exampleLabel: 'Ensembl Gene ID for TP53'
  },
  {
    id: 'entrez',
    acronym: 'NCBI Entrez / PubMed',
    name: 'Entrez Federated Search & PubMed',
    host: 'NCBI / National Library of Medicine (NLM)',
    yearEstablished: 1988,
    tier: 'Composite',
    analogy: 'The Central Railway Switchboard Linking Biomedical Literature Directly to Sequences.',
    whatProblemDoesItSolve: 'Connects the entire biomedical universe together. A single text search in Entrez discovers related journal articles in PubMed, sequences in GenBank, genes in NCBI Gene, and 3D structures in PDB.',
    keyDataTypes: ['Peer-reviewed literature (PMID)', 'PMC full-text articles', 'Gene summaries', 'NCBI Bookshelf'],
    whatIsStored: [
      '35+ million biomedical scientific literature citations with MeSH index terms.',
      'Cross-database indexing links allowing instant traversal from paper $\\rightarrow$ gene $\\rightarrow$ protein.'
    ],
    studentGotchas: [
      'PMID is for the abstract/citation index; PMCID is for the freely available PubMed Central full-text open-access article.'
    ],
    typicalStudentUseCases: [
      'Finding original research papers for your literature review or thesis citations.',
      'Traversing from an unknown clinical condition directly to the causative mutated gene.'
    ],
    exampleAccession: 'PMID: 25741868',
    exampleLabel: 'Seminal paper on CRISPR-Cas9 genome editing'
  },
  {
    id: 'clinvar',
    acronym: 'ClinVar',
    name: 'ClinVar Medical Genetics Archive',
    host: 'NCBI (Bethesda, MD, USA)',
    yearEstablished: 2013,
    tier: 'Tertiary',
    analogy: 'The Supreme Court of Human Genetic Variants: Is this mutation harmless or deadly?',
    whatProblemDoesItSolve: 'Collects clinical assertions and evidence submitted by hospitals, clinical diagnostic laboratories, and researchers worldwide regarding the health effects of human DNA mutations.',
    keyDataTypes: ['Clinical classifications', 'ACMG pathogenicity ratings', 'Phenotype associations', 'Review star status'],
    whatIsStored: [
      'Standard 5-tier clinical classifications: Pathogenic, Likely Pathogenic, Uncertain Significance (VUS), Likely Benign, Benign.',
      'Evidence summaries submitted by testing labs explaining why a mutation causes disease.',
      'Confidence review status (0 stars = single submitter assertion, 4 stars = expert practice guideline).'
    ],
    studentGotchas: [
      'Not all entries have consensus! You will frequently see conflicts where Lab A calls a variant "Likely Pathogenic" and Lab B calls it "VUS" due to differing clinical thresholds.'
    ],
    typicalStudentUseCases: [
      'Checking if a patient\'s sequencing mutation has ever been seen before in genetic disease clinics.',
      'Investigating hereditary cancer variants (BRCA1, BRCA2, Lynch syndrome genes).'
    ],
    exampleAccession: 'VCV000012374.5',
    exampleLabel: 'Pathogenic BRCA1 mutation record'
  },
  {
    id: 'dbsnp',
    acronym: 'dbSNP / gnomAD',
    name: 'Single Nucleotide Polymorphism Database',
    host: 'NCBI & Broad Institute',
    yearEstablished: 1998,
    tier: 'Primary',
    analogy: 'The Global Census of All Small Natural Spelling Differences in Human Genomes.',
    whatProblemDoesItSolve: 'Catalogues single nucleotide polymorphisms (SNPs), small insertions, and deletions across diverse healthy populations, providing unique "rs" identifiers for every variant.',
    keyDataTypes: ['rsID numbers', 'Allele frequencies (MAF)', 'Genomic chromosome positions', 'Flanking primers'],
    whatIsStored: [
      'Over 1 billion recorded short genetic variations in humans and model organisms.',
      'Population frequency breakdowns across ethnicities (African, East Asian, European, Latino).',
      'Links to ClinVar, OMIM, and GWAS Catalog.'
    ],
    studentGotchas: [
      'An rsID (like rs121913343) does NOT mean the mutation is pathogenic! Most SNPs in dbSNP are completely benign natural genetic diversity.'
    ],
    typicalStudentUseCases: [
      'Looking up the minor allele frequency (MAF) of a variant to see if it is common or extremely rare.',
      'Translating between genomic coordinates (chr17:43044295) and standard rsID numbers.'
    ],
    exampleAccession: 'rs121913343',
    exampleLabel: 'Common CFTR cystic fibrosis carrier mutation'
  },
  {
    id: 'kegg',
    acronym: 'KEGG',
    name: 'Kyoto Encyclopedia of Genes and Genomes',
    host: 'Kanehisa Laboratories (Kyoto University, Japan)',
    yearEstablished: 1995,
    tier: 'Tertiary',
    analogy: 'The Subway & Transit Map of Cellular Metabolism, Signaling & Disease Pathways.',
    whatProblemDoesItSolve: 'Connects individual genes, proteins, and chemical metabolites into complete functional biochemical reaction circuits and disease diagrams.',
    keyDataTypes: ['Metabolic pathway diagrams', 'Ortholog KO identifiers', 'BRITE hierarchical functional trees', 'Drug-target maps'],
    whatIsStored: [
      'Hand-curated, interactive biochemical pathway diagrams (Glycolysis, TCA cycle, p53 signaling).',
      'Orthology groupings (KO numbers) allowing functional pathway transfer across all sequenced genomes.',
      'Enzyme reaction numbers (EC numbers) and chemical compound definitions.'
    ],
    studentGotchas: [
      'KEGG uses its own internal identifier system (K numbers for orthologues, map numbers for pathways). Remember that academic research downloads require understanding KEGG licensing policies.'
    ],
    typicalStudentUseCases: [
      'Performing pathway enrichment analysis after RNA-seq differential gene expression experiments.',
      'Mapping which drug blocks a specific enzymatic step in cancer signaling.'
    ],
    exampleAccession: 'hsa04115',
    exampleLabel: 'Human p53 signaling pathway'
  },
  {
    id: 'alphafold-db',
    acronym: 'AlphaFold DB',
    name: 'AlphaFold Protein Structure Database',
    host: 'Google DeepMind & EMBL-EBI',
    yearEstablished: 2021,
    tier: 'Specialized',
    analogy: 'The AI Crystal Ball: 200+ Million 3D Protein Structures Predicted from Sequence Alone.',
    whatProblemDoesItSolve: 'Solves the 50-year-old protein folding challenge by providing AI-predicted 3D atomic models for virtually every sequenced protein known to science, even those that cannot be crystallized in a wet-lab.',
    keyDataTypes: ['Predicted 3D PDB/mmCIF coordinates', 'Per-residue confidence metric (pLDDT, 0-100)', 'Predicted Aligned Error (PAE) matrices'],
    whatIsStored: [
      'Deep learning predicted coordinates for 214+ million proteins across 1 million species.',
      'Per-residue confidence scores colored by color code (Dark Blue = Very High >90; Orange = Low/Disordered <50).',
      'PAE heatmap matrices indicating confidence in relative domain orientation.'
    ],
    studentGotchas: [
      'Low pLDDT score (<50, colored orange) does NOT mean AlphaFold failed! In most cases, it correctly identifies an Intrinsically Disordered Region (IDR) that naturally lacks fixed structure in solution.'
    ],
    typicalStudentUseCases: [
      'Looking up the 3D structure of a newly discovered or rare protein that has no crystal structure in RCSB PDB.',
      'Identifying flexible loop regions and structured enzymatic domains in your protein of interest.'
    ],
    exampleAccession: 'AF-P04637-F1',
    exampleLabel: 'AlphaFold predicted structure for Human p53'
  },
  {
    id: 'geo',
    acronym: 'GEO / SRA',
    name: 'Gene Expression Omnibus & Sequence Read Archive',
    host: 'NCBI & EBI',
    yearEstablished: 2000,
    tier: 'Primary',
    analogy: 'The Grand Central Depot for Raw RNA-seq, Single-Cell, and Next-Gen Sequencing Reads.',
    whatProblemDoesItSolve: 'Stores massive raw experimental functional genomics datasets so that any computational biologist in the world can re-analyze, reproduce, or cross-compare experiments without paying millions in sequencing fees.',
    keyDataTypes: ['Raw FASTQ sequencing reads (SRA)', 'Processed gene expression matrix tables (GEO)', 'Microarray profiles', 'Single-cell count matrices'],
    whatIsStored: [
      'Series records (GSE) and Sample records (GSM) containing experimental metadata.',
      'Differential gene expression matrices comparing healthy vs treated vs diseased tissue.',
      'Terabytes of raw Illumina, PacBio, and Oxford Nanopore sequencer reads.'
    ],
    studentGotchas: [
      'GEO stores the biological study metadata and normalized expression matrices; the actual gigabyte raw FASTQ read files live in the SRA (Sequence Read Archive).'
    ],
    typicalStudentUseCases: [
      'Downloading public COVID-19 or cancer patient RNA-seq data to practice bioinformatics differential expression pipelines.',
      'Re-analyzing published single-cell data with Seurat or Scanpy in Python/R.'
    ],
    exampleAccession: 'GSE68849',
    exampleLabel: 'Comparative RNA-seq study of breast cancer cell lines'
  },
  {
    id: 'string',
    acronym: 'STRING',
    name: 'Search Tool for the Retrieval of Interacting Genes/Proteins',
    host: 'STRING Consortium (EMBL, SIB, CPR, UZH)',
    yearEstablished: 2000,
    tier: 'Tertiary',
    analogy: 'The LinkedIn & Social Network of Proteins: Who interacts with whom in the cell?',
    whatProblemDoesItSolve: 'Brings together known physical protein-protein binding interactions and functional associations from multiple evidence channels, scoring confidence from 0 to 1.',
    keyDataTypes: ['Protein interaction networks', 'Confidence scores (0.150 - 0.999)', 'Evidence channels (Experiments, Text mining, Co-expression)', 'Functional enrichment'],
    whatIsStored: [
      'Interactive network graphs where nodes are proteins and edges represent interaction confidence.',
      'De-convoluted evidence channels: Biochemical assays, curated databases, co-expression, automated PubMed text-mining, and gene neighborhood.',
      'Gene Ontology (GO) and KEGG pathway enrichment calculations for whole protein clusters.'
    ],
    studentGotchas: [
      'An edge in STRING does not always mean two proteins physically touch! It can represent functional association (working together in the same metabolic pathway).'
    ],
    typicalStudentUseCases: [
      'Visualizing the protein interaction hub around your target gene for presentation slides.',
      'Identifying the unknown function of a candidate gene by seeing what well-studied proteins it clusters with.'
    ],
    exampleAccession: '9606.ENSP00000269305',
    exampleLabel: 'Human p53 interaction hub network'
  }
];

// ──────────────────────────────────────────────────────────
// 3. BIOINFORMATICS FILE FORMATS DEEP DIVE
// ──────────────────────────────────────────────────────────
export const FILE_FORMATS_DATA: FileFormatProfile[] = [
  {
    id: 'fasta',
    name: 'FASTA (.fa, .fasta, .fna, .faa)',
    extensions: ['.fasta', '.fa', '.fna', '.faa'],
    category: 'Sequence',
    badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
    oneLineSummary: 'The simplest and most universal text format for biological nucleotide or amino acid sequences.',
    whenYouEncounterIt: 'Every single bioinformatics tool accepts FASTA: BLAST searches, sequence alignments, reference genomes, and primer design.',
    sampleCode: `>NP_000537.3 cellular tumor antigen p53 [Homo sapiens]
MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPLPSQAMDDLMLSPDDIEQWFTEDPGP
DEAPRMPEAAPPVAPAPAAPTPAAPAPAPSWPLSSSVPSQKTYQGSYGFRLGFLHSGTAK
SVTCTYSPALNKMFCQLAKTCPVQLWVDSTPPPGTRVRAMAIYKQSQHMTEVVRRCPHHE`,
    fieldsOrLines: [
      {
        field: 'Line 1: > (Greater-Than Header)',
        meaning: 'Starts with >. Contains the unique sequence identifier and an optional free-text description.',
        example: '>NP_000537.3 cellular tumor antigen p53'
      },
      {
        field: 'Lines 2+: Sequence Lines',
        meaning: 'One-letter IUPAC amino acid or nucleotide codes. Usually wrapped at 60 or 80 characters for readability.',
        example: 'MEEPQSDPSVEPPLSQETFSDLWKLLPENNVLSPL...'
      }
    ],
    studentRules: [
      'The > symbol MUST be the very first character on the first line (no leading spaces).',
      'The identifier is everything after > up to the first whitespace; everything after the first space is description text.',
      '.fna = FASTA Nucleic Acid; .faa = FASTA Amino Acid; .fa = general FASTA.'
    ],
    commonMistakes: [
      'Accidentally leaving spaces or line breaks inside the sequence itself.',
      'Assuming that lowercase letters mean errors (in reference genomes, lowercase often denotes soft-masked repetitive elements).'
    ]
  },
  {
    id: 'fastq',
    name: 'FASTQ (.fq, .fastq)',
    extensions: ['.fastq', '.fq', '.fastq.gz'],
    category: 'Sequence',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    oneLineSummary: 'The industry-standard output format directly from sequencing machines, combining sequence reads with quality scores.',
    whenYouEncounterIt: 'Whenever you receive raw unaligned sequencing data from Illumina, BGI, PacBio, or Nanopore machines.',
    sampleCode: `@ERR001234.1 1/1 length=50
GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAAC
+
!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>`,
    fieldsOrLines: [
      {
        field: 'Line 1: @ (Read Identifier)',
        meaning: 'Starts with @. Contains sequencer instrument ID, flowcell ID, tile coordinates, and pair member (1 or 2).',
        example: '@ERR001234.1 1/1 length=50'
      },
      {
        field: 'Line 2: Raw Sequence',
        meaning: 'The actual sequenced nucleotide base calls (A, C, G, T, or N for ambiguous calls).',
        example: 'GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAA...'
      },
      {
        field: 'Line 3: + (Separator)',
        meaning: 'Starts with + and optionally repeats the read ID. Simply separates sequence from quality characters.',
        example: '+'
      },
      {
        field: 'Line 4: Phred Quality String',
        meaning: 'ASCII characters representing the sequencing machine\'s confidence for every single base call in Line 2.',
        example: "!''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>"
      }
    ],
    studentRules: [
      'Each sequenced read takes EXACTLY 4 lines. An Illumina run with 40 million reads produces a 160-million-line file.',
      'Phred Score Math: Q = -10 * log10(P_error). Q10 = 90% accuracy (1 in 10 error); Q20 = 99% accuracy; Q30 = 99.9% accuracy (benchmark for high quality).',
      'Quality characters use Phred+33 ASCII offset (e.g., "!" = Q0, "?" = Q30, "I" = Q40).'
    ],
    commonMistakes: [
      'Never open a multi-gigabyte FASTQ file in a text editor like Notepad or VS Code; use command line head or zcat | less.',
      'Forgetting that paired-end sequencing produces TWO synchronized FASTQ files (e.g. read_1.fastq.gz and read_2.fastq.gz).'
    ]
  },
  {
    id: 'sam-bam',
    name: 'SAM & BAM (.sam, .bam)',
    extensions: ['.sam', '.bam'],
    category: 'Alignment',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    oneLineSummary: 'Sequence Alignment/Map format: Records where millions of short sequencing reads align against a reference genome.',
    whenYouEncounterIt: 'After running alignment tools like BWA-MEM, Bowtie2, or STAR to map FASTQ reads to a reference genome.',
    sampleCode: `@HD	VN:1.6	SO:coordinate
@SQ	SN:chr17	LN:83257441
read_01	99	chr17	7673535	60	50M	=	7673800	315	GATTTGGGGTTCAAAG...	!''*((((***+))...	NM:i:0`,
    fieldsOrLines: [
      { field: 'Col 1: QNAME', meaning: 'Query template / read name from the original FASTQ file.', example: 'read_01' },
      { field: 'Col 2: FLAG', meaning: 'Bitwise flag encoding 12 boolean properties (e.g. 99 = read paired, mapped in proper pair, first in pair).', example: '99' },
      { field: 'Col 3: RNAME', meaning: 'Reference chromosome name where the read aligned.', example: 'chr17' },
      { field: 'Col 4: POS', meaning: '1-based leftmost coordinate of the alignment.', example: '7673535' },
      { field: 'Col 5: MAPQ', meaning: 'Mapping quality Phred score (-10 * log10(P_mapping_error)). 60 is top tier.', example: '60' },
      { field: 'Col 6: CIGAR', meaning: 'Compact string describing matches (M), insertions (I), deletions (D), and soft clips (S).', example: '50M' },
      { field: 'Col 7: RNEXT', meaning: 'Reference name of the mate read (= means same chromosome).', example: '=' },
      { field: 'Col 8: PNEXT', meaning: '1-based leftmost coordinate of the mate read.', example: '7673800' },
      { field: 'Col 9: TLEN', meaning: 'Observed template length / insert size between paired reads.', example: '315' },
      { field: 'Col 10: SEQ', meaning: 'Segment sequence.', example: 'GATTTGGGG...' },
      { field: 'Col 11: QUAL', meaning: 'Phred ASCII quality string from the FASTQ read.', example: "!''*((((***..." }
    ],
    studentRules: [
      'SAM is human-readable plain tab-delimited text. BAM is the exact same data compressed into indexed binary BGZF format.',
      'Always sort and index your BAM files using samtools sort and samtools index to generate a .bai file for rapid random access in genome viewers like IGV.'
    ],
    commonMistakes: [
      'Never try to read a .bam file directly with cat; use samtools view your_file.bam | head.',
      'Forgetting that SAM uses 1-based coordinates.'
    ]
  },
  {
    id: 'vcf',
    name: 'VCF (.vcf, .vcf.gz)',
    extensions: ['.vcf', '.vcf.gz'],
    category: 'Variation',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    oneLineSummary: 'Variant Call Format: The universal standard for reporting genetic mutations, SNPs, insertions, and deletions.',
    whenYouEncounterIt: 'The final output of variant calling software (GATK, FreeBayes, DeepVariant) used in disease diagnosis and genomics.',
    sampleCode: `##fileformat=VCFv4.2
##FILTER=<ID=PASS,Description="All filters passed">
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	NA12878
chr17	7673803	rs121913343	C	T	999	PASS	DP=120	GT:DP:GQ	0/1:120:99`,
    fieldsOrLines: [
      { field: 'Col 1: #CHROM', meaning: 'Chromosome identifier.', example: 'chr17' },
      { field: 'Col 2: POS', meaning: '1-based coordinate of the reference base.', example: '7673803' },
      { field: 'Col 3: ID', meaning: 'Variant identifier, typically an rsID from dbSNP or . if novel.', example: 'rs121913343' },
      { field: 'Col 4: REF', meaning: 'Reference allele base on the forward strand.', example: 'C' },
      { field: 'Col 5: ALT', meaning: 'Alternate mutated allele observed in the sample.', example: 'T' },
      { field: 'Col 6: QUAL', meaning: 'Phred-scaled probability that the ALT allele exists.', example: '999' },
      { field: 'Col 7: FILTER', meaning: 'PASS if the variant meets all quality criteria, or flags like LowQual.', example: 'PASS' },
      { field: 'Col 8: INFO', meaning: 'Semicolon-separated annotations (depth, frequency, ClinVar).', example: 'DP=120;AF=0.5' },
      { field: 'Col 9: FORMAT', meaning: 'Colon-separated keys defining sample columns.', example: 'GT:DP:GQ' },
      { field: 'Col 10+: Sample(s)', meaning: 'Genotype data: 0/0 = homozygous ref, 0/1 = heterozygous, 1/1 = homozygous alt.', example: '0/1:120:99' }
    ],
    studentRules: [
      'Metadata header lines start with ## and define all abbreviations used in INFO and FORMAT columns.',
      'The column line starts with a single # (#CHROM).',
      'Genotype coding: 0 = REF, 1 = first ALT, 2 = second ALT. A slash (0/1) means unphased; a pipe (0|1) means phased.'
    ],
    commonMistakes: [
      'Confusing the REF and ALT columns: REF is what the human reference genome has; ALT is what your patient carries.',
      'Forgetting to inspect the FILTER column: never use variants that failed filters unless deliberately debugging.'
    ]
  },
  {
    id: 'gff-gtf',
    name: 'GFF3 & GTF (.gff, .gtf)',
    extensions: ['.gff3', '.gff', '.gtf'],
    category: 'Annotation',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    oneLineSummary: 'Tab-delimited files cataloging every genomic feature: genes, transcripts, exons, UTRs, and start/stop codons.',
    whenYouEncounterIt: 'Required for RNA-seq quantification (featureCounts, HTSeq) and genome browsers (IGV, JBrowse) to show gene models.',
    sampleCode: `##gff-version 3
chr17	Ensembl	gene	7668402	7687550	.	-	.	ID=gene:ENSG00000141510;biotype=protein_coding;gene_name=TP53
chr17	Ensembl	mRNA	7668402	7687550	.	-	.	ID=transcript:ENST00000269305;Parent=gene:ENSG00000141510
chr17	Ensembl	exon	7668402	7669609	.	-	.	Parent=transcript:ENST00000269305`,
    fieldsOrLines: [
      { field: 'Col 1: seqid', meaning: 'Chromosome or contig name.', example: 'chr17' },
      { field: 'Col 2: source', meaning: 'Database or program that created the feature.', example: 'Ensembl' },
      { field: 'Col 3: type', meaning: 'Sequence Ontology feature type: gene, mRNA, exon, CDS.', example: 'exon' },
      { field: 'Col 4: start', meaning: '1-based start coordinate (inclusive).', example: '7668402' },
      { field: 'Col 5: end', meaning: '1-based end coordinate (inclusive).', example: '7669609' },
      { field: 'Col 6: score', meaning: 'Confidence score (or . if absent).', example: '.' },
      { field: 'Col 7: strand', meaning: '+ (forward / 5\' to 3\') or - (reverse / 3\' to 5\').', example: '-' },
      { field: 'Col 8: phase', meaning: 'Reading frame offset (0, 1, or 2) for CDS features.', example: '0' },
      { field: 'Col 9: attributes', meaning: 'Semicolon-delimited tag=value pairs linking parent-child features.', example: 'ID=exon1;Parent=transcript1' }
    ],
    studentRules: [
      'GFF3 uses a strict hierarchical parent-child structure: Gene $\\rightarrow$ mRNA $\\rightarrow$ Exon / CDS.',
      'GTF (Gene Transfer Format) is a variation that uses key "value"; syntax instead of key=value.'
    ],
    commonMistakes: [
      'Mixing up GFF3 and GTF syntax when running RNA-seq tools like StringTie or featureCounts (tools expect a specific attribute key like gene_id).'
    ]
  },
  {
    id: 'bed',
    name: 'BED (.bed)',
    extensions: ['.bed'],
    category: 'Annotation',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    oneLineSummary: 'The lightweight, flexible format for defining genomic regions and intervals (ChIP-seq peaks, target capture regions).',
    whenYouEncounterIt: 'Used heavily in bedtools operations, exome capture target kits, and custom tracks on UCSC Genome Browser.',
    sampleCode: `chr17	7673500	7674000	TP53_Exon5	1000	-
chr17	7674100	7674300	TP53_Exon6	900	-
chr17	7675000	7675200	TP53_Exon7	950	-`,
    fieldsOrLines: [
      { field: 'Col 1: chrom', meaning: 'Chromosome name (e.g. chr17).', example: 'chr17' },
      { field: 'Col 2: chromStart', meaning: '0-based start coordinate (inclusive).', example: '7673500' },
      { field: 'Col 3: chromEnd', meaning: '0-based end coordinate (exclusive).', example: '7674000' },
      { field: 'Col 4: name (optional)', meaning: 'Descriptive name for the interval.', example: 'TP53_Exon5' },
      { field: 'Col 5: score (optional)', meaning: 'Score between 0 and 1000 for display intensity.', example: '1000' },
      { field: 'Col 6: strand (optional)', meaning: '+, -, or . for unknown.', example: '-' }
    ],
    studentRules: [
      'BED is strictly 0-based half-open [chromStart, chromEnd). The length of any region is simply chromEnd - chromStart.',
      'BED requires only 3 columns (chrom, chromStart, chromEnd), but can extend up to BED12 for multi-exon blocks.'
    ],
    commonMistakes: [
      'Do not subtract 1 from chromEnd! In 0-based half-open, position 100 to 200 represents bases 101 to 200 in 1-based biological terms.'
    ]
  },
  {
    id: 'pdb-format',
    name: 'PDB & mmCIF (.pdb, .cif)',
    extensions: ['.pdb', '.cif', '.mmcif'],
    category: 'Structure',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    oneLineSummary: '3D coordinate files cataloging every heavy atom in biological macromolecules.',
    whenYouEncounterIt: 'Used in structural biology, molecular docking (AutoDock), drug discovery, and 3D molecular modeling (PyMOL, ChimeraX).',
    sampleCode: `ATOM      1  N   VAL A   1      -4.996  28.749  12.756  1.00 45.23           N
ATOM      2  CA  VAL A   1      -4.321  29.544  11.704  1.00 44.91           C
ATOM      3  C   VAL A   1      -2.825  29.288  11.666  1.00 42.10           C
HETATM 1065  FE  HEM A 142       3.210  15.420   4.890  1.00 18.40          FE`,
    fieldsOrLines: [
      { field: 'Col 1-6: Record Name', meaning: 'ATOM (standard amino acid / nucleic acid) or HETATM (hetero-atom: drug, ligand, water, heme).', example: 'ATOM' },
      { field: 'Col 7-11: Atom Serial', meaning: 'Sequential number of the atom in the structure.', example: '1' },
      { field: 'Col 13-16: Atom Name', meaning: 'Element & position (N, CA = Carbon-Alpha, CB = Carbon-Beta, O).', example: 'CA' },
      { field: 'Col 18-20: Residue Name', meaning: '3-letter amino acid code (VAL, GLY, LYS) or ligand code (HEM, ATP).', example: 'VAL' },
      { field: 'Col 22: Chain ID', meaning: 'Polypeptide chain letter (Chain A, Chain B).', example: 'A' },
      { field: 'Col 23-26: Residue Number', meaning: 'Position along the protein sequence.', example: '1' },
      { field: 'Col 31-54: X, Y, Z Coordinates', meaning: 'Orthogonal Angstrom (Å) coordinates in 3D Euclidean space.', example: '-4.321  29.544  11.704' },
      { field: 'Col 55-60: Occupancy', meaning: 'Fraction of molecules in the crystal with the atom in this spot (usually 1.00).', example: '1.00' },
      { field: 'Col 61-66: Temperature / B-factor', meaning: 'Thermal vibration factor in Å^2. Higher = more mobile and floppy.', example: '44.91' }
    ],
    studentRules: [
      'CA (Carbon Alpha) is the central backbone anchor atom of every amino acid; connecting all C-alphas draws the ribbon trace.',
      'mmCIF is the modern replacement for legacy PDB format because massive assemblies (ribosomes, viruses) exceeded PDB\'s 99,999 atom count limit.'
    ],
    commonMistakes: [
      'Assuming hydrogen atoms are present: standard X-ray crystallography cannot resolve hydrogen atoms at typical resolutions (>1.2 Å).'
    ]
  }
];

// ──────────────────────────────────────────────────────────
// 4. HISTORICAL MILESTONES (1965 – 2026)
// ──────────────────────────────────────────────────────────
export const HISTORICAL_TIMELINE: HistoryMilestone[] = [
  {
    year: 1965,
    title: 'Birth of Computational Biology: The Atlas of Protein Sequence and Structure',
    pioneers: 'Margaret Oakley Dayhoff',
    organization: 'National Biomedical Research Foundation (NBRF)',
    summary: 'Margaret Dayhoff published the first compendium of 65 digitized protein sequences in a printed book and pioneered the one-letter amino acid code and PAM substitution matrices.',
    significance: 'Dayhoff is celebrated as the Mother of Bioinformatics; she proved that digital computers could decode evolutionary history.',
    tierTag: 'Historical Origin',
    iconName: 'BookMarked'
  },
  {
    year: 1971,
    title: 'Protein Data Bank (PDB) Founded with 7 Structures',
    pioneers: 'Walter Hamilton & Brookhaven National Lab',
    organization: 'Brookhaven National Laboratory',
    summary: 'The world\'s very first open-access digital biology database began with magnetic tape storage holding atomic coordinates for just 7 crystallographic protein structures.',
    significance: 'Established the open-data precedent that experimental structural models must be shared freely with all researchers worldwide.',
    tierTag: '3D Structure',
    iconName: 'Box'
  },
  {
    year: 1982,
    title: 'GenBank Established by NIH & Walter Goad',
    pioneers: 'Walter Goad',
    organization: 'Los Alamos National Laboratory & NIH',
    summary: 'Created to collect all published DNA sequences. In 1988, the responsibility was officially transferred to the newly created National Center for Biotechnology Information (NCBI).',
    significance: 'Created the central legal archive of human and microbial genetics.',
    tierTag: 'Primary Nucleotide',
    iconName: 'Database'
  },
  {
    year: 1986,
    title: 'Swiss-Prot Created in Geneva',
    pioneers: 'Amos Bairoch',
    organization: 'University of Geneva & SIB',
    summary: 'Amos Bairoch recognized that raw translations needed PhD-level manual review to document protein function, cellular location, and disease links without false noise.',
    significance: 'Created the highest-quality, manually curated standard for biochemical knowledge, still the gold standard today.',
    tierTag: 'Protein Curation',
    iconName: 'Sparkles'
  },
  {
    year: 1988,
    title: 'INSDC Global Treaty Formed & NCBI Founded',
    pioneers: 'NCBI (USA), EMBL (Europe), DDBJ (Japan)',
    organization: 'International Nucleotide Sequence Database Collaboration',
    summary: 'The three major continents signed an international agreement to synchronize their raw DNA databases every 24 hours, ensuring scientific data survives geopolitical conflict.',
    significance: 'Any sequence submitted in Japan, Europe, or America is mirrored across the planet within hours.',
    tierTag: 'Global Infrastructure',
    iconName: 'Globe'
  },
  {
    year: 1990,
    title: 'BLAST Algorithm Revolutionizes Database Search',
    pioneers: 'Stephen Altschul, Warren Gish, Webb Miller, David Lipman',
    organization: 'NCBI & Penn State',
    summary: 'Basic Local Alignment Search Tool (BLAST) allowed searching a sequence against millions of database entries in seconds using heuristic word matches rather than sluggish dynamic programming.',
    significance: 'Remains the single most cited algorithm in life science history; transformed how biologists hypothesize gene function.',
    tierTag: 'Algorithmic Core',
    iconName: 'Search'
  },
  {
    year: 1999,
    title: 'Ensembl Genome Browser Launched',
    pioneers: 'Ewan Birney, Tim Hubbard',
    organization: 'EMBL-EBI & Wellcome Sanger Institute',
    summary: 'Launched ahead of the Human Genome Project draft to automatically track, assemble, and annotate billions of base pairs of human and vertebrate eukaryotic DNA.',
    significance: 'Introduced the modern visual concept of coordinate tracks and gene models (GENCODE).',
    tierTag: 'Genome Browser',
    iconName: 'Compass'
  },
  {
    year: 2002,
    title: 'UniProt Consortium Unified Swiss-Prot, TrEMBL, and PIR',
    pioneers: 'EMBL-EBI, Swiss Institute of Bioinformatics (SIB), PIR',
    organization: 'UniProt Consortium',
    summary: 'Three competing European and American protein catalogs merged into a single universal entry point: UniProtKB.',
    significance: 'Ended duplicate identifier confusion in protein biochemistry once and for all.',
    tierTag: 'Protein Unification',
    iconName: 'Layers'
  },
  {
    year: 2003,
    title: 'Human Genome Project (HGP) Completed',
    pioneers: 'International Human Genome Sequencing Consortium',
    organization: 'Global Public Consortia',
    summary: 'The reference sequence of 3.1 billion human base pairs was completed and published under the 1996 Bermuda Principles of immediate open-access data release.',
    significance: 'Provided the master reference map that all subsequent modern medicine and cancer genomics rely on.',
    tierTag: 'Reference Genome',
    iconName: 'Dna'
  },
  {
    year: 2005,
    title: 'Next-Generation Sequencing (NGS) Explosion & SRA',
    pioneers: '454 Life Sciences, Solexa / Illumina',
    organization: 'NCBI Sequence Read Archive (SRA)',
    summary: 'Sequencing cost crashed below Moore\'s law. Millions of short reads flooded biological databases, forcing the creation of FASTQ, BAM, and the Sequence Read Archive (SRA).',
    significance: 'Democratized whole-genome sequencing from $100M down to $1,000.',
    tierTag: 'High-Throughput Big Data',
    iconName: 'Cpu'
  },
  {
    year: 2013,
    title: 'ClinVar Medical Genetics Archive Launched',
    pioneers: 'Melissa Landrum & NCBI Team',
    organization: 'NCBI / NIH',
    summary: 'Created to aggregate clinical evidence from genetics clinics worldwide, standardizing ACMG clinical classifications for human disease variants.',
    significance: 'Direct bridge between raw genomic sequencing and hospital bedside diagnostics.',
    tierTag: 'Clinical Genetics',
    iconName: 'ShieldCheck'
  },
  {
    year: 2021,
    title: 'AlphaFold DB Solves the 50-Year Protein Structure Challenge',
    pioneers: 'Demis Hassabis, John Jumper & Google DeepMind Team',
    organization: 'Google DeepMind & EMBL-EBI',
    summary: 'Deep learning neural network AlphaFold predicted 3D structures with atomic accuracy directly from amino acid sequence, publishing 200M+ structures covering almost all known proteins.',
    significance: 'Accelerated structural biology by orders of magnitude; recognized with the 2024 Nobel Prize in Chemistry.',
    tierTag: 'AI Revolution',
    iconName: 'Brain'
  },
  {
    year: 2026,
    title: 'Multimodal Foundation Models & Agentic Biological Discovery',
    pioneers: 'Global AI & Computational Biology Community',
    organization: 'AI Consortia & Cloud Life Sciences',
    summary: 'Biomolecular AI models integrate multi-omics, single-cell atlases, and live API query agents (like DogmaDesk Bioinfo Workstation) to automate variant analysis and drug design.',
    significance: 'Bioinformatics shifts from manual search queries to autonomous paired research exploration.',
    tierTag: 'Modern Era',
    iconName: 'Zap'
  }
];

// ──────────────────────────────────────────────────────────
// 5. INTERACTIVE DECISION TREE: "WHICH DATABASE DO I NEED?"
// ──────────────────────────────────────────────────────────
export const STUDENT_DECISION_TREE: DecisionNode[] = [
  {
    id: 'query-gene-symbol',
    question: 'I have a gene symbol or name (e.g. TP53, BRCA1, EGFR)',
    subtext: 'You know what gene you want to study, but need official transcripts, exons, or coordinates.',
    recommendedDbId: 'ensembl',
    dbAcronym: 'Ensembl',
    dbName: 'Ensembl Genome Browser & RefSeq',
    whyThisOne: 'Ensembl and RefSeq give you official standard transcript IDs, chromosome positions, exon/intron boundaries, and promoter switches.',
    nextStep: 'Check the canonical transcript (e.g. ENST00000269305) and copy the RefSeq mRNA accession (NM_).'
  },
  {
    id: 'query-unknown-sequence',
    question: 'I have an unknown DNA or Protein FASTA sequence',
    subtext: 'You got back a mystery sequencing read from the lab and want to know what organism or gene it came from.',
    recommendedDbId: 'genbank',
    dbAcronym: 'NCBI BLAST',
    dbName: 'NCBI BLAST against GenBank / RefSeq',
    whyThisOne: 'BLAST compares your sequence against billions of cataloged entries in seconds and reports statistical E-values for homology.',
    nextStep: 'Paste your FASTA string into blastn (for nucleotide) or blastp (for protein) on NCBI.'
  },
  {
    id: 'query-protein-function',
    question: 'I have a protein name or accession and want to know what it does',
    subtext: 'You need functional mechanisms, active sites, catalytic domains, or cellular location.',
    recommendedDbId: 'uniprot-swissprot',
    dbAcronym: 'UniProtKB',
    dbName: 'UniProtKB / Swiss-Prot',
    whyThisOne: 'Swiss-Prot is the gold standard for reviewed biochemical roles, post-translational modifications, and PubMed citations.',
    nextStep: 'Search by gene symbol or accession (e.g. P04637) and inspect the Function and Subcellular Location tabs.'
  },
  {
    id: 'query-3d-structure',
    question: 'I want to inspect or download 3D atomic coordinates',
    subtext: 'You need to see where a drug binds, examine binding pockets, or view structural folds.',
    recommendedDbId: 'rcsb-pdb',
    dbAcronym: 'RCSB PDB & AlphaFold DB',
    dbName: 'Protein Data Bank (PDB) / AlphaFold DB',
    whyThisOne: 'If an experimental crystal/Cryo-EM structure exists, use PDB. If no wet-lab structure has ever been solved, check AlphaFold DB for AI predictions.',
    nextStep: 'Search your protein accession to download the .pdb or .cif coordinate file for PyMOL or 3D Mol* viewing.'
  },
  {
    id: 'query-patient-mutation',
    question: 'I have a patient genetic mutation or SNP (e.g. c.1799T>A or rs121913343)',
    subtext: 'You want to know if this variant causes disease or if it is benign in healthy people.',
    recommendedDbId: 'clinvar',
    dbAcronym: 'ClinVar & gnomAD',
    dbName: 'ClinVar Clinical Genetic Assertions',
    whyThisOne: 'ClinVar shows medical diagnostics assertions (Pathogenic vs Benign) with hospital evidence. gnomAD shows whether healthy populations carry it.',
    nextStep: 'Query the rsID or cDNA change in ClinVar and check the review star rating and ACMG classification.'
  },
  {
    id: 'query-pathway-network',
    question: 'I have a list of upregulated genes from RNA-seq and need biological pathways',
    subtext: 'You want to know which metabolic pathways or signaling cascades are enriched.',
    recommendedDbId: 'kegg',
    dbAcronym: 'KEGG & STRING',
    dbName: 'KEGG Pathways & STRING Protein Networks',
    whyThisOne: 'KEGG maps genes into biochemical subway maps; STRING builds interaction networks and calculates functional enrichment.',
    nextStep: 'Paste your gene list into STRING or run KEGG pathway over-representation analysis.'
  },
  {
    id: 'query-expression-data',
    question: 'I want to know which human organs or tissues express my gene',
    subtext: 'You want to know if a gene is active in the brain, liver, heart, or in tumors.',
    recommendedDbId: 'geo',
    dbAcronym: 'GTEx & GEO',
    dbName: 'Genotype-Tissue Expression (GTEx) & GEO',
    whyThisOne: 'GTEx profiles RNA expression across 54 healthy non-diseased human tissues. GEO catalogs thousands of disease vs normal microarrays and RNA-seq.',
    nextStep: 'Check the median TPM bar chart in GTEx for organ-specific expression.'
  }
];

// ──────────────────────────────────────────────────────────
// 6. STUDENT EXAM & RESEARCH GLOSSARY
// ──────────────────────────────────────────────────────────
export const GLOSSARY_DATA: GlossaryItem[] = [
  {
    term: 'Homology',
    simpleDefinition: 'Biological similarity due to shared evolutionary ancestry.',
    studentAnalogy: 'Like cousins sharing bone structures inherited from their common grandparents.',
    practicalExample: 'Human insulin and pig insulin are homologous sequences derived from an ancestral mammal gene.',
    relatedDbOrTool: 'BLAST, Ensembl Compara'
  },
  {
    term: 'Ortholog vs. Paralog',
    simpleDefinition: 'Orthologs are genes separated by a speciation event (same job in different species). Paralogs are genes separated by a duplication event within the same genome (new job).',
    studentAnalogy: 'Orthologs: The British English plug vs American plug (same function across countries). Paralogs: A microwave and a toaster oven in the same kitchen.',
    practicalExample: 'Human alpha-globin and chimpanzee alpha-globin are orthologs; human alpha-globin and human beta-globin are paralogs.',
    relatedDbOrTool: 'Ensembl, EggNOG'
  },
  {
    term: 'E-value (Expect Value)',
    simpleDefinition: 'The number of alignments with a score equal to or better than yours that you would expect to find by pure chance in a random database of this size.',
    studentAnalogy: 'Winning the lottery odds: A super small E-value (e.g. 1e-50 or 0.0) means it is virtually impossible to happen by luck—it is a true biological hit.',
    practicalExample: 'An E-value of 1e-120 in BLAST means high-confidence true homology; an E-value of 4.5 means pure coincidence.',
    relatedDbOrTool: 'NCBI BLAST, HMMER'
  },
  {
    term: 'Phred Quality Score (Q-score)',
    simpleDefinition: 'A logarithmic measure of the probability that a sequencing machine called the wrong nucleotide base.',
    studentAnalogy: 'Like an exam grade scale: Q10 is 90% (D-grade), Q20 is 99% (B-grade), Q30 is 99.9% (A+ grade, 1 error in 1,000 bases).',
    practicalExample: 'In FASTQ files, quality filtering tools like Trimmomatic discard reads falling below Q30.',
    relatedDbOrTool: 'FASTQ, FastQC'
  },
  {
    term: 'CIGAR String',
    simpleDefinition: 'A concise string of letters and numbers in SAM/BAM files describing how a read matches, inserts, or deletes against a reference genome.',
    studentAnalogy: 'A shorthand turn-by-turn navigation note: "Drive straight for 50 feet (50M), turn right 2 steps (2I), drive 30 feet (30M)".',
    practicalExample: '50M2I48M = 50 bases match, 2 extra bases inserted, 48 bases match.',
    relatedDbOrTool: 'SAM, BAM, IGV'
  },
  {
    term: 'Annotation',
    simpleDefinition: 'The process of marking biological features (genes, coding regions, promoters, binding sites) onto raw DNA sequences.',
    studentAnalogy: 'Adding street signs, house numbers, and store labels onto an unlabeled aerial satellite photo of a city.',
    practicalExample: 'GENCODE provides the official human genome annotation for Ensembl and UCSC.',
    relatedDbOrTool: 'GFF3, GTF, Ensembl'
  },
  {
    term: 'INSDC',
    simpleDefinition: 'International Nucleotide Sequence Database Collaboration: The treaty between NCBI GenBank (USA), ENA (Europe), and DDBJ (Japan).',
    studentAnalogy: 'The biological United Nations for DNA: whatever sequence you deposit in one country is mirrored in the others every 24 hours.',
    practicalExample: 'Submitting a sequence to GenBank automatically gives it an entry accessible in Europe\'s ENA the next day.',
    relatedDbOrTool: 'GenBank, ENA, DDBJ'
  },
  {
    term: 'Coverage / Read Depth',
    simpleDefinition: 'The average number of independent sequencing reads that overlap and verify a specific nucleotide position in the genome.',
    studentAnalogy: 'If 30 independent witnesses all testify that the suspect wore a blue hat, you have "30x coverage" of that fact.',
    practicalExample: 'Clinical diagnostic sequencing usually demands at least 30x or 100x depth before declaring a disease mutation.',
    relatedDbOrTool: 'BAM, VCF, samtools depth'
  }
];
