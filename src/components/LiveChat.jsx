"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const sb = url && key ? createClient(url, key) : null;

export default function LiveChat({ ownerName = "Djlo" }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("intro");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [ended, setEnded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  // Restore session
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem("chat_session") || "null");
      if (s?.convId && s?.name) {
        setConvId(s.convId); setName(s.name); setEmail(s.email || "");
        setPhase(s.ended ? "ended" : "chat");
        setEnded(!!s.ended);
      }
    } catch {}
  }, []);

  // Watch admin online status
  useEffect(() => {
    if (!sb) return;
    const fetch = async () => {
      const { data } = await sb.from("admin_status").select("is_online, last_seen").eq("id", "main").single();
      if (data) setAdminOnline(data.is_online);
    };
    fetch();
    const ch = sb.channel("visitor_status")
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_status" }, () => fetch())
      .subscribe();
    return () => sb.removeChannel(ch);
  }, []);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!sb || !convId) return;
    const { data } = await sb.from("chat_messages").select("*").eq("conversation_id", convId).order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, [convId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Check if conversation is ended
  useEffect(() => {
    if (!sb || !convId) return;
    const check = async () => {
      const { data } = await sb.from("chat_conversations").select("status").eq("id", convId).single();
      if (data?.status === "closed") { setEnded(true); setPhase("ended"); saveSession(true); }
    };
    check();
    const ch = sb.channel(`conv_status_${convId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "chat_conversations", filter: `id=eq.${convId}` }, (p) => {
        if (p.new.status === "closed") { setEnded(true); setPhase("ended"); saveSession(true); }
      }).subscribe();
    return () => sb.removeChannel(ch);
  }, [convId]);

  // Realtime messages
  useEffect(() => {
    if (!sb || !convId) return;
    const ch = sb.channel(`chat_v_${convId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${convId}` },
        (p) => setMessages(prev => prev.find(m => m.id === p.new.id) ? prev : [...prev, p.new]))
      .subscribe();
    return () => sb.removeChannel(ch);
  }, [convId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const saveSession = (isEnded = false) => {
    localStorage.setItem("chat_session", JSON.stringify({ convId, name, email, ended: isEnded }));
  };

  // Start conversation
  const startChat = async (e) => {
    e.preventDefault();
    if (!sb || !name.trim()) return;
    const { data, error } = await sb.from("chat_conversations").insert({ visitor_name: name.trim(), visitor_email: email.trim() || null, status: "active" }).select().single();
    if (error || !data) return;
    setConvId(data.id); setPhase("chat"); setEnded(false);
    localStorage.setItem("chat_session", JSON.stringify({ convId: data.id, name: name.trim(), email: email.trim() }));

    // Welcome message
    const welcomeMsg = adminOnline
      ? `Bonjour ${name.trim()} ! 👋 ${ownerName} est en ligne et vous répondra dans un instant.`
      : `Bonjour ${name.trim()} ! 👋 ${ownerName} n'est pas disponible pour le moment, mais notre assistant IA peut vous aider en attendant. Posez votre question !`;

    await sb.from("chat_messages").insert({ conversation_id: data.id, sender: "admin", message: welcomeMsg });
    fetchMessages();
  };

  // Send message
  const sendMessage = async () => {
    if (!sb || !convId || !input.trim() || ended) return;
    const msg = input.trim();
    setSending(true); setInput("");
    await sb.from("chat_messages").insert({ conversation_id: convId, sender: "visitor", message: msg });
    await sb.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);

    // Trigger AI response if admin not online
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, visitorMessage: msg }),
      });
    } catch {}

    setSending(false);
    inputRef.current?.focus();
  };

  // Upload file
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !sb || !convId || ended) return;
    if (file.size > 10 * 1024 * 1024) { alert("Fichier trop volumineux (max 10 MB)"); return; }
    setUploading(true);
    const ext = file.name.split(".").pop().toLowerCase();
    const fn = `chat/${convId}/${Date.now()}_${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const { error } = await sb.storage.from("portfolio").upload(fn, file, { upsert: true });
    if (error) { alert("Erreur upload: " + error.message); setUploading(false); return; }
    const { data: u } = sb.storage.from("portfolio").getPublicUrl(fn);
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    await sb.from("chat_messages").insert({
      conversation_id: convId, sender: "visitor",
      message: isImage ? "📷 Image envoyée" : `📎 ${file.name}`,
      file_url: u.publicUrl, file_name: file.name, file_type: isImage ? "image" : "file",
    });
    await sb.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // End conversation (visitor side)
  const endChat = async () => {
    if (!sb || !convId) return;
    await sb.from("chat_messages").insert({ conversation_id: convId, sender: "admin", message: "La conversation a été terminée. Merci de votre visite ! 👋" });
    await sb.from("chat_conversations").update({ status: "closed", updated_at: new Date().toISOString() }).eq("id", convId);
    setEnded(true); setPhase("ended"); saveSession(true);
  };

  // New conversation
  const newChat = () => {
    setPhase("intro"); setConvId(null); setMessages([]); setName(""); setEmail(""); setEnded(false);
    localStorage.removeItem("chat_session");
  };

  const formatTime = (ts) => new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  if (!sb) return null;

  return (
    <>
      {/* Chat Panel */}
      <div className={`fixed bottom-0 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] transition-all duration-400 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0 pointer-events-none"}`}>
        <div className="rounded-t-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col" style={{ background: "#0f1015", border: "1px solid rgba(42,43,53,0.7)", borderBottom: "none", height: "520px", maxHeight: "70vh" }}>

          {/* Header */}
          <div className="flex-shrink-0 px-5 py-4 bg-gradient-to-r from-[#0e94ff] to-[#00f0ff] relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold">{ownerName[0]}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#0e94ff] ${adminOnline ? "bg-green-400" : "bg-gray-400"}`} />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{ownerName} ALOHOU</h3>
                  <span className="text-white/70 text-[11px]">{adminOnline ? "🟢 En ligne" : "🤖 Assistant IA actif"}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {phase === "chat" && !ended && (
                  <button onClick={endChat} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-red-500/40 flex items-center justify-center text-white transition-colors" title="Terminer la conversation">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors" title="Réduire">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>

          {phase === "intro" ? (
            <div className="flex-1 flex flex-col justify-center px-6 py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0e94ff]/10 border border-[#0e94ff]/20 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0e94ff" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Discutons !</h3>
                <p className="text-[#8b8d9a] text-sm">
                  {adminOnline ? `${ownerName} est en ligne et prêt à vous répondre.` : `Notre assistant IA vous aidera en attendant ${ownerName}.`}
                </p>
              </div>
              <form onSubmit={startChat} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-1.5">Votre nom *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Jean Dupont"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#0e94ff]/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-1.5">Email (optionnel)</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@exemple.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#0e94ff]/50 transition-all" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0e94ff] to-[#00f0ff] text-[#0a0b0e] font-bold text-sm hover:opacity-90 transition-all mt-2">
                  Démarrer la conversation
                </button>
              </form>
            </div>
          ) : phase === "ended" ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Conversation terminée</h3>
              <p className="text-[#8b8d9a] text-sm mb-6">Merci pour votre visite ! N'hésitez pas à revenir.</p>
              <button onClick={newChat} className="px-6 py-2.5 rounded-xl bg-[#0e94ff] text-white font-semibold text-sm hover:opacity-90 transition-all">
                Nouvelle conversation
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2b35 transparent" }}>
                {messages.map((msg) => {
                  const isAdmin = msg.sender === "admin";
                  const isAI = isAdmin && msg.message.startsWith("🤖");
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                      <div className="max-w-[80%]">
                        {isAdmin && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${isAI ? "bg-[#7b61ff]/20 text-[#7b61ff]" : "bg-[#0e94ff]/20 text-[#0e94ff]"}`}>
                              {isAI ? "IA" : ownerName[0]}
                            </div>
                            <span className="text-[10px] text-[#8b8d9a]">{isAI ? "Assistant IA" : ownerName}</span>
                          </div>
                        )}

                        {/* File/Image */}
                        {msg.file_url && msg.file_type === "image" && (
                          <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="block mb-1 rounded-xl overflow-hidden border border-[#2a2b35] hover:opacity-90 transition-opacity">
                            <img src={msg.file_url} alt={msg.file_name || "Image"} className="max-w-full max-h-48 object-cover" />
                          </a>
                        )}
                        {msg.file_url && msg.file_type === "file" && (
                          <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-2 mb-1 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-[#0e94ff] text-xs hover:bg-[#0e94ff]/5 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            {msg.file_name || "Fichier"}
                          </a>
                        )}

                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAdmin
                            ? `bg-[#1a1b24] text-[#e4e5eb] rounded-tl-md border ${isAI ? "border-[#7b61ff]/20" : "border-[#2a2b35]/60"}`
                            : "bg-gradient-to-r from-[#0e94ff] to-[#0e94ff]/90 text-white rounded-tr-md"
                        }`}>
                          {isAI ? msg.message.replace(/^🤖\s?/, "") : msg.message}
                        </div>
                        <span className={`text-[9px] text-[#8b8d9a]/60 mt-1 block ${isAdmin ? "" : "text-right"}`}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {!ended && (
                <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-[#1f2029]">
                  <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 bg-[#1a1b24] border border-[#2a2b35]">
                    {/* File upload */}
                    <button onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-[#8b8d9a] hover:text-[#0e94ff] transition-colors flex-shrink-0">
                      {uploading ? (
                        <div className="w-4 h-4 border-2 border-[#0e94ff] border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                        </svg>
                      )}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" onChange={handleFileUpload} className="hidden" />

                    <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Tapez votre message..."
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#8b8d9a]/50 py-2" disabled={sending} />

                    <button onClick={sendMessage} disabled={sending || !input.trim()}
                      className="w-9 h-9 rounded-lg bg-[#0e94ff] hover:bg-[#0e94ff]/80 disabled:opacity-30 flex items-center justify-center transition-all flex-shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Trigger tab */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-0 z-50" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
          <div className="flex items-center gap-2 bg-gradient-to-b from-[#0e94ff] to-[#00b4d8] text-white px-3 py-4 rounded-l-xl shadow-lg shadow-[#0e94ff]/20 hover:px-4 transition-all cursor-pointer">
            <div className="relative" style={{ transform: "rotate(90deg)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <span className="text-xs font-semibold tracking-wide">Chat</span>
            {adminOnline && <span className="w-2 h-2 bg-green-400 rounded-full" style={{ transform: "rotate(90deg)" }} />}
          </div>
        </button>
      )}
    </>
  );
}
