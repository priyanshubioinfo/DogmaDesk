import React, { useState, useMemo } from 'react';
import {
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Dna,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Database,
  Layers,
  HelpCircle,
  Compass,
} from 'lucide-react';

export interface IdentifierPattern {
  id: string;
  name: string;
  entityType: 'Protein' | 'Nucleotide' | 'Structure' | 'Variant' | 'Chemical' | 'Pathway & Network' | 'Gene & Genome' | 'Functional Term' | 'Genomic Data';
  primaryDatabase: string;
  tier: 'Primary' | 'Secondary' | 'Composite' | 'Tertiary' | 'Specialized';
  host: string;
  patternDesc: string;
  regex: RegExp;
  cleanInput: (input: string) => string;
  getPrimaryUrl: (cleanId: string) => string;
  getCrossLinks: (cleanId: string) => Array<{
    name: string;
    description: string;
    url: string;
    badge: string;
  }>;
}

const IDENTIFIER_PATTERNS: IdentifierPattern[] = [
  // 1. UniProtKB Protein Accession
  {
    id: 'uniprot',
    name: 'UniProtKB Accession',
    entityType: 'Protein',
    primaryDatabase: 'UniProt (Swiss-Prot / TrEMBL)',
    tier: 'Composite',
    host: 'UniProt Consortium (SIB / EMBL-EBI / PIR)',
    patternDesc: '6 or 10 character alphanumeric string (e.g., P04637, Q9BYF1, A0A024RBG1)',
    regex: /^(?:[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2})(?:-\d+)?$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.uniprot.org/uniprotkb/${id}/entry`,
    getCrossLinks: (id) => {
      const baseId = id.split('-')[0];
      return [
        {
          name: 'AlphaFold DB',
          description: 'AI predicted 3D structure & pLDDT confidence',
          url: `https://alphafold.ebi.ac.uk/entry/${baseId}`,
          badge: 'Structure / AI',
        },
        {
          name: 'STRING Interactome',
          description: 'Protein-protein association network & functional partners',
          url: `https://string-db.org/network/${baseId}`,
          badge: 'Networks',
        },
        {
          name: 'RCSB PDB',
          description: 'Experimental crystal / cryo-EM structures mapped to sequence',
          url: `https://www.rcsb.org/search?request=%7B%22query%22%3A%7B%22type%22%3A%22terminal%22%2C%22service%22%3A%22text%22%2C%22parameters%22%3A%7B%22value%22%3A%22${baseId}%22%7D%7D%2C%22return_type%22%3A%22entry%22%7D`,
          badge: 'Experimental 3D',
        },
        {
          name: 'InterPro',
          description: 'Conserved protein domains, families, and functional sites',
          url: `https://www.ebi.ac.uk/interpro/protein/UniProt/${baseId}/`,
          badge: 'Domains',
        },
        {
          name: 'IntAct Molecular Interactions',
          description: 'Curated binary physical protein interactions',
          url: `https://www.ebi.ac.uk/intact/search?query=${baseId}`,
          badge: 'Interactome',
        },
      ];
    },
  },

  // 2. RCSB Protein Data Bank (PDB)
  {
    id: 'pdb',
    name: 'PDB Structure Identifier',
    entityType: 'Structure',
    primaryDatabase: 'Protein Data Bank (wwPDB / RCSB)',
    tier: 'Primary',
    host: 'wwPDB Consortia (RCSB, PDBe, PDBj)',
    patternDesc: '4 alphanumeric characters starting with a digit (e.g. 1TUP, 4HHB, 7KRR)',
    regex: /^[0-9][A-Za-z0-9]{3}$/,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.rcsb.org/structure/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'PDBe (Europe)',
        description: 'European macromolecular structure view & validation metrics',
        url: `https://www.ebi.ac.uk/pdbe/entry/pdb/${id.toLowerCase()}`,
        badge: 'Validation',
      },
      {
        name: 'PDBj (Japan)',
        description: 'Asian structural biology portal and electrostatic surfaces',
        url: `https://pdbj.org/mine/summary/${id.toLowerCase()}`,
        badge: 'wwPDB Mirror',
      },
      {
        name: 'Foldseek 3D Search',
        description: 'Instant structural superposition against AlphaFold & PDB',
        url: `https://search.foldseek.com/search`,
        badge: '3D Homology',
      },
      {
        name: 'Proteopedia',
        description: 'Interactive wiki annotation & 3D functional highlights',
        url: `https://proteopedia.org/wiki/index.php/${id.toLowerCase()}`,
        badge: 'Annotation',
      },
    ],
  },

  // 3. AlphaFold Database Identifier
  {
    id: 'alphafold',
    name: 'AlphaFold DB Model ID',
    entityType: 'Structure',
    primaryDatabase: 'AlphaFold Protein Structure Database',
    tier: 'Specialized',
    host: 'EMBL-EBI & Google DeepMind',
    patternDesc: 'Starts with AF- followed by UniProt accession and fragment index (e.g. AF-P04637-F1)',
    regex: /^AF-[A-Za-z0-9]+-F\d+$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => {
      const match = id.match(/^AF-([A-Za-z0-9]+)-F/i);
      const uniprot = match ? match[1] : id;
      return `https://alphafold.ebi.ac.uk/entry/${uniprot}`;
    },
    getCrossLinks: (id) => {
      const match = id.match(/^AF-([A-Za-z0-9]+)-F/i);
      const uniprot = match ? match[1] : id;
      return [
        {
          name: 'UniProtKB',
          description: 'Annotated sequence, active sites, and post-translational marks',
          url: `https://www.uniprot.org/uniprotkb/${uniprot}/entry`,
          badge: 'Sequence',
        },
        {
          name: 'Foldseek Search',
          description: 'Search structural neighbors using predicted coordinates',
          url: `https://search.foldseek.com/search`,
          badge: 'Structural Align',
        },
        {
          name: 'STRING Network',
          description: 'Functional partners and pathway memberships',
          url: `https://string-db.org/network/${uniprot}`,
          badge: 'Interactions',
        },
      ];
    },
  },

  // 4. RefSeq mRNA / Protein / Genomic
  {
    id: 'refseq',
    name: 'NCBI RefSeq Accession',
    entityType: 'Nucleotide',
    primaryDatabase: 'NCBI Reference Sequence (RefSeq)',
    tier: 'Composite',
    host: 'National Center for Biotechnology Information (NCBI)',
    patternDesc: '2 letters (NM_, NP_, NR_, NC_, NG_, XM_) + underscore + 6-9 digits (e.g. NM_000546.6, NP_000537.3)',
    regex: /^[A-Z]{2}_[0-9]{6,9}(?:\.[0-9]+)?$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ncbi.nlm.nih.gov/nuccore/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'NCBI Gene',
        description: 'Genomic context, expression profiles, and gene orthology',
        url: `https://www.ncbi.nlm.nih.gov/gene/?term=${id}`,
        badge: 'Gene Context',
      },
      {
        name: 'Ensembl Genome Browser',
        description: 'Exon-intron structure, splice transcripts, and regulatory tracks',
        url: `https://www.ensembl.org/Multi/Search/Results?q=${id}`,
        badge: 'Genome Tracks',
      },
      {
        name: 'UCSC Genome Browser',
        description: 'UCSC multi-species alignment and conservation scores',
        url: `https://genome.ucsc.edu/cgi-bin/hgTracks?position=${id}`,
        badge: 'Conservation',
      },
      {
        name: 'NCBI BLAST',
        description: 'Align sequence directly against standard nucleotide databases',
        url: `https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Nucleotides&PROGRAM=blastn&QUERY=${id}`,
        badge: 'Homology',
      },
    ],
  },

  // 5. Ensembl Gene / Transcript / Protein
  {
    id: 'ensembl',
    name: 'Ensembl Stable Identifier',
    entityType: 'Gene & Genome',
    primaryDatabase: 'Ensembl Genome Browser',
    tier: 'Tertiary',
    host: 'EMBL-EBI & Wellcome Sanger Institute',
    patternDesc: 'Starts with ENS followed by G (Gene), T (Transcript), or P (Protein) + 11 digits (e.g. ENSG00000141510)',
    regex: /^ENS(?:[A-Z]{3})?(?:G|T|P|E)[0-9]{11}(?:\.[0-9]+)?$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ensembl.org/Homo_sapiens/Search/Details?q=${id}`,
    getCrossLinks: (id) => [
      {
        name: 'Human Protein Atlas',
        description: 'Tissue immunohistochemistry and single-cell RNA expression',
        url: `https://www.proteinatlas.org/${id}`,
        badge: 'Expression & Tissue',
      },
      {
        name: 'GTEx Portal',
        description: 'Expression quantitative trait loci (eQTLs) across 54 non-diseased tissues',
        url: `https://gtexportal.org/home/gene/${id}`,
        badge: 'eQTLs',
      },
      {
        name: 'Open Targets Platform',
        description: 'Target tractability, disease genetics, and clinical drug evidence',
        url: `https://platform.opentargets.org/target/${id}`,
        badge: 'Drug Targets',
      },
      {
        name: 'gnomAD',
        description: 'Population mutational constraint (pLI, LOEUF) & loss-of-function tolerance',
        url: `https://gnomad.broadinstitute.org/gene/${id}?dataset=gnomad_r4`,
        badge: 'Constraint',
      },
    ],
  },

  // 6. dbSNP Variant Identifier
  {
    id: 'dbsnp',
    name: 'dbSNP Reference SNP (rsID)',
    entityType: 'Variant',
    primaryDatabase: 'dbSNP',
    tier: 'Specialized',
    host: 'National Center for Biotechnology Information (NCBI)',
    patternDesc: 'Starts with "rs" followed by digits (e.g. rs121913529, rs7903146)',
    regex: /^rs[0-9]+$/i,
    cleanInput: (s) => s.trim().toLowerCase(),
    getPrimaryUrl: (id) => `https://www.ncbi.nlm.nih.gov/snp/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'ClinVar',
        description: 'Clinical assertions, pathogenicity classifications, and evidence citations',
        url: `https://www.ncbi.nlm.nih.gov/clinvar/?term=${id}`,
        badge: 'Clinical Impact',
      },
      {
        name: 'gnomAD',
        description: 'Global population allele frequencies and continental ancestry breakdowns',
        url: `https://gnomad.broadinstitute.org/variant/${id}?dataset=gnomad_r4`,
        badge: 'Allele Frequency',
      },
      {
        name: 'Ensembl Variant View',
        description: 'Variant Effect Predictor (VEP) transcript consequences and SIFT/PolyPhen scores',
        url: `https://www.ensembl.org/Homo_sapiens/Variation/Explore?v=${id}`,
        badge: 'Consequences',
      },
      {
        name: 'PharmGKB',
        description: 'Clinical pharmacogenomic annotations and drug dosing guidelines',
        url: `https://www.pharmgkb.org/variant/${id}`,
        badge: 'Pharmacogenomics',
      },
    ],
  },

  // 7. ChEMBL Compound Identifier
  {
    id: 'chembl',
    name: 'ChEMBL Bioactive Molecule ID',
    entityType: 'Chemical',
    primaryDatabase: 'ChEMBL',
    tier: 'Specialized',
    host: 'European Bioinformatics Institute (EMBL-EBI)',
    patternDesc: 'Starts with "CHEMBL" followed by numeric ID (e.g. CHEMBL25, CHEMBL112)',
    regex: /^CHEMBL[0-9]+$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ebi.ac.uk/chembl/compound_report_card/${id}/`,
    getCrossLinks: (id) => [
      {
        name: 'PubChem',
        description: 'Chemical structures, synonyms, bioassay tests, and physical properties',
        url: `https://pubchem.ncbi.nlm.nih.gov/#query=${id}`,
        badge: 'Chemistry',
      },
      {
        name: 'DrugBank',
        description: 'Clinical drug mechanism of action, pharmacology, and drug targets',
        url: `https://go.drugbank.com/unearth/q?query=${id}`,
        badge: 'Pharmacology',
      },
      {
        name: 'SwissTargetPrediction',
        description: 'Predict macromolecular protein targets based on chemical structure similarity',
        url: `https://www.swisstargetprediction.ch/`,
        badge: 'Target Prediction',
      },
    ],
  },

  // 8. Gene Ontology (GO) Identifier
  {
    id: 'go',
    name: 'Gene Ontology Term',
    entityType: 'Functional Term',
    primaryDatabase: 'Gene Ontology (GO Consortium / QuickGO)',
    tier: 'Specialized',
    host: 'Gene Ontology Consortium & EMBL-EBI',
    patternDesc: 'Starts with "GO:" followed by 7 digits (e.g. GO:0006915, GO:0005634)',
    regex: /^GO:[0-9]{7}$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ebi.ac.uk/QuickGO/term/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'AmiGO 2',
        description: 'Browse gene associations, ontology graphs, and taxonomic scope',
        url: `http://amigo.geneontology.org/amigo/term/${id}`,
        badge: 'Ontology Graph',
      },
      {
        name: 'STRING Enrichment',
        description: 'Identify protein networks statistically enriched for this GO term',
        url: `https://string-db.org/`,
        badge: 'Enrichment',
      },
      {
        name: 'NCBI Entrez',
        description: 'Find all human and model organism genes mapped to this function',
        url: `https://www.ncbi.nlm.nih.gov/gene/?term=${id}`,
        badge: 'Gene List',
      },
    ],
  },

  // 9. InterPro Entry ID
  {
    id: 'interpro',
    name: 'InterPro Domain/Family ID',
    entityType: 'Functional Term',
    primaryDatabase: 'InterPro',
    tier: 'Composite',
    host: 'European Bioinformatics Institute (EMBL-EBI)',
    patternDesc: 'Starts with "IPR" followed by 6 digits (e.g. IPR000719, IPR001092)',
    regex: /^IPR[0-9]{6}$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ebi.ac.uk/interpro/entry/InterPro/${id}/`,
    getCrossLinks: (id) => [
      {
        name: 'Pfam Consortium',
        description: 'Underlying Hidden Markov Model (HMM) alignment and domain architectures',
        url: `https://www.ebi.ac.uk/interpro/search/text/${id}/`,
        badge: 'HMM Alignment',
      },
      {
        name: 'CATH / Gene3D',
        description: '3D structural domain classifications and evolutionary superfamilies',
        url: `https://www.cathdb.info/search?q=${id}`,
        badge: 'Structural Hierarchy',
      },
      {
        name: 'UniProt Sequences',
        description: 'All reviewed Swiss-Prot proteins containing this functional domain',
        url: `https://www.uniprot.org/uniprotkb?query=xref%3A${id}`,
        badge: 'Protein Members',
      },
    ],
  },

  // 10. KEGG Pathway ID
  {
    id: 'kegg',
    name: 'KEGG Pathway Identifier',
    entityType: 'Pathway & Network',
    primaryDatabase: 'KEGG (Kyoto Encyclopedia of Genes and Genomes)',
    tier: 'Tertiary',
    host: 'Kanehisa Laboratories (Kyoto University)',
    patternDesc: '3 letters organism code (e.g. hsa, eco, mmu) followed by 5 digits (e.g. hsa04110, map00010)',
    regex: /^[a-z]{3}[0-9]{5}$/i,
    cleanInput: (s) => s.trim().toLowerCase(),
    getPrimaryUrl: (id) => `https://www.kegg.jp/entry/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'Reactome Pathways',
        description: 'Inspect equivalent biological reaction cascades in Reactome',
        url: `https://reactome.org/content/detail/search?q=${id}`,
        badge: 'Pathway Comparison',
      },
      {
        name: 'WikiPathways',
        description: 'Community-curated open pathway diagram and gene list',
        url: `https://www.wikipathways.org/index.php/Special:SearchPathways?query=${id}`,
        badge: 'Open Pathways',
      },
      {
        name: 'NCBI Biosystems',
        description: 'Linked publications, small molecules, and genomic coordinates',
        url: `https://www.ncbi.nlm.nih.gov/biosystems/?term=${id}`,
        badge: 'Cross-References',
      },
    ],
  },

  // 11. NCBI GEO Series / Sample
  {
    id: 'geo',
    name: 'NCBI Gene Expression Omnibus (GEO)',
    entityType: 'Genomic Data',
    primaryDatabase: 'Gene Expression Omnibus (GEO)',
    tier: 'Primary',
    host: 'National Center for Biotechnology Information (NCBI)',
    patternDesc: 'Starts with GSE, GSM, GPL, or GDS followed by numeric accession (e.g. GSE20000, GSM12345)',
    regex: /^G(SE|SM|PL|DS)[0-9]+$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${id}`,
    getCrossLinks: (id) => [
      {
        name: 'SRA Run Browser',
        description: 'Download raw fastq sequencing reads for this experiment',
        url: `https://www.ncbi.nlm.nih.gov/sra/?term=${id}`,
        badge: 'Raw Sequencing',
      },
      {
        name: 'BioStudies / ArrayExpress',
        description: 'Re-analyzed and normalized gene expression matrix at EMBL-EBI',
        url: `https://www.ebi.ac.uk/biostudies/studies?query=${id}`,
        badge: 'EBI Mirror',
      },
      {
        name: 'GEO2R Interactive',
        description: 'Perform instant differential gene expression analysis in the cloud',
        url: `https://www.ncbi.nlm.nih.gov/geo/geo2r/?acc=${id}`,
        badge: 'Cloud Analysis',
      },
    ],
  },

  // 12. NCBI SRA Run / Experiment
  {
    id: 'sra',
    name: 'Sequence Read Archive (SRA)',
    entityType: 'Genomic Data',
    primaryDatabase: 'Sequence Read Archive (SRA / INSDC)',
    tier: 'Primary',
    host: 'NCBI / EMBL-EBI / DDBJ',
    patternDesc: 'Starts with SRR, ERR, DRR, SRP, or SRX followed by digits (e.g. SRR000001, ERR1234567)',
    regex: /^[SED]R[RXPAS][0-9]{6,10}$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://trace.ncbi.nlm.nih.gov/Traces/sra/?run=${id}`,
    getCrossLinks: (id) => [
      {
        name: 'ENA Portal',
        description: 'Direct fast download of European FASTQ mirrors via Aspera/FTP',
        url: `https://www.ebi.ac.uk/ena/browser/view/${id}`,
        badge: 'Fast Download',
      },
      {
        name: 'SRA Explorer',
        description: 'Generate direct bash curl / wget download links with md5 checksums',
        url: `https://sra-explorer.info/#${id}`,
        badge: 'One-Click Download',
      },
    ],
  },

  // 13. OMIM MIM Number
  {
    id: 'omim',
    name: 'OMIM MIM Number',
    entityType: 'Variant',
    primaryDatabase: 'Online Mendelian Inheritance in Man (OMIM)',
    tier: 'Specialized',
    host: 'Johns Hopkins University School of Medicine',
    patternDesc: '6-digit number, optionally preceded by "MIM:" or "#" (e.g. 191170, MIM:601728)',
    regex: /^(?:MIM:?\s*|#)?([1-9][0-9]{5})$/i,
    cleanInput: (s) => s.replace(/^(?:MIM:?\s*|#)/i, '').trim(),
    getPrimaryUrl: (id) => `https://www.omim.org/entry/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'ClinVar Disease Assertions',
        description: 'Clinical assertions and pathogenic variants linked to this condition',
        url: `https://www.ncbi.nlm.nih.gov/clinvar/?term=${id}[MIM]`,
        badge: 'Pathogenic Variants',
      },
      {
        name: 'MedGen',
        description: 'Clinical disease descriptions, medical genetic terms, and treatment tests',
        url: `https://www.ncbi.nlm.nih.gov/medgen/?term=${id}`,
        badge: 'Clinical Terms',
      },
      {
        name: 'DisGeNET',
        description: 'Gene-disease association scores and therapeutic evidence',
        url: `https://www.disgenet.org/browser/0/0/0/0/id__${id}-source__ALL/_#tab1`,
        badge: 'Target Association',
      },
    ],
  },

  // 14. GenBank Archival Nucleotide
  {
    id: 'genbank',
    name: 'GenBank Archival Nucleotide',
    entityType: 'Nucleotide',
    primaryDatabase: 'GenBank (INSDC)',
    tier: 'Primary',
    host: 'National Center for Biotechnology Information (NCBI)',
    patternDesc: '1-2 letters + 5-6 digits (e.g. U00096, AF123456, AY456789)',
    regex: /^[A-Z]{1,2}[0-9]{5,6}(?:\.[0-9]+)?$/i,
    cleanInput: (s) => s.trim().toUpperCase(),
    getPrimaryUrl: (id) => `https://www.ncbi.nlm.nih.gov/nuccore/${id}`,
    getCrossLinks: (id) => [
      {
        name: 'European Nucleotide Archive (ENA)',
        description: 'Synchronized European INSDC record view',
        url: `https://www.ebi.ac.uk/ena/browser/view/${id}`,
        badge: 'INSDC Mirror',
      },
      {
        name: 'NCBI BLASTn',
        description: 'Run nucleotide BLAST against whole GenBank database',
        url: `https://blast.ncbi.nlm.nih.gov/Blast.cgi?PAGE=Nucleotides&PROGRAM=blastn&QUERY=${id}`,
        badge: 'Sequence Search',
      },
    ],
  },
];

