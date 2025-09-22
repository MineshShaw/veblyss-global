"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // mounted to trigger entrance animations after client mount (avoids SSR mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // get user from redux to display initials when logged in
  const user = useSelector((state: RootState) => state.user as any);
  const nameOrEmail: string | undefined = user?.name || user?.email;
  const initials = nameOrEmail
    ? nameOrEmail
        .split(" ")
        .map((p) => p[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Products", path: "/products" },
    { name: "Vision & Mission", path: "/vision-mission" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-11/12 px-4 pointer-events-auto">
      {/* Outer Rounded Container (animated entrance) */}
      <div
        className={
          "bg-[#368580] rounded-2xl flex items-center justify-between px-6 py-3 transition-all duration-500 ease-out transform " +
          (mounted
            ? "opacity-100 translate-y-0 shadow-lg"
            : "opacity-0 -translate-y-3 shadow-sm")
        }
      >
        {/* Logo (slight pop-in) */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/logo.jpg"
            alt="VeBlyss Global Logo"
            className={
              "w-auto h-auto rounded-full transition-transform duration-500 ease-out " +
              (mounted ? "scale-100" : "scale-95")
            }
            width={180}
            height={50}
          />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-4 text-white">
          {navLinks.map((link) => (
            <div key={link.name} className="flex items-center">
              {link.path === "/profile" && initials ? (
                // initials badge when logged in (animated)
                <Link
                  href={link.path}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-sm font-semibold transition-transform duration-300 ease-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/25 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  }`}
                  title={user?.name || user?.email}
                >
                  <span className="text-white">{initials}</span>
                </Link>
              ) : (
                <Link
                  href={link.path}
                  className={`transition-colors font-serif text-xl sm:text-sm transform transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 ${
                    pathname === link.path
                      ? "font-bold underline decoration-white/40 underline-offset-4"
                      : "font-normal hover:font-bold"
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className={
            "md:hidden text-white transition-transform duration-300 ease-out " +
            (isOpen ? "rotate-90" : "rotate-0")
          }
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown (always in DOM to allow smooth transitions) */}
      <div
        aria-hidden={!isOpen}
        className={
          "md:hidden max-w-fit mt-2 bg-[#4f8685] rounded-xl shadow-md flex flex-col text-xl md:text-2xl lg:text-2xl absolute right-10 items-center p-4 text-white transform origin-top-right transition-all duration-250 ease-out " +
          (isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none")
        }
      >
        {/* show initials as a top badge in mobile dropdown when logged in */}
        {initials && (
          <Link
            href="/profile"
            className="mb-2 inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-lg font-semibold transition-transform duration-200 ease-out hover:scale-105"
            onClick={() => setIsOpen(false)}
            title={user?.name || user?.email}
          >
            {initials}
          </Link>
        )}

        {navLinks.map((link) => {
          if (link.path === "/profile" && initials) return null; // already shown above
          return (
            <Link
              key={link.name}
              href={link.path}
              className={`p-2 transform transition duration-200 ease-out ${
                pathname === link.path
                  ? "font-bold"
                  : "font-normal hover:font-bold hover:-translate-y-0.5"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
