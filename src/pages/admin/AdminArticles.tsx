import { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, 
  Search, 
  Github, 
  Star, 
  GitFork, 
  Loader2, 
  X, 
  Check, 
  ExternalLink,
  FileText,
  Bookmark,
  Sparkles,
  RefreshCw,
  Clock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GitHubRepo } from "../../types";
import { githubService } from "../../services/githubService";

export function AdminArticles() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Drawer states
  const [activeRepoId, setActiveRepoId] = useState<string | null>(null);
  const [repoReadme, setRepoReadme] = useState<string>("");
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  // Fetch repositories
  const loadRepos = (silent = false) => {
    if (!silent) setIsLoading(true);
    githubService.getRepositories()
      .then(data => {
        setRepos(data);
        setIsLoading(false);
        setIsRefreshing(false);
        if (silent) triggerToast("Academic archives synced with live GitHub state!");
      })
      .catch(err => {
        console.error("Failed to load papers in admin articles:", err);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    loadRepos();
  }, []);

  const handleRefreshState = () => {
    setIsRefreshing(true);
    loadRepos(true);
  };

  // Category resolver matching homepage logic
  const getRepoCategory = (repoName: string): string => {
    const name = repoName.toLowerCase();
    if (name.includes("law") || name.includes("sovereign") || name.includes("objection") || name.includes("bearer") || name.includes("license")) {
      return "Sovereignty & Legal";
    }
    if (name.includes("infrastructure") || name.includes("physics") || name.includes("energy") || name.includes("scarcity") || name.includes("thermo")) {
      return "Physics & Energy";
    }
    if (name.includes("principles") || name.includes("ecosystem") || name.includes("channel") || name.includes("lightning") || name.includes("networks")) {
      return "Networks & Scaling";
    }
    return "General Study";
  };

  // Extract unique categories for tabs
  const categories = useMemo(() => {
    const cats = new Set<string>();
    repos.forEach(repo => {
      cats.add(getRepoCategory(repo.name));
    });
    return Array.from(cats);
  }, [repos]);

  // Filter papers
  const filteredRepos = useMemo(() => {
    return repos.filter(repo => {
      if (selectedCategory !== "all") {
        const cat = getRepoCategory(repo.name);
        if (cat !== selectedCategory) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return repo.name.toLowerCase().includes(q) || repo.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [repos, selectedCategory, searchQuery]);

  // Handle drawer opening
  const handleOpenReadme = (repo: GitHubRepo) => {
    setActiveRepoId(repo.id);
    setRepoReadme("");
    setIsLoadingReadme(true);

    githubService.getRepositoryReadme(repo.id)
      .then(content => {
        setRepoReadme(content);
        setIsLoadingReadme(false);
      })
      .catch(err => {
        console.error("Error fetching readme:", err);
        setRepoReadme("# Error loading source file\nFailed to sync plain text content from MoloBTC repositories.");
        setIsLoadingReadme(false);
      });
  };

  const handleCloseReadme = () => {
    setActiveRepoId(null);
    setRepoReadme("");
  };

  const activeRepo = useMemo(() => {
    return repos.find(r => r.id === activeRepoId);
  }, [repos, activeRepoId]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto relative">
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
            Ecosystem peer audit
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-display tracking-tight">
            Research Papers Hub
          </h1>
          <p className="text-xs text-gray-550 mt-1 leading-relaxed">
            Verify layout attributes, read plain text specs, and synchronize the core educational curriculum from github.com/molobtc.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Quick Search */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[2]" />
            <input 
              type="text" 
              placeholder="Filter synced papers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-500/20 placeholder:text-gray-400 font-medium shadow-sm"
            />
          </div>

          <button
            onClick={handleRefreshState}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-white text-gray-700 hover:text-gray-950 rounded-xl text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            title="Refresh database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-500" : ""}`} />
            <span>Sync GitHub</span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            selectedCategory === "all" 
              ? "bg-gray-950 text-white shadow-md shadow-gray-950/20 scale-102" 
              : "bg-white text-gray-600 hover:bg-gray-50/50 shadow-sm"
          }`}
        >
          All Papers ({repos.length})
        </button>
        {categories.map((cat) => {
          const count = repos.filter(r => getRepoCategory(r.name) === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? "bg-gray-950 text-white shadow-md shadow-gray-950/20 scale-102" 
                  : "bg-white text-gray-600 hover:bg-gray-50/50 shadow-sm"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Repos Grid & Table container */}
      <div className="bg-white rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] overflow-hidden">
        {isLoading ? (
          <div className="py-28 text-center text-gray-400 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-3" />
            <span className="text-xs font-semibold font-mono tracking-wider">Establishing secure synchronization channels with github.com/molobtc...</span>
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="py-24 text-center text-gray-400">
            <BookOpen className="w-12 h-12 stroke-[1.2] mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-sm text-gray-600 font-display">No matching research papers synced</p>
            <p className="text-xs text-gray-450 mt-1">Try resetting your filters or shifting your query parameter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FCFAF7] text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">
                  <th className="px-6 py-4.5">Research Specifications</th>
                  <th className="px-6 py-4.5">Legal Category</th>
                  <th className="px-6 py-4.5">Engagement Metrics</th>
                  <th className="px-6 py-4.5">Sync Integrity</th>
                  <th className="px-6 py-4.5 text-right">Audit Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                {filteredRepos.map((repo, idx) => {
                  const cat = getRepoCategory(repo.name);
                  return (
                    <motion.tr 
                      key={repo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                      className="hover:bg-gray-50/30 transition-colors"
                    >
                      {/* Name & Desc */}
                      <td className="px-6 py-5 max-w-md">
                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <BookOpen className="w-4.5 h-4.5 text-brand-600" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-extrabold text-gray-950 font-display leading-snug text-sm sm:text-base">{repo.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium">{repo.description}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mt-1">
                              <Clock className="w-3 h-3" />
                              <span>Last Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category Tag */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-block bg-brand-50 text-brand-700 font-sans text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                          {cat}
                        </span>
                      </td>

                      {/* Stars & Forks & Format */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="space-y-1.5 font-mono text-[11px] text-gray-600">
                          <div className="flex items-center gap-1.5 font-bold">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400" />
                            <span>{repo.stars || 42} Stars</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <GitFork className="w-3.5 h-3.5 text-gray-400" />
                            <span>{repo.forks || 8} Forks</span>
                          </div>
                          <span className="inline-block bg-gray-50 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold text-gray-500">Format: {repo.language || "MD"}</span>
                        </div>
                      </td>

                      {/* Status badge */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          <Check className="w-3 h-3" />
                          Verified Synced
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleOpenReadme(repo)}
                            className="p-2 px-3 bg-brand-50 hover:bg-brand-100/70 text-brand-700 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                            title="Read Plain Text Specification"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Audit Specs</span>
                          </button>
                          
                          <a
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all"
                            title="View On GitHub"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Slide-over Plain Text Read Specification Drawer */}
      <AnimatePresence>
        {activeRepoId && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseReadme}
              className="fixed inset-0 bg-gray-950/45 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full z-50"
            >
              {/* Header */}
              <div className="p-6 flex items-center justify-between bg-[#FCFAF7] border-b border-gray-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-brand-600 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
                    MoloBTC Source Reader Spec
                  </span>
                  <h3 className="font-extrabold text-base text-gray-950 font-display line-clamp-1">
                    {activeRepo?.name}
                  </h3>
                </div>
                
                <button 
                  onClick={handleCloseReadme}
                  className="p-1 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Markdown Content Pane */}
              <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-4 bg-gray-50/30">
                {isLoadingReadme ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-500 mb-2" />
                    <span>Loading spec stream...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm font-mono text-xs text-gray-700 leading-relaxed whitespace-pre-wrap max-w-none bg-[#1C1816] text-gray-100 rounded-2xl p-5 sm:p-6 select-text overflow-x-auto shadow-inner">
                    {repoReadme}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4.5 flex items-center justify-between bg-white shrink-0 border-t border-gray-100">
                <span className="text-[10px] font-mono text-gray-400">
                  Ref: github.com/molobtc
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={activeRepo?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 px-4 bg-gray-950 hover:bg-gray-900 text-white font-mono text-[10px] font-bold rounded-xl transition-all shadow-md shadow-gray-950/15 flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GITHUB ↗</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