const EXAMPLE_QUERIES = [
  { label: 'UniProt', id: 'P04637', desc: 'Human Tumor Suppressor TP53' },
  { label: 'RefSeq', id: 'NM_000546.6', desc: 'TP53 mRNA Transcript' },
  { label: 'PDB', id: '1TUP', desc: 'p53 DNA-binding Core Domain' },
  { label: 'AlphaFold', id: 'AF-P04637-F1', desc: 'AlphaFold 3D Model' },
  { label: 'dbSNP', id: 'rs121913529', desc: 'Clinically Pathogenic Variant' },
  { label: 'Ensembl', id: 'ENSG00000141510', desc: 'Human TP53 Gene' },
  { label: 'ChEMBL', id: 'CHEMBL25', desc: 'Aspirin Bioactive Compound' },
  { label: 'Gene Ontology', id: 'GO:0006915', desc: 'Apoptotic Process Term' },
  { label: 'KEGG', id: 'hsa04110', desc: 'Cell Cycle Pathway' },
  { label: 'GEO Data', id: 'GSE20000', desc: 'Microarray Gene Expression' },
];

const SAMPLE_CHIP_COLORS: Record<string, string> = {
  'P04637': 'bg-indigo-50/80 border-indigo-200 text-indigo-900 hover:bg-indigo-100',
  'NM_000546.6': 'bg-sky-50/80 border-sky-200 text-sky-900 hover:bg-sky-100',
  '1TUP': 'bg-teal-50/80 border-teal-200 text-teal-900 hover:bg-teal-100',
  'AF-P04637-F1': 'bg-cyan-50/80 border-cyan-200 text-cyan-900 hover:bg-cyan-100',
  'rs121913529': 'bg-rose-50/80 border-rose-200 text-rose-900 hover:bg-rose-100',
  'ENSG00000141510': 'bg-purple-50/80 border-purple-200 text-purple-900 hover:bg-purple-100',
  'CHEMBL25': 'bg-fuchsia-50/80 border-fuchsia-200 text-fuchsia-900 hover:bg-fuchsia-100',
  'GO:0006915': 'bg-emerald-50/80 border-emerald-200 text-emerald-900 hover:bg-emerald-100',
  'hsa04110': 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-100',
  'GSE20000': 'bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100',
};

