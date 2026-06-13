import type { Metadata } from "next";
import { Anton, Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Display face for headings; condensed sans for everything else.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "World Cup Fan Cam '26",
  description:
    "Watch the hype build outside World Cup 2026 stadiums through grainy public street cams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
