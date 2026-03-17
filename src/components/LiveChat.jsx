"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const sb = url && key ? createClient(url, key) : null;

export default function LiveChat({ ownerName = "Djlo", whatsappPhone = "22901999989929" }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("intro"); // intro | chat
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chat_session");
      if (saved) {
        const s = JSON.parse(saved);
        if (s.convId && s.name) {
          setConvId(s.convId);
          setName(s.name);
          setEmail(s.email || "");
          setPhase("chat");
        }
      }
    } catch {}
  }, []);

  // Fetch messages when conversation exists
  const fetchMessages = useCallback(async () => {
    if (!sb || !convId) return;
    const { data } = await sb
      .from("chat_messages")
      .select("*")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }, [convId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime subscription
  useEffect(() => {
    if (!sb || !convId) return;
    const channel = sb
      .channel(`chat_${convId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "chat_messages",
        filter: `conversation_id=eq.${convId}`,
      }, (payload) => {
        setMessages((prev) => {
          if (prev.find((m) => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [convId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Start conversation
  const startChat = async (e) => {
    e.preventDefault();
    if (!sb || !name.trim()) return;
    const { data, error } = await sb.from("chat_conversations").insert({
      visitor_name: name.trim(),
      visitor_email: email.trim() || null,
    }).select().single();
    if (error || !data) return;
    setConvId(data.id);
    setPhase("chat");
    localStorage.setItem("chat_session", JSON.stringify({ convId: data.id, name: name.trim(), email: email.trim() }));

    // Auto welcome message from owner
    await sb.from("chat_messages").insert({
      conversation_id: data.id,
      sender: "admin",
      message: `Bonjour ${name.trim()} ! 👋 Merci de me contacter. Je suis ${ownerName} et je vous répondrai dans les plus brefs délais. En attendant, n'hésitez pas à me poser votre question.`,
    });
    fetchMessages();
  };

  // Send message
  const sendMessage = async () => {
    if (!sb || !convId || !input.trim()) return;
    setSending(true);
    await sb.from("chat_messages").insert({
      conversation_id: convId,
      sender: "visitor",
      message: input.trim(),
    });
    // Update conversation timestamp
    await sb.from("chat_conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
    setInput("");
    setSending(false);
    inputRef.current?.focus();
  };

  // End conversation
  const endChat = () => {
    setPhase("intro");
    setConvId(null);
    setMessages([]);
    setName("");
    setEmail("");
    setOpen(false);
    localStorage.removeItem("chat_session");
  };

  const formatTime = (ts) => {
    return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  if (!sb) return null;

  return (
    <>
      {/* Chat Panel */}
      <div className={`fixed bottom-0 right-4 sm:right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] transition-all duration-400 ease-out ${
        open ? "translate-y-0 opacity-100" : "translate-y-[110%] opacity-0 pointer-events-none"
      }`}>
        <div className="rounded-t-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col" style={{ background: "#0f1015", border: "1px solid rgba(42,43,53,0.7)", borderBottom: "none", height: "520px", maxHeight: "70vh" }}>

          {/* Header */}
          <div className="flex-shrink-0 px-5 py-4 bg-gradient-to-r from-[#0e94ff] to-[#00f0ff] relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold">
                  {ownerName[0]}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{ownerName} ALOHOU</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                    <span className="text-white/70 text-[11px]">Support en ligne</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {phase === "chat" && (
                  <button onClick={endChat} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors" title="Terminer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            </div>
          </div>

          {phase === "intro" ? (
            /* ─── Intro / Start form ─── */
            <div className="flex-1 flex flex-col justify-center px-6 py-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0e94ff]/10 border border-[#0e94ff]/20 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0e94ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Discutons !</h3>
                <p className="text-[#8b8d9a] text-sm">Laissez-moi vos coordonnées pour démarrer la conversation.</p>
              </div>
              <form onSubmit={startChat} className="space-y-3">
                <div>
                  <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-1.5">Votre nom *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jean Dupont"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#0e94ff]/50 transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] text-[#8b8d9a] font-mono uppercase mb-1.5">Email (optionnel)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jean@exemple.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#1a1b24] border border-[#2a2b35] text-white text-sm focus:outline-none focus:border-[#0e94ff]/50 transition-all" />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0e94ff] to-[#00f0ff] text-[#0a0b0e] font-bold text-sm hover:opacity-90 transition-all mt-2">
                  Démarrer la conversation
                </button>
              </form>
            </div>
          ) : (
            /* ─── Chat messages ─── */
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a2b35 transparent" }}>
                {messages.map((msg) => {
                  const isAdmin = msg.sender === "admin";
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[80%] ${isAdmin ? "order-1" : ""}`}>
                        {isAdmin && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-[#0e94ff]/20 flex items-center justify-center text-[#0e94ff] text-[9px] font-bold">{ownerName[0]}</div>
                            <span className="text-[10px] text-[#8b8d9a]">{ownerName}</span>
                          </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isAdmin
                            ? "bg-[#1a1b24] text-[#e4e5eb] rounded-tl-md border border-[#2a2b35]/60"
                            : "bg-gradient-to-r from-[#0e94ff] to-[#0e94ff]/90 text-white rounded-tr-md"
                        }`}>
                          {msg.message}
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
              <div className="flex-shrink-0 px-4 pb-4 pt-2 border-t border-[#1f2029]">
                <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 bg-[#1a1b24] border border-[#2a2b35]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Tapez votre message..."
                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#8b8d9a]/50 py-2"
                    disabled={sending}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !input.trim()}
                    className="w-9 h-9 rounded-lg bg-[#0e94ff] hover:bg-[#0e94ff]/80 disabled:opacity-30 flex items-center justify-center transition-all flex-shrink-0"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Trigger Tab (Microsoft-style) ─── */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed z-50 transition-all duration-300 ${
          open ? "bottom-[520px] max-[70vh]:bottom-[70vh] right-4 sm:right-6" : "bottom-6 right-0"
        }`}
        style={!open ? {
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        } : {}}
      >
        {open ? (
          // Minimized state — small tab above the chat
          <div className="hidden" />
        ) : (
          // Closed state — vertical tab on right edge like Microsoft
          <div className="flex items-center gap-2 bg-gradient-to-b from-[#0e94ff] to-[#00b4d8] text-white px-3 py-4 rounded-l-xl shadow-lg shadow-[#0e94ff]/20 hover:px-4 transition-all cursor-pointer"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "rotate(90deg)" }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="text-xs font-semibold tracking-wide">Chat</span>
          </div>
        )}
      </button>
    </>
  );
}