const ENTITY_TYPE_PASTELS: Record<string, string> = {
  'Protein':           'bg-sky-50 text-sky-700 border-sky-200 font-semibold',
  'Nucleotide':        'bg-indigo-50 text-indigo-700 border-indigo-200 font-semibold',
  'Structure':         'bg-teal-50 text-teal-700 border-teal-200 font-semibold',
  'Variant':           'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
  'Chemical':          'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  'Pathway & Network': 'bg-amber-50 text-amber-700 border-amber-200 font-semibold',
  'Gene & Genome':     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  'Functional Term':   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  'Genomic Data':      'bg-cyan-50 text-cyan-700 border-cyan-200 font-semibold',
};

const TIER_BADGE_STYLES: Record<string, string> = {
  Primary:     'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  Secondary:   'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
  Composite:   'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Tertiary:    'bg-purple-50 text-purple-700 border-purple-200 font-semibold',
  Specialized: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
};

export const AccessionResolver: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>('P04637');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Match against pattern library
  const matchedPattern = useMemo(() => {
    const raw = inputVal.trim();
    if (!raw) return null;
    return IDENTIFIER_PATTERNS.find((p) => p.regex.test(raw)) || null;
  }, [inputVal]);

  const cleanId = useMemo(() => {
    if (!matchedPattern) return inputVal.trim();
    return matchedPattern.cleanInput(inputVal);
  }, [inputVal, matchedPattern]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <section id="resolver" className="py-14 border-t border-slate-200 bg-[#F8F9FA] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#D95D29] text-xs font-semibold mb-3 shadow-xs">
            <span className="font-serif text-xs font-bold leading-none select-none">✻</span>
            <span>Universal Accession Detective & Multi-DB Resolver</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0F172A] font-normal tracking-tight leading-snug">
            Paste Any Identifier.{' '}
            <span className="italic text-[#D95D29] block sm:inline">Instant Multi-Database Bridges.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-normal leading-relaxed text-pretty">
            Match an accession to a recognized identifier format, then open the record in its source database
            or explore useful links to related repositories.
          </p>
        </div>

        {/* Input Bar & Controls */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center shadow-sm rounded-2xl sm:rounded-3xl bg-white border border-slate-200 focus-within:border-[#D95D29] focus-within:ring-4 focus-within:ring-[#D95D29]/15 transition-all p-1 sm:p-1.5">
            <div className="pl-3.5 sm:pl-4 pr-2 text-slate-400 shrink-0">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Paste any accession (e.g. P04637, 1TUP, NM_000546, rs121913529, CHEMBL25)..."
              className="w-full py-2.5 sm:py-3 px-1 text-xs sm:text-sm font-mono text-[#0F172A] placeholder-slate-400 focus:outline-none bg-transparent min-w-0"
              aria-label="Accession number input"
            />
            {inputVal && (
              <button
                onClick={() => setInputVal('')}
                className="px-2.5 py-1 text-xs font-semibold text-slate-400 hover:text-[#0F172A] cursor-pointer shrink-0 mr-1"
                title="Clear input"
              >
                Clear
              </button>
            )}
          </div>

          {/* Preset Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
            <span className="text-[11px] font-medium text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D95D29]" />
              Try sample:
            </span>
            {EXAMPLE_QUERIES.map((ex) => {
              const isSelected = inputVal.trim() === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setInputVal(ex.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0F172A] text-white font-semibold border-[#0F172A] shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-[#0F172A] border-slate-200'
                  }`}
                  title={ex.desc}
                >
                  {ex.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution Results Card */}
        <div className="max-w-4xl mx-auto" aria-live="polite" aria-atomic="true">
          {matchedPattern ? (
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.04)] p-5 sm:p-8 space-y-5 sm:space-y-6 animate-fade-up">
              {/* Top Detection Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-slate-200">
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Format Match
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${ENTITY_TYPE_PASTELS[matchedPattern.entityType] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {matchedPattern.entityType}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${TIER_BADGE_STYLES[matchedPattern.tier] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {matchedPattern.tier} Database
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#0F172A]">
                    {matchedPattern.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assigned by <strong className="text-[#0F172A]">{matchedPattern.host}</strong>
                  </p>
                </div>

                {/* Primary Destination Action */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleCopy(cleanId, 'clean')}
                    className="w-full sm:w-auto justify-center px-3 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-xs font-mono font-medium text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Copy sanitized ID"
                  >
                    {copiedLink === 'clean' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span>{cleanId}</span>
                  </button>

                  <a
                    href={matchedPattern.getPrimaryUrl(encodeURIComponent(cleanId))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center px-4 py-2 rounded-full bg-[#D95D29] hover:bg-[#C2541C] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    <span>Open in {matchedPattern.primaryDatabase.split(' ')[0]}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Format Specification info */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border-l-2 border-[#D95D29] border-y border-r border-slate-200 text-xs space-y-1">
                <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#D95D29]" />
                  <span>Pattern Specification & Structural Standard</span>
                </div>
                <p className="text-slate-600 font-normal leading-relaxed">
                  {matchedPattern.patternDesc}
                </p>
              </div>

              {/* Multi-Database Reciprocal Cross-Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#D95D29]" />
                    <span>Related databases ({matchedPattern.getCrossLinks(encodeURIComponent(cleanId)).length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    Direct entry deep-links mapped to this accession
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {matchedPattern.getCrossLinks(encodeURIComponent(cleanId)).map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#D95D29]/40 hover:shadow-sm hover:-translate-y-0.5 transition-all text-left flex flex-col justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className="font-serif text-sm font-bold text-[#0F172A] group-hover:text-[#D95D29] transition-colors">
                            {link.name}
                          </span>
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-50 text-[#D95D29] border border-orange-200">
                            {link.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 font-normal leading-relaxed line-clamp-2">
                          {link.description}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-semibold text-[#D95D29] group-hover:text-[#C2541C]">
                        <span>Jump to entry</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl bg-white border border-slate-200 p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-orange-50 text-[#D95D29] border border-orange-200 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                {inputVal.trim() ? 'Unrecognized Accession Format' : 'Enter an Accession ID to Inspect'}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed text-pretty">
                {inputVal.trim()
                  ? `The identifier "${inputVal.trim()}" does not match any supported format. Check for typos or try one of the sample IDs above. A format match checks the identifier's shape; the destination database confirms whether the record exists.`
                  : 'Type or paste any identifier from GenBank, UniProt, PDB, Ensembl, RefSeq, dbSNP, ChEMBL, or Gene Ontology to view its official specifications and connected databases.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
