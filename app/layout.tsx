import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUILD26 — Admin Command Center & Participant OS",
  description: "Production operating system for Build26 hands-on college technology bootcamp. Build, Ship, and Showcase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20 selection:text-accent">
        {children}
      </body>
    </html>
  );
}
