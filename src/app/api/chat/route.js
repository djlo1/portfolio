import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const SYSTEM_PROMPT = `Tu es l'assistant virtuel du portfolio de Djlo ALOHOU, un expert en gestion de flotte (FMS), IoT, développement web et administration système basé au Bénin.

PROFIL DE DJLO:
- Plus de 8 ans d'expérience en technologies
- Spécialiste FMS: SECURYSAT, TELTONIKA, AFTRAX, Ruptela — configuration balises GPS, analyse données
- Développeur Web: WordPress, HTML/CSS/JS, e-commerce, CMS personnalisés, PWA, React, Next.js, Supabase
- Admin Système: Microsoft 365, Azure AD/Entra ID, Google Workspace, Power Automate, Intune
- Gestion de projet: Scrum/Agile, JIRA, Zoho Desk, gestion SLA
- IoT & Data: Capteurs IoT, intégration API temps réel, Power BI, Cartographie OSM

EXPÉRIENCE NOTABLE:
- REEXOM SARL (Togo, 2024): Jauge automatique stations-services, système péréquation hydrocarbures gouvernement Togolais
- 3D Techlogis SARL (Bénin, 2020-2024): DG, SyGeQ pour ministère Industrie/Commerce, SyCaP pour usine NOCIBE, système AFTRAX
- Bourjon Investment (2021-2024): Admin Microsoft 365, Azure AD, Google Workspace
- DJLOTECH Society, ABP Technologie, CREDEL Bénin: Formation, développement web

FORMATION: Licence développement web (Goldsmith University London), PSM1 en cours, Power BI PL-300 en cours, certifications Google (PWA, TensorFlow, Android Things)

RÈGLES:
- Réponds en français, de manière professionnelle et chaleureuse
- Présente les compétences et expériences de Djlo pour convaincre les visiteurs
- Si on te demande un devis ou de démarrer un projet, invite à laisser un email ou à attendre que Djlo se connecte
- Si la question sort du domaine tech/portfolio, reste poli et ramène vers les services de Djlo
- Sois concis (2-3 phrases max par réponse)
- Tu ne connais PAS les tarifs — invite à en discuter directement avec Djlo
- Si le visiteur demande si Djlo est disponible, dis qu'il n'est pas en ligne mais qu'il répondra dès que possible
- Ne dis jamais que tu es ChatGPT, Gemini ou un autre modèle précis — dis simplement que tu es l'assistant IA du portfolio de Djlo`;

export async function POST(request) {
  try {
    const { conversationId, visitorMessage } = await request.json();
    if (!conversationId || !visitorMessage) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if admin is online
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
      .limit(20);

    // Build Gemini conversation format
    // Gemini requires: first message must be "user", roles must alternate
    const rawContents = [];

    (history || []).forEach((m) => {
      rawContents.push({
        role: m.sender === "visitor" ? "user" : "model",
        parts: [{ text: m.message.replace(/^🤖\s?/, "") }],
      });
    });

    // Ensure the last message is the visitor's current message
    if (rawContents.length === 0 || rawContents[rawContents.length - 1].role !== "user") {
      rawContents.push({ role: "user", parts: [{ text: visitorMessage }] });
    }

    // Fix: ensure first message is "user" and roles alternate
    const contents = [];
    for (const msg of rawContents) {
      if (contents.length === 0 && msg.role === "model") continue; // Skip leading model messages
      if (contents.length > 0 && contents[contents.length - 1].role === msg.role) {
        // Merge consecutive same-role messages
        contents[contents.length - 1].parts[0].text += "\n" + msg.parts[0].text;
      } else {
        contents.push(msg);
      }
    }

    // Safety: if still empty or doesn't start with user
    if (contents.length === 0) {
      contents.push({ role: "user", parts: [{ text: visitorMessage }] });
    }

    // Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json({ replied: false, reason: "no_api_key" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      // Fallback: send a default message if Gemini fails
      await sb.from("chat_messages").insert({
        conversation_id: conversationId,
        sender: "admin",
        message: `🤖 Merci pour votre message ! Djlo n'est pas disponible pour le moment mais il vous répondra dès que possible. En attendant, n'hésitez pas à laisser votre email pour qu'il puisse vous recontacter.`,
      });
      return Response.json({ replied: true, reason: "fallback" });
    }

    const data = await response.json();
    const aiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiReply) {
      return Response.json({ replied: false, reason: "empty_response" });
    }

    // Save AI reply
    await sb.from("chat_messages").insert({
      conversation_id: conversationId,
      sender: "admin",
      message: `🤖 ${aiReply}`,
    });

    await sb
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    return Response.json({ replied: true, message: aiReply });
  } catch (err) {
    console.error("Chat AI error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
