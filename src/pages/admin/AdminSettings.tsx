import { useState } from "react";
import { 
  Settings, 
  Info, 
  Check, 
  Save, 
  GraduationCap,
  Sparkles,
  Info as InfoIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function AdminSettings() {
  // Identity parameters
  const [labName, setLabName] = useState(() => localStorage.getItem("molo_lab_name") || "MoloBTC Sovereign Lab");
  const [licensing, setLicensing] = useState(() => localStorage.getItem("molo_licensing") || "Apache-2.0");
  const [requirePeerApproval, setRequirePeerApproval] = useState(() => localStorage.getItem("molo_peer_approval") !== "false");

  // Tutor parameters
  const [tutorMode, setTutorMode] = useState(() => localStorage.getItem("molo_tutor_mode") || "ELI5_Beginner");
  const [creativity, setCreativity] = useState(() => Number(localStorage.getItem("molo_tutor_creativity") || "0.4"));

  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleSaveConfigs = () => {
    localStorage.setItem("molo_lab_name", labName);
    localStorage.setItem("molo_licensing", licensing);
    localStorage.setItem("molo_peer_approval", String(requirePeerApproval));
    localStorage.setItem("molo_tutor_mode", tutorMode);
    localStorage.setItem("molo_tutor_creativity", String(creativity));

    triggerToast("Lab parameter configurations successfully saved!");
  };

  // Dynamic system prompt simulation based on active settings
  const dynamicPromptPreview = (() => {
    switch(tutorMode) {
      case "ELI5_Beginner":
        return `[SYSTEM INSTRUCTION MODE: ELI5 BEGINNER]
- Present all legal and technical materials using simplified visual analogies (e.g., comparing Lightning channels to dual-signed ledger tab systems).
- Enforce creativity index of ${creativity} to inject highly conversational, warm African context structures.
- License references assume: ${licensing}`;
      case "Socratic_Inquiry":
        return `[SYSTEM INSTRUCTION MODE: SOCRATIC INQUIRY]
- Never supply absolute raw answers first. Pose dual rhetorical policy questions.
- Maintain academic neutral ground. Drive users to discover thermodynamic constraints.
- Temperature weights are configured to deterministic strictness: ${creativity}`;
      case "Academic_Dense":
        return `[SYSTEM INSTRUCTION MODE: ACADEMIC DENSE]
- Cite specific legal codes, BSRF regulatory paragraphs, and thermodynamic math proofs.
- Vocabulary target is postgraduate level. License constraints: ${licensing}.
- Rigorous peer-reviewer standards applied. Requires consensus: ${requirePeerApproval}`;
      case "Technical_Deep":
        return `[SYSTEM INSTRUCTION MODE: TECHNICAL DEEP]
- Provide pure raw code parameters, JSON schemas, and command terminal specifications.
- Highlight asymmetric cryptography signatures and block hash configurations.
- Deterministic index: ${creativity}`;
      default:
        return "";
    }
  })();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gray-950 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-brand-500" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div>
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest block mb-1 font-mono">
            Global configurations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-display tracking-tight">
            Lab Settings
          </h1>
          <p className="text-xs text-gray-550 mt-1 leading-relaxed">
            Configure academic metadata identifiers, peer review consensus mandates, and live AI model temperature configurations.
          </p>
        </div>

        <button
          onClick={handleSaveConfigs}
          className="bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-xl shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer self-start md:self-auto hover:scale-102"
        >
          <Save className="w-4.5 h-4.5" />
          <span>Save Configurations</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left side parameters: Config groups */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity settings */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
            <h3 className="text-sm sm:text-base font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-4 font-display">
              <Settings className="h-5 w-5 text-brand-500" />
              Sovereign Lab Identity
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                  Lab Division Identifier
                </label>
                <input 
                  type="text" 
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  className="w-full bg-white rounded-xl p-3 text-xs sm:text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-800 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                  Default Legal Licensing Structure
                </label>
                <select 
                  value={licensing}
                  onChange={(e) => setLicensing(e.target.value)}
                  className="w-full bg-white rounded-xl p-3 text-xs sm:text-sm font-bold text-gray-750 outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer shadow-sm appearance-none"
                >
                  <option value="Apache-2.0">Apache License 2.0 (Permissive)</option>
                  <option value="MIT">MIT License (Standard Open Source)</option>
                  <option value="GPL-3.0">GNU GPLv3 (Copyleft Copy)</option>
                  <option value="Unlicense">The Unlicense (Public Domain)</option>
                </select>
              </div>

              <div className="pt-3">
                <label className="flex items-start gap-3.5 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={requirePeerApproval}
                    onChange={(e) => setRequirePeerApproval(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-brand-500 border-gray-300 focus:ring-brand-500 cursor-pointer mt-0.5"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-bold text-gray-950 font-display">Require Peer Reviewer Consensus</span>
                    <p className="text-[10px] text-gray-400 font-mono mt-1 leading-normal">
                      Mandate dual cryptographic signatory approval before draft papers can be synchronized onto the public moloBTC home feed.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* AI Tutor configs */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
            <h3 className="text-sm sm:text-base font-bold text-gray-950 flex items-center gap-2 border-b border-gray-50 pb-4 font-display">
              <GraduationCap className="h-5.5 w-5.5 text-brand-500" />
              Molo Cognitive Tutor Parameters
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                  Pedagogical Paradigm Preset
                </label>
                <select 
                  value={tutorMode}
                  onChange={(e) => setTutorMode(e.target.value)}
                  className="w-full bg-white rounded-xl p-3 text-xs sm:text-sm font-bold text-gray-750 outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer shadow-sm appearance-none"
                >
                  <option value="ELI5_Beginner">ELI5 Beginner (Analogies & Simplifications)</option>
                  <option value="Socratic_Inquiry">Socratic Inquiry (Guided Questions)</option>
                  <option value="Academic_Dense">Academic Dense (Math Proofs & Legal Citations)</option>
                  <option value="Technical_Deep">Technical Deep (Code & Cryptography)</option>
                </select>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                    Inference Temperature (Creativity)
                  </label>
                  <span className="text-xs font-bold text-brand-600 font-mono bg-brand-50 px-2 py-0.5 rounded-lg">{creativity}</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                  <span className="text-[10px] text-gray-450 font-mono font-bold">Deterministic</span>
                  <input 
                    type="range" 
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                    className="flex-1 accent-brand-500 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-450 font-mono font-bold">Creative</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Dynamic simulation preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#1C1816] p-6 sm:p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] space-y-5 text-gray-100 sticky top-24">
            <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
              <Sparkles className="h-5 w-5 text-brand-400 animate-pulse" />
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Neural Instruction Preview
              </h3>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
              Based on your active configurations, the Gemini LLM client will adapt its core system prompt constraints across all chat panels:
            </p>

            <div className="bg-[#120F0D] p-4.5 rounded-2xl font-mono text-[11px] text-brand-300 leading-relaxed whitespace-pre-wrap select-none shadow-inner">
              {dynamicPromptPreview}
            </div>

            <div className="bg-[#2C2320] p-4 rounded-2xl flex gap-3 shadow-md shadow-brand-500/5">
              <InfoIcon className="h-4.5 w-4.5 text-brand-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-300 leading-normal font-sans">
                These constraints update the server's context window rules on the client-facing website instantly upon clicking <strong>Save Configurations</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
