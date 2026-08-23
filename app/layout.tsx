import type { Metadata, Viewport } from "next";
import {
  Inter,
  JetBrains_Mono,
  Source_Serif_4,
  Instrument_Serif,
  Newsreader,
} from "next/font/google";
import "./globals.css";

// latin-ext carries the Croatian diacritics. Without it "Brkić" falls back mid-word.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin", "latin-ext"],
});

// Editorial face for the notebook presentation.
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "latin-ext"],
});

// Broadsheet: high-contrast display face for mastheads and headlines...
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

// ...and a text face designed for long-form reading at small sizes.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
});

const siteUrl = "https://antoniobrkic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Antonio Brkić, Full-Stack Developer",
    template: "%s | Antonio Brkić",
  },
  description:
    "Antonio Brkić is a full-stack developer in Zagreb building web apps with Next.js, TypeScript and PostgreSQL. Client work, college projects and things built for fun.",
  keywords: [
    "Antonio Brkić",
    "Full-Stack Developer",
    "Next.js Developer",
    "TypeScript",
    "React",
    "Web Developer Portfolio",
    "Zagreb",
  ],
  authors: [{ name: "Antonio Brkić", url: siteUrl }],
  creator: "Antonio Brkić",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Antonio Brkić",
    title: "Antonio Brkić, Full-Stack Developer",
    description:
      "Full-stack developer in Zagreb building web apps with Next.js, TypeScript and PostgreSQL.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Antonio Brkić, Full-Stack Developer",
    description:
      "Full-stack developer in Zagreb building web apps with Next.js, TypeScript and PostgreSQL.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Antonio Brkić",
    url: siteUrl,
    jobTitle: "Full-Stack Developer",
    email: "mailto:contact@antoniobrkic.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Zagreb",
      addressCountry: "HR",
    },
    knowsAbout: [
      "Full-Stack Development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
    ],
    sameAs: [
      "https://github.com/Brkic365",
      "https://linkedin.com/in/antonio-brkic",
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${sourceSerif.variable} ${instrumentSerif.variable} ${newsreader.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
