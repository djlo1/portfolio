"use client";

export default function Footer({ data }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-[var(--color-border)]">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-white">D<span className="text-[var(--color-accent)]">.</span></span>
          <span className="text-sm text-[var(--color-text-dim)]">
            &copy; {year} {data.firstName} {data.lastName}. Tous droits réservés.
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
            aria-label="LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a
            href={`mailto:${data.email}`}
            className="text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors"
            aria-label="Email"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
          <a
            href={`https://wa.me/22901999989929`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-dim)] hover:text-emerald-400 transition-colors"
            aria-label="WhatsApp"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
