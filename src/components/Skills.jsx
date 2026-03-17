"use client";
import { useEffect, useRef, useState } from "react";

export default function Skills({ data, languages }) {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            setAnimated(true);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="skills"
      className="py-24 md:py-32 relative bg-[var(--color-bg-card)]/30"
      ref={ref}
    >
      <div className="container-custom">
        {/* Section label */}
        <div className="animate-on-scroll flex items-center gap-3 mb-4">
          <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
          <span className="font-mono text-sm text-[var(--color-accent)] uppercase tracking-widest">
            Compétences
          </span>
        </div>

        <h2 className="animate-on-scroll section-heading text-3xl md:text-5xl text-white mb-16">
          Expertise <span className="gradient-text">technique</span>
        </h2>

        {/* Skills grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {data.map((skill, index) => (
            <div
              key={index}
              className="animate-on-scroll glass-card glass-card-hover p-6 group"
              style={{ transitionDelay: `${index * 0.08}s` }}
            >
              {/* Category header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-sm">
                  {skill.category}
                </h3>
                <span className="font-mono text-xs text-[var(--color-accent)]">
                  {skill.level}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="skill-bar-bg mb-5">
                <div
                  className="skill-bar-fill"
                  style={{ width: animated ? `${skill.level}%` : "0%" }}
                />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {(skill.items || []).map((item, i) => (
                  <span key={i} className="tech-tag text-[0.65rem]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div className="animate-on-scroll">
          <h3 className="font-display font-semibold text-white text-lg mb-6">
            Langues
          </h3>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang, i) => (
              <div
                key={i}
                className="glass-card p-4 flex items-center gap-4 min-w-[180px]"
              >
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(42,43,53,0.5)"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#langGrad)"
                      strokeWidth="3"
                      strokeDasharray={`${animated ? lang.percentage : 0}, 100`}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1.5s ease-out" }}
                    />
                    <defs>
                      <linearGradient id="langGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent-2)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] text-white">
                    {lang.percentage}%
                  </span>
                </div>
                <div>
                  <p className="font-display font-medium text-white text-sm">
                    {lang.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-dim)]">{lang.level}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
