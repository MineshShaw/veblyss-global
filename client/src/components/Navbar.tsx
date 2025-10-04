"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3 pointer-events-auto">
      {/* Outer Rounded Container */}
      <div
        className={`bg-[#368580] rounded-lg mx-auto w-[98%] max-w-screen flex items-center justify-between px-6 py-3 transition-all duration-500 ease-out transform
        ${mounted ? "opacity-100 translate-y-0 shadow-lg" : "opacity-0 -translate-y-3 shadow-sm"}`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/images/logo.jpg"
            alt="VeBlyss Global Logo"
            className={`w-auto h-auto rounded-full transition-transform duration-500 ease-out ${mounted ? "scale-100" : "scale-95"}`}
            width={180}
            height={50}
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center space-x-6 text-white">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`transition-colors font-sans text-lg transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 ${
                  pathname === link.path
                    ? "font-bold underline decoration-white/40 underline-offset-4"
                    : "font-normal hover:font-bold"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          className={`md:hidden text-white transition-transform duration-300 ease-out ${isOpen ? "rotate-90" : "rotate-0"}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        aria-hidden={!isOpen}
        className={`md:hidden mx-auto w-[95%] max-w-sm mt-2 bg-[#4f8685] rounded-xl shadow-md flex flex-col text-lg items-center p-4 text-white transform origin-top transition-all duration-300 ease-out
        ${isOpen ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}
      >
        <ul className="flex flex-col items-center space-y-2 w-full">
          {navLinks.map((link) => (
            <li key={link.name} className="w-full text-center">
              <Link
                href={link.path}
                className={`block p-2 transition-transform duration-200 ease-out ${
                  pathname === link.path
                    ? "font-bold"
                    : "font-normal hover:font-bold hover:-translate-y-0.5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
