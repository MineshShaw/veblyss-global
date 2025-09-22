"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Profile", path: "/profile" },
    { name: "Vision & Mission", path: "/vision-mission" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-11/12 px-4">
      {/* Outer Rounded Container */}
      <div className="bg-[#368580] rounded-2xl flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/logo.jpg"
            alt="VeBlyss Global Logo"
            className="w-auto h-auto rounded-full"
            width={180}
            height={50}
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-4 text-white">
          {navLinks.map((link) => (
            <div key={link.name} className="flex items-center">
              <Link
                href={link.path}
                className={`transition-colors font-serif text-xl sm:text-sm ${
                  pathname === link.path
                    ? "font-bold"
                    : "font-normal hover:font-bold"
                }`}
              >
                {link.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden max-w-fit mt-2 bg-[#4f8685] rounded-xl shadow-md flex flex-col text-xl md:text-2xl lg:text-2xl absolute right-10 items-center p-4 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`p-2 ${
                pathname === link.path
                  ? "font-bold"
                  : "font-normal hover:font-bold"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
