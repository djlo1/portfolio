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

  const phoneDigits = (data.phone || "").replace(/[^0-9]/g, "");

  return (
    <section id="contact" className="py-20 md:py-32 relative" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--color-accent)] rounded-full filter blur-[200px] opacity-5 pointer-events-none" />

      <div className="container-custom relative">
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">Contact</span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-4">
          Travaillons <span className="gradient-text">ensemble</span>
        </h2>
        <p className="animate-on-scroll text-[var(--color-text-dim)] max-w-xl mb-10 md:mb-12">
          Vous avez un projet en tête ? N'hésitez pas à me contacter pour discuter de la meilleure façon de le réaliser.
        </p>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div className="animate-on-scroll space-y-4">

            {/* Email */}
            <a href={`mailto:${data.email}`}
              className="glass-card glass-card-hover p-5 md:p-6 flex items-center gap-4 md:gap-5 group block">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/15 flex items-center justify-center group-hover:bg-[var(--color-accent)]/15 transition-colors flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">Email</p>
                <p className="text-white font-medium group-hover:text-[var(--color-accent)] transition-colors text-sm md:text-base truncate">{data.email}</p>
              </div>
            </a>

            {/* Phone + WhatsApp */}
            <div className="glass-card glass-card-hover p-5 md:p-6 flex items-center gap-4 md:gap-5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">Téléphone</p>
                <a href={`tel:+${phoneDigits}`} className="text-white font-medium hover:text-emerald-400 transition-colors text-sm md:text-base block">{data.phone}</a>
                <a href={`https://wa.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400/70 hover:text-emerald-400 mt-1 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Écrire sur WhatsApp
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
              className="glass-card glass-card-hover p-5 md:p-6 flex items-center gap-4 md:gap-5 group block">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center group-hover:bg-blue-500/15 transition-colors flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">LinkedIn</p>
                <p className="text-white font-medium group-hover:text-blue-400 transition-colors text-sm md:text-base">Djlo Alo</p>
              </div>
            </a>

            {/* YouTube */}
            {data.youtube && (
              <a href={data.youtube} target="_blank" rel="noopener noreferrer"
                className="glass-card glass-card-hover p-5 md:p-6 flex items-center gap-4 md:gap-5 group block">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-500/8 border border-red-500/15 flex items-center justify-center group-hover:bg-red-500/15 transition-colors flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">YouTube</p>
                  <p className="text-white font-medium group-hover:text-red-400 transition-colors text-sm md:text-base">DJLOTECH Society</p>
                </div>
              </a>
            )}

            {/* Location — Google Maps */}
            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.location || "Abomey-Calavi Benin")}`}
              target="_blank" rel="noopener noreferrer"
              className="glass-card glass-card-hover p-5 md:p-6 flex items-center gap-4 md:gap-5 group block">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--color-accent-2)]/8 border border-[var(--color-accent-2)]/15 flex items-center justify-center group-hover:bg-[var(--color-accent-2)]/15 transition-colors flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-[var(--color-text-dim)] uppercase mb-1">Localisation</p>
                <p className="text-white font-medium group-hover:text-[var(--color-accent-2)] transition-colors text-sm md:text-base">{data.location}</p>
              </div>
            </a>
          </div>

          {/* CTA card */}
          <div className="animate-on-scroll glass-card p-6 md:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden"
            style={{ transitionDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-accent-2)]/5" />
            <div className="relative z-10">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-6 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-3">Démarrons un projet</h3>
              <p className="text-[var(--color-text-dim)] mb-6 md:mb-8 max-w-sm text-sm md:text-base">
                FMS, IoT, développement web ou administration système — discutons de votre besoin et trouvons la meilleure solution.
              </p>
              <a href={`mailto:${data.email}?subject=Nouveau%20Projet&body=Bonjour%20Djlo,%0A%0AJe%20souhaite%20discuter%20d'un%20projet.%0A%0ACordialement`}
                className="btn-primary text-sm md:text-base px-6 md:px-8 py-3 md:py-4">
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
