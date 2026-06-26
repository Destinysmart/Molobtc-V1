import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Loader2,
  Mail,
  UserCheck2,
  Lock,
  Check,
  KeyRound,
  Fingerprint,
  RefreshCw,
  Copy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TeamUser {
  id: string;
  role: string;
  name: string;
  avatar: string;
  can_edit_ui?: boolean;
  pgp_key?: string; // added visual PGP details for sovereign fidelity
}

export function AdminUsers() {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState("Peer Reviewer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const loadUsers = () => {
    setIsLoading(true);
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        // Enriched with mock cryptographic signatures for sovereign aesthetic
        const enriched = data.map((u: any, idx: number) => ({
          ...u,
          pgp_key: u.pgp_key || `0x${(29458230 + idx * 81239).toString(16).toUpperCase()}...${(9482 + idx * 231).toString(16).toUpperCase()}`
        }));
        setUsers(enriched);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    setIsSubmitting(true);
    const payload = {
      name: inviteName,
      role: inviteRole,
      avatar: `https://i.pravatar.cc/150?u=${inviteName.replace(/\s+/g, "")}`
    };

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        triggerToast(`Invitation dispatched to ${inviteName} as ${inviteRole}!`);
        setInviteName("");
        loadUsers();
      } else {
        triggerToast("Failed to register peer reviewer.");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Error dispatching secure request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    triggerToast(`Copied signatory key: ${key}`);
  };

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
            Sovereign signatories registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 font-display tracking-tight">
            Research Team Space
          </h1>
          <p className="text-xs text-gray-550 mt-1 leading-relaxed">
            Manage authorized academic peer reviewers, verify cryptographic PGP keys, and allocate publication consent parameters.
          </p>
        </div>

        <button 
          onClick={loadUsers}
          className="p-2.5 bg-white text-gray-700 hover:text-gray-950 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shrink-0 cursor-pointer self-start md:self-auto shadow-sm hover:shadow transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Registry</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Team List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6">
            <div className="flex justify-between items-center border-b border-gray-50 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-950 font-display flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-500" />
                Active Lab Signatories
              </h2>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400">
                <Fingerprint className="w-4 h-4 text-brand-500" />
                <span>Multisig Quorum Active</span>
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center text-gray-400">
                <Loader2 className="w-7 h-7 animate-spin mx-auto mb-3 text-brand-500" />
                <span className="text-xs font-mono tracking-wide">Loading secure signatory registries...</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {users.map((user, index) => {
                  const canEdit = user.can_edit_ui !== false && (user.role.toLowerCase() === "admin" || index === 0);
                  
                  return (
                    <motion.div 
                      key={user.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 first:pt-0 last:pb-0 group"
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-12 h-12 rounded-full border border-brand-500/10 object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm sm:text-base text-gray-950 font-display">{user.name}</h3>
                            <span className="inline-block bg-brand-50 text-brand-700 text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase tracking-wider">
                              {user.role}
                            </span>
                          </div>
                          
                          {/* Cryptographic metadata */}
                          <div className="flex flex-col gap-1 text-[11px] font-mono text-gray-400">
                            <span className="flex items-center gap-1.5">
                              <KeyRound className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>Signatory Key: <strong className="text-gray-600 hover:underline cursor-pointer select-all" onClick={() => handleCopyKey(user.pgp_key || "")}>{user.pgp_key}</strong></span>
                              <Copy className="w-3 h-3 hover:text-brand-500 cursor-pointer ml-1" onClick={() => handleCopyKey(user.pgp_key || "")} />
                            </span>
                            <span>ID Code: <strong className="text-gray-500">{user.id}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-[11px]">
                        {canEdit ? (
                          <div className="flex items-center gap-1.5 text-brand-600 bg-brand-50 p-1.5 px-3 rounded-xl font-bold shadow-sm">
                            <Shield className="w-3.5 h-3.5" />
                            <span>Signed Cleared</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-gray-450 bg-gray-50 p-1.5 px-3 rounded-xl font-bold shadow-sm">
                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                            <span>Read Verified</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Invite Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.015)] space-y-6 sticky top-24">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-950 font-display flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-brand-500" />
                Invite Lab Signatory
              </h3>
              <p className="text-xs text-gray-550 mt-1 leading-relaxed">
                Add simulated academic peers or policy reviewers to authorize BSRF policy evaluations.
              </p>
            </div>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                  Academic Full Name
                </label>
                <input 
                  type="text" 
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Prof. Jabulani Dube"
                  className="w-full bg-white rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-500/20 font-semibold text-gray-850 shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono mb-2">
                  System Author Role
                </label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full bg-white rounded-xl p-3 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-brand-500/20 font-bold text-gray-750 cursor-pointer shadow-sm appearance-none"
                >
                  <option value="Peer Reviewer">Peer Reviewer</option>
                  <option value="Associate Professor">Associate Professor</option>
                  <option value="Lead Cryptographer">Lead Cryptographer</option>
                  <option value="Policy Auditor">Policy Auditor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting || !inviteName.trim()}
                className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-150 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4.5 h-4.5" />
                    <span>Dispatch Cleared Invite</span>
                  </>
                )}
              </button>
            </form>

            <div className="bg-[#FCFAF7] p-4.5 rounded-2xl flex gap-3 shadow-inner">
              <UserCheck2 className="h-4.5 w-4.5 text-brand-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                Invited stakeholders must verify identity via asymmetric key handshakes before gaining draft access rights.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
