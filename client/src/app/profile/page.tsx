"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AuthModal from "@/components/AuthModal";
import { RootState } from "@/redux/store";
import { logout as apiLogout } from "@/lib/Auth";
import { resetUser, setUser } from "@/redux/userSlice";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    if (!user || !user.email) {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
  }, [user]);

  const initials = (() => {
    const name = user?.name || "";
    if (name) return name.split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();
    return (user?.email || "U").charAt(0).toUpperCase();
  })();

  const handleLogout = async () => {
    setBusy(true);
    try {
      await apiLogout();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(resetUser());
      setBusy(false);
      setAuthModalOpen(true);
    }
  };

  if (!user || !user.email) {
    return <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />;
  }

  const countItems = (obj: any) => (obj && typeof obj === "object" ? Object.keys(obj).length : 0);
  const wishCount = countItems(user.wishlistdata);
  const orderCount = countItems(user.orderdata);

  const address = user.addressdata && typeof user.addressdata === "object" ? user.addressdata : null;

  // Edit modal component (local) - UPDATED to include address fields
  const EditProfileModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    // ensure TypeScript accepts address fields — treat addr as any
    const addr: any = (user && (user as any).addressdata) || {};
    const [name, setName] = useState<string>(user?.name ?? "");
    const [email, setEmail] = useState<string>(user?.email ?? "");
    const [street, setStreet] = useState<string>(addr?.street ?? "");
    const [city, setCity] = useState<string>(addr?.city ?? "");
    const [stateVal, setStateVal] = useState<string>(addr?.state ?? "");
    const [postalCode, setPostalCode] = useState<string>(addr?.postalCode ?? "");
    const [country, setCountry] = useState<string>(addr?.country ?? "");
    const [phone, setPhone] = useState<string>(addr?.phone ?? "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const body = {
          name: name.trim(),
          email: email.trim(),
          addressdata: {
            street: street.trim(),
            city: city.trim(),
            state: stateVal.trim(),
            postalCode: postalCode.trim(),
            country: country.trim(),
            phone: phone.trim(),
          },
        };

        // Use explicit backend origin (set NEXT_PUBLIC_API_URL in .env). Fallback to http://localhost:5000
        const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");
        // PATCH to server
        const res = await fetch(`${API}/api/auth/me`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });
        const patchJson = await res.json().catch(() => null);
        if (!res.ok) throw new Error(patchJson?.error || `Update failed (${res.status})`);
        const updated = patchJson?.user || patchJson || null;

        dispatch(setUser({
          name: updated.name ?? name,
          email: updated.email ?? email,
          password: null,
          cartdata: updated.cartdata ?? user.cartdata,
          wishlistdata: updated.wishlistdata ?? user.wishlistdata,
          orderdata: updated.orderdata ?? user.orderdata,
          addressdata: updated.addressdata ?? body.addressdata,
        }));
        onClose();
      } catch (err: any) {
        // removed debug logs - surface error to UI only
        setError(err?.message || "Update failed");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ width: 520, maxWidth: "96%", background: "#fff", borderRadius: 12, padding: 20 }}>
          <h3 style={{ margin: 0, marginBottom: 12, textAlign: "center" }}>Edit Profile</h3>
          <form onSubmit={submit} className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required type="email" style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />

            <div style={{ marginTop: 8, marginBottom: 6, fontWeight: 600 }}>Address</div>
            <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street / Address line" style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
              <input value={stateVal} onChange={(e) => setStateVal(e.target.value)} placeholder="State" style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code" style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
              <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" style={{ flex: 1, padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
            </div>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />

            {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button type="submit" disabled={loading} style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: "#368581", color: "#fff", fontWeight: 600 }}>
                {loading ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={onClose} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc", background: "#fff" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-veblyssBackground min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-veblyssPrimary px-6 py-8" style={{ backgroundColor: "#368581" }}>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                {initials}
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-playfair font-bold">{user.name || "Unnamed User"}</h1>
                <p className="text-sm opacity-90">{user.email}</p>
                <div className="mt-3 flex gap-3">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{wishCount} Saved</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">{orderCount} Orders</span>
                </div>
              </div>

              <div className="ml-auto flex gap-3">
                <button
                  onClick={() => setEditOpen(true)}
                  className="bg-white text-veblyssPrimary font-semibold px-4 py-2 rounded-lg transform transition duration-200 hover:-translate-y-1 hover:scale-105 shadow-sm hover:shadow-lg"
                  title="Edit profile"
                >
                  Edit
                </button>
                <button
                  onClick={handleLogout}
                  disabled={busy}
                  className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg transform transition duration-200 hover:-translate-y-1 hover:scale-105 shadow-sm hover:shadow-lg"
                >
                  {busy ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <section>
              <h2 className="font-playfair text-lg mb-2">Wishlist</h2>
              {wishCount === 0 ? (
                <div className="text-sm text-veblyssText">No saved items.</div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <pre className="text-xs overflow-auto max-h-36">{JSON.stringify(user.wishlistdata, null, 2)}</pre>
                </div>
              )}
            </section>

            <section>
              <h2 className="font-playfair text-lg mb-2">Orders</h2>
              {orderCount === 0 ? (
                <div className="text-sm text-veblyssText">No orders yet.</div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <pre className="text-xs overflow-auto max-h-36">{JSON.stringify(user.orderdata, null, 2)}</pre>
                </div>
              )}
            </section>

            <section>
              <h2 className="font-playfair text-lg mb-2">Address</h2>
              {address ? (
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                  {Object.entries(address).map(([k, v]) => (
                    <div key={k}><strong className="capitalize mr-2">{k}:</strong>{String(v)}</div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-veblyssText">No address saved.</div>
              )}
            </section>
          </div>
        </div>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
};

export default ProfilePage;
