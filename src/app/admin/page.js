"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ═══════════════════════════════════════════════
// SUPABASE CLIENT
// ═══════════════════════════════════════════════
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const sb = url && key ? createClient(url, key) : null;

// ═══════════════════════════════════════════════
// ICONS (inline SVGs)
// ═══════════════════════════════════════════════
const icons = {
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  briefcase: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  zap: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  folder: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  globe: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  plus: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  edit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  save: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  eye: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  x: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  arrows: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 15 12 20 17 15"/><polyline points="7 9 12 4 17 9"/></svg>,
};

// ═══════════════════════════════════════════════
// SECTIONS CONFIG
// ═══════════════════════════════════════════════
const sections = [
  { key: "personal_info", label: "Profil", icon: icons.user, single: true },
  { key: "experiences", label: "Expériences", icon: icons.briefcase },
  { key: "skills", label: "Compétences", icon: icons.zap },
  { key: "projects", label: "Projets", icon: icons.folder },
  { key: "education", label: "Formation", icon: icons.book },
  { key: "languages", label: "Langues", icon: icons.globe },
];

// ═══════════════════════════════════════════════
// MAIN ADMIN COMPONENT
// ═══════════════════════════════════════════════
export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("personal_info");
  const [data, setData] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth check
  useEffect(() => {
    if (!sb) { setLoading(false); return; }
    sb.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Fetch all data
  const fetchAll = useCallback(async () => {
    if (!sb) return;
    const results = {};
    for (const sec of sections) {
      const { data: rows } = await sb.from(sec.key).select("*").order(sec.single ? "updated_at" : "sort_order", { ascending: true });
      results[sec.key] = rows || [];
    }
    setData(results);
  }, []);

  useEffect(() => {
    if (session) fetchAll();
  }, [session, fetchAll]);

  // Toast
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Not configured
  if (!sb) return <NotConfigured />;
  if (loading) return <LoadingScreen />;
  if (!session) return <LoginScreen sb={sb} onLogin={setSession} />;

  // ─── CRUD Handlers ───
  const handleSave = async (table, record) => {
    setSaving(true);
    try {
      if (record.id) {
        const { error } = await sb.from(table).update(record).eq("id", record.id);
        if (error) throw error;
      } else {
        const { id, ...rest } = record;
        const { error } = await sb.from(table).insert(rest);
        if (error) throw error;
      }
      showToast("Sauvegardé avec succès !");
      setEditItem(null);
      await fetchAll();
    } catch (err) {
      showToast("Erreur : " + err.message, "error");
    }
    setSaving(false);
  };

  const handleDelete = async (table, id) => {
    if (!confirm("Supprimer cet élément ?")) return;
    try {
      const { error } = await sb.from(table).delete().eq("id", id);
      if (error) throw error;
      showToast("Supprimé !");
      await fetchAll();
    } catch (err) {
      showToast("Erreur : " + err.message, "error");
    }
  };

  const handleLogout = async () => {
    await sb.auth.signOut();
    setSession(null);
  };

  const currentSection = sections.find((s) => s.key === activeSection);
  const currentData = data[activeSection] || [];

  return (
    <div className="min-h-screen bg-[#0c0d11] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111218] border-r border-[#1f2029] flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#1f2029]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f0ff] to-[#7b61ff] flex items-center justify-center text-[#0c0d11] font-bold text-sm font-display">D</div>
          <div>
            <div className="font-display font-bold text-white text-sm">Portfolio Admin</div>
            <div className="text-[10px] text-[#8b8d9a] font-mono">Djlo ALOHOU</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => { setActiveSection(sec.key); setEditItem(null); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === sec.key
                  ? "bg-[#00f0ff]/10 text-[#00f0ff]"
                  : "text-[#8b8d9a] hover:text-white hover:bg-white/5"
              }`}
            >
              {sec.icon}
              {sec.label}
              {!sec.single && (
                <span className="ml-auto text-xs opacity-50">
                  {(data[sec.key] || []).length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[#1f2029] space-y-1">
          <a href="/" target="_blank" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#8b8d9a] hover:text-white hover:bg-white/5 transition-all">
            {icons.eye} Voir le site
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all">
            {icons.logout} Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-[#1f2029] flex items-center justify-between px-6 bg-[#0c0d11]/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white" onClick={() => setSidebarOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <h1 className="font-display font-bold text-white text-lg flex items-center gap-2">
              {currentSection?.icon}
              {currentSection?.label}
            </h1>
          </div>
          {!currentSection?.single && !editItem && (
            <button
              onClick={() => setEditItem({ _isNew: true })}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00f0ff] text-[#0c0d11] font-display font-semibold text-sm hover:bg-[#00f0ff]/90 transition-all"
            >
              {icons.plus} Ajouter
            </button>
          )}
        </header>

        {/* Content */}
        <div className="p-6 max-w-5xl">
          {editItem ? (
            <EditForm
              section={activeSection}
              item={editItem}
              onSave={(record) => handleSave(activeSection, record)}
              onCancel={() => setEditItem(null)}
              saving={saving}
            />
          ) : currentSection?.single ? (
            <PersonalInfoView
              data={currentData[0] || {}}
              onEdit={(item) => setEditItem(item)}
            />
          ) : (
            <ListView
              section={activeSection}
              data={currentData}
              onEdit={(item) => setEditItem(item)}
              onDelete={(id) => handleDelete(activeSection, id)}
            />
          )}
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl text-sm font-medium ${
          toast.type === "error"
            ? "bg-red-500/90 text-white"
            : "bg-emerald-500/90 text-white"
        }`} style={{ animation: "slideUp 0.3s ease-out" }}>
          {toast.type === "error" ? icons.x : icons.check}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════
function LoginScreen({ sb, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: err } = await sb.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message === "Invalid login credentials" ? "Email ou mot de passe incorrect" : err.message);
      setLoading(false);
    } else {
      onLogin(data.session);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-20" style={{backgroundImage:"linear-gradient(rgba(42,43,53,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(42,43,53,.3) 1px,transparent 1px)",backgroundSize:"60px 60px"}} />
      <div className="relative w-full max-w-md">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00f0ff] rounded-full filter blur-[120px] opacity-10" />
        <div className="glass-card p-8 relative z-10" style={{background:"rgba(18,19,26,.8)",backdropFilter:"blur(20px)",border:"1px solid rgba(42,43,53,.6)",borderRadius:"20px"}}>
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#7b61ff] flex items-center justify-center text-[#0a0b0e] font-bold text-xl font-display mb-4">D</div>
            <h1 className="font-display font-bold text-white text-2xl">Portfolio Admin</h1>
            <p className="text-[#8b8d9a] text-sm mt-2">Connectez-vous pour gérer votre contenu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs text-[#8b8d9a] font-mono uppercase mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/20 transition-all"
                placeholder="votre@email.com"
              />
            </div>
            <div>
              <label className="block text-xs text-[#8b8d9a] font-mono uppercase mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/20 transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#0e94ff] text-[#0a0b0e] font-display font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Connexion..." : "Se Connecter"}
            </button>
          </form>

          <p className="text-center text-[#8b8d9a] text-xs mt-6">
            Créez un utilisateur dans Supabase → Authentication → Users
          </p>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// PERSONAL INFO VIEW
// ═══════════════════════════════════════════════
function PersonalInfoView({ data, onEdit }) {
  if (!data?.id) return (
    <div className="text-center py-20">
      <p className="text-[#8b8d9a] mb-4">Aucune info personnelle trouvée.</p>
      <button onClick={() => onEdit({ _isNew: true })} className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-[#00f0ff] text-[#0c0d11] font-semibold text-sm">
        {icons.plus} Créer le profil
      </button>
    </div>
  );

  const fields = [
    { label: "Prénom", value: data.first_name },
    { label: "Nom", value: data.last_name },
    { label: "Titre", value: data.title },
    { label: "Accroche", value: data.tagline },
    { label: "Email", value: data.email },
    { label: "Téléphone", value: data.phone },
    { label: "Localisation", value: data.location },
    { label: "LinkedIn", value: data.linkedin },
    { label: "YouTube", value: data.youtube },
  ];

  return (
    <div className="space-y-6">
      <div className="glass-card p-6" style={{background:"rgba(18,19,26,.7)",border:"1px solid rgba(42,43,53,.6)",borderRadius:"16px"}}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-display font-bold text-white text-2xl">{data.first_name} {data.last_name}</h2>
            <p className="text-[#00f0ff] text-sm mt-1">{data.title}</p>
          </div>
          <button onClick={() => onEdit(data)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-[#2a2b35] text-white text-sm hover:border-[#00f0ff]/30 transition-all">
            {icons.edit} Modifier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label} className="bg-[#1a1b24] rounded-xl p-4">
              <div className="text-[10px] text-[#8b8d9a] font-mono uppercase mb-1">{f.label}</div>
              <div className="text-white text-sm break-all">{f.value || "—"}</div>
            </div>
          ))}
        </div>

        {data.description && (
          <div className="mt-4 bg-[#1a1b24] rounded-xl p-4">
            <div className="text-[10px] text-[#8b8d9a] font-mono uppercase mb-1">Description</div>
            <div className="text-white text-sm leading-relaxed">{data.description}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// LIST VIEW
// ═══════════════════════════════════════════════
function ListView({ section, data, onEdit, onDelete }) {
  if (data.length === 0) return (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1a1b24] border border-[#2a2b35] flex items-center justify-center text-[#8b8d9a] mb-4">
        {icons.folder}
      </div>
      <p className="text-[#8b8d9a]">Aucun élément. Cliquez sur "Ajouter" pour commencer.</p>
    </div>
  );

  const getTitle = (item) => {
    if (item.company) return item.company;
    if (item.category) return item.category;
    if (item.title) return item.title;
    if (item.institution) return item.institution;
    if (item.name) return item.name;
    return "Sans titre";
  };

  const getSubtitle = (item) => {
    if (item.role) return item.role;
    if (item.level !== undefined && item.category) return `Niveau : ${item.level}%`;
    if (item.description) return item.description.slice(0, 80) + "...";
    if (item.degree) return item.degree;
    if (item.percentage !== undefined) return `${item.percentage}% — ${item.level || ""}`;
    return "";
  };

  const getMeta = (item) => {
    if (item.period) return item.period;
    if (item.highlight !== undefined) return item.highlight ? "⭐ Phare" : "";
    return "";
  };

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="group bg-[#12131a]/70 border border-[#1f2029] rounded-xl p-4 hover:border-[#2a2b35] transition-all flex items-center gap-4"
        >
          {/* Drag handle / order */}
          <div className="flex-shrink-0 text-[#8b8d9a]/30 hidden md:flex flex-col items-center">
            {icons.arrows}
            <span className="text-[9px] font-mono mt-1">{item.sort_order}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="font-display font-semibold text-white text-sm truncate">
                {getTitle(item)}
              </h3>
              {getMeta(item) && (
                <span className="text-[10px] font-mono text-[#00f0ff] bg-[#00f0ff]/8 px-2 py-0.5 rounded-full flex-shrink-0">
                  {getMeta(item)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#8b8d9a] mt-0.5 truncate">
              {getSubtitle(item)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#00f0ff]/10 text-[#8b8d9a] hover:text-[#00f0ff] flex items-center justify-center transition-all"
              title="Modifier"
            >
              {icons.edit}
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/10 text-[#8b8d9a] hover:text-red-400 flex items-center justify-center transition-all"
              title="Supprimer"
            >
              {icons.trash}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════
// EDIT FORM (dynamic per section)
// ═══════════════════════════════════════════════
function EditForm({ section, item, onSave, onCancel, saving }) {
  const isNew = item._isNew;
  const [form, setForm] = useState(isNew ? {} : { ...item });

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clean up internal flags
    const { _isNew, created_at, updated_at, ...record } = form;
    onSave(record);
  };

  // Field renderer
  const Field = ({ label, name, type = "text", required, placeholder, rows }) => (
    <div>
      <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-2">{label}</label>
      {rows ? (
        <textarea
          value={form[name] || ""}
          onChange={(e) => set(name, e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 transition-all resize-y"
        />
      ) : type === "number" ? (
        <input
          type="number"
          value={form[name] ?? ""}
          onChange={(e) => set(name, parseInt(e.target.value) || 0)}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 transition-all"
        />
      ) : type === "checkbox" ? (
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form[name]}
            onChange={(e) => set(name, e.target.checked)}
            className="w-4 h-4 accent-[#00f0ff]"
          />
          <span className="text-sm text-white">{placeholder || "Oui"}</span>
        </label>
      ) : type === "select" ? null : (
        <input
          type={type}
          value={form[name] || ""}
          onChange={(e) => set(name, e.target.value)}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 transition-all"
        />
      )}
    </div>
  );

  // JSON array editor (for missions, items, tags)
  const JsonArrayField = ({ label, name, placeholder }) => {
    const arr = Array.isArray(form[name]) ? form[name] : (() => {
      try { return JSON.parse(form[name] || "[]"); } catch { return []; }
    })();

    const updateArr = (newArr) => set(name, newArr);

    return (
      <div>
        <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-2">
          {label} <span className="text-[#8b8d9a]/50">({arr.length} éléments)</span>
        </label>
        <div className="space-y-2">
          {arr.map((val, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={val}
                onChange={(e) => {
                  const copy = [...arr];
                  copy[i] = e.target.value;
                  updateArr(copy);
                }}
                placeholder={placeholder}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 transition-all"
              />
              <button
                type="button"
                onClick={() => updateArr(arr.filter((_, j) => j !== i))}
                className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-all flex-shrink-0"
              >
                {icons.x}
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => updateArr([...arr, ""])}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[#00f0ff] hover:bg-[#00f0ff]/5 transition-all"
          >
            {icons.plus} Ajouter un élément
          </button>
        </div>
      </div>
    );
  };

  // Render fields by section
  const renderFields = () => {
    switch (section) {
      case "personal_info":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Prénom" name="first_name" required placeholder="Djlo" />
              <Field label="Nom" name="last_name" required placeholder="ALOHOU" />
            </div>
            <Field label="Titre professionnel" name="title" placeholder="FMS Technical Manager & Web Developer" />
            <Field label="Accroche" name="tagline" placeholder="Expert en..." />
            <Field label="Description" name="description" rows={4} placeholder="Votre parcours..." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" name="email" type="email" placeholder="votre@email.com" />
              <Field label="Téléphone" name="phone" placeholder="+229 ..." />
            </div>
            <Field label="Localisation" name="location" placeholder="Abomey-Calavi, Bénin" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="LinkedIn URL" name="linkedin" placeholder="https://linkedin.com/in/..." />
              <Field label="YouTube URL" name="youtube" placeholder="https://youtube.com/..." />
            </div>
          </>
        );
      case "experiences":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Entreprise" name="company" required placeholder="Nom de l'entreprise" />
              <Field label="Rôle / Poste" name="role" placeholder="Responsable Projet" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Période" name="period" placeholder="2020 — 2024" />
              <Field label="Lieu" name="location" placeholder="Cotonou, Bénin" />
            </div>
            <Field label="Ordre d'affichage" name="sort_order" type="number" placeholder="1" />
            <JsonArrayField label="Missions" name="missions" placeholder="Description de la mission..." />
          </>
        );
      case "skills":
        return (
          <>
            <Field label="Catégorie" name="category" required placeholder="Gestion de Flotte (FMS)" />
            <Field label="Niveau (%)" name="level" type="number" placeholder="80" />
            <Field label="Ordre d'affichage" name="sort_order" type="number" placeholder="1" />
            <JsonArrayField label="Technologies / Items" name="items" placeholder="Nom de la technologie..." />
          </>
        );
      case "projects":
        return (
          <>
            <Field label="Titre du projet" name="title" required placeholder="SyGeQ — Péréquation..." />
            <Field label="Description" name="description" rows={3} placeholder="Description du projet..." />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ordre d'affichage" name="sort_order" type="number" placeholder="1" />
              <Field label="Projet phare ?" name="highlight" type="checkbox" placeholder="Mettre en avant ce projet" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="URL image (optionnel)" name="image_url" placeholder="https://..." />
              <Field label="Lien externe (optionnel)" name="link" placeholder="https://..." />
            </div>
            <JsonArrayField label="Tags" name="tags" placeholder="FMS, IoT, Web..." />
          </>
        );
      case "education":
        return (
          <>
            <Field label="Institution" name="institution" required placeholder="Goldsmith University" />
            <Field label="Diplôme / Certification" name="degree" placeholder="Licence en Développement Web" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Période" name="period" placeholder="2016 — 2019" />
              <div>
                <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-2">Type</label>
                <select
                  value={form.type || "certification"}
                  onChange={(e) => set("type", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#00f0ff]/50 transition-all"
                >
                  <option value="degree">Diplôme</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
            </div>
            <Field label="Ordre d'affichage" name="sort_order" type="number" placeholder="1" />
          </>
        );
      case "languages":
        return (
          <>
            <Field label="Langue" name="name" required placeholder="Français" />
            <Field label="Niveau (texte)" name="level" placeholder="Courant" />
            <Field label="Pourcentage (%)" name="percentage" type="number" placeholder="95" />
            <Field label="Ordre d'affichage" name="sort_order" type="number" placeholder="1" />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={onCancel} className="text-[#8b8d9a] hover:text-white transition-colors">
          ← Retour
        </button>
        <h2 className="font-display font-bold text-white text-lg">
          {isNew ? "Ajouter" : "Modifier"}
        </h2>
      </div>

      <div className="space-y-5 bg-[#12131a]/70 border border-[#1f2029] rounded-2xl p-6">
        {renderFields()}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00f0ff] text-[#0c0d11] font-display font-bold text-sm hover:bg-[#00f0ff]/90 transition-all disabled:opacity-50"
        >
          {saving ? "Sauvegarde..." : <>{icons.save} Sauvegarder</>}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl bg-white/5 border border-[#2a2b35] text-[#8b8d9a] text-sm hover:text-white hover:border-[#8b8d9a]/30 transition-all"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}

// ═══════════════════════════════════════════════
// LOADING & NOT CONFIGURED
// ═══════════════════════════════════════════════
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function NotConfigured() {
  return (
    <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center p-4">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6 text-2xl">⚠</div>
        <h1 className="font-display font-bold text-white text-2xl mb-4">Supabase non configuré</h1>
        <p className="text-[#8b8d9a] mb-6 leading-relaxed">
          Pour utiliser le panneau admin, configurez les variables d'environnement Supabase dans Vercel :
        </p>
        <div className="bg-[#12131a] border border-[#2a2b35] rounded-xl p-4 text-left font-mono text-sm space-y-2">
          <div><span className="text-[#00f0ff]">NEXT_PUBLIC_SUPABASE_URL</span><span className="text-[#8b8d9a]">=https://xxx.supabase.co</span></div>
          <div><span className="text-[#00f0ff]">NEXT_PUBLIC_SUPABASE_ANON_KEY</span><span className="text-[#8b8d9a]">=votre-clé-anon</span></div>
        </div>
        <a href="/" className="inline-block mt-6 text-[#00f0ff] hover:underline text-sm">← Retour au portfolio</a>
      </div>
    </div>
  );
}
