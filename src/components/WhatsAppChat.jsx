"use client";
import { useState, useEffect } from "react";

export default function WhatsAppChat({ phone = "22901999989929", name = "Djlo" }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show welcome bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setShowBubble(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  // Auto-hide bubble after 8 seconds
  useEffect(() => {
    if (showBubble) {
      const timer = setTimeout(() => setShowBubble(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showBubble]);

  const sendMessage = () => {
    const text = message.trim() || `Bonjour ${name}, je visite votre portfolio et j'aimerais discuter avec vous.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setMessage("");
    setOpen(false);
  };

  const quickMessages = [
    "Je suis intéressé par vos services",
    "J'ai un projet à discuter",
    "Demande de devis",
    "Question sur votre expérience",
  ];

  return (
    <>
      {/* Chat panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className="rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          style={{
            background: "#111218",
            border: "1px solid rgba(42,43,53,0.8)",
          }}
        >
          {/* Header */}
          <div className="relative px-5 py-4 bg-gradient-to-r from-[#25D366] to-[#128C7E]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {name[0]}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{name} ALOHOU</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <span className="text-white/80 text-xs">
                    En ligne — répond en quelques minutes
                  </span>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Wave decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#111218]" style={{ borderRadius: "100% 100% 0 0" }} />
          </div>

          {/* Chat body */}
          <div className="px-5 py-4 space-y-4">
            {/* Welcome message bubble */}
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] text-xs font-bold flex-shrink-0 mt-1">
                {name[0]}
              </div>
              <div
                className="bg-[#1a1b24] rounded-2xl rounded-tl-md px-4 py-3 max-w-[260px]"
                style={{ border: "1px solid rgba(42,43,53,0.6)" }}
              >
                <p className="text-[#e4e5eb] text-sm leading-relaxed">
                  Bonjour ! 👋 Je suis {name}. Comment puis-je vous aider ?
                  N'hésitez pas à me laisser un message.
                </p>
                <span className="text-[10px] text-[#8b8d9a] mt-1.5 block">
                  {new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>

            {/* Quick replies */}
            <div>
              <p className="text-[10px] text-[#8b8d9a] font-mono uppercase mb-2 px-1">
                Messages rapides
              </p>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setMessage(msg);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#25D366]/8 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/15 hover:border-[#25D366]/40 transition-all"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="px-4 pb-4">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{
                background: "#1a1b24",
                border: "1px solid rgba(42,43,53,0.6)",
              }}
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-[#8b8d9a]/60"
              />
              <button
                onClick={sendMessage}
                className="w-9 h-9 rounded-lg bg-[#25D366] hover:bg-[#20BD5A] flex items-center justify-center transition-colors flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <p className="text-[9px] text-[#8b8d9a]/50 text-center mt-2 flex items-center justify-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              Powered by WhatsApp — Conversation sécurisée
            </p>
          </div>
        </div>
      </div>

      {/* Welcome bubble tooltip */}
      {showBubble && !open && (
        <div
          className="fixed bottom-24 right-6 z-50 max-w-[260px] animate-fade-in"
          style={{ animation: "slideUp 0.4s ease-out" }}
        >
          <div
            className="relative rounded-2xl px-4 py-3 shadow-xl"
            style={{
              background: "#1a1b24",
              border: "1px solid rgba(42,43,53,0.8)",
            }}
          >
            <button
              onClick={() => { setShowBubble(false); setDismissed(true); }}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#2a2b35] text-[#8b8d9a] flex items-center justify-center hover:text-white text-[10px]"
            >
              ✕
            </button>
            <p className="text-sm text-[#e4e5eb]">
              👋 Besoin d'aide ? Discutons sur WhatsApp !
            </p>
            {/* Arrow pointing to button */}
            <div
              className="absolute -bottom-2 right-6 w-4 h-4 rotate-45"
              style={{ background: "#1a1b24", border: "1px solid rgba(42,43,53,0.8)", borderTop: "none", borderLeft: "none" }}
            />
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => {
          setOpen(!open);
          setShowBubble(false);
          setDismissed(true);
        }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          open
            ? "bg-[#2a2b35] rotate-0"
            : "bg-[#25D366] hover:bg-[#20BD5A]"
        }`}
        aria-label="Chat WhatsApp"
      >
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}

        {/* Notification dot */}
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold border-2 border-[#0a0b0e]">
            1
          </span>
        )}
      </button>
    </>
  );
}
