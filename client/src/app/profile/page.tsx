"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/lib/Auth";
import { resetUser } from "@/redux/userSlice";
import AuthModal from "@/components/AuthModal";
import EditProfileModal from "@/components/EditProfileModal";

interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface UserState {
  name: string | null;
  email: string | null;
  cartdata: Record<string, number> | number[] | null;
  wishlistdata: Record<string, number> | null;
  orderdata: Record<string, number> | null;
  addressdata: AddressData | null;
}

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const dispatch = useDispatch();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
  }, [user]);

  const initials = (() => {
    const name = user?.name || "";
    if (name)
      return name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (user?.email || "U").charAt(0).toUpperCase();
  })();

  const handleLogout = async () => {
    setBusy(true);
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(resetUser());
      setBusy(false);
      setAuthModalOpen(true);
    }
  };

  if (!user?.email) {
    return (
      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    );
  }

  const countItems = (obj: Record<string, number> | null) =>
    obj && typeof obj === "object" ? Object.keys(obj).length : 0;

  const wishCount = countItems(user.wishlistdata);
  const orderCount = countItems(user.orderdata);
  const address =
    user.addressdata && typeof user.addressdata === "object"
      ? user.addressdata
      : null;



  return (
    <div className="bg-veblyssBackground min-h-screen pt-24 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div
            className="bg-veblyssPrimary px-6 py-8"
            style={{ backgroundColor: "#368581" }}
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                {initials}
              </div>

              <div className="text-white">
                <h1 className="text-2xl font-playfair font-bold">
                  {user.name || "Unnamed User"}
                </h1>
                <p className="text-sm opacity-90">{user.email}</p>
                <div className="mt-3 flex gap-3">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {wishCount} Saved
                  </span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">
                    {orderCount} Orders
                  </span>
                </div>
              </div>

              <div className="ml-auto flex gap-3">
                <button
                  onClick={() => setEditOpen(true)}
                  className="bg-white text-veblyssPrimary font-semibold px-4 py-2 rounded-lg"
                  title="Edit profile"
                >
                  Edit
                </button>

                <button
                  onClick={handleLogout}
                  disabled={busy}
                  className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-lg"
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
                  <pre className="text-xs overflow-auto max-h-36">
                    {JSON.stringify(user.wishlistdata, null, 2)}
                  </pre>
                </div>
              )}
            </section>

            <section>
              <h2 className="font-playfair text-lg mb-2">Orders</h2>
              {orderCount === 0 ? (
                <div className="text-sm text-veblyssText">No orders yet.</div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <pre className="text-xs overflow-auto max-h-36">
                    {JSON.stringify(user.orderdata, null, 2)}
                  </pre>
                </div>
              )}
            </section>

            <section>
              <h2 className="font-playfair text-lg mb-2">Address</h2>
              {address ? (
                <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-1">
                  {Object.entries(address).map(([k, v]) => (
                    <div key={k}>
                      <strong className="capitalize mr-2">{k}:</strong>
                      {String(v)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-veblyssText">
                  No address saved.
                </div>
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
