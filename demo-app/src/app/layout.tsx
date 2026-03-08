import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARCADIA Demo App",
  description: "ARCADIA Demo Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="light" style={{ colorScheme: "light" }}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
