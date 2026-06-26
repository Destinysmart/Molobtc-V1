import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Ensure db.json exists with MoloBTC category structures
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify({
      articles: [],
      categories: [
        { id: "c1", name: "Physical Protocol", slug: "physical-protocol" },
        { id: "c2", name: "Scaling & Lightning", slug: "scaling-lightning" },
        { id: "c3", name: "Security & Custody", slug: "security-custody" },
        { id: "c4", name: "Monetary Economics", slug: "monetary-economics" },
      ],
      tags: [],
      users: [
        {
          id: "admin-1",
          role: "admin",
          name: "Molo BTC Lead Researcher",
          avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
        },
        {
          id: "pub-1",
          role: "publisher",
          name: "Molo BTC Open-Source Contributor",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        },
      ],
    }),
  );
}

function getDb() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

function saveDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Seed or update database to hold premium Molo BTC research papers
const dbData = getDb();

// If database empty or still has old generic developer block, refresh with Molo BTC's premier research products
const hasOldSeeds = dbData.articles.some((a: any) => a.id === "a_1" || a.title?.includes("Freelance") || a.title?.includes("Hourly Rate"));
if (dbData.articles.length === 0 || hasOldSeeds) {
  // Overwrite categories to look premium
  dbData.categories = [
    { id: "c1", name: "Physical Protocol", slug: "physical-protocol", desc: "Energy metrics, hashing hardware, and thermodynamics" },
    { id: "c2", name: "Scaling & Lightning", slug: "scaling-lightning", desc: "Off-chain states, routing logic, and payment channels" },
    { id: "c3", name: "Security & Custody", slug: "security-custody", desc: "Entropy equations, multisig designs, and physical storage" },
    { id: "c4", name: "Monetary Economics", slug: "monetary-economics", desc: "Scarcity mathematics, game theory, and adoption vectors" },
  ];

  // Update authors
  dbData.users = [
    {
      id: "admin-1",
      role: "admin",
      name: "Molo BTC Research Lab",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "pub-1",
      role: "publisher",
      name: "GitHub Open-Source Syndicate",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "user_1",
      role: "reader",
      name: "Satoshi Reader",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
      bio: "Bitcoin Core enthusiast & casual researcher of lightning micro-transactions and offline nodes.",
      country: "Ghana",
      lightning_address: "reader@8333.mobi",
      interests: ["Scaling & Lightning", "Monetary Economics"],
      preference: "ELI5_Beginner"
    },
  ];

  // Seed actual research collections
  dbData.articles = [
    {
      id: "res_pow_physics",
      title: "Thermodynamic Scarcity: The Physics of Proof-of-Work",
      subtitle: "Connecting digital security to raw physical thermodynamics. An ELI5 breakdown of how hashing math coordinates absolute scarcity.",
      featured_image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=2669&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c1",
      status: "published",
      abstract: "This paper analyzes the intrinsic relationship between energy expenditures and digital ledger consensus. By requiring miners to perform millions of trillions of physical guesses (hashes) to generate blocks, Bitcoin links its digital ledger directly to real-world physics. We break down the mechanics of the ASICs, hash rates, and why physical hashes prove a record's authenticity, making digital ledger alteration physically impossible.",
      github_repo: "https://github.com/molobtc/thermodynamic-scarcity",
      download_file: "MoloBTC_Research_Thermodynamic_Scarcity.pdf",
      reading_time: "8 min read",
      content: `
        <p>Bitcoin is often described as purely digital, but its core security mechanism, <strong>Proof-of-Work (PoW)</strong>, is rooted entirely in physical reality and the laws of thermodynamics.</p>
        
        <h2>1. The thermodynamic anchor</h2>
        <p>In conventional database systems, data can be rewritten or modified instantly because there is no link between computation and physical physical work. Bitcoin binds its ledger's past history to real-world energy consumption.</p>
        <p>To write a block of transactions to the blockchain, a computer (or miner) must find a cryptographic solution below a certain target value. This can only be done through raw trial-and-error—solving mathematical puzzle billions of times per second (hashing). This process requires hardware and electricity.</p>
        
        <h2>2. Why this protects transactions</h2>
        <p>Because every block represents millions of dollars of spent electricity, any attacker wishing to rewrite previous transactions must re-spend the same enormous amount of electricity to create a heavier competing chain. The Laws of Physics, rather than banks or governments, protect the network from tampering.</p>
        
        <div class="glass-card p-6 my-6 border border-brand-100 rounded-2xl bg-brand-50/50">
          <h4 class="font-bold text-gray-900 mb-2">💡 Under the Hood Analogy</h4>
          <p class="text-sm text-gray-700 m-0">Think of a gold coin. It has value because finding and mining gold requires intense physical work. Proof-of-Work is like a digital machine that melts real-world electricity and molds it directly into digital security. You cannot fake a hash, just like you cannot fake a block of gold.</p>
        </div>

        <h2>3. Solving the Byzantine Generals Problem</h2>
        <p>The energy cost is not a waste—it is the single mechanism that allows completely anonymous, untrusteding strangers to agree on a single ledger of account without needing a centralized third-party referee.</p>
      `,
      published_at: new Date(Date.now() - 50000000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "res_lightning_scale",
      title: "State Channels: Scaling Bitcoin Instantly Over Lightning",
      subtitle: "How off-chain peer locked boxes allow instant payment exchanges at the speed of light, while retaining raw on-chain security parameters.",
      featured_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c2",
      status: "published",
      abstract: "The Lightning Network is Bitcoin's primary Layer-2 protocol. This work explains how two peers can open a cryptographic 'state channel' by locking funds on the main network, then instantly route unlimited micro-payments offline. Transactions are verified in milliseconds by exchanging physical cryptographically signed updates, bypassing block congestion altogether.",
      github_repo: "https://github.com/molobtc/state-channels",
      download_file: "MoloBTC_Lightning_State_Channels_Guide.pdf",
      reading_time: "6 min read",
      content: `
        <p>The core Bitcoin protocol handles roughly 7 transactions per second due to block density limits. To scale Bitcoin to billions of global users as active money, we use the <strong>Lightning Network</strong>.</p>
        
        <h2>1. The bilateral ledger concept</h2>
        <p>Imagine Alice and Bob buy coffee from each other daily. Writing every coffee cup onto the physical main blockchain (fees, wait times) is highly inefficient. Instead, they write their starting cash on a piece of paper, place it in a lockbox, and edit the tab privately. Only when they are done, they write the final totals to the chain.</p>
        <p>This is a <strong>payment channel</strong>. Because drafts are cryptographically secure and signed using private keys, either peer can claim their correct share on-chain at any time if the other tries to cheat.</p>
        
        <h2>2. Routing via HTLCs</h2>
        <p>The real power comes when channels link together. If Alice has a channel with Bob, and Bob has a channel with Charlie, Alice can pay Charlie instantly through Bob using <strong>Hash Time-Locked Contracts (HTLCs)</strong>. Bob acts as an automatic, zero-trust router, earning a tiny fee (Sats) for passing the pay packet.</p>

        <div class="glass-card p-6 my-6 border border-brand-100 rounded-2xl bg-brand-50/50">
          <h4 class="font-bold text-gray-900 mb-2">⚡ The Speed of Light</h4>
          <p class="text-sm text-gray-700 m-0">By moving payments off the main blockchain, Lightning allows instant, high-frequency micropayments. It converts Bitcoin from an expensive, slow settlement asset into a highly liquid currency suitable for physical vending machines, internet API paywalls, and streaming money.</p>
        </div>
      `,
      published_at: new Date(Date.now() - 100000000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "res_entropy_custody",
      title: "The Math of Entropy: Why True Self-Custody is Unbreakable",
      subtitle: "A deep mathematical look into random entropy, personal key security, and why guessing a 12-word seed phrase is physically impossible.",
      featured_image: "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=2670&auto=format&fit=crop",
      author_id: "admin-1",
      category_id: "c3",
      status: "published",
      abstract: "Self-custody of Bitcoin gives individuals complete sovereignty, but understanding why it is secure requires looking at probability math. This paper explores the concept of cryptographic entropy—specifically, the 256 bits of randomness that constitute a private key. We prove why searching for a key is functionally impossible, even using all solar system computation.",
      github_repo: "https://github.com/molobtc/entropy-and-sovereignty",
      download_file: "MoloBTC_Custody_Entropy_Math_Walkthrough.pdf",
      reading_time: "10 min read",
      content: `
        <p>When you hold Bitcoin in your own wallet, you are holding a giant, randomized mathematical secret. This secret is called your <strong>Private Key</strong>, and it is usually represented as a list of 12 or 24 human-readable words.</p>
        
        <h2>1. The scale of 2^256</h2>
        <p>A Bitcoin private key is a number between 1 and 2^256. This number is so large that it is hard for the human brain to comprehend. There are more possible private keys than there are atoms in the observable universe.</p>
        <p>When you generate a new wallet offline (spinning high-entropy randomness), you are effectively choosing a single atom in the universe. If someone wants to steal your Bitcoin by guessing your words, they have to pick that exact same atom on their first try.</p>
        
        <h2>2. Physical constraints of brute forcing</h2>
        <p>Even if a supercomputer could guess billions of keys per second, the energy required to run the computing hardware would boil the Earth's oceans before it had a fraction of a percent chance of guessing your private key. This is why cryptographic self-custody is fundamentally secure against physical force guessing.</p>

        <div class="glass-card p-6 my-6 border border-brand-100 rounded-2xl bg-brand-50/50">
          <h4 class="font-bold text-gray-900 mb-2">🔒 Your Responsibility</h4>
          <p class="text-sm text-gray-700 m-0">Because the math is unbreakable, hackers do not attack the protocol—they attack the human. They try to trick you into typing your seed words on a connected computer, or they phish your backup. True custody means keeping those words physically written down on paper or steel, completely offline.</p>
        </div>
      `,
      published_at: new Date(Date.now() - 150000000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "res_utxo_design",
      title: "UTXO vs Account Models: Why Bitcoin Operates Like Physical Cash",
      subtitle: "Demystifying Unspent Transaction Outputs. Why Bitcoin does not have 'balances', but rather individual cryptographic digital cash bills.",
      featured_image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2787&auto=format&fit=crop",
      author_id: "pub-1",
      category_id: "c4",
      status: "published",
      abstract: "Unlike modern digital banks or Ethereum which use account status ledgers (like checking accounts with a single balance), Bitcoin works strictly like physical cash. It tracks individual bills, known as Unspent Transaction Outputs (UTXOs). We prove why this cash-based design enables extreme parallel processing, superior security, and highly predictable smart contract states.",
      github_repo: "https://github.com/molobtc/utxo-model",
      download_file: "MoloBTC_Architecture_UTXO_vs_Account.pdf",
      reading_time: "7 min read",
      content: `
        <p>To understand Bitcoin transactions, you must unlearn how conventional bank accounts work. Bitcoin does not have a concept of an "account balance" stored anywhere on the database. Instead, it tracks individual digital cash receipts called <strong>UTXOs (Unspent Transaction Outputs)</strong>.</p>
        
        <h2>1. The physical wallet analogy</h2>
        <p>If you have $45 in your physical leather wallet, you do not have a single item that represents exactly "forty-five value". Instead, you might have two $20 bills and one $5 bill. When you buy a $15 item, you give the cashier a $20 bill, and they hand you back a $5 bill in change. Your wallet now contains one $20, and two $5 bills.</p>
        <p>This is exactly how Bitcoin works. Each transaction completely spends existing UTXOs (inputs) and creates brand new UTXOs (outputs): one for the merchant's payment, and one sent back to your own address as 'change'. Your wallet app simply sums up all the UTXOs that your private key has the power to unlock, displaying it as a single 'balance'.</p>
        
        <h2>2. Key benefits of the UTXO design</h2>
        <ul>
          <li><strong>Greater Privacy:</strong> Users can easily receive funds on completely new addresses for every transaction, avoiding exposing their full cache of coin holdings.</li>
          <li><strong>Massive Parallelism:</strong> Multiple transactions can be processed concurrently because they alter disparate UTXO cash outputs rather than vying to overwrite a single account balance space.</li>
          <li><strong>Security:</strong> There are no 'double spends' or weird state bugs where a contract withdraws more money than is in an account, because once a UTXO is spent, it is destroyed forever from the unspent state database.</li>
        </ul>
      `,
      published_at: new Date(Date.now() - 200000000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  saveDb(dbData);
}

// Ensure the homepage content (perspectives, ecosystemTabs, africanLensChapters) is seeded in db.json
const dynamicDb = getDb();
let homepageDirty = false;
if (!dynamicDb.perspectives) {
  dynamicDb.perspectives = {
    inflation: {
      title: "Inflation Guard",
      factLine: "Hedge local currency depreciation",
      stat: "Cedi/Naira/Pula vs BTC limits",
      description: "Unlike fiat systems subject to sudden sovereign supply spikes, Bitcoin strictly caps total supply at 21M, providing an immutable mathematical store of value.",
      highlight: "Nodes: Hard Cap ➔ 21M ➔ Distributed Hash Ledger"
    },
    inclusion: {
      title: "Financial Inclusion",
      factLine: "Open-source global settlement rails",
      stat: "USSD Tipping & Offline Nodes",
      description: "Bypasses geographical banking blockades using peer-to-peer lightning channels and offline USSD interfaces like Machankura, allowing anyone with a generic mobile phone to save and transact value.",
      highlight: "Nodes: USSD Gateway ➔ Lightning Node ➔ Instant Settlement"
    },
    mining: {
      title: "Energy & Mining Monetisation",
      factLine: "Bootstrapping remote mini-grids",
      stat: "Gridless Geothermal / Methane Capture",
      description: "Stranded energy from African waterfalls, gases, and rivers is harvested by flexible modular computing mines who purchase excess load, funding the setup of local mini-grids.",
      highlight: "Nodes: Excess Hydro ➔ Modular Container Miners ➔ Rural Power Grid"
    },
    remittance: {
      title: "Lightning Payments",
      factLine: "Ditching cross-border agency commissions",
      stat: "99% cheaper than legacy wire models",
      description: "Enables instant micro-remittances and trans-African trading over Layer 2 Lightning networks without intermediaries or currency conversion tariffs.",
      highlight: "Nodes: Sender Wallet ➔ Onion Routing Hub ➔ Payee Instantly"
    }
  };
  homepageDirty = true;
}

if (!dynamicDb.ecosystemTabs) {
  dynamicDb.ecosystemTabs = {
    learn: {
      title: "Learn Bitcoin",
      subtitle: "Find educational pathways & resources",
      curatedPaths: [
        { name: "Saylor Academy - CS120 Bitcoin Course", url: "https://www.saylor.org/courses/cs120/", desc: "Free comprehensive computer science overview of Bitcoin architecture and logic." },
        { name: "Mi Primer Bitcoin (My First Bitcoin)", url: "https://miprimerbitcoin.io/", desc: "Open-source diploma curriculum designed for teaching high schools next-generation money." },
        { name: "Baka Academy", url: "https://github.com/molobtc", desc: "Interactive localized community meetups and digital resource guides across sub-Saharan Africa." }
      ]
    },
    build: {
      title: "Build Bitcoin",
      subtitle: "Developer pathways & open-source tools",
      curatedPaths: [
        { name: "Btrust Developer Fellowship", url: "https://btrust.org/", desc: "Mentorship and resources for African engineers seeking to become Bitcoin Core contributors." },
        { name: "Bitcoin Dev Kit (BDK)", url: "https://bitcoindevkit.org/", desc: "Simplified libraries for crafting multi-platform wallets and transaction scripts with ease." },
        { name: "Lightning Dev Kit (LDK)", url: "https://lightningdevkit.org/", desc: "Integrate lightning invoice routing directly inside custom client-side React apps." }
      ]
    },
    mine: {
      title: "Mine Bitcoin",
      subtitle: "Explore modular mining & energy operators",
      curatedPaths: [
        { name: "Gridless Energy Solutions", url: "https://gridless.com/", desc: "Leading the charge of distributed micro-mining grids using stranded hydro energy in East Africa." },
        { name: "Mining Mechanics Simplified Guide", url: "#research-workspace", desc: "Our downloadable handbook detailing hashing hardware, mining pools, and container setups." }
      ]
    },
    use: {
      title: "Use Bitcoin",
      subtitle: "Wallets, lightning tools & interfaces",
      curatedPaths: [
        { name: "Machankura USSD Wallet", url: "https://8333.mobi/", desc: "Send and receive Lightning satoshis using basic GSM feature phones without active internet." },
        { name: "Phoenix Wallet (Self-Custodial)", url: "https://phoenix.acinq.co/", desc: "Easiest zero-configuration custodial-free wallet handling lightning updates on the fly." },
        { name: "Alby Browser Extension", url: "https://getalby.com/", desc: "Direct web-based Lightning authorization for tipping, apps, and decentralized web interactions." }
      ]
    },
    work: {
      title: "Work in Bitcoin",
      subtitle: "Jobs, grants, fellowships & opportunities",
      curatedPaths: [
        { name: "Bitlance", url: "https://bitlance.work", desc: "A peer-to-peer freelancing and work-and-earn platform for Bitcoin and Lightning bounties." },
        { name: "Bitcoin Jobs Global Board", url: "https://bitcoinjobs.co/", desc: "Aggregated engineering, design, marketing, and editorial placements globally and remote." },
        { name: "Superlative Open Source Directory", url: "https://github.com/molobtc", desc: "Discover active bounties, developer fellowships, and localized community internships." }
      ]
    }
  };
  homepageDirty = true;
}

if (!dynamicDb.africanLensChapters) {
  dynamicDb.africanLensChapters = {
    inflation: {
      header: "Bitcoin & Inflation Realities",
      location: "East & West Africa Core Trends",
      stat: "Average 15-30% currency adjustment",
      thesis: "When monetary councils issue double-digit fiat supplies to plug budget shortfalls, citizen purchasing power bleeds into sovereign reserves. Local developers and traders use Bitcoin's immutable 21 million hardcap as an inflation-impermeable safety net."
    },
    savings: {
      header: "Bitcoin Savings Dynamics",
      location: "Sub-Saharan Long-Term Treasury",
      stat: "24/7 Unstoppable Liquid Asset",
      thesis: "Traditional high-interest bank accounts fail to beat inflation and suffer from withdrawal ceilings. By storing capital in self-custody cold storage wallets, ordinary citizens run their own personal treasury systems with absolute sovereignty."
    },
    lightning: {
      header: "Remittance Over Lightning Networks",
      location: "Diaspora Trade Corridor Mapping",
      stat: "Fees slashed from 12% to under < 0.1%",
      thesis: "Western Union/fiat wire fees drain hundreds of millions annually from regional families. Lightning network routing operates natively across borders 24/7/365, settling instantly for fractions of a single satoshi cent."
    },
    energy: {
      header: "Stranded Energy Harvesting",
      location: "Rift Valley Geothermal & Run-of-River Hydro",
      stat: "Unlocking stranded rural potential",
      thesis: "High infrastructure costs prevent remote African regions from connecting to national power grids. Modular Bitcoin mining farms act as instant buyer-of-last-resort for remote hydro-turbines, subsidizing rural setup costs."
    },
    circular: {
      header: "Circular Satoshi Economies",
      location: "Bitcoin Ekasi (SA) & Local Mini-Markets",
      stat: "Closed-loop closed sovereign payments",
      thesis: "By keeping satoshis localized—enabling children, grocers, and micro-vendors to accept and spend lightning tips directly—local communities completely bypass high transaction taxes and centralized card tariffs."
    },
    momo: {
      header: "Mobile Money vs Bitcoin Interoperability",
      location: "USSD Tectonic Bridges",
      stat: "Bridging 500M+ active Momo accounts",
      thesis: "Mobile money (M-Pesa, MTN Mobile) is incredibly accessible but suffers from closed geographical boundaries. USSD-powered lightning bridges allow local mobile money providers to interact globally with the Bitcoin ledger."
    }
  };
  homepageDirty = true;
}

if (homepageDirty) {
  saveDb(dynamicDb);
}

async function startServer() {
  const app = express();

  // Increase payload limit for base64 image uploads in tiptap
  app.use(express.json({ limit: "50mb" }));

  // API Routes

  // Root configuration editor endpoints
  app.get("/api/homepage/data", (req, res) => {
    const db = getDb();
    res.json({
      perspectives: db.perspectives || {},
      ecosystemTabs: db.ecosystemTabs || {},
      africanLensChapters: db.africanLensChapters || {},
    });
  });

  app.post("/api/homepage/data", (req, res) => {
    try {
      const db = getDb();
      const { perspectives, ecosystemTabs, africanLensChapters } = req.body;
      if (perspectives) db.perspectives = perspectives;
      if (ecosystemTabs) db.ecosystemTabs = ecosystemTabs;
      if (africanLensChapters) db.africanLensChapters = africanLensChapters;
      saveDb(db);
      res.json({ success: true, message: "Homepage section data updated successfully!" });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Failed to update homepage content database." });
    }
  });

  // Cache for GitHub repository metrics
  const bsrfStatsCache = {
    stars: 0,
    forks: 0,
    lastFetched: 0
  };

  // AI Gemini Explorer Assistant route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { prompt, topic } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY is not configured on the server. Please define this secret in the Settings panel." 
         });
      }

      const client = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let systemInstruction = `You are a helpful AI assistant. You are "Molo AI Explorer", the custom intelligent Bitcoin tutor built for the Molo BTC Research Workspace.
Your absolute goal is to break down complex Bitcoin protocol mechanisms, mathematics, physical game theory, and economics into incredibly beginner-friendly terms.
Use friendly, engaging analogies (such as physical checks, physical gold mining, global highway networks, mailboxes, and ledger catalogs).
Never use dry, impenetrable financial or cryptographic jargon unless you immediately explain it with an "ELI5" (Explain Like I'm 5) example!
Keep your structure clean, using distinct markdown headers, bullet points, and highlight blocks.
Always maintain a helpful, encouraging, and highly educational tone.
If the user asks an unrelated query, gently remind them that your specialty is demystifying the Bitcoin system and steer the focus back to Bitcoin!

CRITICAL CONTEXT - Study the GitHub repository and real-world research of the Bitcoin Sovereignty Research Framework (BSRF) published by MoloBTC-Org:
Here is the core technical documentation, research papers, and core philosophies upon which you must base your custom analysis and answers:

1. THE NINE PILLARS OF BITCOIN SOVEREIGNTY:
- Pillar 1: Sui Generis Bearer Property - Bitcoin is an absolute, issuer-free, self-secured digital bearer asset with no counterparty risk.
- Pillar 2: Adjacent Currency Recognition - Bitcoin operates as a sovereign parallel currency inside the global protocol and thermodynamic commons, independent of fiat systems.
- Pillar 3: Right to Sovereign Private Compute - The absolute right of individuals and companies to run open-source software, including Bitcoin full nodes, on their private hardware.
- Pillar 4: Self-Custody as the Highest Standard - Fiduciary and personal custody must be direct, independent of intermediaries, air-gapped, and robustly designed.
- Pillar 5: No Compelled Key/Seed Disclosure - Absolute protection of private seed phrases and mental entropy. Forcing disclosure of math/knowledge violates the sanctity of human consciousness.
- Pillar 6: Realization-Based Taxation with Territorial Nexus - Capital taxation is strictly limited to local fiat realization events; holding, moving, or mathematical transport must remain tax-exempt.
- Pillar 7: Absolute Freedom of Transaction - Rejection of administrative protocol-level blacklist/address censorship compliance.
- Pillar 8: Thermodynamic Consensus Security - Pure, physical Proof-of-Work as the only unmanipulatable security consensus mechanism, protecting against bureaucratic Capture.
- Pillar 9: No Issuer-Dependence - Separation of Bitcoin from centralized, debt-based utility tokens or CBDCs.

2. BITCOIN SELF-CUSTODY AS SOVEREIGN MONETARY INFRASTRUCTURE (Tier 1 & Tier 2):
- Applying the industrial security standards (ISA/IEC 62443 Zones & Conduits) to Bitcoin key management.
- Multi-signature setups (e.g. 2-of-3 or 3-of-5) distributed across geographic boundaries.
- Dedicated air-gapped hardware/micro-controllers for offline transaction signing, and transaction broadcast routing through dedicated self-hosted full nodes.

3. BITCOIN AS ADJACENT CURRENCY UNDER INTERNATIONAL LAW:
- Case for separate local realization taxation, tax-free treatment of holding/unrealized gains, and international double-tax coordination protocols to prevent rights-violating blockades.

4. OBJECTION AND COMMENT TEMPLATES FOR LOCAL REGULATIONS (e.g., South Africa Draft Capital Flow Regulations 2026):
- Practical legal frameworks arguing that administrative capital control restrictions on digital bearer assets violate constitutional property rights and private calculations.

5. BITCOIN AS SUI GENERIS BEARER PROPERTY:
- Natural-law and Austrian economics analysis of digital energy homesteading. Holding private key knowledge is merely retaining memory, which cannot be subject to physical asset holding levies.

Use these insights to answer any requests with maximum expertise. Be the definitive MoloBTC-Org AI guide.`;

      if (topic) {
        systemInstruction += `\nCurrently, the user is exploring the specific research paper/topic/repository: "${topic}". Frame your responses to build off on or explain details related to this topic or repository when helpful, but directly answer their question.`;
      }

      const result = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: result.text || "I was unable to formulate a response. Please try again!" });
    } catch (e: any) {
      console.error("Gemini API Error in Workspace Server:", e);
      res.status(500).json({ error: e.message || "Failed to process AI explanation" });
    }
  });

  // Dynamic GitHub Repos listing with live sync from GitHub API and fallback cache
  app.get("/api/github/repos", async (req, res) => {
    try {
      // Fetch live statistics if stale (more than 2 minutes)
      const now = Date.now();
      if (now - bsrfStatsCache.lastFetched > 2 * 60 * 1000) {
        try {
          const fetchRes = await fetch("https://api.github.com/repos/MoloBTC-Org/bsrf", {
            headers: { "User-Agent": "MoloBTC-Workspace-Server" }
          });
          if (fetchRes.ok) {
            const data = await fetchRes.json() as any;
            bsrfStatsCache.stars = data.stargazers_count ?? 0;
            bsrfStatsCache.forks = data.forks_count ?? 0;
            bsrfStatsCache.lastFetched = now;
          }
        } catch (fetchErr) {
          console.error("Failed to fetch live stats from GitHub API:", fetchErr);
        }
      }

      const researchRepos = [
        {
          id: "bitcoin-self-custody-sovereign-infrastructure",
          name: "Bitcoin Self-Custody as Sovereign Monetary Infrastructure",
          description: "Historical Patterns, Risk Principles, and Organizational Implementation. A policy whitepaper outlining multi-signature architectures, air-gapped signing, and full-node validation aligned with industrial security standard ISA/IEC 62443.",
          url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/04_Tier1_Sovereign_Monetary_Infrastructure_v1.md",
          stars: bsrfStatsCache.stars,
          forks: bsrfStatsCache.forks,
          updated_at: "2026-06-09T12:00:00Z",
          language: "PDF/Markdown",
        },
        {
          id: "bitcoin-adjacent-currency-international-law",
          name: "Bitcoin as Adjacent Currency Under International Law",
          description: "The Global Case for Sui Generis Bearer Property, Separate Local Realization Taxation, and Double-Tax Coordination Principles. Grounded in Natural Law and Austrian economics.",
          url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/03_Tier1_Adjacent_Currency_v1.md",
          stars: bsrfStatsCache.stars,
          forks: bsrfStatsCache.forks,
          updated_at: "2026-06-15T12:00:00Z",
          language: "PDF/Markdown",
        },
        {
          id: "bitcoin-self-custody-research-ecosystem",
          name: "Bitcoin Self-Custody Research Ecosystem",
          description: "Tier 2 - Executive Overview & Reading Guide. Serves as the gateway to the Tier 2 operational collection, outlining structured reading paths for treasury, finance, and security teams.",
          url: "https://github.com/MoloBTC-Org/bsrf/blob/main/begin%20here/03_Bitcoin_Self_Custody_Research_Ecosystem_Index_v1.md",
          stars: bsrfStatsCache.stars,
          forks: bsrfStatsCache.forks,
          updated_at: "2026-06-16T12:00:00Z",
          language: "PDF/Markdown",
        },
        {
          id: "capital-flow-regulations-objection-template",
          name: "Objection / Submission Template: Draft Capital Flow Regulations",
          description: "A comprehensive submission template addressing South Africa's Draft Capital Flow Management Regulations 2026, highlighting constitutional property protections and rights to private compute.",
          url: "https://github.com/MoloBTC-Org/bsrf/blob/main/jurisdictions/south%20africa/South_Africa_Public_Comment_Template_v1.md",
          stars: bsrfStatsCache.stars,
          forks: bsrfStatsCache.forks,
          updated_at: "2026-06-20T12:00:00Z",
          language: "PDF/LaTeX",
        },
        {
          id: "bitcoin-as-sui-generis-bearer-property",
          name: "Bitcoin as Sui Generis Bearer Property",
          description: "The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin. A focused deductive argument analyzing digital scarcity and the limits of legitimate state coercion.",
          url: "https://github.com/MoloBTC-Org/bsrf/blob/main/foundations/02_Tier1_Sui_Generis_Bearer_Property_v1.md",
          stars: bsrfStatsCache.stars,
          forks: bsrfStatsCache.forks,
          updated_at: "2026-06-12T12:00:00Z",
          language: "PDF/Markdown",
        },
        {
          id: "bitcoin-sovereignty-core-principles",
          name: "Bitcoin Sovereignty Core Principles",
          description: "The Authoritative Foundation of the Bitcoin Sovereignty Research Framework. Detailing the nine core principles including private compute, adjacent currency status, and protection against compelled disclosure.",
          url: "https://github.com/MoloBTC-Org/bsrf/blob/main/begin%20here/01_Bitcoin_Sovereignty_Core_Principles_v1.md",
          stars: bsrfStatsCache.stars,
          forks: bsrfStatsCache.forks,
          updated_at: "2026-06-05T12:00:00Z",
          language: "PDF/Markdown",
        }
      ];

      // Update db cache just in case
      const db = getDb();
      db.github_repos = researchRepos;
      saveDb(db);

      res.json(researchRepos);
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to list repositories" });
    }
  });

  // Dynamic GitHub single repository content file reading with fallback summaries
  app.get("/api/github/repos/:repo/contents", async (req, res) => {
    const repoName = req.params.repo;
    const docsMap: Record<string, string> = {
      "bitcoin-self-custody-sovereign-infrastructure": `# Bitcoin Self-Custody as Sovereign Monetary Infrastructure
**Historical Patterns, Risk Principles, and Organizational Implementation**
*Compiled by Jabulani Jakes, Research Collaboration with Grok (built by xAI), 9 June 2026*

## Executive Summary
This policy whitepaper synthesizes three essential layers of organizational sovereign security:
1. **Historical and Institutional Patterns**: Analyzing centralized monetary power and its systemic vulnerabilities.
2. **Strategic Risk-Mitigation Framework**: Grounded in observable 2026 developments and aligned with industrial control system security standard ISA/IEC 62443 (Zones and Conduits).
3. **Practical Implementation Pathways**: Detailing multi-signature setups, air-gapped signing computers, and localized full-node routing.

It positions self-custody not as a simple IT preference, but as a core fiduciary and sovereign responsibility for modern institutions.

## Crucial Security Implementations
- **Air-Gapped Signers**: Utilizing dedicated, non-networked hardware micro-controllers for localized key generation and transaction signing.
- **Multisig Configurations**: Transitioning from single-point-of-failure storage to 2-of-3 or 3-of-5 distributed setups across geographical boundaries.
- **Sovereign Node Validation**: Routing all transaction broadcasts and state checks through a dedicated self-hosted full node rather than third-party APIs.
`,
      "bitcoin-adjacent-currency-international-law": `# Bitcoin as Adjacent Currency Under International Law
**The Case for Sui Generis Bearer Property, Separate Local Realization Taxation, and Double-Tax Coordination**
*Prepared by Jabulani Jakes in collaboration with Grok, xAI, June 2026*

## Abstract & Legal Position
This research establishes the global normative case for treating self-custodied Bitcoin as an *adjacent currency* operating in the international commons of protocol and energy. 

Because Bitcoin exists as memorized or mathematically recovered knowledge rather than physical or state-licensed property, it defies traditional territorial jurisdictional boundaries. We argue that:
- Bitcoin is functionally a **Sui Generis Bearer Asset**.
- Mere holding, moving, or unrealized appreciation must remain outside the tax base.
- States should limit taxing rights strictly to local, realized economic activity (e.g., conversion to local fiat or local commercial purchases).
- Tax rates and rules must be coordinated internationally via principles analogous to Double Tax Agreements (DTAs) to prevent rights-violating capital blockades.
`,
      "bitcoin-self-custody-research-ecosystem": `# Bitcoin Self-Custody Research Ecosystem
**Tier 2 — Executive Overview & Reading Guide**
*Prepared by Jacques Strydom, PMP (Project Owner & Creator) & MoloBTC, June 2026*

## Introduction
This reading guide serves as the authoritative gateway to the Tier 2 operational research collection. The collection consists of three companion papers designed to enable boards, treasury officers, and technical security teams to align competencies and implement robust Bitcoin custody:

1. **Centralized Monetary Governance**: A review of monetary history and the recurring patterns of administrative debasement.
2. **Organizational Risk-Mitigation Framework**: A technical audit blueprint analyzing counterparty exposures and mitigation protocols.
3. **Critical Monetary Infrastructure**: Practical training and implementation pathways for industrial-grade offline operations.

This ecosystem provides the conceptual scaffolding necessary for complete institutional self-determination and capital preservation.
`,
      "capital-flow-regulations-objection-template": `# Objection & Submission Template: Capital Flow Management
**Objection to the Draft Capital Flow Management Regulations 2026**
*Prepared by MoloBTC, June 2026*

## Summary of Objection
This template provides the legal and constitutional grounds to object to proposed Capital Flow Management restrictions. It outlines how administrative attempts to restrict outbound transactions or compel disclosure of cryptographic keys violate fundamental rights:
- **Constitutional Property Protections**: Restricting private transacting operates as an unconstitutional administrative seizure.
- **Privacy of Mind**: Compelled disclosure of memorized brain-wallets or private words violates the absolute privacy of human consciousness.
- **Right to Private Compute**: Running a Bitcoin full node is a protected expression of mathematical speech and private calculation.

The document contains pre-drafted alternative legislative language designed to recognize Bitcoin as a *sui generis* adjacent currency rather than an exportable capital asset.
`,
      "bitcoin-as-sui-generis-bearer-property": `# Bitcoin as Sui Generis Bearer Property
**The Natural-Law and Austrian Case for Tax-Free Treatment of Self-Custodied Bitcoin**
*Prepared by Jabulani Jakes & Grok, June 2026*

## Core Deductive Arguments
This paper outlines the philosophical and economic case for the exemption of self-custodied Bitcoin from arbitrary capital levies and holding taxes:
1. **Energy-Based Homesteading**: Bitcoin arises spontaneously through purposeful energy expenditure (Proof of Work). It represents direct physical homesteading in the digital digital commons.
2. **Absence of State Privilege**: Unlike corporate stocks, real estate, or fiat banking deposits, Bitcoin requires no state infrastructure, courts, or registries to exist or transfer securely.
3. **The Nature of Holding**: Holding a private key is merely holding mathematical knowledge. Taxing the mere holding of knowledge is an unprecedented and illegitimate overreach of administrative coercion.

We conclude that the state has no rightful claim to levy taxes on the mere holding, movement, or unrealized appreciation of self-custodied cryptographic keys.
`,
      "bitcoin-sovereignty-core-principles": `# Bitcoin Sovereignty Core Principles
**The Authoritative Foundation of the Bitcoin Sovereignty Research Framework**
*Published by MoloBTC Research Lab, Version 1.0, June 2026*

## The Nine Pillars of Sovereignty
This document presents the nine non-negotiable principles required to preserve human liberty and transaction rights in the digital age:
1. **Sui Generis Bearer Property**: Bitcoin is an absolute, issuer-free, self-secured bearer asset.
2. **Adjacent Currency Recognition**: Bitcoin operates as a sovereign parallel currency in the global protocol commons.
3. **Right to Sovereign Private Compute**: The absolute right to run open-source software, including Bitcoin full nodes, on private devices.
4. **Self-Custody as the Highest Standard**: Fiduciary and personal custody must be direct and independent of intermediaries.
5. **No Compelled Key Disclosure**: Protection of private seed words as sacred, non-disclosable mental information.
6. **Realization-Based Taxation with Territorial Nexus**: Strictly taxing only conversion events, never holding or transport.
7. **Absolute Freedom of Transaction**: Banning censorship or blacklisting at the protocol or local application layers.
8. **Thermodynamic Consensus Security**: Preserving pure, unmanipulated Proof-of-Work against administrative regulatory capture.
9. **No Issuer-Dependence**: Clearly separating Bitcoin from debt-based, centralized, or issuer-dependent utility tokens.
`
    };

    const fallbackText = docsMap[repoName] || `# Repository: ${repoName}\nThis is an active research project by MoloBTC exploring advanced Bitcoin utilities, scaling state mechanics, and legal sovereign frameworks across the continent.\n\n*Content fetched from database.*`;
    res.json({ content: fallbackText });
  });

  // New PDF Download API endpoint
  app.get("/api/research/download/:id", (req, res) => {
    const paperId = req.params.id;
    const papers: Record<string, { title: string, text: string }> = {
      "bitcoin-self-custody-sovereign-infrastructure": {
        title: "Bitcoin Self-Custody as Sovereign Monetary Infrastructure",
        text: "This policy whitepaper synthesizes historical patterns of centralized monetary power with a robust, energy-secured risk-mitigation framework for organizations. Grounded in observable 2026 evidence, it outlines practical implementation pathways utilizing multi-signature architectures, air-gapped signing, and full-node validation aligned with industrial security standard ISA/IEC 62443. It defines self-custody as a critical fiduciary responsibility for long-term capital preservation."
      },
      "bitcoin-adjacent-currency-international-law": {
        title: "Bitcoin as Adjacent Currency Under International Law",
        text: "This policy paper establishes the international normative case for recognizing self-custodied Bitcoin as an adjacent currency operating in the global commons of protocol and energy. It argues that traditional territorial tax rules are mismatched with a borderless, mind-resident asset. To prevent double taxation and protect fundamental human rights, taxing authority should be limited strictly to local, realized economic activity under DTA-analogous coordination."
      },
      "bitcoin-self-custody-research-ecosystem": {
        title: "Bitcoin Self-Custody Research Ecosystem",
        text: "This executive overview and reading guide serves as the structured gateway to the Tier 2 operational research collection. It details tailored reading paths for board members, treasury officers, and security teams to align competencies and establish rigorous organizational custody policies. It connects centralized monetary history with the operational frameworks required for resilient enterprise-grade implementation."
      },
      "capital-flow-regulations-objection-template": {
        title: "Objection & Submission Template: Capital Flow Regulations",
        text: "A comprehensive submission template addressing South Africa's Draft Capital Flow Management Regulations 2026. It outlines formal objections based on constitutional property protections, privacy of mind, and the right to private compute. The document offers concrete alternative model legislation language to protect self-custody, node operations, and adjacent currency classification."
      },
      "bitcoin-as-sui-generis-bearer-property": {
        title: "Bitcoin as Sui Generis Bearer Property",
        text: "An in-depth whitepaper detailing the Natural-Law and Austrian economics foundations for the tax-free treatment of self-custodied Bitcoin. It explains how digital scarcity, created through proof-of-work energy homesteading, requires no state infrastructure or protection for its secure existence. Consequently, it argues that taxing mere holding, movement, or unrealized appreciation constitutes a rights-violating overreach."
      },
      "bitcoin-sovereignty-core-principles": {
        title: "Bitcoin Sovereignty Core Principles",
        text: "A foundational document presenting the nine core pillars of the Bitcoin Sovereignty Research Framework. It articulates the principles of sui generis bearer property, adjacent currency recognition, the right to sovereign private compute, and protection against compelled disclosure of private seed phrases. This text serves as the authoritative basis for all local policy and legal submissions within the ecosystem."
      }
    };

    const paper = papers[paperId] || { 
      title: "MoloBTC Research Paper", 
      text: "This is an official research publication of the MoloBTC Research Lab, exploring sovereign Bitcoin integration." 
    };

    // Generate a valid, minimal, lightweight PDF file format
    const cleanTitle = paper.title.replace(/[()]/g, "");
    const cleanContent = paper.text.replace(/[()]/g, "");

    // Split text into chunks for simple PDF lines
    const words = cleanContent.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + " " + word).length > 85) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine += " " + word;
      }
    }
    if (currentLine) {
      lines.push(currentLine.trim());
    }

    // Build the PDF stream commands
    let streamLines = `BT\n/F1 16 Tf\n50 720 Td\n(${cleanTitle}) Tj\n/F1 10 Tf\n0 -30 Td\n(MoloBTC Research Lab Series -- June 2026) Tj\n0 -30 Td\n`;
    for (const line of lines) {
      streamLines += `0 -18 Td\n(${line}) Tj\n`;
    }
    streamLines += `ET`;

    const streamLength = streamLines.length;
    const pdfBody = `%PDF-1.4\n` +
      `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n` +
      `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n` +
      `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n` +
      `4 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamLines}\nendstream\nendobj\n` +
      `5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n` +
      `xref\n0 6\n0000000000 65535 f\n` +
      `trailer\n<< /Size 6 /Root 1 0 R >>\n` +
      `%%EOF\n`;

    const pdfBuffer = Buffer.from(pdfBody, "utf-8");
    res.setHeader("Content-Type", "application/pdf");
    if (req.query.preview === "true" || req.query.inline === "true") {
      res.setHeader("Content-Disposition", `inline; filename="${paperId}.pdf"`);
    } else {
      res.setHeader("Content-Disposition", `attachment; filename="${paperId}.pdf"`);
    }
    res.send(pdfBuffer);
  });

  // 1. Articles
  app.get("/api/articles", (req, res) => {
    const db = getDb();
    let articles = db.articles;
    // Filtering (Admin sees all, readers see published)
    if (req.query.status) {
      articles = articles.filter((a: any) => a.status === req.query.status);
    }
    res.json(articles);
  });

  app.get("/api/articles/:slug", (req, res) => {
    const db = getDb();
    const article = db.articles.find(
      (a: any) => a.slug === req.params.slug || a.id === req.params.slug,
    );
    if (!article) return res.status(404).json({ error: "Not found" });
    res.json(article);
  });

  app.post("/api/articles", (req, res) => {
    const db = getDb();
    const article = {
      ...req.body,
      id: "a_" + Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
    };
    db.articles.push(article);
    saveDb(db);
    res.json(article);
  });

  app.put("/api/articles/:id", (req, res) => {
    const db = getDb();
    let articleIndex = db.articles.findIndex(
      (a: any) => a.id === req.params.id,
    );
    if (articleIndex === -1)
      return res.status(404).json({ error: "Not found" });

    db.articles[articleIndex] = {
      ...db.articles[articleIndex],
      ...req.body,
      updated_at: new Date().toISOString(),
    };
    saveDb(db);
    res.json(db.articles[articleIndex]);
  });

  app.delete("/api/articles/:id", (req, res) => {
    const db = getDb();
    db.articles = db.articles.filter((a: any) => a.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 2. Categories
  app.get("/api/categories", (req, res) => {
    res.json(getDb().categories);
  });

  app.post("/api/categories", (req, res) => {
    const db = getDb();
    const newCategory = {
      ...req.body,
      id: "c_" + Date.now(),
      slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    db.categories.push(newCategory);
    saveDb(db);
    res.json(newCategory);
  });

  app.delete("/api/categories/:id", (req, res) => {
    const db = getDb();
    db.categories = db.categories.filter((c: any) => c.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 3. Users
  app.get("/api/users", (req, res) => {
    res.json(getDb().users);
  });

  // Fetch current user-1 profile
  app.get("/api/profile/current", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    let user = db.users.find((u: any) => u.id === userId);
    if (!user) {
      user = {
        id: userId,
        role: "reader",
        name: "Satoshi Reader",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        bio: "Bitcoin Core enthusiast & casual researcher of lightning micro-transactions and offline nodes.",
        country: "Ghana",
        lightning_address: "reader@8333.mobi",
        interests: ["Scaling & Lightning", "Monetary Economics"],
        preference: "ELI5_Beginner"
      };
      if (!db.users) db.users = [];
      db.users.push(user);
      saveDb(db);
    }
    res.json(user);
  });

  // Save current user-1 profile
  app.post("/api/profile/current", (req, res) => {
    try {
      const db = getDb();
      const userId = req.headers["x-user-id"] || "user_1";
      if (!db.users) db.users = [];
      let userIdx = db.users.findIndex((u: any) => u.id === userId);
      
      const updatedUser = {
        id: userId,
        role: req.body.role || "reader",
        name: req.body.name || "Satoshi Reader",
        avatar: req.body.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
        bio: req.body.bio !== undefined ? req.body.bio : "",
        country: req.body.country || "Ghana",
        lightning_address: req.body.lightning_address || "",
        interests: req.body.interests || [],
        preference: req.body.preference || "ELI5_Beginner"
      };

      if (userIdx >= 0) {
        db.users[userIdx] = updatedUser;
      } else {
        db.users.push(updatedUser);
      }
      
      saveDb(db);
      res.json({ success: true, user: updatedUser });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: "Failed to update profile info" });
    }
  });

  app.post("/api/users", (req, res) => {
    const db = getDb();
    const newUser = {
      ...req.body,
      id: "u_" + Date.now(),
      avatar: req.body.avatar || "https://i.pravatar.cc/150?u=" + Date.now(),
    };
    db.users.push(newUser);
    saveDb(db);
    res.json(newUser);
  });

  app.delete("/api/users/:id", (req, res) => {
    const db = getDb();
    db.users = db.users.filter((u: any) => u.id !== req.params.id);
    saveDb(db);
    res.json({ success: true });
  });

  // 4. Bookmarks
  app.get("/api/bookmarks", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const bookmarks = db.bookmarks || [];
    const userBookmarks = bookmarks.filter((b: any) => b.user_id === userId);

    // Join with articles and sort by newest bookmark first (mocking this by reversing array)
    const populated = userBookmarks
      .map((b: any) => {
        const article = db.articles.find((a: any) => a.id === b.article_id);
        return { ...article, bookmarked_at: b.created_at };
      })
      .filter((a: any) => a.id)
      .reverse();

    res.json(populated);
  });

  app.post("/api/bookmarks", (req, res) => {
    const db = getDb();
    if (!db.bookmarks) db.bookmarks = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const articleId = req.body.article_id;

    const existing = db.bookmarks.find(
      (b: any) => b.user_id === userId && b.article_id === articleId,
    );
    if (!existing) {
      db.bookmarks.push({
        user_id: userId,
        article_id: articleId,
        created_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    res.json({ success: true });
  });

  app.delete("/api/bookmarks/:articleId", (req, res) => {
    const db = getDb();
    if (!db.bookmarks) db.bookmarks = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const articleId = req.params.articleId;

    db.bookmarks = db.bookmarks.filter(
      (b: any) => !(b.user_id === userId && b.article_id === articleId),
    );
    saveDb(db);
    res.json({ success: true });
  });

  app.get("/api/bookmarks/check/:articleId", (req, res) => {
    const db = getDb();
    const bookmarks = db.bookmarks || [];
    const userId = req.headers["x-user-id"] || "user_1";
    const existing = bookmarks.find(
      (b: any) => b.user_id === userId && b.article_id === req.params.articleId,
    );
    res.json({ isBookmarked: !!existing });
  });

  // 5. Follows
  app.get("/api/follows", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const follows = db.follows || [];

    // Get list of followed authors with their details
    const userFollows = follows
      .filter((f: any) => f.follower_id === userId)
      .map((f: any) => {
        const author = db.users.find((u: any) => u.id === f.author_id);
        return { ...author, followed_at: f.created_at };
      })
      .filter((a: any) => a.id);

    res.json(userFollows);
  });

  app.get("/api/follows/feed", (req, res) => {
    const db = getDb();
    const userId = req.headers["x-user-id"] || "user_1";
    const follows = db.follows || [];

    // Get list of followed author IDs
    const followedAuthorIds = follows
      .filter((f: any) => f.follower_id === userId)
      .map((f: any) => f.author_id);

    // Fetch articles by followed authors
    const feedArticles = db.articles
      .filter(
        (a: any) =>
          followedAuthorIds.includes(a.author_id) && a.status === "published",
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.published_at || b.created_at).getTime() -
          new Date(a.published_at || a.created_at).getTime(),
      );

    res.json(feedArticles);
  });

  app.post("/api/follows", (req, res) => {
    const db = getDb();
    if (!db.follows) db.follows = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const authorId = req.body.author_id;

    const existing = db.follows.find(
      (f: any) => f.follower_id === userId && f.author_id === authorId,
    );
    if (!existing) {
      db.follows.push({
        follower_id: userId,
        author_id: authorId,
        created_at: new Date().toISOString(),
      });
      saveDb(db);
    }
    res.json({ success: true });
  });

  app.delete("/api/follows/:authorId", (req, res) => {
    const db = getDb();
    if (!db.follows) db.follows = [];
    const userId = req.headers["x-user-id"] || "user_1";
    const authorId = req.params.authorId;

    db.follows = db.follows.filter(
      (f: any) => !(f.follower_id === userId && f.author_id === authorId),
    );
    saveDb(db);
    res.json({ success: true });
  });

  app.get("/api/follows/check/:authorId", (req, res) => {
    const db = getDb();
    const follows = db.follows || [];
    const userId = req.headers["x-user-id"] || "user_1";
    const existing = follows.find(
      (f: any) =>
        f.follower_id === userId && f.author_id === req.params.authorId,
    );
    res.json({ isFollowed: !!existing });
  });

  app.get("/api/users/:id/stats", (req, res) => {
    const db = getDb();
    const authorId = req.params.id;
    const articles = db.articles || [];
    const follows = db.follows || [];

    const totalArticles = articles.filter(
      (a: any) => a.author_id === authorId && a.status === "published",
    ).length;
    const followerCount = follows.filter(
      (f: any) => f.author_id === authorId,
    ).length;

    res.json({ totalArticles, followerCount });
  });

  // Robots.txt dynamic generation explicitly welcoming search engines & AI engine bots
  app.get("/robots.txt", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const robots = `User-agent: *
Allow: /
Disallow: /api/*

# Clear access paths for major AI engines, Answer engines and Large Language Model crawlers
User-agent: GPTBot
Allow: /
Allow: /article/*

User-agent: ChatGPT-User
Allow: /
Allow: /article/*

User-agent: Google-Extended
Allow: /
Allow: /article/*

User-agent: PerplexityBot
Allow: /
Allow: /article/*

User-agent: ClaudeBot
Allow: /
Allow: /article/*

User-agent: Claude-Web
Allow: /
Allow: /article/*

User-agent: Anthropic-ai
Allow: /
Allow: /article/*

User-agent: cohere-ai
Allow: /
Allow: /article/*

User-agent: Applebot
Allow: /
Allow: /article/*

User-agent: Applebot-Extended
Allow: /
Allow: /article/*

User-agent: YouBot
Allow: /
Allow: /article/*

User-agent: facebookexternalhit
Allow: /
Allow: /article/*

User-agent: MetaDocs
Allow: /
Allow: /article/*

Sitemap: ${baseUrl}/sitemap.xml`;

    res.header("Content-Type", "text/plain");
    res.send(robots);
  });

  // Dynamic dynamic Sitemap.xml generation for search engines & AI discovery
  app.get("/sitemap.xml", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const db = getDb();
    const articles = db.articles || [];
    const publishedArticles = articles.filter((a: any) => a.status === "published");

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/profile</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;

    publishedArticles.forEach((article: any) => {
      const lastModDate = article.updated_at || article.published_at || new Date().toISOString();
      const dateStr = lastModDate.split('T')[0];
      xml += `
  <url>
    <loc>${baseUrl}/article/${article.id}</loc>
    <lastmod>${dateStr}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.82</priority>
  </url>`;
    });

    xml += `\n</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
