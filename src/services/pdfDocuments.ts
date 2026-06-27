export interface DocPage {
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

export const documentsData: Record<string, DocPage[]> = {
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
            "We assert that any attempt by states to levy taxes on the 'unrealized' appreciation of Bitcoin, or on the mere act of holding or moving keys across borders, is an illegitimate administrative overreach [2]. The state does not provide security, courts, or clearing mechanisms for the Bitcoin network; it is completely self-secured by global Proof-of-Work energy physics.",
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
