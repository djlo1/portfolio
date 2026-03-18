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

    const count = window.innerWidth < 768 ? 25 : 60;
    for (let i = 0; i < count; i++) {
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

  const hasPhoto = data.photo && data.photo !== "/photo.jpg";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient orbs — hidden on small screens to prevent overflow */}
      <div className="hidden md:block absolute w-[400px] h-[400px] bg-[var(--color-accent)] rounded-full filter blur-[100px] opacity-15 -top-[10%] -right-[10%]" />
      <div className="hidden md:block absolute w-[300px] h-[300px] bg-[var(--color-accent-2)] rounded-full filter blur-[100px] opacity-10 -bottom-[5%] -left-[5%]" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20 md:opacity-30 z-0" />

      {/* Content */}
      <div className="container-custom relative z-10 pt-20 pb-12 md:pt-28 md:pb-16 w-full">

        {/* Mobile photo — above name */}
        {hasPhoto && (
          <div className="flex justify-center mb-6 lg:hidden" style={{ animation: "fadeIn 0.8s ease-out" }}>
            <div className="relative">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden shadow-xl shadow-[var(--color-accent)]/10">
                <img
                  src={data.photo}
                  alt={`${data.firstName} ${data.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/20 blur-xl -z-10 scale-110 opacity-60" />
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Status badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-[var(--color-accent)]/8 border border-[var(--color-accent)]/20 mb-5 md:mb-8"
              style={{ animation: "fadeIn 0.8s ease-out" }}
            >
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs md:text-sm font-mono text-[var(--color-accent)]">
                Disponible pour de nouveaux projets
              </span>
            </div>

            {/* Name */}
            <h1
              className="font-display font-900 text-[2.5rem] leading-[1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 md:mb-6"
              style={{ animation: "slideUp 0.8s ease-out" }}
            >
              <span className="text-white">{data.firstName}</span>
              <br />
              <span className="gradient-text">{data.lastName}</span>
            </h1>

            {/* Title */}
            <p
              className="font-display text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/70 font-light mb-3 md:mb-4"
              style={{ animation: "slideUp 0.8s ease-out 0.15s both" }}
            >
              {data.title}
            </p>

            {/* Tagline */}
            <p
              className="text-sm sm:text-base md:text-lg text-[var(--color-text-dim)] max-w-2xl mb-6 md:mb-10 leading-relaxed"
              style={{ animation: "slideUp 0.8s ease-out 0.3s both" }}
            >
              {data.tagline}
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              style={{ animation: "slideUp 0.8s ease-out 0.45s both" }}
            >
              <a href="#projects" className="btn-primary justify-center sm:justify-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Voir mes Projets
              </a>
              <a href="#contact" className="btn-outline justify-center sm:justify-start">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                Me Contacter
              </a>
            </div>

            {/* Stats row */}
            <div
              className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mt-8 md:mt-16 pt-6 md:pt-8 border-t border-[var(--color-border)]"
              style={{ animation: "fadeIn 1s ease-out 0.7s both" }}
            >
              {[
                { value: "8+", label: "Années d'exp." },
                { value: "15+", label: "Projets livrés" },
                { value: "3", label: "Pays" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-2 md:gap-3">
                  <span className="font-display font-bold text-2xl md:text-3xl gradient-text-accent">
                    {stat.value}
                  </span>
                  <span className="text-xs md:text-sm text-[var(--color-text-dim)]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop photo — right side */}
          {hasPhoto && (
            <div
              className="hidden lg:flex flex-shrink-0"
              style={{ animation: "fadeIn 1s ease-out 0.5s both" }}
            >
              <div className="relative">
                <div className="w-56 h-56 xl:w-64 xl:h-64 2xl:w-72 2xl:h-72 rounded-full overflow-hidden shadow-2xl shadow-[var(--color-accent)]/10">
                  <img
                    src={data.photo}
                    alt={`${data.firstName} ${data.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-accent)]/20 to-[var(--color-accent-2)]/20 blur-2xl -z-10 scale-110 opacity-60" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-2 opacity-50 hidden md:flex">
        <span className="text-xs font-mono text-[var(--color-text-dim)]">SCROLL</span>
        <div className="w-5 h-8 rounded-full border border-[var(--color-border)] flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[var(--color-accent)] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
