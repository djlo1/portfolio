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
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Auth
  useEffect(() => {
    if (!sb) { setLoading(false); return; }
    sb.auth.getSession().then(({ data: { session: s } }) => { setSession(s); setLoading(false); });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  // Fetch conversations
  const fetchConvos = useCallback(async () => {
    if (!sb) return;
    const { data } = await sb.from("chat_conversations").select("*").order("updated_at", { ascending: false });
    if (data) setConvos(data);
  }, []);

  useEffect(() => { if (session) fetchConvos(); }, [session, fetchConvos]);

  // Realtime new conversations
  useEffect(() => {
    if (!sb || !session) return;
    const ch = sb.channel("admin_convos")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, () => fetchConvos())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => fetchConvos())
      .subscribe();
    return () => sb.removeChannel(ch);
  }, [session, fetchConvos]);

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
    const ch = sb.channel(`admin_msg_${activeConvo.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${activeConvo.id}` },
        (payload) => setMessages(prev => prev.find(m => m.id === payload.new.id) ? prev : [...prev, payload.new]))
      .subscribe();
    return () => sb.removeChannel(ch);
  }, [activeConvo]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendReply = async () => {
    if (!sb || !activeConvo || !input.trim()) return;
    setSending(true);
    await sb.from("chat_messages").insert({ conversation_id: activeConvo.id, sender: "admin", message: input.trim() });
    await sb.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", activeConvo.id);
    setInput("");
    setSending(false);
    inputRef.current?.focus();
  };

  const deleteConvo = async (id) => {
    if (!confirm("Supprimer cette conversation ?")) return;
    await sb.from("chat_conversations").delete().eq("id", id);
    if (activeConvo?.id === id) { setActiveConvo(null); setMessages([]); }
    fetchConvos();
  };

  const fmt = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) + " " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  if (!sb) return <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center text-[#8b8d9a]">Supabase non configuré</div>;
  if (loading) return <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#00f0ff] border-t-transparent rounded-full animate-spin" /></div>;
  if (!session) return <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center"><div className="text-center"><h1 className="text-white text-xl font-bold mb-2">Accès refusé</h1><p className="text-[#8b8d9a] mb-4">Connectez-vous d'abord sur /admin</p><a href="/admin" className="text-[#00f0ff] hover:underline">/admin</a></div></div>;

  return (
    <div className="h-screen bg-[#0c0d11] flex">
      {/* Sidebar — Conversations list */}
      <div className="w-80 border-r border-[#1f2029] flex flex-col">
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1f2029] flex-shrink-0">
          <div className="flex items-center gap-3">
            <a href="/admin" className="text-[#8b8d9a] hover:text-white text-sm">←</a>
            <h1 className="font-bold text-white text-base">Live Chat</h1>
          </div>
          <span className="text-xs text-[#8b8d9a] font-mono bg-[#1a1b24] px-2 py-1 rounded">{convos.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convos.length === 0 ? (
            <div className="text-center py-12 text-[#8b8d9a] text-sm">Aucune conversation</div>
          ) : (
            convos.map((c) => (
              <div
                key={c.id}
                onClick={() => setActiveConvo(c)}
                className={`px-4 py-3 border-b border-[#1f2029]/50 cursor-pointer transition-all flex items-center gap-3 ${
                  activeConvo?.id === c.id ? "bg-[#0e94ff]/10 border-l-2 border-l-[#0e94ff]" : "hover:bg-white/3"
                }`}
              >
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
                <button onClick={(e) => { e.stopPropagation(); deleteConvo(c.id); }} className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded hover:bg-red-500/10 flex items-center justify-center text-[#8b8d9a] hover:text-red-400 flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main — Chat area */}
      <div className="flex-1 flex flex-col">
        {!activeConvo ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1a1b24] border border-[#2a2b35] flex items-center justify-center text-[#8b8d9a] mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <p className="text-[#8b8d9a]">Sélectionnez une conversation</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#1f2029] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#0e94ff]/15 flex items-center justify-center text-[#0e94ff] font-bold text-sm">
                  {(activeConvo.visitor_name || "?")[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">{activeConvo.visitor_name}</h2>
                  <span className="text-[10px] text-[#8b8d9a]">{activeConvo.visitor_email || "Pas d'email"} — {fmt(activeConvo.created_at)}</span>
                </div>
              </div>
              <button onClick={() => deleteConvo(activeConvo.id)} className="text-xs text-red-400/60 hover:text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/5 transition-all">
                Supprimer
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
              {messages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[70%]">
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        isAdmin
                          ? "bg-gradient-to-r from-[#0e94ff] to-[#0e94ff]/90 text-white rounded-tr-md"
                          : "bg-[#1a1b24] text-[#e4e5eb] rounded-tl-md border border-[#2a2b35]/60"
                      }`}>
                        {msg.message}
                      </div>
                      <span className={`text-[9px] text-[#8b8d9a]/50 mt-1 block ${isAdmin ? "text-right" : ""}`}>{fmt(msg.created_at)}</span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-6 pb-5 pt-3 border-t border-[#1f2029]">
              <div className="flex items-center gap-3 rounded-xl px-4 py-2 bg-[#1a1b24] border border-[#2a2b35]">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendReply(); } }}
                  placeholder="Répondre..."
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#8b8d9a]/50 py-2"
                  disabled={sending}
                />
                <button onClick={sendReply} disabled={sending || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-[#0e94ff] hover:bg-[#0e94ff]/80 disabled:opacity-30 flex items-center justify-center transition-all flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
