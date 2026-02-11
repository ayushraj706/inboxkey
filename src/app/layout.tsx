import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";  // 👈 यह लाइन सबसे जरूरी है!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayush Hub",
  description: "Secure Inbox",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
