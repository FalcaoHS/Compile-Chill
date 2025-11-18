import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeEffects } from "@/components/ThemeEffects";

export const metadata: Metadata = {
  title: {
    default: "Compile & Chill",
    template: "%s | Compile & Chill",
  },
  description: "Portal de descompressão para desenvolvedores. Jogos leves com estética hacker/cyber, temas personalizáveis, ranking competitivo e integração social no X.",
  keywords: [
    "desenvolvedores",
    "jogos para devs",
    "descompressão",
    "hacker games",
    "cyber games",
    "jogos retro",
    "terminal games",
    "ranking de desenvolvedores",
    "break time games",
    "dev games",
  ],
  authors: [{ name: "Compile & Chill" }],
  creator: "Compile & Chill",
  publisher: "Compile & Chill",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://compileandchill.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Compile & Chill",
    title: "Compile & Chill - Portal de Descompressão para Desenvolvedores",
    description: "Jogos leves com estética hacker/cyber, temas personalizáveis, ranking competitivo e integração social no X.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Compile & Chill - Portal de Descompressão para Desenvolvedores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compile & Chill - Portal de Descompressão para Desenvolvedores",
    description: "Jogos leves com estética hacker/cyber, temas personalizáveis, ranking competitivo e integração social no X.",
    images: ["/og-image.png"],
    creator: "@compileandchill",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Adicione aqui quando tiver Google Search Console
     google: "G-QDK4PWT6K9",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <ThemeEffects />
          <Header />
          <div className="flex flex-col min-h-screen">
            <main className="flex-1 pt-16">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

