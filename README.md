# DogmaDesk 🧬
> **The Central Dogma Bioinfo Workstation & Student Handbook**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.x-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Databases](https://img.shields.io/badge/Curated_Databases-55%2B-0284c7)](#-database-catalog--tier-taxonomy)
[![Mobile Ready](https://img.shields.io/badge/Mobile-Responsive_%E2%89%A544px-10B981)](#-mobile--touch-optimization)
[![Theme](https://img.shields.io/badge/Theme-High--Contrast_Light_Mode-amber)](#-design-system)

---

## 📌 Executive Summary & Academic Vision

In contemporary life sciences, researchers, computational biologists, and students face severe **database fragmentation** and **accession number silos**. A typical molecular workflow requires crossing boundaries between nucleic acid archives (NCBI GenBank, EBI ENA), curated reference transcripts (RefSeq, Ensembl), protein sequences (UniProt), macromolecular 3D structures (PDB, AlphaFold DB), functional pathways (KEGG, Reactome), and clinical variant catalogs (ClinVar, dbSNP, gnomAD).

New students and bench biologists often struggle with fundamental questions:
- *What is the difference between an uncurated GenBank entry and an authoritative RefSeq transcript?*
- *Why does a SAM file use bitwise flags and 1-based coordinates while a BED file uses 0-based intervals?*
- *What does an accession prefix like `NM_`, `NP_`, `ENST`, `rs`, or `1TUP` signify, and how can it be mapped to downstream clinical evidence?*

**DogmaDesk** is an open-source, single-page Bioinfo Workstation that integrates **55+ canonical databases across 5 fundamental tiers**, an **automated accession pattern detective**, **multi-step research workflow blueprints**, and an interactive **6-module student curriculum handbook** grounded in the Central Dogma of Molecular Biology.

---

## 🌟 Key Platform Modules

### 1. 🗂️ 5-Tier Database Catalog (55+ Repositories)
Databases are systematically classified according to authoritative bioinformatics taxonomy:
* **Primary (Raw Archival Records):** INSDC (NCBI GenBank, EMBL-EBI ENA, DDBJ), Sequence Read Archive (SRA), NCBI GEO, EMBL-EBI ArrayExpress, Worldwide Protein Data Bank (wwPDB / RCSB PDB), Nucleic Acid Database (NDB), Electron Microscopy Data Bank (EMDB).
* **Secondary (Derived & Domain Classifications):** UniProtKB/TrEMBL, InterPro, Pfam, PROSITE, PRINTS, BLOCKS, SMART, NCBI CDD, CATH, SCOP2.
* **Composite (Non-Redundant & Expert Curated):** UniProtKB/Swiss-Prot, NCBI RefSeq, Ensembl Genomes, UCSC Genome Browser, NCBI Entrez.
* **Tertiary (Pathways, Networks & Systems Biology):** KEGG PATHWAY, Reactome Knowledgebase, STRING Interactome, BioGRID, IntAct, BioCyc / MetaCyc, WikiPathways, STITCH.
* **Specialized (Clinical, Pharmacogenomics & Model Organisms):** ClinVar, dbSNP, gnomAD, COSMIC, OMIM, GTEx, ChEMBL, DrugBank, PubChem, PharmGKB, AlphaFold DB, Foldseek, miRBase, Rfam, JASPAR, ENCODE, Human Protein Atlas, Model Organism databases (FlyBase, WormBase, SGD, TAIR, MGI, ZFIN).

### 2. 🔍 Universal Accession Detective & Multi-DB Resolver
Paste any accession identifier or pattern to instantly detect the host repository, target molecule type, and launch direct queries:
* **GenBank / DDBJ / ENA:** `U49845`, `AF123456`, `NC_000017`
* **NCBI RefSeq Transcripts & Proteins:** `NM_000546.6`, `NP_000537.3`, `NR_`
* **Ensembl Stable Identifiers:** `ENSG00000141510` (Gene), `ENST00000269305` (Transcript), `ENSP00000269305` (Protein)
* **UniProtKB Accessions:** `P04637`, `Q9BY41`
* **PDB 4-Character Identifiers:** `1TUP`, `4HHB`, `6VXX`
* **Clinical Variants & SNPs:** `rs121913529`, `RCV000012345`, `VCV000012345`
* **Chemical & Pathway IDs:** `CHEMBL25`, `CID 2244`, `hsa04115`, `R-HSA-5633007`

### 3. 🗺️ Interactive Research Workflow Navigator
Interactive, sequenced multi-step analysis pipelines designed for real-world projects:
1. **Clinical Variant Pathogenicity & Rare Disease:** Population frequency filtering (`gnomAD`) $\rightarrow$ Clinical assertion (`ClinVar` / `OMIM`) $\rightarrow$ Splice & transcript impact (`Ensembl VEP`) $\rightarrow$ 3D structure perturbation (`PDB` / `AlphaFold DB`) $\rightarrow$ Tissue regulation (`GTEx`).
2. **Protein Structure & Functional Characterization:** Amino acid sequence $\rightarrow$ Domain/motif architecture (`InterPro` / `Pfam`) $\rightarrow$ 3D atomic coordinates (`PDB` / `AlphaFold`) $\rightarrow$ Physical binding pockets (`Foldseek`) $\rightarrow$ Protein-protein interaction network (`STRING`).
3. **Cancer Somatic Driver Mutations & Precision Oncology:** Somatic mutation profiling $\rightarrow$ Tumor census (`COSMIC`) $\rightarrow$ Pathway alteration (`KEGG` / `Reactome`) $\rightarrow$ Target druggability (`ChEMBL` / `DrugBank`).
4. **Target Validation & Druggability Assessment:** Target gene selection $\rightarrow$ Expression & safety validation (`GTEx` / `HPA`) $\rightarrow$ Experimental structures $\rightarrow$ Bioactivity profiling.
5. **Non-Coding RNA & Epigenomics Regulome Mapping:** Regulatory interval $\rightarrow$ Non-coding RNA classification (`miRBase` / `Rfam`) $\rightarrow$ Chromatin state (`ENCODE` / `JASPAR`) $\rightarrow$ Evolutionary conservation (`UCSC Genome Browser`).

### 4. 🎓 Bioinformatics 101: The Essential Student Handbook
A pedagogical curriculum designed for university students, lab newcomers, and wet-lab bench scientists:
* **Module 1: Foundations:** Primary vs. Secondary data models, raw sequencing reads vs. curated reference assemblies, data federation across INSDC, and the Central Dogma bioinformatics flow.
* **Module 2: Big 12 Repositories Dissected:** Plain-English student analogies, underlying problems solved, exact data structures stored, common exam/research gotchas, and copyable example accessions.
* **Module 3: Raw File Formats Dissected Line-by-Line:**
  * **FASTA:** Header definitions (`>`), multi-line sequence wrapping, gap symbols (`-`).
  * **FASTQ:** 4-line cyclical record, Phred quality scoring equation ($Q = -10 \log_{10} P$), ASCII character decoding (Phred+33 Sanger vs. Phred+64 Illumina).
  * **SAM / BAM:** Header records (`@HD`, `@SQ`), 11 mandatory alignment columns, CIGAR strings (`M`, `I`, `D`, `S`, `H`), and binary bitwise flag breakdown.
  * **VCF:** Meta-information headers (`##fileformat`, `##INFO`, `##FORMAT`), 8 fixed columns, genotype notation (`0/1` unphased vs. `0|1` phased).
  * **GFF3 / GTF:** 9-column tab-delimited gene structure annotation, feature hierarchy (`gene` $\rightarrow$ `mRNA` $\rightarrow$ `exon` $\rightarrow$ `CDS`), 1-based inclusive indexing.
  * **PDB / mmCIF:** Atomic coordinate cards (`ATOM`, `HETATM`), PDB 4-letter codes, B-factor / temperature columns.
  * **BED:** Minimal 3-column genomic intervals, 0-based start / 1-based end half-open coordinate logic (`[start, end)`).
* **Module 4: Visual Flowcharts & Decision Tree:** Interactive wet-lab to database pipeline stepper + interactive diagnostic tree answering: *"Which database do I need for my exact biological question?"*
* **Module 5: Historical Timeline (1965–2026):** Margaret Dayhoff's *Atlas of Protein Sequence and Structure* $\rightarrow$ GenBank $\rightarrow$ BLAST $\rightarrow$ PDB $\rightarrow$ Human Genome Project $\rightarrow$ Next-Gen Sequencing $\rightarrow$ AlphaFold 3D protein revolution $\rightarrow$ Agentic AI in computational biology.
* **Module 6: Student Exam & Research Glossary:** Clear plain-English definitions with beginner analogies for high-yield exam terms (Annotation, Assembly, Accession, BLAST, CIGAR, Coverage, Ortholog vs. Paralog, Phred Score, Splicing, VCF).

### 5. 📑 Accession Prefix Cheat-Sheet
Instant cross-reference table and mobile cards mapping prefixes (`NM_`, `NP_`, `NR_`, `NC_`, `ENSG`, `ENST`, `ENSP`, `rs`, `1TUP`, `IPR`, `PF`, `RCV`, `VCV`, `CHEMBL`, `CID`) to their origin databases, molecule classes, and official portals.

### 6. 💾 Custom Bioinformatics Stack (Stack Builder)
Save databases to your local stack (persisted via `localStorage`). View, filter, and export your curated list as **Markdown** or **JSON** for inclusion in laboratory notebooks, paper citations, or project documentation.

---

## 💻 Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [TypeScript 5.8](https://www.typescriptlang.org/) |
| **Bundler & Dev Server** | [Vite 8](https://vitejs.dev/) |
| **Styling & UI System** | [Tailwind CSS v4](https://tailwindcss.com/) (Pure High-Contrast Light Mode) |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Backend API Server** | Node.js / Express (Lightweight health check, DB catalog endpoints, query proxy) |
| **State Persistence** | Browser `localStorage` (Zero tracking, zero cookies, 100% client-side privacy) |
| **Responsiveness** | Mobile-first ($\ge 44\text{px}$ touch targets, fluid grids, `.no-scrollbar` touch carousels) |

---

## 📱 Mobile & Touch Optimization

DogmaDesk is built to provide an app-like experience across all viewports:
- **Small Smartphones (320px – 375px):** Stacked mobile cards replace overly wide data tables, preventing horizontal viewport clipping.
- **Modern Smartphones (390px – 430px):** Single-hand bottom navigation, responsive font sizing, 2-column filter controls.
- **Tablets & iPads (768px – 1024px):** Adaptive multi-column grid layouts with balanced side gutters.
- **Desktop (1280px+):** High-density inspection tables, expansive workflow timelines, and keyboard shortcuts.
- **Touch Ergonomics:** All buttons, pills, and toggles strictly adhere to Apple Human Interface and Material Design standards with minimum $44\text{px} \times 44\text{px}$ touch targets.

---

## ⚡ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `/` | Immediately focus the global database search input |
| `B` | Toggle the Saved Database Stack drawer |
| `D` | Cycle view modes: **Grid Cards** $\rightarrow$ **Dense Table** $\rightarrow$ **Taxonomy Tree** |
| `Escape` | Close any active modal dialog or slide-out drawer |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or higher recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/dogmadesk.git
   cd dogmadesk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **(Optional) Start the companion API server:**
   ```bash
   npm run server
   ```
   Backend API runs at [http://localhost:5000](http://localhost:5000). Check health at [http://localhost:5000/api/health](http://localhost:5000/api/health).

5. **Build for production:**
   ```bash
   npm run build
   ```
   Production assets will be output to the `dist/` directory.

6. **Preview the production build:**
   ```bash
   npm run preview
   ```

---

## 📂 Project Directory Structure

```text
dogmadesk/
├── backup_before_mobile/       # Pristine backup snapshot of project baseline
├── server/                     # Backend API services
│   └── server.mjs              # Express REST server & health check
├── src/                        # React 19 Frontend application
│   ├── components/             # Reusable modular UI components
│   │   ├── AccessionCheatSheet.tsx  # Fast prefix lookup tables & mobile cards
│   │   ├── AccessionResolver.tsx    # Universal regex accession pattern detector
│   │   ├── BookmarksDrawer.tsx      # Saved database stack drawer with export
│   │   ├── DatabaseCard.tsx         # Responsive database summary card
│   │   ├── DatabaseModal.tsx        # In-depth inspection & direct query dialog
│   │   ├── DatabaseTable.tsx        # High-density sortable tabular view
│   │   ├── EducationGuide.tsx       # Comparison matrices & data flow diagrams
│   │   ├── FilterBar.tsx            # Multi-dimensional filtering & view controls
│   │   ├── Footer.tsx               # Consortia directory & back-to-top FAB
│   │   ├── Hero.tsx                 # Search hero banner & tier counter statistics
│   │   ├── Navbar.tsx               # Sticky header with mobile drawer & search trigger
│   │   ├── StudentGuidePage.tsx     # Bioinformatics 101 6-module curriculum handbook
│   │   ├── TaxonomyView.tsx         # Hierarchical tier & discipline tree view
│   │   ├── Toast.tsx                # Lightweight feedback notification alerts
│   │   └── WorkflowNavigator.tsx    # 5 interactive research workflow pipelines
│   ├── data/
│   │   ├── databases.ts        # Comprehensive catalog of 55+ databases & metadata
│   │   └── studentGuideData.ts # Educational formats, glossary, timeline & decision trees
│   ├── App.tsx                 # Root application controller & keyboard shortcut listener
│   ├── index.css               # Global Tailwind CSS directives & scrollbar utilities
│   └── main.tsx                # DOM mount entry point
├── index.html                  # HTML entry template with metadata & fonts
├── package.json                # Project dependencies, metadata & scripts
├── tsconfig.json               # TypeScript compiler configuration
├── vite.config.ts              # Vite 8 configuration with Tailwind plugin
└── LICENSE                     # MIT Open Source License
```

---

## 📚 Academic Citation & Educational Use

If you use **DogmaDesk** in coursework, teaching, or research, cite the version you used. The repository's [`CITATION.cff`](CITATION.cff) file provides the current software citation metadata. After a versioned release is archived with Zenodo, add its DOI here so citations can resolve to a permanent release.

---

## 🤝 Contributing

Contributions from the bioinformatics, computational biology, and open-source software communities are warmly welcomed!

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/NewDatabaseRecord`).
3. Commit your Changes (`git commit -m 'Add AlphaGenome to Specialized tier'`).
4. Push to the Branch (`git push origin feature/NewDatabaseRecord`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with ❤️ for the global bioinformatics and computational biology community.</sub>
</div>
