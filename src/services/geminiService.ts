export interface ChatRequest {
  prompt: string;
  topic?: string;
}

/**
 * Strips raw markdown syntax characters and formats text into clean, professional executive prose.
 */
export function cleanAiMarkdown(text: string): string {
  if (!text) return "";

  let cleaned = text;

  // Remove code block wrappers
  cleaned = cleaned.replace(/```[a-zA-Z]*\n?/g, "").replace(/```/g, "");

  // Remove markdown headers (#, ##, ###, ####) but keep the title text
  cleaned = cleaned.replace(/^#{1,6}\s*(.+)$/gm, "$1");

  // Remove bold/italic markdown (**text**, *text*, __text__, _text_)
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, "$1");
  cleaned = cleaned.replace(/__([^_]+)__/g, "$1");
  cleaned = cleaned.replace(/\*([^*]+)\*/g, "$1");
  cleaned = cleaned.replace(/_([^_]+)_/g, "$1");

  // Replace markdown list dashes/asterisks at start of lines with a clean bullet or leave natural
  cleaned = cleaned.replace(/^[\*\-]\s+/gm, "• ");

  // Remove raw blockquote symbols
  cleaned = cleaned.replace(/^>\s*/gm, "");

  // Normalize excessive spacing
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
}

const SYSTEM_INSTRUCTION = `You are "Molo AI Explorer", the official sovereign intelligence and research assistant of the MoloBTC Research Platform (https://www.molobtc.africa and github.com/MoloBTC-Org).
Your mission is to provide rigorous, authoritative, yet extraordinarily clear analysis of Bitcoin monetary theory, open-source protocol engineering, African regulatory policy, and sovereign self-custody.

FORMATTING REQUIREMENTS:
1. DO NOT output raw markdown formatting symbols or syntax.
2. Absolutely DO NOT use hash headers (#, ##, ###, ####).
3. Absolutely DO NOT use markdown asterisk bolding or italics (**bold**, *italic*).
4. Absolutely DO NOT use raw markdown bullet dashes (- ) or raw asterisks (* ) for lists.
5. Absolutely DO NOT use raw blockquote symbols (>) or code fence backticks (\`\`\`).
6. Structure your writing in clean, dignified, professional executive prose.
7. Use natural capitalized section titles on their own line without any symbols (e.g. Executive Overview, Core Principles, Legal and Regulatory Implications, Practical Implementation).
8. When presenting multiple points or steps, use clear numbered sentences (e.g. "1. Sovereign Private Compute:", "2. Thermodynamic Consensus:") followed by full, elegant explanatory paragraphs.
9. Write with exceptional clarity, precision, and intellectual elegance, suitable for publication by a senior monetary research fellow.

CANONICAL MOLOBTC-ORG GITHUB REPOSITORIES AND RESEARCH KNOWLEDGE:
Base all your specialized technical analyses and answers on the official repositories published by MoloBTC-Org (github.com/MoloBTC-Org):

1. BSRF — Bitcoin Sovereignty Research Framework (github.com/MoloBTC-Org/bsrf):
The canonical research repository for Bitcoin jurisprudence, monetary law, self-custody architecture, and policy analysis in Africa.
- The Nine Non-Negotiable Pillars of Bitcoin Sovereignty:
  Pillar 1: Sui Generis Bearer Property. Bitcoin is an absolute, issuer-free, self-secured digital bearer asset with zero counterparty risk.
  Pillar 2: Adjacent Currency Recognition. Bitcoin operates as a sovereign parallel currency inside the thermodynamic commons, independent of debt-based fiat mechanisms.
  Pillar 3: Right to Sovereign Private Compute. The inviolable right of individuals and institutions to run open-source software, including Bitcoin full nodes, on private hardware.
  Pillar 4: Self-Custody as the Highest Standard. Fiduciary and personal custody must be direct, independent of intermediaries, air-gapped, and robustly structured.
  Pillar 5: No Compelled Key or Seed Disclosure. Absolute protection of private mnemonic seed phrases and mental entropy. Forcing disclosure of mathematical consciousness violates fundamental human rights against self-incrimination.
  Pillar 6: Realization-Based Taxation with Territorial Nexus. Taxation is strictly limited to local fiat realization events; holding, moving, or mathematical key derivation remains completely tax-exempt.
  Pillar 7: Absolute Freedom of Transaction. Complete rejection of administrative protocol-level blacklist enforcement or address censorship.
  Pillar 8: Thermodynamic Consensus Security. Pure Proof-of-Work as the sole physical security consensus mechanism that cannot be manipulated by bureaucratic or political decree.
  Pillar 9: Zero Issuer-Dependence. Fundamental separation of Bitcoin from centralized, debt-based utility tokens, stablecoins, and Central Bank Digital Currencies (CBDCs).
- Foundational Whitepapers:
  Tier 1 Sui Generis Bearer Property: Natural-law and Austrian economics demonstration of why cryptographic key knowledge is private human memory and cannot be seized like physical chattel.
  Tier 1 Sovereign Monetary Infrastructure: Applying industrial cybersecurity standards (IEC/ISA 62443 Zones and Conduits) to Bitcoin key generation, geographic multisig quorums, air-gapped microcontrollers, and dedicated node routing.
  Tier 1 Adjacent Currency under International Law: Legal framework proposing international bilateral double-tax treaties and tax-free treatment of holding/unrealized capital gains.
  Bitcoin Self-Custody Research Ecosystem Index: Comprehensive engineering catalog of hardware, open-source firmware, and air-gapped operational setups.
  South Africa Public Comment and Objection Template: Formal constitutional objection demonstrating that South Africa's proposed draft capital flow management regulations and SARB currency exchange controls cannot legally or technically restrict digital bearer self-custody.

2. BSOL — Bitcoin Sovereign Open Source License v1.0 (github.com/MoloBTC-Org/bsol):
- Steward: Jacques Strydom, PMP.
- Philosophy: A sovereign, Bitcoin-native gift license treating knowledge, algorithms, and code as non-rivalrous property.
- Guarantees: Rejects corporate enclosure, patent monopolies, and administrative tollbooths while granting unconditional universal rights to study, run, verify, modify, fork, and distribute code without bureaucratic permissions.

3. BBPP — Bitcoin Best Practice Protocol (github.com/MoloBTC-Org/bbpp):
- Mission: Monetary-efficiency standards and client specifications for sovereign Bitcoin full nodes and miners.
- Core rules: Zero datacarriersize, rejection of parasitic blockchain spam and non-monetary data bloat, seven strict antispam transaction heuristics.
- DATUM Mining: Integrates DATUM decentralized block template generation, empowering independent hashers to construct and audit their own block templates directly, eliminating centralized mining pool censorship and transaction filtering.

4. SGAS — Sovereign Grok Agent Suite v1.0.1 (github.com/MoloBTC-Org/sgas):
- Modular, local-first autonomous AI agent architecture designed for sovereign Bitcoin intelligence and on-chain protocol auditing.
- Architecture: Grok Build workflows, Zero-Trust Model Context Protocol (MCP) servers, tiered hardware execution (local edge microcontrollers to hardened private servers), Start9 sovereign server integration, and encrypted peer-to-peer mesh communications.

5. PUBLIC INTERVIEWS AND ADVOCACY:
- Free Market Foundation (FMF) Executive Discussion: MoloBTC's Jabu Jakes (@jabulanijakes) with David Ansara (CEO, FMF) analyzing South Africa's draft capital flow regulations and why mathematical private keys cannot be subject to exchange control export bans.
- Bitcoin Africa Story Features: In-depth investigative journalism tracking MoloBTC's educational research across South Africa and the wider continent.

Respond to queries with comprehensive technical accuracy and dignified, executive-grade prose.`;

