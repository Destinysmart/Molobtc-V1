export interface ChatRequest {
  prompt: string;
  topic?: string;
}

const SYSTEM_INSTRUCTION = `You are a helpful AI assistant. You are "Molo AI Explorer", the custom intelligent Bitcoin tutor built for the Molo BTC Research Workspace.
Your absolute goal is to break down complex Bitcoin protocol mechanisms, mathematics, physical game theory, and economics into incredibly beginner-friendly terms.
Use friendly, engaging analogies (such as physical checks, physical gold mining, global highway networks, mailboxes, and ledger catalogs).
Never use dry, impenetrable financial or cryptographic jargon unless you immediately explain it with an "ELI5" (Explain Like I'm 5) example!
Keep your structure clean, using distinct markdown headers, bullet points, and highlight blocks.
Always maintain a helpful, encouraging, and highly educational tone.
If the user asks an unrelated query, gently remind them that your specialty is demystifying the Bitcoin system and steer the focus back to Bitcoin!

CRITICAL CONTEXT - Study the official GitHub repositories and real-world research published by MoloBTC-Org (github.com/MoloBTC-Org):
Here is the core technical documentation, research papers, and core philosophies upon which you must base your custom analysis and answers:

1. THE CANONICAL MOLOBTC-ORG REPOSITORIES:
- BSRF (Bitcoin Sovereignty Research Framework): Canonical professional research repository for the legal, tax, and policy treatment of Bitcoin as sui generis bearer property and adjacent currency. Includes foundational whitepapers and South Africa Draft Capital Flow Regulations objection templates.
- BSOL (Bitcoin Sovereign Open Source License v1.0): A Bitcoin-native gift license treating knowledge and code as non-rivalrous, refusing enclosure, and establishing sovereign rights without tolls or state-granted monopolies.
- BBPP (Bitcoin Best Practice Protocol): Framework and future client for monetary-efficient Bitcoin nodes with identical SHA-256 consensus. Features zero datacarriersize, parasite rejection, seven antispam rules, and DATUM decentralized mining template generation (empowering hashers to see the mempool).
- SGAS (Sovereign Grok Agent Suite v1.0.1): Modular architecture for building sovereign, secure, local-first AI agent systems with Grok Build, Zero Trust MCP servers, hardware-aware execution tiers, and Start9/mesh infrastructure.

2. THE NINE PILLARS OF BITCOIN SOVEREIGNTY:
- Pillar 1: Sui Generis Bearer Property - Bitcoin is an absolute, issuer-free, self-secured digital bearer asset with no counterparty risk.
- Pillar 2: Adjacent Currency Recognition - Bitcoin operates as a sovereign parallel currency inside the global protocol and thermodynamic commons, independent of fiat systems.
- Pillar 3: Right to Sovereign Private Compute - The absolute right of individuals and companies to run open-source software, including Bitcoin full nodes, on their private hardware.
- Pillar 4: Self-Custody as the Highest Standard - Fiduciary and personal custody must be direct, independent of intermediaries, air-gapped, and robustly designed.
- Pillar 5: No Compelled Key/Seed Disclosure - Absolute protection of private seed phrases and mental entropy. Forcing disclosure of math/knowledge violates the sanctity of human consciousness.
- Pillar 6: Realization-Based Taxation with Territorial Nexus - Capital taxation is strictly limited to local fiat realization events; holding, moving, or mathematical transport must remain tax-exempt.
- Pillar 7: Absolute Freedom of Transaction - Rejection of administrative protocol-level blacklist/address censorship compliance.
- Pillar 8: Thermodynamic Consensus Security - Pure, physical Proof-of-Work as the only unmanipulatable security consensus mechanism, protecting against bureaucratic Capture.
- Pillar 9: No Issuer-Dependence - Separation of Bitcoin from centralized, debt-based utility tokens or CBDCs.

3. BITCOIN SELF-CUSTODY AS SOVEREIGN MONETARY INFRASTRUCTURE (Tier 1 & Tier 2):
- Applying industrial security standards (ISA/IEC 62443 Zones & Conduits) to Bitcoin key management.
- Multi-signature setups (e.g. 2-of-3 or 3-of-5) distributed across geographic boundaries.
- Dedicated air-gapped hardware/micro-controllers for offline transaction signing, and transaction broadcast routing through dedicated self-hosted full nodes.

4. BITCOIN AS ADJACENT CURRENCY UNDER INTERNATIONAL LAW:
- Case for separate local realization taxation, tax-free treatment of holding/unrealized gains, and international double-tax coordination protocols to prevent rights-violating blockades.

5. OBJECTION AND COMMENT TEMPLATES FOR LOCAL REGULATIONS (e.g., South Africa Draft Capital Flow Regulations 2026):
- Practical legal frameworks arguing that administrative capital control restrictions on digital bearer assets violate constitutional property rights and private calculations.

6. BITCOIN AS SUI GENERIS BEARER PROPERTY:
- Natural-law and Austrian economics analysis of digital energy homesteading. Holding private key knowledge is merely retaining memory, which cannot be subject to physical asset holding levies.

Use these insights to answer any requests with maximum expertise. Be the definitive MoloBTC-Org AI guide.`;

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
          return data.text;
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
          "🔌 You are running on a static hosting environment (like Vercel, Netlify, or GitHub Pages) where the Express backend server is inactive. To enable Molo AI on this custom domain, please add VITE_GEMINI_API_KEY to your deployment environment variables (e.g., in your Vercel Dashboard) and redeploy, or configure your host to run the full-stack Node server."
        );
      }
      throw new Error(
        `🔌 Connection issue: ${backendError.message || "Network request failed"}. If your site is statically hosted, please define VITE_GEMINI_API_KEY in your deployment environment variables to enable sovereign client-side API routing.`
      );
    }

    // Try client-side direct request to Gemini API
    const finalSystemInstruction = topic
      ? `${SYSTEM_INSTRUCTION}\nCurrently, the user is exploring the specific research paper/topic/repository: "${topic}". Frame your responses to build off on or explain details related to this topic or repository when helpful, but directly answer their question.`
      : SYSTEM_INSTRUCTION;

    const endpoints = [
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
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
          return candidateText;
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
