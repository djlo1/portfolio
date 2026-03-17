"use client";
import { useEffect, useRef } from "react";

export default function Contact({ data }) {
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
    <section id="contact" className="py-24 md:py-32 relative" ref={ref}>
      {/* Background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] rounded-full filter blur-[200px] opacity-5 pointer-events-none" />

      <div className="container-custom relative">
        {/* Section label */}
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">
            Contact
          </span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-4">
          Travaillons <span className="gradient-text">ensemble</span>
        </h2>
        <p className="animate-on-scroll text-[var(--color-text-dim)] max-w-xl mb-12">
          Vous avez un projet en tête ? N'hésitez pas à me contacter pour
          discuter de la meilleure façon de le réaliser.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact cards */}
          <div className="animate-on-scroll space-y-4">
            {/* Email */}
            <a
              href={`mailto:${data.email}`}
              className="glass-card glass-card-hover p-6 flex items-center gap-5 group block"
            >
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/15 flex items-center justify-center group-hover:bg-[var(--color-accent)]/15 transition-colors flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">
                  Email
                </p>
                <p className="text-white font-medium group-hover:text-[var(--color-accent)] transition-colors">
                  {data.email}
                </p>
              </div>
            </a>

            {/* Phone / WhatsApp */}
            <a
              href={`https://wa.me/22901999989929`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-hover p-6 flex items-center gap-5 group block"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">
                  WhatsApp / Téléphone
                </p>
                <p className="text-white font-medium group-hover:text-emerald-400 transition-colors">
                  {data.phone}
                </p>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card glass-card-hover p-6 flex items-center gap-5 group block"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/15 transition-colors flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">
                  LinkedIn
                </p>
                <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                  Djlo Alo
                </p>
              </div>
            </a>

            {/* Location */}
            <div className="glass-card p-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-2)]/8 border border-[var(--color-accent-2)]/15 flex items-center justify-center flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">
                  Localisation
                </p>
                <p className="text-white font-medium">{data.location}</p>
              </div>
            </div>
          </div>

          {/* CTA card */}
          <div
            className="animate-on-scroll glass-card p-8 md:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden"
            style={{ transitionDelay: "0.2s" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-accent-2)]/5" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-3">
                Démarrons un projet
              </h3>
              <p className="text-[var(--color-text-dim)] mb-8 max-w-sm">
                FMS, IoT, développement web ou administration système —
                discutons de votre besoin et trouvons la meilleure solution.
              </p>
              <a
                href={`mailto:${data.email}?subject=Nouveau%20Projet&body=Bonjour%20Djlo,%0A%0AJe%20souhaite%20discuter%20d'un%20projet.%0A%0ACordialement`}
                className="btn-primary text-base px-8 py-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Envoyer un Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
