require('dotenv').config();
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminToolsBanner from "./components/AdminToolsBanner";
import { AuthProvider } from "@/context/AuthContext";
import localFont from 'next/font/local'

// Font files can be colocated inside of `app`
const satoshi = localFont({
  src: [
    {
      path: './fonts/Satoshi-Light.woff2',
      weight: '300',
      style: 'light',
    },
    {
      path: './fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Satoshi-Medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: './fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'bold',
    },
  ],
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
      <html lang="en" className={satoshi.className}>
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
