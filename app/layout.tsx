import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SITE_URL, ogImage } from "@/lib/meta";

// One family for everything. The variable font carries the width axis, so the
// display type can run expanded (125%) while body text stays at 100%.
// latin-ext carries the Croatian diacritics. Without it "Brkić" falls back mid-word.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

const description =
  "Antonio Brkić is a full-stack developer in Zagreb building web apps with Next.js, TypeScript and PostgreSQL. Client work, college projects and things built for fun.";
const short = "Full-stack developer in Zagreb. I build software with something moving in it.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Antonio Brkić, Full-Stack Developer",
    template: "%s | Antonio Brkić",
  },
  description,
  keywords: [
    "Antonio Brkić",
    "Full-Stack Developer",
    "Next.js Developer",
    "TypeScript",
    "React",
    "Web Developer Portfolio",
    "Zagreb",
  ],
  authors: [{ name: "Antonio Brkić", url: SITE_URL }],
  creator: "Antonio Brkić",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Antonio Brkić",
    title: "Antonio Brkić, Full-Stack Developer",
    description: short,
    locale: "en_US",
    images: ogImage("home", "Antonio Brkić, full-stack developer in Zagreb"),
  },
  twitter: {
    card: "summary_large_image",
    title: "Antonio Brkić, Full-Stack Developer",
    description: short,
    images: ogImage("home", "Antonio Brkić")?.map((i) => i.url),
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0e10",
  colorScheme: "dark",
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
    url: SITE_URL,
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
    <html lang="en" className={archivo.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
