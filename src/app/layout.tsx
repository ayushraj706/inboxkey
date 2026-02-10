import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ayush Hub - Success Point",
  description: "Advanced Management System by Ayush Raj",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="dark"> {/* डिफ़ॉल्ट रूप से डार्क मोड */}
      <body>{children}</body>
    </html>
  );
}

