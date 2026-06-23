import { useEffect, useState } from "react";
import { 
  Trash2, 
  FolderPlus, 
  Settings, 
  Sparkles, 
  Sliders, 
  Shield, 
  Info, 
  Check, 
  Compass, 
  BookOpen, 
  Briefcase, 
  ExternalLink,
  Plus,
  Trash,
  Globe,
  Layers,
  MapPin,
  HelpCircle
} from "lucide-react";

export function AdminSettings() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  // Platform identity configs
  const [labName, setLabName] = useState(() => localStorage.getItem("molo_lab_name") || "Molo BTC Research Lab");
  const [licensing, setLicensing] = useState(() => localStorage.getItem("molo_licensing") || "Apache-2.0");
  const [requirePeerApproval, setRequirePeerApproval] = useState(() => localStorage.getItem("molo_peer_approval") !== "false");

  // Simulator configurations
  const [defaultFee, setDefaultFee] = useState(() => Number(localStorage.getItem("molo_default_fee") || "10"));
  const [defaultBalance, setDefaultBalance] = useState(() => Number(localStorage.getItem("molo_default_balance") || "10000"));

  // Tutor parameters
  const [tutorMode, setTutorMode] = useState(() => localStorage.getItem("molo_tutor_mode") || "ELI5_Beginner");
  const [creativity, setCreativity] = useState(() => Number(localStorage.getItem("molo_tutor_creativity") || "0.4"));

  // Dynamic Content states from server db.json
  const [perspectives, setPerspectives] = useState<any>({});
  const [ecosystemTabs, setEcosystemTabs] = useState<any>({});
  const [africanLensChapters, setAfricanLensChapters] = useState<any>({});

  // Active admin layout tabs
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>("lab"); // "lab", "ecosystem", "perspectives", "chapters"
  const [editingEcosystemKey, setEditingEcosystemKey] = useState<string>("learn"); // "learn", "build", "mine", "use", "work"
  const [editingPerspectiveKey, setEditingPerspectiveKey] = useState<string>("inflation"); // "inflation", "inclusion", "mining", "remittance"
  const [editingChapterKey, setEditingChapterKey] = useState<string>("inflation"); // "inflation", "savings", "lightning", "energy", "circular", "momo"

  const [savingMessage, setSavingMessage] = useState("");

  const fetchCategories = () => {
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  };

  const fetchHomepageData = () => {
    fetch("/api/homepage/data")
      .then(r => r.json())
      .then(data => {
        setPerspectives(data.perspectives || {});
        setEcosystemTabs(data.ecosystemTabs || {});
        setAfricanLensChapters(data.africanLensChapters || {});
      })
      .catch(err => console.error("Error loading homepage dynamic items in admin settings:", err));
  };

  useEffect(() => {
    fetchCategories();
    fetchHomepageData();
  }, []);

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure? This doesn't remove the category from existing articles.")) {
      fetch(`/api/categories/${id}`, { method: "DELETE" })
        .then(() => fetchCategories());
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCatName })
    })
      .then(() => {
        setNewCatName("");
        setIsAddingCategory(false);
        fetchCategories();
      });
  };

  // Saved local parameters (identity, simulator, AI engine)
  const handleSaveConfigs = () => {
    localStorage.setItem("molo_lab_name", labName);
    localStorage.setItem("molo_licensing", licensing);
    localStorage.setItem("molo_peer_approval", String(requirePeerApproval));
    localStorage.setItem("molo_default_fee", String(defaultFee));
    localStorage.setItem("molo_default_balance", String(defaultBalance));
    localStorage.setItem("molo_tutor_mode", tutorMode);
    localStorage.setItem("molo_tutor_creativity", String(creativity));

    setSavingMessage("Configurations saved directly to local storage presets!");
    setTimeout(() => setSavingMessage(""), 3000);
  };

  // Save server database homepage dynamic objects
  const handleSaveHomepageData = (
    updatedPerspectives = perspectives, 
    updatedEcosystem = ecosystemTabs, 
    updatedChapters = africanLensChapters
  ) => {
    setSavingMessage("Saving dynamic configuration live to workspace server...");
    
    fetch("/api/homepage/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        perspectives: updatedPerspectives,
        ecosystemTabs: updatedEcosystem,
        africanLensChapters: updatedChapters
      })
    })
      .then(r => r.json())
      .then(res => {
        if (res.success) {
          setSavingMessage("Live homepage configurations saved & synchronized successfully!");
          setTimeout(() => setSavingMessage(""), 4000);
        } else {
          setSavingMessage("Failed to save: " + (res.error || "Unknown server error"));
        }
      })
      .catch(err => {
        console.error(err);
        setSavingMessage("Network failure when saving homepage content.");
      });
  };

  // Helper callbacks to update variables inside state records
  const handlePerspectiveFieldChange = (key: string, field: string, val: string) => {
    const updated = {
      ...perspectives,
      [key]: {
        ...perspectives[key],
        [field]: val
      }
    };
    setPerspectives(updated);
  };

  const handleChapterFieldChange = (key: string, field: string, val: string) => {
    const updated = {
      ...africanLensChapters,
      [key]: {
        ...africanLensChapters[key],
        [field]: val
      }
    };
    setAfricanLensChapters(updated);
  };

  const handleEcosystemHeaderChange = (key: string, field: string, val: string) => {
    const updated = {
      ...ecosystemTabs,
      [key]: {
        ...ecosystemTabs[key],
        [field]: val
      }
    };
    setEcosystemTabs(updated);
  };

  const handleCuratedPathFieldChange = (tabKey: string, pathIndex: number, field: string, val: string) => {
    const tab = ecosystemTabs[tabKey];
    if (!tab) return;
    const paths = [...(tab.curatedPaths || [])];
    paths[pathIndex] = {
      ...paths[pathIndex],
      [field]: val
    };
    const updated = {
      ...ecosystemTabs,
      [tabKey]: {
        ...tab,
        curatedPaths: paths
      }
    };
    setEcosystemTabs(updated);
  };

  const handleAddCuratedPath = (tabKey: string) => {
    const tab = ecosystemTabs[tabKey];
    if (!tab) return;
    const paths = [...(tab.curatedPaths || [])];
    paths.push({ name: "New Platform / Resource", url: "https://", desc: "A brief description of this site layout." });
    const updated = {
      ...ecosystemTabs,
      [tabKey]: {
        ...tab,
        curatedPaths: paths
      }
    };
    setEcosystemTabs(updated);
  };

  const handleRemoveCuratedPath = (tabKey: string, pathIndex: number) => {
    const tab = ecosystemTabs[tabKey];
    if (!tab) return;
    const paths = (tab.curatedPaths || []).filter((_: any, idx: number) => idx !== pathIndex);
    const updated = {
      ...ecosystemTabs,
      [tabKey]: {
        ...tab,
        curatedPaths: paths
      }
    };
    setEcosystemTabs(updated);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header section with tab indicators */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div>
          <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-2.5 py-1 rounded font-mono block w-fit mb-2">Workspace Content Deck</span>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight font-display">Lab Administration Center</h1>
          <p className="text-gray-500 mt-1 text-sm font-sans">Configure platform variables, simulator matrices, resource directories, and core research frameworks.</p>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-center">
          <button 
            onClick={() => {
              if (activeSettingsTab === "lab") {
                handleSaveConfigs();
              } else {
                handleSaveHomepageData();
              }
            }}
            className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {activeSettingsTab === "lab" ? "Save Identity Settings" : "Publish Content Changes"}
          </button>
        </div>
      </div>

      {savingMessage && (
        <div className="bg-brand-500/10 border border-brand-500/20 text-brand-900 rounded-2xl p-4 flex items-center gap-2.5 text-xs font-semibold animate-pulse shadow-sm">
          <Check className="h-4.5 w-4.5 text-brand-500 shrink-0" />
          {savingMessage}
        </div>
      )}

      {/* Main Settings Navigation Rail Tabs */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveSettingsTab("lab")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSettingsTab === "lab"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-650"
          }`}
        >
          <Settings className="w-4 h-4" />
          Lab Config & Taxonomies
        </button>

        <button
          onClick={() => setActiveSettingsTab("ecosystem")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSettingsTab === "ecosystem"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-650"
          }`}
        >
          <Compass className="w-4 h-4" />
          Ecosystem Directory
        </button>

        <button
          onClick={() => setActiveSettingsTab("perspectives")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSettingsTab === "perspectives"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-650"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Orange Lens Perspectives
        </button>

        <button
          onClick={() => setActiveSettingsTab("chapters")}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
            activeSettingsTab === "chapters"
              ? "border-brand-500 text-brand-600"
              : "border-transparent text-gray-400 hover:text-gray-650"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          African Research Chapters
        </button>
      </div>

      {/* 1. SECTION TAB: LAB GENERAL SETTINGS */}
      {activeSettingsTab === "lab" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left side parameters */}
          <div className="space-y-8">
            
            {/* Section: Platform attributes */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-3 font-display">
                <Shield className="h-4.5 w-4.5 text-brand-500" />
                Workspace Base Identity
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Research Division Identifier</label>
                  <input 
                    type="text" 
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Open Source License Code</label>
                  <select 
                    value={licensing}
                    onChange={(e) => setLicensing(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="Apache-2.0">Apache 2.0 (Standard Permissive)</option>
                    <option value="MIT">MIT License (Ultra Liberal)</option>
                    <option value="GPL-3.0">GNU GPLv3 (Copyleft Enforcement)</option>
                    <option value="BSL-1.0">Bitcoin Software License</option>
                    <option value="CC-BY-4.0">Creative Commons Attribution 4.0</option>
                  </select>
                </div>

                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={requirePeerApproval}
                    onChange={(e) => setRequirePeerApproval(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 text-brand-500 border-gray-300 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Require Peer-Review Consent</span>
                    <p className="text-[10px] text-gray-400">Locks live feed articles until approved by at least 1 other teammate.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Section: Simulator customization */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-3 font-display">
                <Sliders className="h-4.5 w-4.5 text-brand-500" />
                Bitcoin Simulators Defaults
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Default Fee (Sats)</label>
                  <input 
                    type="number" 
                    value={defaultFee}
                    onChange={(e) => setDefaultFee(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 text-gray-800 font-mono"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Alice Wallet Balance (Sats)</label>
                  <input 
                    type="number" 
                    value={defaultBalance}
                    onChange={(e) => setDefaultBalance(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 text-gray-800 font-mono"
                    step="500"
                  />
                </div>
              </div>
              
              <div className="bg-[#FCFAF7] p-3 rounded-xl flex gap-2 border border-gray-150">
                <Info className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Updating these parameters changes the starting values of the transaction fee calculations and seed balance pools in the physical Bitcoin simulators.
                </p>
              </div>
            </div>

          </div>

          {/* Right side parameters */}
          <div className="space-y-8">
            
            {/* Section: AI Tutor customizer */}
            <div className="bg-white p-6 rounded-3xl border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-3 font-display">
                <Sparkles className="h-4.5 w-4.5 text-brand-500" />
                Molo AI Tutor Intelligence
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Tone/Explanation Preset</label>
                  <select 
                    value={tutorMode}
                    onChange={(e) => setTutorMode(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="ELI5_Beginner">Beginner-Friendly ELI5 (Metaphors & Visuals)</option>
                    <option value="Academic_Dense">Academic Rigorous (Mathematics & Protocols)</option>
                    <option value="Pragmatic_Coder">Pragmatic Developer (Solidity & UTXO Code)</option>
                    <option value="Socratic_Coach">Socratic Inquiry (Guides user with questions)</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tutor Creativity (Temperature)</label>
                    <span className="text-xs font-mono font-bold text-brand-600">{creativity}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={creativity}
                    onChange={(e) => setCreativity(Number(e.target.value))}
                    className="w-full accent-brand-500 cursor-pointer h-1.5 bg-gray-100 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-semibold">
                    <span>Focused (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Taxonomy categories */}
            <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden text-sm">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-950 font-display text-sm">Taxonomy Categories</h3>
                  <p className="text-[10px] text-gray-400 font-medium font-sans">Categorization filters for core research files.</p>
                </div>
                <button 
                  onClick={() => setIsAddingCategory(true)}
                  className="flex items-center gap-1 bg-gray-950 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  New
                </button>
              </div>

              {isAddingCategory && (
                <form onSubmit={handleAddCategory} className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-200 rounded-lg p-2 text-xs outline-none bg-white font-medium" 
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Scaling Protocols"
                    autoFocus
                  />
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="text-gray-500 hover:text-gray-900 text-xs font-semibold px-1">Cancel</button>
                  <button type="submit" className="bg-brand-500 text-white rounded-lg px-3 py-1.5 text-xs font-bold hover:bg-brand-600">Add</button>
                </form>
              )}

              <ul className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <li key={cat.id} className="p-3.5 px-6 flex items-center justify-between hover:bg-brand-50/10 transition-colors">
                    <div>
                      <span className="font-extrabold text-gray-800 text-xs">{cat.name}</span>
                      <span className="text-gray-400 text-[10px] ml-2 font-mono">/{cat.slug}</span>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1" title="Delete category">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
                {categories.length === 0 && (
                  <li className="p-8 text-center text-gray-400 text-xs text-sans">No categories found.</li>
                )}
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* 2. SECTION TAB: ECOSYSTEM DIRECTORY EDITOR */}
      {activeSettingsTab === "ecosystem" && Object.keys(ecosystemTabs).length > 0 && (
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50/70 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-display">
                <Compass className="w-5 h-5 text-brand-500" />
                Ecosystem Hub Director
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Edit Curated Paths, educational course lines, wallet recommendations, or work opportunities.</p>
            </div>
            
            <button
              onClick={() => handleSaveHomepageData(undefined, ecosystemTabs, undefined)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Sync Directory Live
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Sidebar directory list selector */}
            <div className="md:col-span-3 border-r border-gray-100 bg-[#FCFAF7] p-4 space-y-1">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 px-2 font-mono">Directories</span>
              {Object.keys(ecosystemTabs).map((key) => (
                <button
                  key={key}
                  onClick={() => setEditingEcosystemKey(key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    editingEcosystemKey === key
                      ? "bg-brand-50 font-black text-brand-700 shadow-sm border border-brand-100"
                      : "text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <span className="capitalize">{key} Directory</span>
                  <span className="text-[10px] font-mono text-gray-400 fill-gray-300">
                    {ecosystemTabs[key]?.curatedPaths?.length || 0} links
                  </span>
                </button>
              ))}
            </div>

            {/* Target workspace sub-form */}
            <div className="md:col-span-9 p-6 space-y-6">
              
              {/* Tab Label / Description edit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FCFAF7] p-5 rounded-2xl border border-gray-105">
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Directory Tab Button Title</label>
                  <input
                    type="text"
                    value={ecosystemTabs[editingEcosystemKey]?.title || ""}
                    onChange={(e) => handleEcosystemHeaderChange(editingEcosystemKey, "title", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-brand-500 bg-white font-bold text-gray-800 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1.5 font-mono">Directory Subtitle Description</label>
                  <input
                    type="text"
                    value={ecosystemTabs[editingEcosystemKey]?.subtitle || ""}
                    onChange={(e) => handleEcosystemHeaderChange(editingEcosystemKey, "subtitle", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:border-brand-500 bg-white font-bold text-gray-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Resource Link items array form */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider font-mono">
                    Curated Resource Items ({ecosystemTabs[editingEcosystemKey]?.curatedPaths?.length || 0})
                  </h4>
                  <button
                    onClick={() => handleAddCuratedPath(editingEcosystemKey)}
                    className="flex items-center gap-1 bg-brand-50 hover:bg-brand-100 text-brand-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border border-brand-100"
                  >
                    <Plus className="w-4 h-4" />
                    New Resource Link
                  </button>
                </div>

                <div className="space-y-4">
                  {ecosystemTabs[editingEcosystemKey]?.curatedPaths?.map((path: any, idx: number) => (
                    <div 
                      key={idx}
                      className="group bg-white p-5 rounded-2xl border border-gray-150 hover:border-brand-200 shadow-sm transition-all relative"
                    >
                      {/* Delete resource option */}
                      <button
                        onClick={() => handleRemoveCuratedPath(editingEcosystemKey, idx)}
                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="Delete Resource"
                      >
                        <Trash className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 font-mono">Resource Name / Platform</label>
                          <input
                            type="text"
                            value={path.name || ""}
                            onChange={(e) => handleCuratedPathFieldChange(editingEcosystemKey, idx, "name", e.target.value)}
                            className="w-full border border-gray-200 rounded-xl p-2 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] font-bold text-gray-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 font-mono">Hyperlink Node URL</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={path.url || ""}
                              onChange={(e) => handleCuratedPathFieldChange(editingEcosystemKey, idx, "url", e.target.value)}
                              className="w-full border border-gray-200 rounded-xl p-2 pr-8 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] text-gray-650 font-mono"
                            />
                            <a 
                              href={path.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="absolute right-2.5 top-2.5 text-gray-400 hover:text-brand-500"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 font-mono">Abstract / Description details</label>
                        <textarea
                          rows={2}
                          value={path.desc || ""}
                          onChange={(e) => handleCuratedPathFieldChange(editingEcosystemKey, idx, "desc", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-xs outline-none bg-[#FCFAF7] text-gray-600 focus:border-brand-500 font-sans"
                        />
                      </div>
                    </div>
                  ))}

                  {(!ecosystemTabs[editingEcosystemKey]?.curatedPaths || ecosystemTabs[editingEcosystemKey]?.curatedPaths.length === 0) && (
                    <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl text-center text-gray-400 text-xs">
                      No curated links mapped in this workspace. Create your first resource!
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 3. SECTION TAB: ORANGE LENS PERSPECTIVES */}
      {activeSettingsTab === "perspectives" && Object.keys(perspectives).length > 0 && (
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50/70 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-display">
                <Sparkles className="w-5 h-5 text-brand-500" />
                Orange Lens Interactive Matrix
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Control perspectives of the interactive Orange-Lensed simulator element (Title, Stats focus, Descriptions, and flow route metrics).</p>
            </div>
            
            <button
              onClick={() => handleSaveHomepageData(perspectives, undefined, undefined)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Sync Perspectives Live
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left sidebar select */}
            <div className="md:col-span-3 border-r border-gray-100 bg-[#FCFAF7] p-4 space-y-1">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 px-2 font-mono">Perspectives</span>
              {Object.keys(perspectives).map((key) => (
                <button
                  key={key}
                  onClick={() => setEditingPerspectiveKey(key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    editingPerspectiveKey === key
                      ? "bg-brand-50 font-black text-brand-700 shadow-sm border border-brand-100"
                      : "text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <span className="capitalize">{perspectives[key]?.title || key}</span>
                </button>
              ))}
            </div>

            {/* Editing perspective details form fields */}
            <div className="md:col-span-9 p-6">
              
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Perspective Node Title</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] font-bold text-gray-900"
                      value={perspectives[editingPerspectiveKey]?.title || ""}
                      onChange={(e) => handlePerspectiveFieldChange(editingPerspectiveKey, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Focus Stat Metric (Inside Orange View)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] text-gray-800 font-bold"
                      value={perspectives[editingPerspectiveKey]?.stat || ""}
                      onChange={(e) => handlePerspectiveFieldChange(editingPerspectiveKey, "stat", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Fact Line / Image Banner Tagline</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] text-gray-900 font-semibold"
                    value={perspectives[editingPerspectiveKey]?.factLine || ""}
                    onChange={(e) => handlePerspectiveFieldChange(editingPerspectiveKey, "factLine", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Narrative Breakdown Description</label>
                  <textarea
                    rows={4}
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] text-gray-700 leading-relaxed font-sans"
                    value={perspectives[editingPerspectiveKey]?.description || ""}
                    onChange={(e) => handlePerspectiveFieldChange(editingPerspectiveKey, "description", e.target.value)}
                  />
                </div>

                <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100">
                  <label className="block text-[10px] font-bold text-brand-800 uppercase tracking-wider mb-2 font-mono">Interactive Highlighting Code Line (Nodes Connection Metaphor)</label>
                  <input
                    type="text"
                    className="w-full border border-brand-250 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-white text-gray-900 font-mono font-bold"
                    value={perspectives[editingPerspectiveKey]?.highlight || ""}
                    onChange={(e) => handlePerspectiveFieldChange(editingPerspectiveKey, "highlight", e.target.value)}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* 4. SECTION TAB: AFRICAN RESEARCH CHAPTERS */}
      {activeSettingsTab === "chapters" && Object.keys(africanLensChapters).length > 0 && (
        <div className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 bg-gray-50/70 border-b border-gray-150 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 font-display">
                <BookOpen className="w-5 h-5 text-brand-500" />
                Research Framework - "Through An African Lens"
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">Edit thesis papers, geographical markers, specific focus metrics, and academic headers mapping continental Bitcoin trends.</p>
            </div>
            
            <button
              onClick={() => handleSaveHomepageData(undefined, undefined, africanLensChapters)}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              Sync Chapters Live
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left sidebar select */}
            <div className="md:col-span-3 border-r border-gray-100 bg-[#FCFAF7] p-4 space-y-1">
              <span className="text-[9px] font-black uppercase text-gray-400 block mb-3 px-2 font-mono">Chapters</span>
              {Object.keys(africanLensChapters).map((key) => (
                <button
                  key={key}
                  onClick={() => setEditingChapterKey(key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    editingChapterKey === key
                      ? "bg-brand-50 font-black text-brand-700 shadow-sm border border-brand-100"
                      : "text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <span className="capitalize">{africanLensChapters[key]?.header ? africanLensChapters[key].header.split(" & ").pop() : key}</span>
                </button>
              ))}
            </div>

            {/* Edit chapter detail form */}
            <div className="md:col-span-9 p-6">
              
              <div className="space-y-6">
                
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Chapter Header Title</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] font-bold text-gray-950"
                    value={africanLensChapters[editingChapterKey]?.header || ""}
                    onChange={(e) => handleChapterFieldChange(editingChapterKey, "header", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Geographical Mapping / Location Focus</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-3 w-4 h-4 text-brand-500" />
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-xl p-3 pl-9 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] font-bold text-gray-800"
                        value={africanLensChapters[editingChapterKey]?.location || ""}
                        onChange={(e) => handleChapterFieldChange(editingChapterKey, "location", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Key Metric Stat Target</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] text-gray-900 font-bold"
                      value={africanLensChapters[editingChapterKey]?.stat || ""}
                      onChange={(e) => handleChapterFieldChange(editingChapterKey, "stat", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5 font-mono">Research Thesis Abstract</label>
                  <textarea
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-xs outline-none focus:border-brand-500 bg-[#FCFAF7] text-gray-700 leading-relaxed font-sans"
                    value={africanLensChapters[editingChapterKey]?.thesis || ""}
                    onChange={(e) => handleChapterFieldChange(editingChapterKey, "thesis", e.target.value)}
                  />
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
