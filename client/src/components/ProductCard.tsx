"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: string | number;
  name: string;
  image?: string;
}

export default function ProductCard({
  product,
}: {
  product: Product;
  setNotice: (message: string | null) => void;
}) {

  return (
    <div
      key={product.id}
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="h-96 bg-gray-300 relative overflow-hidden">
        <Image
          src={product.image || "/images/placeholder.png"}
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

        <div className="flex justify-center gap-4">
          

          <Link
            href="#"
            className="inline-block text-veblyssPrimary font-opensans font-bold text-lg px-4 py-3 rounded-xl border transition-transform duration-300 hover:scale-105 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-veblyssPrimary/20"
          >
            Add to Wishlist
          </Link>

          <Link
            href="#"
            className="inline-block text-veblyssPrimary font-opensans font-bold text-lg px-4 py-3 rounded-xl border transition-transform duration-300 hover:scale-105 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-veblyssPrimary/20"
          >
            Check More
          </Link>
        </div>
      </div>
    </div>
  );
}