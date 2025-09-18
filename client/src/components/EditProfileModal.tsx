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
  addressdata: AddressData[] | null;
}

const emptyAddress: AddressData = {
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  phone: "",
};

const EditProfileModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const user = useSelector((state: RootState) => state.user) as UserState;
  const dispatch = useDispatch();
  const [name, setName] = useState<string>(user?.name ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [addresses, setAddresses] = useState<AddressData[]>(user.addressdata ?? [emptyAddress]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<AddressData>(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleAddAddress = () => {
    setNewAddress(emptyAddress);
    setEditingIdx(addresses.length);
  };

  const handleEditAddress = (idx: number) => {
    setNewAddress(addresses[idx]);
    setEditingIdx(idx);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSave = () => {
    const updatedAddresses = [...addresses];
    if (editingIdx === addresses.length) {
      // New address
      updatedAddresses.push(newAddress);
    } else if (editingIdx !== null) {
      // Edit existing address
      updatedAddresses[editingIdx] = newAddress;
    }
    setAddresses(updatedAddresses);
    setEditingIdx(null);
    setNewAddress(emptyAddress);
  };

  const handleRemoveAddress = (idx: number) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      setAddresses(addresses.filter((_, i) => i !== idx));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body = {
        name: name.trim(),
        email: email.trim(),
        addressdata: addresses ? addresses.map(a => ({
          street: a.street.trim(),
          city: a.city.trim(),
          state: a.state.trim(),
          postalCode: a.postalCode.trim(),
          country: a.country.trim(),
          phone: a.phone.trim(),
        })) : [],
      };

      const res = await updateUserProfile(name, email, body.addressdata);

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

          {/* Addresses Section */}
          <div style={{ fontWeight: 600, marginTop: 16 }}>Addresses</div>
          <div style={{ marginBottom: 12 }}>
            {addresses.map((addr, idx) => (
              <div key={idx} style={{
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 10,
                margin: "8px 0",
                background: "#f9f9f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}>
                <div style={{ flex: 1, fontSize: 15 }}>
                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}, {addr.country}
                  <span style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>({addr.phone})</span>
                </div>
                <button type="button" onClick={() => handleEditAddress(idx)} style={{ marginLeft: 4, fontSize: 13 }}>
                  Edit
                </button>
                <button type="button" onClick={() => handleRemoveAddress(idx)} style={{ marginLeft: 4, fontSize: 13, color: "crimson" }}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddAddress} style={{
              marginTop: 8,
              padding: "8px 14px",
              borderRadius: 6,
              background: "#e0f4f2",
              border: "1px solid #b8e0dd",
              color: "#368581",
              fontWeight: 600,
              cursor: "pointer",
            }}>
              Add Address
            </button>
          </div>

          {/* Address editor */}
          {editingIdx !== null && (
            <div style={{
              background: "#f3fcfc",
              border: "1px solid #b8e0dd",
              borderRadius: 10,
              padding: 14,
              marginBottom: 10,
            }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                {editingIdx === addresses.length ? "Add New Address" : "Edit Address"}
              </div>
              <input name="street" value={newAddress.street} onChange={handleAddressChange} placeholder="Street" style={inputStyle} />
              <div style={{ display: "flex", gap: 8 }}>
                <input name="city" value={newAddress.city} onChange={handleAddressChange} placeholder="City" style={inputStyle} />
                <input name="state" value={newAddress.state} onChange={handleAddressChange} placeholder="State" style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input name="postalCode" value={newAddress.postalCode} onChange={handleAddressChange} placeholder="Postal code" style={inputStyle} />
                <input name="country" value={newAddress.country} onChange={handleAddressChange} placeholder="Country" style={inputStyle} />
              </div>
              <input name="phone" value={newAddress.phone} onChange={handleAddressChange} placeholder="Phone" style={inputStyle} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" onClick={handleAddressSave} style={{ ...buttonStyle, background: "#368581", color: "#fff" }}>
                  Save Address
                </button>
                <button type="button" onClick={() => setEditingIdx(null)} style={buttonStyle}>
                  Cancel
                </button>
              </div>
            </div>
          )}

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

const inputStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ddd",
  marginTop: 6,
  marginBottom: 6,
};

const buttonStyle = {
  flex: 1,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

export default EditProfileModal;
