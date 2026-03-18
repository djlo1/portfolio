import './globals.css';

export const metadata = {
  title: 'Djlo ALOHOU — FMS Technical Manager & Web Developer',
  description:
    'Portfolio professionnel de Djlo ALOHOU — Expert en Gestion de Flotte (FMS), IoT, Développement Web et Administration Système basé au Bénin.',
  keywords: 'FMS, GPS tracking, web developer, IoT, project management, Bénin, Afrique',
  openGraph: {
    title: 'Djlo ALOHOU — Portfolio',
    description: 'Expert en Gestion de Flotte, IoT & Développement Web',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