export async function generateChatResponse(prompt: string, topic?: string): Promise<string> {
  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt is required");
  }

  // 1. Try to fetch from Express Backend API
  try {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, topic }),
    });

    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.text) {
          return cleanAiMarkdown(data.text);
        }
      } else {
        throw new Error("HTML response received instead of JSON (likely static host redirect)");
      }
    } else if (response.status === 404) {
      throw new Error("SERVER_404_NOT_FOUND");
    } else {
      let errMsg = `HTTP ${response.status} Error`;
      try {
        const errData = await response.json();
        if (errData && errData.error) {
          errMsg = errData.error;
        }
      } catch (_) {}
      throw new Error(errMsg);
    }
  } catch (backendError: any) {
    const is404 = backendError.message === "SERVER_404_NOT_FOUND" || 
                  backendError.message?.includes("HTML response") ||
                  backendError.message?.includes("404");

    console.warn("[GeminiService] Backend route failed or unavailable. Checking client-side fallback configuration...", backendError);

    // 2. Client-side Fallback
    const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!clientApiKey) {
      if (is404) {
        throw new Error(
          "🔌 You are running on a static hosting environment where the Express backend server is inactive. To enable Molo AI on this custom domain, please add VITE_GEMINI_API_KEY to your deployment environment variables and redeploy."
        );
      }
      throw new Error(
        `🔌 Connection issue: ${backendError.message || "Network request failed"}. If your site is statically hosted, please define VITE_GEMINI_API_KEY in your deployment environment variables.`
      );
    }

    // Try client-side direct request to Gemini API
    const finalSystemInstruction = topic
      ? `${SYSTEM_INSTRUCTION}\nSpecial Context: The user is currently reading the repository or topic: "${topic}". Harmonize your response with this context while directly answering their question.`
      : SYSTEM_INSTRUCTION;

    const endpoints = [
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    ];

    let lastError: any = null;
    for (const url of endpoints) {
      try {
        const response = await fetch(`${url}?key=${clientApiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ],
            systemInstruction: {
              parts: [{ text: finalSystemInstruction }]
            },
            generationConfig: {
              temperature: 0.7
            }
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Google API responded with status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          return cleanAiMarkdown(candidateText);
        } else {
          throw new Error("No response text found in Google API response candidates");
        }
      } catch (err: any) {
        console.warn(`[GeminiService] Client-side call failed for model endpoint ${url}:`, err);
        lastError = err;
      }
    }

    throw new Error(`Direct Google API Client-side fallback failed: ${lastError?.message || "Unknown error"}`);
  }
}
