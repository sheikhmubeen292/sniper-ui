import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/lib/provider";

export const metadata: Metadata = {
  title: "App",
  description: "Sniper Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body>{children}</body>
      </Providers>
    </html>
  );
}
