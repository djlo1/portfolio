"use client";
import { useEffect, useRef } from "react";

export default function Education({ data }) {
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

  const degrees = data.filter((e) => e.type === "degree");
  const certifications = data.filter((e) => e.type === "certification");

  return (
    <section
      id="education"
      className="py-24 md:py-32 relative bg-[var(--color-bg-card)]/30"
      ref={ref}
    >
      <div className="container-custom">
        {/* Section label */}
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">
            Formation
          </span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-16">
          Formation & <span className="gradient-text">Certifications</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Degrees */}
          <div>
            <h3 className="animate-on-scroll font-display font-semibold text-white text-lg mb-6 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
              </svg>
              Diplômes
            </h3>
            <div className="space-y-4">
              {degrees.map((edu, i) => (
                <div
                  key={edu.id || i}
                  className="animate-on-scroll glass-card glass-card-hover p-5"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display font-semibold text-white text-sm">
                        {edu.institution}
                      </h4>
                      <p className="text-sm text-[var(--color-text-dim)] mt-1">
                        {edu.degree}
                      </p>
                    </div>
                    <span className="font-mono text-[0.65rem] text-[var(--color-accent)] bg-[var(--color-accent)]/8 px-2 py-1 rounded-md whitespace-nowrap">
                      {edu.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="animate-on-scroll font-display font-semibold text-white text-lg mb-6 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
              Certifications
            </h3>
            <div className="space-y-4">
              {certifications.map((edu, i) => (
                <div
                  key={edu.id || i}
                  className="animate-on-scroll glass-card glass-card-hover p-5"
                  style={{ transitionDelay: `${(i + degrees.length) * 0.1}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display font-semibold text-white text-sm">
                        {edu.institution}
                      </h4>
                      <p className="text-sm text-[var(--color-text-dim)] mt-1">
                        {edu.degree}
                      </p>
                    </div>
                    <span className="font-mono text-[0.65rem] text-[var(--color-accent-2)] bg-[var(--color-accent-2)]/8 px-2 py-1 rounded-md whitespace-nowrap">
                      {edu.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
