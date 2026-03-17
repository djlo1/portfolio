"use client";
import { useEffect, useRef } from "react";

export default function About({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container-custom">
        {/* Section label */}
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">
            À propos
          </span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-12">
          Transformer la <span className="gradient-text">technologie</span>
          <br />
          en solutions concrètes
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Bio */}
          <div className="animate-on-scroll space-y-6">
            <p className="text-lg text-[var(--color-text-dim)] leading-relaxed">
              {data.description}
            </p>
            <p className="text-[var(--color-text-dim)] leading-relaxed">
              Spécialiste des systèmes de gestion de flotte (FMS), je conçois et déploie
              des solutions technologiques complexes pour des gouvernements et des entreprises
              en Afrique de l'Ouest — du tracking GPS et l'IoT à l'administration système
              et au développement web.
            </p>

            {/* Quick info */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[
                { icon: "📍", label: "Localisation", value: data.location },
                { icon: "📧", label: "Email", value: data.email },
                { icon: "🌐", label: "Langues", value: "FR, EN, ES" },
                { icon: "🎯", label: "Focus", value: "FMS & IoT" },
              ].map((item) => (
                <div key={item.label} className="glass-card p-4">
                  <span className="text-lg mb-1 block">{item.icon}</span>
                  <span className="text-xs text-[var(--color-text-dim)] font-mono uppercase">
                    {item.label}
                  </span>
                  <p className="text-sm text-white mt-1 font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Services / What I do */}
          <div className="animate-on-scroll space-y-4" style={{ transitionDelay: "0.2s" }}>
            {[
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                ),
                title: "Gestion de Flotte & GPS",
                desc: "Conception et déploiement de systèmes FMS complets — configuration de balises GPS, intégration API, analyse de données en temps réel.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
                title: "Développement Web & CMS",
                desc: "Sites web, applications e-commerce, thèmes WordPress personnalisés, et modules CMS sur mesure.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                ),
                title: "Administration Système",
                desc: "Microsoft 365, Azure AD / Entra ID, Google Workspace — gestion des identités, sécurité et conformité.",
              },
              {
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                ),
                title: "Gestion de Projet IT",
                desc: "Méthodologie Agile/Scrum, gestion SLA, coordination d'équipes techniques, formation et support client.",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="glass-card glass-card-hover p-5 flex gap-4 items-start group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/15 flex items-center justify-center text-[var(--color-accent)] group-hover:bg-[var(--color-accent)]/15 transition-colors">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white mb-1">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">
                    {service.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
