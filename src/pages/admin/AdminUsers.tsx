import { useEffect, useState } from "react";
import { Trash2, UserPlus, Shield, Mail, Check, AlertCircle, Sparkles } from "lucide-react";

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Researcher");
  
  // Role based capabilities
  const [canPublish, setCanPublish] = useState(true);
  const [canEditUI, setCanEditUI] = useState(false);

  const fetchUsers = () => {
    fetch("/api/users")
      .then(r => r.json())
      .then(data => {
        // Enriched list with email & specific flags if empty
        const mapped = data.map((u: any, index: number) => {
          const names = ["Satoshi", "Hal", "Nick", "Adam", "Greg", "alice", "bob"];
          const domain = "molobtc.org";
          const defaultEmail = `${u.name?.toLowerCase().replace(/\s+/g, '') || 'user' + index}@${domain}`;
          return {
            ...u,
            email: u.email || defaultEmail,
            can_publish: u.can_publish !== undefined ? u.can_publish : true,
            can_edit_ui: u.can_edit_ui !== undefined ? u.can_edit_ui : (u.role === 'admin' || index === 0)
          };
        });
        setUsers(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to revoke this user's research access?")) {
      fetch(`/api/users/${id}`, { method: "DELETE" })
        .then(() => fetchUsers());
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: newUserName, 
        role: newUserRole,
        email: newUserEmail,
        can_publish: canPublish,
        can_edit_ui: canEditUI,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(newUserEmail)}`
      })
    })
      .then(() => {
        setNewUserName("");
        setNewUserEmail("");
        setNewUserRole("Researcher");
        setCanPublish(true);
        setCanEditUI(false);
        setIsAddingUser(false);
        fetchUsers();
      });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header element */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-150 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight font-display">Research Team & Controls</h1>
          <p className="text-gray-500 mt-1 text-sm">Add qualified collaborators with role-based and permission-scoped clearance.</p>
        </div>
        <button 
          onClick={() => {
            setIsAddingUser(!isAddingUser);
            // Default random generator name for instant UX ease
            setNewUserName("");
            setNewUserEmail("");
          }}
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-md self-start"
        >
          <UserPlus className="h-4.5 w-4.5 stroke-[2]" />
          Invite Researcher
        </button>
      </div>

      {/* Adding dialog form */}
      {isAddingUser && (
        <form onSubmit={handleAddUser} className="mb-8 p-6 bg-white border border-gray-200 rounded-3xl shadow-md space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-sm text-gray-900 font-display">Invite Peer-Reviewer or Admin</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50/50" 
                value={newUserName}
                onChange={e => setNewUserName(e.target.value)}
                placeholder="Hal Finney"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50/50" 
                value={newUserEmail}
                onChange={e => setNewUserEmail(e.target.value)}
                placeholder="hal@finney.org"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Custom Role Badge</label>
              <select 
                className="w-full border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-brand-500 bg-gray-50/50"
                value={newUserRole}
                onChange={e => setNewUserRole(e.target.value)}
              >
                <option value="Lead Researcher">Lead Researcher</option>
                <option value="Open-Source Contributor">Open-Source Contributor</option>
                <option value="Peer Reviewer">Peer Reviewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          {/* Role based controls */}
          <div className="bg-[#FCFAF7] border border-gray-150 p-5 rounded-2xl">
            <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Configure Permissions Clearance</h4>
            <div className="flex flex-col sm:flex-row gap-6">
              
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={canPublish} 
                  onChange={e => setCanPublish(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-extrabold text-gray-800 block">Can Publish Research Papers</span>
                  <span className="text-[10px] text-gray-400">Allows instant deployment to the home feed without lead reviewer manual override.</span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={canEditUI} 
                  onChange={e => setCanEditUI(e.target.checked)}
                  className="mt-1 h-4 w-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-extrabold text-gray-800 block">Can Edit Website UI / Simulators</span>
                  <span className="text-[10px] text-gray-400">Allows changing peer fees, learning curves, and tutor personas in the workspace settings.</span>
                </div>
              </label>

            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={() => setIsAddingUser(false)} 
              className="px-4 py-2.5 text-xs text-gray-500 hover:text-gray-800 font-bold"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[#E66E00] hover:bg-[#B35500] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm"
            >
              Save Credentials
            </button>
          </div>
        </form>
      )}

      {/* Team table list */}
      <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-[#FCFAF7] border-b border-gray-150">
            <tr>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collaborator Space</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responsibility Role</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Clearances</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Revoke Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, i) => (
              <tr key={user.id || i} className="hover:bg-brand-50/10 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.name || 'key')}`} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-2xl bg-gray-100 border border-gray-200" 
                    />
                    <div>
                      <div className="font-extrabold text-gray-950 text-sm leading-tight">{user.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-300" />
                        {user.email || "researcher@molobtc.org"}
                      </div>
                    </div>
                  </div>
                </td>
                
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                    user.role === 'admin' || user.role === 'Admin'
                      ? 'bg-red-50 text-red-600 border border-red-100'
                      : 'bg-brand-50 text-brand-700 border border-brand-100'
                  }`}>
                    <Shield className="w-3.5 h-3.5 mt-[1px]" />
                    {user.role || "Researcher"}
                  </span>
                </td>

                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {user.can_publish ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase border border-green-100">
                        <Check className="w-3 h-3" /> Can Publish
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-400 px-2 py-0.5 rounded text-[10px] uppercase border border-gray-100">
                        Review Only
                      </span>
                    )}

                    {user.can_edit_ui && (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase border border-blue-100">
                        <Check className="w-3 h-3" /> Edit Website UI
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end">
                    <button 
                      onClick={() => handleDelete(user.id)} 
                      className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-xl transition-all"
                      title="Deauthorize team member"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-16 text-center text-gray-500 text-xs">
                  No registered active users in this laboratory workspace.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
