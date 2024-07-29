require('dotenv').config();
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminToolsBanner from "./components/AdminToolsBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Poster Podcast Player",
  description: "Made by Jacob",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
          {children}
        <Footer />
        <AdminToolsBanner />
      </body>
    </html>
  );
}
