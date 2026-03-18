"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const sb = url && key ? createClient(url, key) : null;

export default function AdminChat() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [convos, setConvos] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [unread, setUnread] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  // Auth
  useEffect(() => {
    if (!sb) { setLoading(false); return; }
    sb.auth.getSession().then(({ data: { session: s } }) => { setSession(s); setLoading(false); });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Online status — set online on mount, offline on close
  useEffect(() => {
    if (!sb || !session) return;
    const goOnline = async () => {
      await sb.from("admin_status").upsert({ id: "main", is_online: true, last_seen: new Date().toISOString() });
      setIsOnline(true);
    };
    const goOffline = async () => {
      await sb.from("admin_status").upsert({ id: "main", is_online: false, last_seen: new Date().toISOString() });
    };
    goOnline();

    // Heartbeat every 30s
    const hb = setInterval(() => {
      if (isOnline) sb.from("admin_status").upsert({ id: "main", is_online: true, last_seen: new Date().toISOString() });
    }, 30000);

    // Go offline on tab close
    const handleUnload = () => {
      navigator.sendBeacon?.(`${url}/rest/v1/admin_status?id=eq.main`, JSON.stringify({ is_online: false, last_seen: new Date().toISOString() }));
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => { clearInterval(hb); window.removeEventListener("beforeunload", handleUnload); goOffline(); };
  }, [session]);

  // Toggle online status
  const toggleOnline = async () => {
    const next = !isOnline;
    setIsOnline(next);
    await sb.from("admin_status").upsert({ id: "main", is_online: next, last_seen: new Date().toISOString() });
  };

  // Fetch conversations
  const fetchConvos = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("chat_conversations").select("*").order("updated_at", { ascending: false });
    if (data) setConvos(data);
  }, []);

  useEffect(() => { if (session) fetchConvos(); }, [session, fetchConvos]);

  // Realtime convos + messages
  useEffect(() => {
    if (!sb || !session) return;
    const ch = sb.channel("admin_convos_v2")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, () => fetchConvos())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (p) => {
        fetchConvos();
        if (p.new.sender === "visitor" && (!activeConvo || p.new.conversation_id !== activeConvo.id)) {
          playSound(); setUnread(n => n + 1);
          if (Notification.permission === "granted") new Notification("Nouveau message", { body: p.new.message?.slice(0, 80), icon: "/favicon.ico" });
        }
      }).subscribe();
    return () => sb.removeChannel(ch);
  }, [session, activeConvo, fetchConvos]);

  // Fetch messages for active convo
  const fetchMessages = useCallback(async () => {
    if (!sb || !activeConvo) return;
    const { data } = await sb.from("chat_messages").select("*").eq("conversation_id", activeConvo.id).order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, [activeConvo]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime messages for active convo
  useEffect(() => {
    if (!sb || !activeConvo) return;
    const ch = sb.channel(`admin_msg_v2_${activeConvo.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${activeConvo.id}` },
        (p) => {
          setMessages(prev => prev.find(m => m.id === p.new.id) ? prev : [...prev, p.new]);
          if (p.new.sender === "visitor") { playSound(); setUnread(n => n + 1); }
        }).subscribe();
    return () => sb.removeChannel(ch);
  }, [activeConvo]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  // Notifications
  useEffect(() => { if (typeof window !== "undefined" && Notification.permission === "default") Notification.requestPermission(); }, []);

  // Tab title flash
  useEffect(() => {
    if (unread <= 0) { document.title = "Admin Chat"; return; }
    let on = true;
    const iv = setInterval(() => { document.title = on ? `(${unread}) Nouveau message !` : "Admin Chat"; on = !on; }, 1000);
    const reset = () => { setUnread(0); document.title = "Admin Chat"; };
    window.addEventListener("focus", reset);
    return () => { clearInterval(iv); window.removeEventListener("focus", reset); document.title = "Admin Chat"; };
  }, [unread]);

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  // Send reply
  const sendReply = async () => {
    if (!sb || !activeConvo || !input.trim()) return;
    setSending(true);
    await sb.from("chat_messages").insert({ conversation_id: activeConvo.id, sender: "admin", message: input.trim() });
    await sb.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConvo.id);
    setInput(""); setSending(false);
    inputRef.current?.focus();
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !sb || !activeConvo) return;
    if (file.size > 10 * 1024 * 1024) { alert("Max 10 MB"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop().toLowerCase();
    const fn = `chat/${activeConvo.id}/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("portfolio").upload(fn, file, { upsert: true });
    if (error) { alert(error.message); setUploading(false); return; }
    const { data: u } = sb.storage.from("portfolio").getPublicUrl(fn);
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    await sb.from("chat_messages").insert({
      conversation_id: activeConvo.id, sender: "admin",
      message: isImage ? "📷 Image envoyée" : `📎 ${file.name}`,
      file_url: u.publicUrl, file_name: file.name, file_type: isImage ? "image" : "file",
    });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // End conversation
  const closeConvo = async (id) => {
    await sb.from("chat_messages").insert({ conversation_id: id, sender: "admin", message: "La conversation a été terminée par l'administrateur. Merci ! 👋" });
    await sb.from("chat_conversations").update({ status: "closed", updated_at: new Date().toISOString() }).eq("id", id);
    fetchConvos();
    if (activeConvo?.id === id) {
      setActiveConvo(prev => ({ ...prev, status: "closed" }));
    }
  };

  // Delete conversation
  const deleteConvo = async (id) => {
    if (!confirm("Supprimer cette conversation ?")) return;
    await sb.from("chat_conversations").delete().eq("id", id);
    if (activeConvo?.id === id) { setActiveConvo(null); setMessages([]); }
    fetchConvos();
  };

  const fmt = (ts) => {
    const d = new Date(ts); const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  if (!sb) return <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center text-[#8b8d9a]">Supabase non configuré</div>;
  if (loading) return <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center"><div className="text-center"><h1 className="text-white text-xl font-bold mb-2">Accès refusé</h1><p className="text-[#8b8d9a] mb-4">Connectez-vous d'abord</p><a href="/admin" className="text-[#00f0ff] hover:underline">/admin</a></div></div>;

  const activeConvos = convos.filter(c => c.status === "active");
  const closedConvos = convos.filter(c => c.status === "closed");
  const isClosed = activeConvo?.status === "closed";

  return (
    <div className="h-screen bg-[#0c0d11] flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0 overflow-hidden"} border-r border-[#1f2029] flex flex-col transition-all duration-300 flex-shrink-0`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#1f2029] flex-shrink-0">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-[#8b8d9a] hover:text-white text-sm">←</a>
            <h1 className="font-bold text-white text-base">Live Chat</h1>
          </div>
          {/* Online toggle */}
          <button onClick={toggleOnline} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isOnline ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-[#1a1b24] text-[#8b8d9a] border border-[#2a2b35]"}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
            {isOnline ? "En ligne" : "Hors ligne"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Active conversations */}
          {activeConvos.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] text-[#8b8d9a] font-mono uppercase">Actives ({activeConvos.length})</div>
              {activeConvos.map(c => (
                <div key={c.id} onClick={() => setActiveConvo(c)}
                  className={`px-4 py-3 border-b border-[#1f2029]/50 cursor-pointer transition-all flex items-center gap-3 ${activeConvo?.id === c.id ? "bg-[#0e94ff]/10 border-l-2 border-l-[#0e94ff]" : "hover:bg-white/3"}`}>
                  <div className="w-9 h-9 rounded-full bg-[#0e94ff]/15 flex items-center justify-center text-[#0e94ff] font-bold text-sm flex-shrink-0">
                    {(c.visitor_name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm font-medium truncate">{c.visitor_name || "Anonyme"}</span>
                      <span className="text-[9px] text-[#8b8d9a] flex-shrink-0">{fmt(c.updated_at)}</span>
                    </div>
                    {c.visitor_email && <p className="text-[10px] text-[#8b8d9a] truncate">{c.visitor_email}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Closed conversations */}
          {closedConvos.length > 0 && (
            <div>
              <div className="px-4 py-2 text-[10px] text-[#8b8d9a] font-mono uppercase mt-2">Terminées ({closedConvos.length})</div>
              {closedConvos.map(c => (
                <div key={c.id} onClick={() => setActiveConvo(c)}
                  className={`px-4 py-3 border-b border-[#1f2029]/50 cursor-pointer transition-all flex items-center gap-3 opacity-60 ${activeConvo?.id === c.id ? "bg-white/5 border-l-2 border-l-[#8b8d9a]" : "hover:bg-white/3"}`}>
                  <div className="w-9 h-9 rounded-full bg-[#8b8d9a]/10 flex items-center justify-center text-[#8b8d9a] font-bold text-sm flex-shrink-0">
                    {(c.visitor_name || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[#8b8d9a] text-sm truncate block">{c.visitor_name || "Anonyme"}</span>
                    <span className="text-[9px] text-[#8b8d9a]/50">{fmt(c.updated_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {convos.length === 0 && <div className="text-center py-12 text-[#8b8d9a] text-sm">Aucune conversation</div>}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {!activeConvo ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1a1b24] border border-[#2a2b35] flex items-center justify-center text-[#8b8d9a] mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-[#8b8d9a]">Sélectionnez une conversation</p>
              <p className="text-[#8b8d9a]/50 text-xs mt-2">
                Statut: {isOnline ? <span className="text-green-400">En ligne</span> : <span>Hors ligne — IA active</span>}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#1f2029] flex-shrink-0">
              <div className="flex items-center gap-3">
                <button className="lg:hidden text-[#8b8d9a] hover:text-white mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
                <div className="w-9 h-9 rounded-full bg-[#0e94ff]/15 flex items-center justify-center text-[#0e94ff] font-bold text-sm">
                  {(activeConvo.visitor_name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">{activeConvo.visitor_name}</h2>
                  <span className="text-[10px] text-[#8b8d9a]">
                    {activeConvo.visitor_email || "Pas d'email"} — {isClosed ? "🔴 Terminée" : "🟢 Active"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!isClosed && (
                  <button onClick={() => closeConvo(activeConvo.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                    Terminer
                  </button>
                )}
                <button onClick={() => deleteConvo(activeConvo.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Supprimer
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                const isAI = isAdmin && msg.message.startsWith("🤖");
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      {!isAdmin && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-[#8b8d9a]">{activeConvo.visitor_name}</span>
                        </div>
                      )}
                      {isAdmin && isAI && (
                        <div className="flex items-center gap-2 mb-1 justify-end">
                          <span className="text-[10px] text-[#7b61ff]">🤖 IA</span>
                        </div>
                      )}

                      {/* File/image */}
                      {msg.file_url && msg.file_type === "image" && (
                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="block mb-1 rounded-xl overflow-hidden border border-[#2a2b35] hover:opacity-90">
                          <img src={msg.file_url} alt="" className="max-w-full max-h-48 object-cover" />
                        </a>
                      )}
                      {msg.file_url && msg.file_type === "file" && (
                        <a href={msg.file_url} target="_blank" className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-[#0e94ff] text-xs hover:bg-[#0e94ff]/5">
                          📎 {msg.file_name || "Fichier"}
                        </a>
                      )}

                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isAdmin
                          ? `rounded-tr-md ${isAI ? "bg-[#7b61ff]/15 text-[#e4e5eb] border border-[#7b61ff]/20" : "bg-gradient-to-r from-[#0e94ff] to-[#0e94ff]/90 text-white"}`
                          : "bg-[#1a1b24] text-[#e4e5eb] rounded-tl-md border border-[#2a2b35]/60"
                      }`}>
                        {isAI ? msg.message.replace(/^🤖\s?/, "") : msg.message}
                      </div>
                      <span className={`text-[9px] text-[#8b8d9a]/50 mt-1 block ${isAdmin ? "text-right" : ""}`}>{fmt(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            {!isClosed ? (
              <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-[#1f2029]">
                <div className="flex items-center gap-3 rounded-xl px-4 py-2 bg-[#1a1b24] border border-[#2a2b35]">
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#8b8d9a] hover:text-[#0e94ff] transition-colors flex-shrink-0">
                    {uploading ? <div className="w-4 h-4 border-2 border-[#0e94ff] border-t-transparent rounded-full animate-spin" /> : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" onChange={handleFileUpload} className="hidden" />
                  <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); sendReply(); } }}
                    placeholder="Répondre..." className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#8b8d9a]/50 py-2" disabled={sending} />
                  <button onClick={sendReply} disabled={sending || !input.trim()}
                    className="w-10 h-10 rounded-xl bg-[#0e94ff] hover:bg-[#0e94ff]/80 disabled:opacity-30 flex items-center justify-center transition-all flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 px-6 py-4 border-t border-[#1f2029] text-center text-sm text-[#8b8d9a]">
                Conversation terminée
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
