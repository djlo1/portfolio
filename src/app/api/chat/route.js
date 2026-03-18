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
- Pour devis/projet: invite à laisser un email
- Ne révèle pas quel modèle IA tu es
- Pas de tarifs: invite à discuter avec Djlo`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { conversationId, visitorMessage } = body;

    if (!conversationId || !visitorMessage) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check admin online status
    const { data: status } = await sb
      .from("admin_status")
      .select("is_online")
      .eq("id", "main")
      .single();

    if (status?.is_online) {
      return Response.json({ replied: false, reason: "admin_online" });
    }

    // Check API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not found in env");
      await sendFallback(conversationId);
      return Response.json({ replied: true, reason: "no_key_fallback" });
    }

    // Get last messages for context (only visitor messages to keep it simple)
    const { data: history } = await sb
      .from("chat_messages")
      .select("sender, message")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(15);

    // Build clean conversation - Gemini needs user first, alternating roles
    const contents = [];
    let lastRole = null;

    for (const m of (history || [])) {
      const role = m.sender === "visitor" ? "user" : "model";
      const text = m.message.replace(/^🤖\s?/, "").trim();
      if (!text) continue;

      if (role === lastRole && contents.length > 0) {
        // Merge same role
        contents[contents.length - 1].parts[0].text += " " + text;
      } else {
        // Skip if first message would be model
        if (contents.length === 0 && role === "model") continue;
        contents.push({ role, parts: [{ text }] });
        lastRole = role;
      }
    }

    // Ensure ends with user message
    if (contents.length === 0 || lastRole !== "user") {
      if (lastRole === "user" && contents.length > 0) {
        contents[contents.length - 1].parts[0].text += " " + visitorMessage;
      } else {
        contents.push({ role: "user", parts: [{ text: visitorMessage }] });
      }
    }

    // Try Gemini 2.0 Flash first, then 1.5 Flash as fallback
    const models = ["gemini-2.0-flash", "gemini-1.5-flash"];
    let aiReply = null;

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM }] },
            contents,
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.7,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiReply) break;
        } else {
          const errBody = await res.text();
          console.error(`Gemini ${model} error ${res.status}:`, errBody);
        }
      } catch (fetchErr) {
        console.error(`Gemini ${model} fetch error:`, fetchErr.message);
      }
    }

    // If all models failed, try simple single-turn request
    if (!aiReply) {
      try {
        const simpleRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${SYSTEM}\n\nLe visiteur dit: "${visitorMessage}"\n\nRéponds en 2-3 phrases max.` }] }],
              generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
            }),
          }
        );
        if (simpleRes.ok) {
          const d = await simpleRes.json();
          aiReply = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
          console.error("Simple Gemini also failed:", await simpleRes.text());
        }
      } catch (e) {
        console.error("Simple Gemini fetch error:", e.message);
      }
    }

    // Final fallback
    if (!aiReply) {
      await sendFallback(conversationId);
      return Response.json({ replied: true, reason: "all_failed_fallback" });
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
    console.error("Chat API top-level error:", err);
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

// GET /api/chat — test endpoint to verify Gemini works
export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return Response.json({ status: "error", message: "GEMINI_API_KEY not set" });

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Dis bonjour en une phrase" }] }],
          generationConfig: { maxOutputTokens: 50 },
        }),
      }
    );
    if (!res.ok) {
      const err = await res.text();
      return Response.json({ status: "error", code: res.status, detail: err });
    }
    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return Response.json({ status: "ok", reply, key_prefix: apiKey.slice(0, 8) + "..." });
  } catch (e) {
    return Response.json({ status: "error", message: e.message });
  }
}
