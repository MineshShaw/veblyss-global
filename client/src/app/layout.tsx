import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { Playfair_Display, Open_Sans } from "next/font/google";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display"
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans"
});


export const metadata: Metadata = {
  title: "VeBlyss Global",
  description: "Your one-stop solution for lifestyle, fashion, and home products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-[#fcede1] ${playfairDisplay.variable} ${openSans.variable}`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
