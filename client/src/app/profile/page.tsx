"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AuthModal from "@/components/AuthModal";

export default function ProfileOverview() {
  const user = useSelector((state: RootState) => state.user as any);

  // moved here so hooks are called on every render (prevents hooks order mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  if (!user?.name) {
    return <AuthModal open={true} onClose={() => {}} />;
  }

  // helper to count either arrays or object keys safely
  const safeCount = (v: any) => {
    if (!v) return 0;
    if (Array.isArray(v)) return v.length;
    if (typeof v === "object") return Object.keys(v).length;
    return 0;
  };

  // small CountUp component for animated numbers
  function CountUp({ to }: { to: number }) {
    const [value, setValue] = useState(0);
    useEffect(() => {
      let raf: number;
      const duration = 700;
      const start = performance.now();
      const from = 0;
      const animate = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease out cubic
        setValue(Math.round(from + (to - from) * eased));
        if (t < 1) raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(raf);
    }, [to]);
    return <span>{value}</span>;
  }

  const cards = [
    { title: "Wishlist", count: safeCount(user.wishlistdata) },
    { title: "Orders", count: safeCount(user.orderdata) },
    { title: "Addresses", count: safeCount(user.addressdata) },
  ];

  const firstName = (user.name || "").split(" ")[0] || user.name;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Profile Overview
      </h1>

      <div className="max-w-4xl mx-auto">
        {/* responsive grid: 1 col on mobile, 2 on sm, 3 on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card, idx) => {
            const delay = `${idx * 90}ms`;
            return (
              <div
                key={card.title}
                style={{ transitionDelay: delay }}
                className={
                  "bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center min-h-[110px] sm:min-h-[120px] transition-transform transition-opacity duration-400 ease-out transform " +
                  (mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4") +
                  " hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
                }
              >
                <h2 className="font-semibold text-lg">{card.title}</h2>
                <p className="mt-2 text-3xl font-bold">
                  <CountUp to={card.count} />
                </p>
              </div>
            );
          })}
        </div>

        {/* optional extra details area */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 transition-opacity duration-400" style={{ opacity: mounted ? 1 : 0 }}>
          <h3 className="font-semibold mb-2">Account</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">Welcome {firstName}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
