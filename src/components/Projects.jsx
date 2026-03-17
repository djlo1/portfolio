"use client";
import { useEffect, useRef } from "react";

const colorMap = {
  FMS: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400",
  API: "from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400",
  IoT: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-400",
  Gouvernement: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400",
  "QR Code": "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400",
  Automatisation: "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-400",
  Innovation: "from-fuchsia-500/20 to-fuchsia-500/5 border-fuchsia-500/30 text-fuchsia-400",
  default: "from-[var(--color-accent)]/20 to-[var(--color-accent)]/5 border-[var(--color-accent)]/30 text-[var(--color-accent)]",
};

function getTagColor(tag) {
  return colorMap[tag] || colorMap.default;
}

export default function Projects({ data }) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const highlighted = data.filter((p) => p.highlight);
  const others = data.filter((p) => !p.highlight);

  return (
    <section id="projects" className="py-24 md:py-32 relative" ref={ref}>
      <div className="container-custom">
        {/* Section label */}
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">
            Projets
          </span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-4">
          Réalisations <span className="gradient-text">clés</span>
        </h2>
        <p className="animate-on-scroll text-[var(--color-text-dim)] max-w-2xl mb-12">
          Des projets à fort impact, livrés pour des gouvernements et des entreprises
          industrielles en Afrique de l'Ouest.
        </p>

        {/* Featured projects */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {highlighted.map((project, i) => (
            <div
              key={project.id || i}
              className="animate-on-scroll glass-card glass-card-hover p-0 flex flex-col relative overflow-hidden group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] via-[var(--color-accent-2)] to-transparent z-10" />

              {/* Project image */}
              {project.image_url && (
                <div className="w-full h-44 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Featured badge */}
                <div className="flex items-center gap-2 mb-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="text-xs font-mono text-[var(--color-accent)] uppercase">
                    Projet phare
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-[var(--color-text-dim)] leading-relaxed mb-5 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tags || []).map((tag, j) => (
                    <span key={j} className="tech-tag text-[0.65rem]">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Project link */}
                {project.link && project.link_visibility !== "private" && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:text-white transition-colors mt-auto pt-3 border-t border-[var(--color-border)]"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Voir le projet
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Other projects */}
        {others.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((project, i) => (
              <div
                key={project.id || i}
                className="animate-on-scroll glass-card glass-card-hover p-0 flex flex-col overflow-hidden group"
                style={{ transitionDelay: `${(i + highlighted.length) * 0.1}s` }}
              >
                {/* Project image */}
                {project.image_url && (
                  <div className="w-full h-36 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-semibold text-white mb-3">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-dim)] leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.tags || []).map((tag, j) => (
                      <span key={j} className="tech-tag text-[0.65rem]">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Project link */}
                  {project.link && project.link_visibility !== "private" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-accent)] hover:text-white transition-colors mt-auto pt-3 border-t border-[var(--color-border)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      Voir le projet
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
