import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const SYSTEM = `Tu es l'assistant virtuel du portfolio de Djlo ALOHOU, expert en gestion de flotte (FMS), IoT, développement web et administration système basé au Bénin.

PROFIL:
- 8+ ans d'expérience en technologies
- FMS: SECURYSAT, TELTONIKA, AFTRAX, Ruptela, configuration balises GPS
- Web: WordPress, HTML/CSS/JS, React, Next.js, e-commerce, CMS, PWA
- Admin Système: Microsoft 365, Azure AD/Entra ID, Google Workspace, Intune
- Projet: Scrum/Agile, JIRA, Zoho Desk
- IoT & Data: Capteurs IoT, API temps réel, Power BI, OSM

EXPÉRIENCES CLÉS:
- REEXOM SARL (Togo 2024): jauge auto stations-services, péréquation hydrocarbures gouvernement Togolais
- 3D Techlogis (Bénin 2020-2024): DG, SyGeQ ministère Industrie, SyCaP usine NOCIBE, AFTRAX
- Bourjon Investment (2021-2024): Admin M365, Azure AD, Google Workspace
- Formation: Licence web Goldsmith London, PSM1 en cours, PL-300 en cours

RÈGLES:
- Réponds en français, professionnel et chaleureux
- 2-3 phrases max par réponse
- Mets en avant les compétences de Djlo
- Pour devis/projet: invite à laisser un email ou attendre que Djlo se connecte
- Ne dis jamais quel modèle IA tu utilises
- Pas de tarifs: invite à discuter directement avec Djlo`;

export async function POST(request) {
  try {
    const { conversationId, visitorMessage } = await request.json();
    if (!conversationId || !visitorMessage) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check admin online
    const { data: status } = await sb
      .from("admin_status")
      .select("is_online")
      .eq("id", "main")
      .single();

    if (status?.is_online) {
      return Response.json({ replied: false, reason: "admin_online" });
    }

    // Get conversation history
    const { data: history } = await sb
      .from("chat_messages")
      .select("sender, message")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(15);

    // Build OpenAI-compatible messages (Groq uses same format)
    const messages = [{ role: "system", content: SYSTEM }];

    for (const m of (history || [])) {
      const role = m.sender === "visitor" ? "user" : "assistant";
      const content = m.message.replace(/^🤖\s?/, "").trim();
      if (!content) continue;
      // Merge consecutive same-role messages
      if (messages.length > 0 && messages[messages.length - 1].role === role) {
        messages[messages.length - 1].content += "\n" + content;
      } else {
        messages.push({ role, content });
      }
    }

    // Ensure last message is user
    if (messages[messages.length - 1]?.role !== "user") {
      messages.push({ role: "user", content: visitorMessage });
    }

    // Try Groq first (free, fast), then Gemini as fallback
    let aiReply = null;

    // === GROQ (Llama 3.1 70B) ===
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && !aiReply) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages,
            max_tokens: 250,
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          aiReply = data?.choices?.[0]?.message?.content;
        } else {
          console.error("Groq error:", res.status, await res.text());
        }
      } catch (e) {
        console.error("Groq fetch error:", e.message);
      }
    }

    // === GEMINI FALLBACK ===
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && !aiReply) {
      try {
        // Convert to Gemini format
        const contents = [];
        for (const m of messages) {
          if (m.role === "system") continue;
          const role = m.role === "user" ? "user" : "model";
          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts[0].text += "\n" + m.content;
          } else {
            if (contents.length === 0 && role === "model") continue;
            contents.push({ role, parts: [{ text: m.content }] });
          }
        }
        if (contents.length === 0) {
          contents.push({ role: "user", parts: [{ text: visitorMessage }] });
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM }] },
              contents,
              generationConfig: { maxOutputTokens: 250, temperature: 0.7 },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
          console.error("Gemini error:", res.status, await res.text());
        }
      } catch (e) {
        console.error("Gemini fetch error:", e.message);
      }
    }

    // Final fallback message
    if (!aiReply) {
      await sendFallback(conversationId);
      return Response.json({ replied: true, reason: "fallback" });
    }

    // Save AI reply
    await sb.from("chat_messages").insert({
      conversation_id: conversationId,
      sender: "admin",
      message: `🤖 ${aiReply}`,
    });

    await sb.from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return Response.json({ replied: true });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function sendFallback(conversationId) {
  await sb.from("chat_messages").insert({
    conversation_id: conversationId,
    sender: "admin",
    message: `🤖 Merci pour votre message ! Djlo n'est pas disponible actuellement mais il vous répondra très bientôt. Vous pouvez laisser votre email et il vous recontactera.`,
  });
  await sb.from("chat_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);
}

// GET /api/chat — test endpoint
export async function GET() {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const result = { groq: "not configured", gemini: "not configured" };

  if (groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: "Dis bonjour en une phrase" }],
          max_tokens: 30,
        }),
      });
      if (res.ok) {
        const d = await res.json();
        result.groq = { status: "ok", reply: d?.choices?.[0]?.message?.content };
      } else {
        result.groq = { status: "error", code: res.status, detail: await res.text() };
      }
    } catch (e) {
      result.groq = { status: "error", message: e.message };
    }
  }

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Dis bonjour en une phrase" }] }],
            generationConfig: { maxOutputTokens: 30 },
          }),
        }
      );
      if (res.ok) {
        const d = await res.json();
        result.gemini = { status: "ok", reply: d?.candidates?.[0]?.content?.parts?.[0]?.text };
      } else {
        result.gemini = { status: "error", code: res.status, detail: (await res.text()).slice(0, 200) };
      }
    } catch (e) {
      result.gemini = { status: "error", message: e.message };
    }
  }

  return Response.json(result);
}
