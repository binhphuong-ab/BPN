import type { Metadata } from "next";
import localFont from "next/font/local";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import "./globals.css";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Binh Phuong Nguyen's Blog",
    template: "%s | Binh Phuong Nguyen's Blog",
  },
  description: "Personal blog about technology, programming, and insights",
  keywords: ["blog", "technology", "programming", "web development", "software engineering"],
  authors: [{ name: "Binh Phuong Nguyen" }],
  creator: "Binh Phuong Nguyen",
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    title: "Binh Phuong Nguyen's Blog",
    description: "Personal blog about technology, programming, and insights",
    siteName: "Binh Phuong Nguyen's Blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Binh Phuong Nguyen's Blog",
    description: "Personal blog about technology, programming, and insights",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}
      >
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
