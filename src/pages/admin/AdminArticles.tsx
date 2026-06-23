import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Trash2, Eye, Plus, FileText, Github, Download, Search } from "lucide-react";

export function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchArticles = () => {
    fetch("/api/articles")
      .then(r => r.json())
      .then(setArticles);
  };

  useEffect(() => {
    fetchArticles();
    fetch("/api/categories")
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this research paper? This is irreversible.")) {
      fetch(`/api/articles/${id}`, { method: "DELETE" })
        .then(() => fetchArticles());
    }
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Unassigned";
  };

  const filteredArticles = articles.filter((a: any) => 
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-150 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight font-display">Research Papers</h1>
          <p className="text-gray-500 mt-1 text-sm">Draft, optimize, and organize simplified open-source Bitcoin research materials.</p>
        </div>
        <Link 
          to="/admin/editor/new" 
          className="bg-[#E66E00] hover:bg-[#B35500] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-1.5 self-start"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2]" />
          Publish Paper
        </Link>
      </div>

      {/* Search utility */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 stroke-[2.5]" />
        <input 
          type="text" 
          placeholder="Filter papers in workspace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-xs outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 placeholder:text-gray-400 font-medium"
        />
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FCFAF7] border-b border-gray-150">
            <tr>
              <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Research Overview</th>
              <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Workspace Category</th>
              <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metadata Sync</th>
              <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="py-4.5 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredArticles.map((article: any) => (
              <tr key={article.id} className="hover:bg-brand-50/15 transition-colors">
                <td className="py-4 px-6 max-w-md">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-extrabold text-gray-950 text-sm leading-snug">{article.title || "Untitled Paper"}</div>
                      <div className="text-[11px] text-gray-400 italic mt-0.5 font-sans truncate max-w-sm">"{article.subtitle}"</div>
                      <div className="text-[10px] font-mono text-gray-450 mt-1">Modified: {new Date(article.updated_at || Date.now()).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6 text-xs font-semibold text-gray-700">
                  <span className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md">
                    {getCategoryName(article.category_id)}
                  </span>
                </td>

                <td className="py-4 px-6 text-xs">
                  <div className="space-y-1">
                    {article.github_repo ? (
                      <a href={article.github_repo} target="_blank" rel="noreferrer" className="text-brand-650 hover:underline inline-flex items-center gap-1 font-mono text-[10px]">
                        <Github className="w-3.5 h-3.5" />
                        Source Repo
                      </a>
                    ) : (
                      <span className="text-gray-400 italic text-[10px]">No linked repository</span>
                    )}

                    {article.download_file && (
                      <div className="text-gray-500 flex items-center gap-1 font-mono text-[10px]">
                        <Download className="w-3.5 h-3.5 shrink-0" />
                        {article.download_file}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-650'}`}>
                    {article.status}
                  </span>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-3 text-gray-400">
                    <Link 
                      to={`/admin/editor/${article.id}`} 
                      className="p-1.5 hover:bg-brand-50 hover:text-brand-600 rounded-lg transition-all"
                      title="Edit Paper"
                    >
                      <Edit className="h-4.5 w-4.5" />
                    </Link>
                    <button 
                      onClick={() => handleDelete(article.id)} 
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                      title="Delete Paper"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredArticles.length === 0 && (
              <tr>
                <td colSpan={5} className="py-16 text-center text-gray-500 text-xs">
                  No research papers correspond to current search constraints.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
