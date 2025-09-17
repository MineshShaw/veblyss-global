"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "@/lib/User";
import { setUser } from "@/redux/userSlice";
import { RootState } from "@/redux/store";

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

const EditProfileModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const dispatch = useDispatch();
  const addr = user.addressdata || {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  };

  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [street, setStreet] = useState<string>(addr.street);
  const [city, setCity] = useState<string>(addr.city);
  const [stateVal, setStateVal] = useState<string>(addr.state);
  const [postalCode, setPostalCode] = useState<string>(addr.postalCode);
  const [country, setCountry] = useState<string>(addr.country);
  const [phone, setPhone] = useState<string>(addr.phone);
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

      const res = await updateUserProfile(name, email);

      if (!res.ok)
        throw new Error(res?.error || `Update failed (${res.status})`);

      const updated = res?.user || res || null;

      dispatch(
        setUser({
          name: updated.name ?? name,
          email: updated.email ?? email,
          cartdata: updated.cartdata ?? user.cartdata,
          wishlistdata: updated.wishlistdata ?? user.wishlistdata,
          orderdata: updated.orderdata ?? user.orderdata,
          addressdata: updated.addressdata ?? body.addressdata,
        })
      );

      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 520,
          maxWidth: "96%",
          background: "#fff",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 12 }}>Edit Profile</h3>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />

          <div style={{ fontWeight: 600 }}>Address</div>

          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Street"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
            <input
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              placeholder="State"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="Postal code"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 6,
                border: "1px solid #ddd",
              }}
            />
          </div>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          />

          {error && <div style={{ color: "crimson" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "none",
                background: "#368581",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;