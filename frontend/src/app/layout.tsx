import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golf Store — Coming Soon",
  description: "A new golf shopping experience is in the works.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
