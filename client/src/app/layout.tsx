import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";


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
      <body className="antialiased bg-[#fcede1]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
