import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/layout/Shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const siteUrl = "https://antoniobrkic.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Antonio Brkić — Full-Stack Engineer",
    template: "%s | Antonio Brkić",
  },
  description:
    "Antonio Brkić is a full-stack engineer building production SaaS with Next.js, TypeScript, and PostgreSQL. Explore his work through an interactive desktop OS portfolio.",
  keywords: [
    "Antonio Brkić",
    "Full-Stack Engineer",
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
    siteName: "Antonio Brkić — Full-Stack Engineer",
    title: "Antonio Brkić — Full-Stack Engineer",
    description:
      "Full-stack engineer building production SaaS with Next.js, TypeScript, and PostgreSQL. Explore the work through an interactive desktop OS portfolio.",
    locale: "en_US",
    images: [
      {
        url: "/preview.png",
        width: 2558,
        height: 1339,
        alt: "Antonio Brkić — Full-Stack Engineer portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antonio Brkić — Full-Stack Engineer",
    description:
      "Full-stack engineer building production SaaS with Next.js, TypeScript, and PostgreSQL.",
    images: ["/preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
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
    url: siteUrl,
    image: `${siteUrl}/preview.png`,
    jobTitle: "Full-Stack Engineer",
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
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
