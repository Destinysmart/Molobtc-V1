import React, { useState, useMemo } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  Maximize2, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Printer, 
  FileText,
  Sparkles,
  RotateCcw
} from "lucide-react";

interface PdfPreviewCanvasProps {
  repoId: string;
  repoName: string;
  onDownload: () => void;
}

interface DocPage {
  header?: string;
  title?: string;
  subtitle?: string;
  authors?: string;
  institution?: string;
  abstractTitle?: string;
  abstract?: string;
  sections: {
    heading?: string;
    paragraphs: string[];
  }[];
  footnotes?: string[];
}

export function PdfPreviewCanvas({ repoId, repoName, onDownload }: PdfPreviewCanvasProps) {
  const [page, setPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1.0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Deeply structured content mimicking real academic papers from the MoloBTC Research Lab
  const documents: Record<string, DocPage[]> = {
    "bitcoin-self-custody-sovereign-infrastructure": [
      {
        header: "BSRF POLICY SERIES — TIER 1 FOUNDATIONAL REPORT (JUNE 2026)",
        title: "Bitcoin Self-Custody as Sovereign Monetary Infrastructure",
        subtitle: "Historical Patterns, Risk Principles, and Organizational Implementation",
        authors: "Jabulani Jakes (Research Director) & Grok (xAI Core Engine)",
        institution: "MoloBTC-Org Sovereign Research Division",
        abstractTitle: "EXECUTIVE SUMMARY & ABSTRACT",
        abstract: "This policy whitepaper synthesizes three essential layers of organizational sovereign security: historical patterns of state-level monetary debasement, a modern risk-mitigation framework aligned with industrial control system standard ISA/IEC 62443 (Zones & Conduits), and practical decentralized implementation protocols. We argue that direct self-custody is not an IT infrastructure option, but a primary fiduciary responsibility for long-term capital preservation in the digital era.",
        sections: [
          {
            heading: "I. INTRODUCTION & MONETARY HEGEMONY",
            paragraphs: [
              "Throughout monetary history, the centralization of capital has served as the ultimate mechanism for administrative surveillance and systemic wealth debasement [1]. Traditional financial institutions operate as state-licensed intermediaries, subject to arbitrary capital controls, account freezing, and asset inflation. The invention of Bitcoin introduces a fundamental thermodynamic rupture in this historical cycle.",
              "As a pure digital bearer asset secured by Proof-of-Work energy physics, Bitcoin allows organizations to bypass third-party intermediary risks entirely. However, realizing this sovereign capability requires an architectural transition from centralized reliance to enterprise self-custody protocols [2]. This report details the theoretical and practical pathways for such an implementation."
            ]
          }
        ],
        footnotes: [
          "1. Cf. Menger, C. (1871). Principles of Economics. Austrian School foundation of organic currency emergence.",
          "2. Standard ISA/IEC 62443 regulates industrial security zones to prevent single points of administrative failure."
        ]
      },
      {
        header: "BSRF POLICY SERIES — TIER 1 FOUNDATIONAL REPORT (JUNE 2026)",
        sections: [
          {
            heading: "II. RISK ANALYSIS & ZONES AND CONDUITS (ISA/IEC 62443)",
            paragraphs: [
              "To safely manage corporate cryptographic reserves, organizations must treat digital key management with the same rigor applied to critical physical infrastructure [3]. We apply the ISA/IEC 62443 security framework to establish 'Zones' (security boundaries where keys reside) and 'Conduits' (secure channels through which signed data streams).",
              "1. Zone 0 (The Mind/Entropy): The initial seed generation or mental mnemonic storage. This zone is fully air-gapped, never exposed to digital processors or networks. It represents pure, high-entropy mathematical knowledge.",
              "2. Zone 1 (Offline Signing Engine): Non-networked, dedicated hardware micro-controllers or air-gapped computers running open-source software. This zone only imports unsigned transactions and outputs signed bytecodes via physical QR codes or physical hardware cards.",
              "3. Zone 2 (Sovereign Node Gateway): A self-hosted local full node that validates and broadcasts transactions. Routing through third-party APIs compromises privacy and exposes the organization to censorship and metadata blacklisting [4]."
            ]
          }
        ],
        footnotes: [
          "3. Industrial security standards mandate that no electronic interface should bridge air-gapped operational assets directly.",
          "4. Third-party node providers frequently collect transactional IP metadata, which can be shared with regulatory trackers."
        ]
      },
      {
        header: "BSRF POLICY SERIES — TIER 1 FOUNDATIONAL REPORT (JUNE 2026)",
        sections: [
          {
            heading: "III. IMPLEMENTATION STEPS & RECOMMENDATIONS",
            paragraphs: [
              "To implement a multi-signature framework (e.g., 2-of-3 or 3-of-5 setups), the organization should distribute physical signing keys across distinct geographical boundaries and separate corporate roles [5]. Keyholders must undergo structured training to ensure resilience against coercion or accidental key destruction.",
              "The permanent non-assertion covenant under the Bitcoin Sovereign Software License (BSSL) prevents corporate patent-trolling from hijacking these open protocols. We recommend that organizations mandate BSSL-licensed software for all custody operations to ensure permanent, open-access compute rights.",
              "Finally, we conclude that holding private key knowledge constitutes retaining a mathematical truth—an internal mental state. Because human consciousness is protected under natural law, administrative attempts to force key disclosure are fundamentally unconstitutional."
            ]
          }
        ],
        footnotes: [
          "5. Geographic distribution of multisig keyholders prevents localized physical co-optation and natural disaster losses."
        ]
      }
    ],
    "bitcoin-adjacent-currency-international-law": [
      {
        header: "BSRF FOUNDATIONAL PAPERS — COGNITIVE JURISPRUDENCE SERIES",
        title: "Bitcoin as Adjacent Currency Under International Law",
        subtitle: "The Legal Case for Sui Generis Bearer Property and Tax Realization Principles",
        authors: "Jabulani Jakes, LLM (Sovereignty Jurisprudence) & MoloBTC Legal Taskforce",
        institution: "MoloBTC-Org Institute of Digital Law and Austrian Economics",
        abstractTitle: "LEGAL HYPOTHESIS & STATEMENT",
        abstract: "This paper establishes the international legal status of self-custodied Bitcoin as an adjacent currency operating in the borderless protocol and energy commons. Because Bitcoin exists purely as mathematical knowledge held within the human mind, it cannot be subject to physical location-based taxation or asset levies. We argue that states must limit taxing authority strictly to local, realized economic events, while exempting holding, transmission, and thermodynamic transport from capital controls.",
        sections: [
          {
            heading: "I. THE NATURE OF MIND-RESIDENT ASSETS",
            paragraphs: [
              "Traditional jurisprudence relies on the physical location (lex situs) of an asset to determine jurisdiction and tax authority. However, Bitcoin is a digital representation of ledger state controlled by private keys [1]. Since a private key can be memorized (a brain wallet) or reconstructed from raw mental entropy, the asset resides within human consciousness itself.",
              "Under established human rights conventions, human thoughts, memory, and internal calculations are absolutely private and inviolable. Forcing an individual or an entity to disclose mental entropy (seed phrases) is a direct violation of the right against self-incrimination and the sanctity of mind. Therefore, physical asset seizure rules are fundamentally incompatible with Bitcoin custody."
            ]
          }
        ],
        footnotes: [
          "1. Cryptographic keys are large prime numbers. There is no physical locus of a number; it exists in the realm of logic and mind."
        ]
      },
      {
        header: "BSRF FOUNDATIONAL PAPERS — COGNITIVE JURISPRUDENCE SERIES",
        sections: [
          {
            heading: "II. REALIZATION-BASED TAXATION VS. PROPERTY LEVIES",
            paragraphs: [
              "We assert that any attempt by states to levy taxes on the 'unrealized' appreciation of Bitcoin, or on the mere act of holding or moving keys across borders, is an illegitimate administrative overreach [2]. The state does not provide security, courts, or clearing mechanisms for the Bitcoin network; it is completely self-secured by globalProof-of-Work energy physics.",
              "To align with natural law and economic efficiency, taxation must be restricted to real-world realization events within the local territory. A realization event is defined as the voluntary conversion of Bitcoin into sovereign fiat currency, or the direct exchange of Bitcoin for localized physical property. Mere mathematical transport (moving UTXOs to new addresses) is a tax-free mental exercise."
            ]
          }
        ],
        footnotes: [
          "2. Taxing unrealized gains on a mental asset requires continuous invasive surveillance of private mathematical files."
        ]
      }
    ],
    "bitcoin-self-custody-research-ecosystem": [
      {
        header: "BSRF MANAGEMENT INDEX — READING GUIDE (JUNE 2026)",
        title: "Bitcoin Self-Custody Research Ecosystem",
        subtitle: "Tier 2 - Executive Overview & Reading Guide for Boards and Treasury Officers",
        authors: "Jacques Strydom, PMP (Project Owner & Creator) & MoloBTC Executive Committee",
        institution: "MoloBTC-Org Board of Governance",
        abstractTitle: "DOCUMENT SCOPE",
        abstract: "This document serves as the official structural guide and gateway to the Tier 2 operational research database. It details tailored reading paths for board members, treasury officers, and technical security teams to align competencies and establish rigorous organizational custody policies. It connects centralized monetary history with the operational frameworks required for resilient enterprise-grade implementation.",
        sections: [
          {
            heading: "I. THE THREE TIER 2 SYSTEMIC MODULES",
            paragraphs: [
              "To facilitate rapid institutional onboarding, the MoloBTC research ecosystem is divided into three comprehensive sub-modules [1]. Each module targets a specific organizational layer:",
              "1. MODULE A (Centralized Monetary Governance): Synthesizes 5,000 years of monetary history, outlining the predictable cycle of fiat debasement, state-led capture of banking systems, and the subsequent need for physical bearer-asset protection.",
              "2. MODULE B (Organizational Risk-Mitigation Framework): An operational checklist analyzing corporate vulnerability. It details counterparty risk matrices, custodian insolvency risk, and mitigation protocols utilizing multisig systems.",
              "3. MODULE C (Critical Monetary Infrastructure): A technical, hands-on playbook outlining how to configure hardware micro-controllers, deploy self-hosted full nodes, and verify mathematical transactions safely."
            ]
          }
        ],
        footnotes: [
          "1. Detailed reading paths are designed to minimize corporate onboarding friction while maintaining strict technical compliance."
        ]
      }
    ],
    "capital-flow-regulations-objection-template": [
      {
        header: "BSRF ADVOCACY & POLICY TEMPLATES (JUNE 2026)",
        title: "Objection & Submission Template: Draft Capital Flow Regulations",
        subtitle: "A Model Submission Rejecting Proposed Regulatory Seizure of Digital Bearer Assets",
        authors: "MoloBTC Public Policy Taskforce & Legal Counsel",
        institution: "MoloBTC-Org Policy Advocacy Initiative",
        abstractTitle: "PURPOSE OF TEMPLATE",
        abstract: "This formal document acts as a template for public and judicial submissions addressing South Africa's Draft Capital Flow Management Regulations 2026. It leverages constitutional property protections, privacy of mind, and the right to private compute to argue against administrative restrictions on digital bearer assets, offering model legislative draft text to protect sovereign self-custody and node operators.",
        sections: [
          {
            heading: "I. STATUTORY GROUNDS OF OBJECTION",
            paragraphs: [
              "We submit this formal objection to Section 12 of the Draft Capital Flow Management Regulations 2026 [1]. The proposed administrative blockades and registration mandates on outbound cryptographic transfers represent an unconstitutional seizure of private citizen assets.",
              "Specifically, the regulations fail to recognize that Bitcoin represents direct, self-secured mathematical property. Unlike outbound bank wires, which rely on state-licensed clearing corridors (such as SWIFT), Bitcoin transmission is simply the broadcast of mathematical formulas to a global open ledger. Compelling node operators to block addresses constitutes an illegal, unworkable restriction on mathematical speech."
            ]
          }
        ],
        footnotes: [
          "1. Draft Capital Flow Regulations (South Africa National Gazette, No. 49122, March 2026)."
        ]
      },
      {
        header: "BSRF ADVOCACY & POLICY TEMPLATES (JUNE 2026)",
        sections: [
          {
            heading: "II. ALTERNATIVE LEGISLATIVE MODEL DRAFT",
            paragraphs: [
              "In place of restrictive, non-enforceable capital blockades, we propose the 'Adjacent Currency Recognition Framework'. This model legislation acknowledges Bitcoin as a parallel utility ledger and digital bearer asset:",
              "- Exclusion of Node Operators: Node operators shall not be classified as financial intermediaries or money transmitters.",
              "- Safe Harbor for Private Keys: No administrative body shall compel any private individual to surrender or register their private keys or seed phrases.",
              "- Simplified Territorial Tax: Realized capital gains on digital bearer assets shall be taxed strictly upon fiat conversion, with a basic tax-exempt threshold for micro-payments to stimulate local economic trade."
            ]
          }
        ],
        footnotes: [
          "2. See constitutional guarantees of private computational expression and physical search exemptions."
        ]
      }
    ],
    "bitcoin-as-sui-generis-bearer-property": [
      {
        header: "BSRF PHILOSOPHICAL SERIES — MONETARY NATURAL LAW",
        title: "Bitcoin as Sui Generis Bearer Property",
        subtitle: "The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin",
        authors: "Jabulani Jakes & Austrian Economics Scholar Assembly",
        institution: "MoloBTC-Org Institute of Economic Philosophy",
        abstractTitle: "THE CORE PHILOSOPHICAL ABSTRACT",
        abstract: "This paper outlines the deductive natural-law argument that self-custodied Bitcoin is a unique category of digital bearer property. Created through Proof-of-Work energy homesteading, Bitcoin requires no government privileges, corporate backing, or public registries to exist or operate safely. Consequently, any state-levied holding taxes or movement tolls on private key calculations represent a fundamental infringement on human self-ownership and the right to private calculation.",
        sections: [
          {
            heading: "I. PROOF-OF-WORK AS THERMODYNAMIC HOMESTEADING",
            paragraphs: [
              "John Locke's classical theory of property states that individuals acquire legitimate ownership over unowned resources by mixing their physical labor with the natural commons [1]. In the digital sphere, the creation of Bitcoin blocks requires miners to mix thermodynamic energy (computational electricity) with the mathematical rules of the consensus protocol.",
              "This Proof-of-Work energy expenditure represents genuine digital homesteading. The resulting UTXOs (Unspent Transaction Outputs) are the physical manifestations of expended energy—unrelated to state privileges or financial licenses. Because this property arises entirely outside state-backed systems, its existence is intrinsically sovereign."
            ]
          }
        ],
        footnotes: [
          "1. Locke, J. (1689). Second Treatise of Government. Natural law foundations of property rights."
        ]
      }
    ],
    "bitcoin-sovereignty-core-principles": [
      {
        header: "BSRF FOUNDATIONAL CONSTITUTION — MANDATE V1.0 (JUNE 2026)",
        title: "Bitcoin Sovereignty Core Principles",
        subtitle: "The Nine Pillars of the Bitcoin Sovereignty Research Framework (BSRF)",
        authors: "MoloBTC-Org Governing Council & Sovereign Developers League",
        institution: "MoloBTC-Org Authoritative Assembly",
        abstractTitle: "THE SOVEREIGNTY CONSTITUTION",
        abstract: "This foundational document presents the nine non-negotiable pillars of Bitcoin sovereignty. It defines the absolute right of individuals and organizations to run open-source software, self-custody cryptographic reserves, protect key knowledge, reject administrative blacklists, and utilize Proof-of-Work consensus as the only physical consensus mechanism capable of resisting corporate and bureaucratic capture.",
        sections: [
          {
            heading: "THE NINE PILLARS OF SOVEREIGNTY",
            paragraphs: [
              "Pillar 1: Sui Generis Bearer Property. Bitcoin is an absolute, issuer-free, self-secured bearer asset with zero counterparty risk.",
              "Pillar 2: Adjacent Currency Recognition. Bitcoin operates as a sovereign parallel currency inside the global thermodynamic commons, independent of fiat systems.",
              "Pillar 3: Right to Sovereign Private Compute. The absolute, unregulatable right of individuals to run open-source software, including Bitcoin full nodes, on private hardware.",
              "Pillar 4: Self-Custody as the Highest Standard. Personal and corporate custody must be direct, independent of intermediaries, and geographically distributed."
            ]
          }
        ],
        footnotes: [
          "1. Ratified by the MoloBTC Research Council in June 2026. This constitution forms the basis of all legal and public advocacy work."
        ]
      },
      {
        header: "BSRF FOUNDATIONAL CONSTITUTION — MANDATE V1.0 (JUNE 2026)",
        sections: [
          {
            heading: "THE NINE PILLARS (CONTINUED)",
            paragraphs: [
              "Pillar 5: No Compelled Key/Seed Disclosure. Absolute protection of private mental mnemonic words. Forcing disclosure of mathematical memory is a direct violation of cognitive liberty.",
              "Pillar 6: Realization-Based Taxation with Territorial Nexus. Taxation must be strictly restricted to conversion-into-fiat events, leaving holding, transport, and movement fully tax-exempt.",
              "Pillar 7: Absolute Freedom of Transaction. Complete rejection of protocol-level or application-level address blacklists or censorship compliance.",
              "Pillar 8: Thermodynamic Consensus Security. Proof-of-Work as the only consensus mechanism anchored in physical reality, preventing capture by administrative fiat.",
              "Pillar 9: No Issuer-Dependence. Separation of Bitcoin from debt-based central tokens or corporate utility coins."
            ]
          }
        ],
        footnotes: [
          "2. Protecting these nine pillars is critical to preserving human transaction rights across the continent and beyond."
        ]
      }
    ]
  };

  const currentDoc = documents[repoId] || documents["bitcoin-self-custody-sovereign-infrastructure"];
  const totalPages = currentDoc.length;
  const currentPageContent = currentDoc[page - 1] || currentDoc[0];

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleZoomIn = () => {
    if (zoom < 1.6) setZoom(prev => Math.min(prev + 0.1, 1.6));
  };

  const handleZoomOut = () => {
    if (zoom > 0.7) setZoom(prev => Math.max(prev - 0.1, 0.7));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  // Inline search text highlight logic
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-amber-200 text-black px-0.5 rounded-xs font-serif font-semibold">{part}</mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div id="pdf-interactive-viewer" className="flex flex-col bg-gray-150 border border-gray-200 rounded-2xl overflow-hidden shadow-xs w-full h-[580px] font-sans">
      {/* Top Bar / Acrobat-style controls */}
      <div className="bg-gray-900 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 shadow-sm shrink-0 select-none">
        
        {/* Left: Doc Name */}
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="text-[11px] sm:text-xs font-mono font-medium tracking-wide text-gray-300 max-w-[150px] sm:max-w-[240px] truncate">
            {repoId}_v1.pdf
          </span>
        </div>

        {/* Center: Page Navigation & Zoom */}
        <div className="flex items-center gap-4 sm:gap-6 mx-auto">
          {/* Pagination */}
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`p-1 rounded-md hover:bg-gray-800 transition-colors cursor-pointer ${page === 1 ? 'opacity-40 pointer-events-none' : 'text-gray-300 hover:text-white'}`}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-gray-300 font-bold min-w-[64px] text-center bg-gray-950 px-2 py-0.5 rounded-md border border-gray-800">
              Page {page} / {totalPages}
            </span>
            <button 
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`p-1 rounded-md hover:bg-gray-800 transition-colors cursor-pointer ${page === totalPages ? 'opacity-40 pointer-events-none' : 'text-gray-300 hover:text-white'}`}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-gray-950 px-2 py-0.5 rounded-lg border border-gray-800">
            <button 
              onClick={handleZoomOut}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-gray-300 min-w-[38px] text-center font-semibold">
              {Math.round(zoom * 100)}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {zoom !== 1.0 && (
              <button 
                onClick={handleResetZoom}
                className="p-1 text-brand-400 hover:text-brand-300 hover:bg-gray-800 rounded-md transition-colors cursor-pointer border-l border-gray-800 ml-0.5 pl-1.5"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative hidden md:block">
            <input 
              type="text"
              placeholder="Search in PDF..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-950 text-white border border-gray-800 rounded-lg pl-8 pr-3 py-1 text-xs w-36 focus:outline-none focus:border-brand-500 placeholder-gray-500 transition-all font-sans"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <button 
            onClick={onDownload}
            className="text-xs bg-brand-500 hover:bg-brand-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
            title="Download Sovereign PDF Compilation"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Download</span>
          </button>
        </div>
      </div>

      {/* PDF Viewport Area */}
      <div className="flex-1 overflow-auto bg-gray-800 p-4 sm:p-6 flex justify-center items-start scroll-smooth relative">
        {/* Floating Search overlay for mobile */}
        <div className="md:hidden absolute top-2 right-4 z-20 bg-gray-900 border border-gray-700 p-1 rounded-lg flex items-center gap-1.5 shadow-lg max-w-[150px] sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 ml-1.5 shrink-0" />
          <input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-white text-xs py-0.5 focus:outline-none placeholder-gray-500 w-20 sm:w-28 font-sans"
          />
        </div>

        {/* Paper Sheet container */}
        <div 
          className="bg-[#FDFDFD] border border-gray-300 shadow-2xl rounded-sm p-8 sm:p-14 text-gray-900 relative transition-all duration-300 origin-top flex flex-col justify-between"
          style={{ 
            width: "100%",
            maxWidth: "680px",
            minHeight: "820px",
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            marginBottom: `${(zoom - 1.0) > 0 ? (zoom - 1.0) * 820 : 10}px` // Handle bottom margin on zoom scaling
          }}
        >
          {/* Running header */}
          {currentPageContent.header && (
            <div className="border-b border-gray-200 pb-1.5 mb-8 flex justify-between items-center text-[9px] font-mono tracking-widest text-gray-400 select-none">
              <span>{currentPageContent.header}</span>
              <span>CLASSIFIED NO: BSRF-M-{repoId.slice(0,4).toUpperCase()}</span>
            </div>
          )}

          {/* First Page Metadata */}
          {page === 1 && (
            <div className="text-center mb-8">
              {currentPageContent.title && (
                <h1 className="font-serif text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 leading-tight mb-2">
                  {highlightText(currentPageContent.title, searchQuery)}
                </h1>
              )}
              {currentPageContent.subtitle && (
                <p className="font-serif italic text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed mb-4">
                  {highlightText(currentPageContent.subtitle, searchQuery)}
                </p>
              )}
              <div className="w-16 h-0.5 bg-brand-500 mx-auto mb-4" />
              {currentPageContent.authors && (
                <p className="text-[10px] font-mono tracking-wider text-gray-700 uppercase mb-0.5 font-bold">
                  {currentPageContent.authors}
                </p>
              )}
              {currentPageContent.institution && (
                <p className="text-[9px] font-mono tracking-wide text-gray-400 uppercase select-none">
                  {currentPageContent.institution}
                </p>
              )}
            </div>
          )}

          {/* Abstract callout */}
          {page === 1 && currentPageContent.abstract && (
            <div className="bg-gray-50 border-l-2 border-brand-500 px-5 py-4 rounded-r-md mb-8 select-text">
              <h4 className="text-[10px] font-mono font-bold tracking-widest uppercase text-brand-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-brand-500" />
                {currentPageContent.abstractTitle || "ABSTRACT"}
              </h4>
              <p className="font-serif text-xs leading-relaxed text-gray-700 italic text-justify">
                {highlightText(currentPageContent.abstract, searchQuery)}
              </p>
            </div>
          )}

          {/* Core scholarly sections */}
          <div className="flex-1 select-text space-y-6">
            {currentPageContent.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-3">
                {sec.heading && (
                  <h3 className="font-serif text-sm font-bold tracking-wide text-gray-900 uppercase border-b border-gray-100 pb-1">
                    {highlightText(sec.heading, searchQuery)}
                  </h3>
                )}
                {sec.paragraphs.map((para, pIdx) => (
                  <p key={pIdx} className="font-serif text-xs leading-relaxed text-gray-800 text-justify indent-6">
                    {highlightText(para, searchQuery)}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Footnotes line and footnotes */}
          {currentPageContent.footnotes && currentPageContent.footnotes.length > 0 && (
            <div className="border-t border-gray-200 mt-12 pt-4 select-text">
              <div className="text-[9px] font-mono tracking-widest text-gray-400 uppercase mb-2 select-none">
                Footnotes & Citations
              </div>
              <div className="space-y-1.5">
                {currentPageContent.footnotes.map((fn, fIdx) => (
                  <p key={fIdx} className="font-serif text-[10px] leading-relaxed text-gray-500 italic text-justify pl-4 -indent-4">
                    {highlightText(fn, searchQuery)}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Footer of the paper sheet */}
          <div className="mt-8 pt-3 border-t border-gray-100 flex justify-between items-center text-[8px] font-mono text-gray-400 uppercase select-none">
            <span>MoloBTC Sovereign Research Institute</span>
            <span className="font-bold text-gray-600">Page {page} of {totalPages}</span>
            <span>https://github.com/MoloBTC-Org/bsrf</span>
          </div>
        </div>
      </div>
    </div>
  );
}
