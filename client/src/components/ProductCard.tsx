"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { getCurrentUser } from "@/lib/User";

export default function ProductCard({product, setNotice}: {product: { id: string; name: string; price: number; }, setNotice: (message: string | null) => void}) {
  const [loadingAdd, setLoadingAdd] = useState(false);
  const dispatch = useDispatch();

  const addToCart = async (product: { id: string; name: string; price: number; }) => {
    try {
      setLoadingAdd(true)
      setNotice(null)
      const body = {
        productId: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: '/images/placeholder.png'
      }

      

      // fetch latest user/cart from backend and update redux so Cart page shows new item
      try {
        const me = await getCurrentUser();
        const user = me?.user ?? me;
        if (user) {
          dispatch(setUser({
            name: user.name ?? null,
            email: user.email ?? null,
            cartdata: user.cartdata ?? null,
            wishlistdata: user.wishlistdata ?? null,
            orderdata: user.orderdata ?? null,
            addressdata: user.addressdata ?? null,
          }));
        }
      } catch (e) {
        console.error(e)
      }

      setNotice('Added to cart')
    } catch (err) {
      console.error(err)
      setNotice('Add to cart failed')
    } finally {
      setLoadingAdd(false)
      setTimeout(()=>setNotice(null), 3000)
    }
  }

  return (
    <div
      key={product.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="h-96 bg-gray-300 relative overflow-hidden">
        {/* Next/Image fill usage */}
        <Image
          src="/images/placeholder.png"
          alt={product.name}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      <div className="p-8 text-center">
        <h3 className="font-playfair font-semibold text-2xl text-veblyssText mb-4">
          {product.name}
        </h3>

        <div className="mb-6">
          <span className="text-2xl font-bold">
            ₹{product.price.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setLoadingAdd(true);
               addToCart(product);
            }}
            className="bg-veblyssPrimary text-veblyssTextLight font-opensans font-bold text-lg px-6 py-3 rounded-xl hover:bg-opacity-90 transition-all duration-300"
            style={{ backgroundColor: "#368581", color: "#FAF9F6" }}
            disabled={loadingAdd}
          >
            {loadingAdd ? "Adding..." : "Add to Cart"}
          </button>

          <Link
            href="#"
            className="inline-block text-veblyssPrimary font-opensans font-bold text-lg px-4 py-3 rounded-xl border"
          >
            Check More
          </Link>
        </div>
      </div>
    </div>
  );
}
