require('dotenv').config();
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminToolsBanner from "./components/AdminToolsBanner";
import { AuthProvider } from "@/context/AuthContext";
import localFont from 'next/font/local'

const inter = Inter({ subsets: ["latin"] });

// Font files can be colocated inside of `app`
const satoshi = localFont({
  src: [
    {
      path: './Satoshi-Variable.woff2',
      style: 'normal'
    },
    {
      path: './Satoshi-VariableItalic.woff2',
      style: 'italic'
    },
  ],
  variable: '--font-satoshi',
})

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
      <html lang="en" className={satoshi.variable}>
        <body>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <AuthProvider>
            <AdminToolsBanner />
          </AuthProvider>
        </body>
      </html>
  );
}
