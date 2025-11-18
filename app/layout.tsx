import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { ThemeEffects } from "@/components/ThemeEffects";

export const metadata: Metadata = {
  title: "Compile & Chill",
  description: "Portal de descompressão para desenvolvedores",
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
          {children}
        </Providers>
      </body>
    </html>
  );
}

