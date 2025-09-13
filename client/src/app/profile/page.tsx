"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import AuthModal from "@/components/AuthModal";
import { RootState } from "@/redux/store";

const ProfilePage = () => {
  const user = useSelector((state: RootState) => state.user);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  React.useEffect(() => {
    if (!user || !user.email) {
      setAuthModalOpen(true);
    } else {
      setAuthModalOpen(false);
    }
  }, [user]);

  if (!user || !user.email) {
    return <AuthModal open={authModalOpen} onClose={() => {}} />;
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Profile Page</h2>
      <hr />
      <div><strong>Name:</strong> {user.name}</div>
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Cart:</strong> <pre>{JSON.stringify(user.cartdata, null, 2)}</pre></div>
      <div><strong>Wishlist:</strong> <pre>{JSON.stringify(user.wishlistdata, null, 2)}</pre></div>
      <div><strong>Orders:</strong> <pre>{JSON.stringify(user.orderdata, null, 2)}</pre></div>
      <div><strong>Address:</strong> <pre>{JSON.stringify(user.addressdata, null, 2)}</pre></div>
    </div>
  );
};

export default ProfilePage;
