"use client";
import { useEffect, useRef } from "react";

export default function Experience({ data }) {
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

  return (
    <section id="experience" className="py-24 md:py-32 relative" ref={ref}>
      {/* Background accent */}
      <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />

      <div className="container-custom relative">
        {/* Section label */}
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">
            Expérience
          </span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-16">
          Parcours <span className="gradient-text">professionnel</span>
        </h2>

        {/* Timeline */}
        <div className="relative pl-8 md:pl-12">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-accent-2)] to-transparent" />

          {data.map((exp, index) => (
            <div
              key={exp.id || index}
              className="animate-on-scroll relative mb-12 last:mb-0"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              {/* Dot on timeline */}
              <div className="absolute -left-8 md:-left-8 top-1 w-4 h-4 rounded-full bg-[var(--color-bg)] border-2 border-[var(--color-accent)] z-10">
                <div className="absolute inset-1 rounded-full bg-[var(--color-accent)] animate-pulse-slow" />
              </div>

              {/* Card */}
              <div className="glass-card glass-card-hover p-6 md:p-8 ml-4">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl text-white">
                      {exp.company}
                    </h3>
                    <p className="font-display text-[var(--color-accent)] text-sm font-medium mt-1">
                      {exp.role}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-mono text-xs text-[var(--color-text-dim)] bg-white/5 px-3 py-1 rounded-full">
                      {exp.period}
                    </span>
                    <span className="text-xs text-[var(--color-text-dim)]">
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Missions */}
                <div className="space-y-2">
                  {(exp.missions || []).map((mission, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-[var(--color-accent)]/50" />
                      <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">
                        {mission}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
