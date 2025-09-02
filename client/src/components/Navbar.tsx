"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import LoginPopup from "./LoginPopup";

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Vision & Mission", path: "/vision-mission" },
    { name: "Products", path: "/products" },
    { name: "Contact", path: "/contact" },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-11/12 px-4">
      {/* Outer Rounded Container */}
      <div className="bg-[#4c8380] rounded-xl shadow-md flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/images/logo.png"
            alt="VeBlyss Global Logo"
            width={40}
            height={40}
          />
          <div className="leading-tight text-white">
            <h1 className="text-lg font-bold tracking-wide">VeBlyss Global</h1>
            <p className="text-xs font-light italic">
              Lifestyle. Fashion. Home & Beyond
            </p>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-4 text-white">
          {navLinks.map((link, index) => (
            <div key={link.name} className="flex items-center">
              <Link
                href={link.path}
                className={`transition-colors ${
                  pathname === link.path
                    ? "font-bold"
                    : "font-normal hover:font-bold"
                }`}
              >
                {link.name}
              </Link>
            </div>
          ))}

          {/* User Authentication Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 hover:scale-105 transition-all duration-300 transform active:scale-95"
              >
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="font-medium">{user.name}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl shadow-lg py-2 z-50"
                  style={{ backgroundColor: '#FAF9F6' }}
                >
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 transition-colors"
                    style={{ color: '#222', fontFamily: 'Open Sans' }}
                  >
                    <User size={16} className="mr-3" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 hover:bg-gray-100 transition-colors"
                    style={{ color: '#222', fontFamily: 'Open Sans' }}
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="px-4 py-2 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 hover:scale-105 hover:shadow-lg transition-all duration-300 transform active:scale-95"
              style={{ fontFamily: 'Open Sans' }}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden mt-2 bg-[#4f8685] rounded-xl shadow-md flex flex-col items-center py-4 space-y-3 text-white">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`${
                pathname === link.path
                  ? "font-bold"
                  : "font-normal hover:font-bold"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile User Section */}
          {user ? (
            <>
              <div className="border-t border-white border-opacity-20 w-full pt-3 mt-3"></div>
              <Link
                href="/profile"
                className="flex items-center space-x-2 font-medium"
                onClick={() => setIsOpen(false)}
              >
                <User size={16} />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 font-medium"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-white border-opacity-20 w-full pt-3 mt-3"></div>
              <button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsOpen(false);
                }}
                className="font-semibold hover:scale-105 transition-all duration-300 transform active:scale-95"
                style={{ fontFamily: 'Open Sans' }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      )}

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
};

export default Navbar;
