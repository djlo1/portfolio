"use client";
import { useEffect, useRef } from "react";

export default function Hero({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create network particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 240, 255, 0.3)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient orbs */}
      <div className="hero-orb w-[500px] h-[500px] bg-[var(--color-accent)] top-[-10%] right-[-10%] opacity-20" />
      <div className="hero-orb w-[400px] h-[400px] bg-[var(--color-accent-2)] bottom-[-5%] left-[-5%] opacity-15"
        style={{ animationDelay: "-3s" }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-0" />

      {/* Content */}
      <div className="container-custom relative z-10 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
        <div className="flex-1 max-w-4xl">
          {/* Status badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20 mb-8"
            style={{ animation: "fadeIn 0.8s ease-out" }}
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-sm font-mono text-[var(--color-accent)]">
              Disponible pour de nouveaux projets
            </span>
          </div>

          {/* Name */}
          <h1
            className="font-display font-900 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] mb-6"
            style={{ animation: "slideUp 0.8s ease-out" }}
          >
            <span className="text-white">{data.firstName}</span>
            <br />
            <span className="gradient-text">{data.lastName}</span>
          </h1>

          {/* Title */}
          <p
            className="font-display text-xl sm:text-2xl md:text-3xl text-white/70 font-light mb-4"
            style={{ animation: "slideUp 0.8s ease-out 0.15s both" }}
          >
            {data.title}
          </p>

          {/* Tagline */}
          <p
            className="text-lg text-[var(--color-text-dim)] max-w-2xl mb-10 leading-relaxed"
            style={{ animation: "slideUp 0.8s ease-out 0.3s both" }}
          >
            {data.tagline}
          </p>

          {/* CTA buttons */}
          <div
            className="flex flex-wrap gap-4"
            style={{ animation: "slideUp 0.8s ease-out 0.45s both" }}
          >
            <a href="#projects" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Voir mes Projets
            </a>
            <a href="#contact" className="btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Me Contacter
            </a>
          </div>

          {/* Stats row */}
          <div
            className="flex flex-wrap gap-8 mt-16 pt-8 border-t border-[var(--color-border)]"
            style={{ animation: "fadeIn 1s ease-out 0.7s both" }}
          >
            {[
              { value: "8+", label: "Années d'expérience" },
              { value: "15+", label: "Projets livrés" },
              { value: "3", label: "Pays d'intervention" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3">
                <span className="font-display font-bold text-3xl gradient-text-accent">
                  {stat.value}
                </span>
                <span className="text-sm text-[var(--color-text-dim)]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

          {/* Profile photo */}
          {data.photo && data.photo !== "/photo.jpg" && (
            <div
              className="hidden lg:flex flex-shrink-0"
              style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
            >
              <div className="relative group">
                <div className="w-64 h-64 xl:w-72 xl:h-72 rounded-full overflow-hidden shadow-2xl shadow-[var(--color-accent)]/10">
                  <img
                    src={data.photo}
                    alt={`${data.firstName} ${data.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Subtle glow behind */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/20 blur-2xl -z-10 scale-110 opacity-60" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs font-mono text-[var(--color-text-dim)]">SCROLL</span>
        <div className="w-5 h-8 rounded-full border border-[var(--color-border)] flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[var(--color-accent)] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
