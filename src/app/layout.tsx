import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ness.MKT | Marketing Toolkit",
  description: "ness.MKT - Ferramentas de marketing da NESS. Assinaturas, manual de marca, propostas e muito mais.",
  keywords: ["ness.MKT", "NESS", "marketing", "assinatura", "email", "propostas"],
  authors: [{ name: "NESS" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' font-family='Arial' font-weight='bold' fill='white'>n<tspan fill='%2300ade8'>.</tspan></text></svg>",
  },
  openGraph: {
    title: "ness.MKT | Marketing Toolkit",
    description: "Ferramentas de marketing da NESS",
    url: "https://www.ness.com.br",
    siteName: "ness.MKT",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} font-montserrat antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
