"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import AuthModal from "@/components/AuthModal";

export default function ProfileOverview() {
  const user = useSelector((state: RootState) => state.user);

  // moved here so hooks are called on every render (prevents hooks order mismatch)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // simple cart count from user.cartdata (assumed array)
  const cartCount = user?.cartdata && Array.isArray(user.cartdata) ? user.cartdata.length : 0;

  if (!user?.name) {
    return <AuthModal open={true} onClose={() => {}} />;
  }

  // helper to count either arrays or object keys safely
  const safeCount = (v: Array<object> | object) => {
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
    // wishlist count now reflects cart product count (from user.cartdata)
    { title: "Wishlist", count: cartCount },
    { title: "Orders", count: safeCount(user.orderdata as Array<object>) },
    { title: "Addresses", count: safeCount(user.addressdata as Array<object>) },
  ];

  const firstName = (user.name || "").split(" ")[0] || user.name;

  return (
    <div className="p-3 sm:p-6">
      <h1 className="text-xl sm:text-3xl font-bold mb-4 text-center">
        Profile Overview
      </h1>

      {/* container: full width on mobile, centered on larger screens */}
      <div className="w-full max-w-screen-sm sm:max-w-3xl mx-auto">
        {/* responsive grid: compact cards on mobile, 2 cols on sm, 3 on md+ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((card, idx) => {
            const delay = `${idx * 70}ms`;
            return (
              <div
                key={card.title}
                style={{ transitionDelay: delay }}
                className={
                  "bg-white p-3 sm:p-4 rounded-lg shadow-sm sm:shadow flex flex-col items-center justify-center min-h-[76px] sm:min-h-[110px] transition-transform transition-opacity duration-300 ease-out transform " +
                  (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3") +
                  " hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-md"
                }
              >
                <h2 className="font-semibold text-sm sm:text-lg text-center">
                  {card.title}
                </h2>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold">
                  <CountUp to={card.count} />
                </p>
              </div>
            );
          })}
        </div>

        {/* account details: compact, stacked on mobile */}
        <div
          className="mt-4 sm:mt-6 bg-white rounded-lg shadow-sm p-3 sm:p-4 transition-opacity duration-300"
          style={{ opacity: mounted ? 1 : 0 }}
        >
          <h3 className="font-semibold mb-2 text-base sm:text-lg">Account</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Name</p>
              <p className="font-medium text-sm sm:text-base">
                Welcome {firstName}
              </p>
            </div>
            <div className="mt-2 sm:mt-0">
              <p className="text-xs sm:text-sm text-gray-600">Email</p>
              <p className="font-medium text-sm sm:text-base break-words">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
