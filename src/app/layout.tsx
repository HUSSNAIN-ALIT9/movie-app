import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovieFlix",
  description: "Movie App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-20 bg-[#111218]">

        {/* Navbar fixed */}
        <Navbar />

        {/* Layout wrapper */}
        <div className="flex">

          {/* Sidebar fixed */}
          <Sidebar />

          {/* Main content */}
          <main className="flex-1 ml-16 w-full">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}