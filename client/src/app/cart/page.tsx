'use client'

import React, { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { getCurrentUser } from '@/lib/Auth'
import { setUser } from '@/redux/userSlice'

// --- Type Definitions ---
interface CartItemMeta {
  productId?: string
  id?: string
  quantity?: number
  qty?: number
  name?: string
  price?: number
  image?: string
}

interface UserState {
  name: string | null
  email: string | null
  cartdata: Record<string, CartItemMeta> | CartItemMeta[] | null
}

// --- Component ---
export default function CartPage() {
  const user = useSelector((state: RootState) => state.user) as UserState
  const dispatch = useDispatch()

  const refreshUser = async () => {
    try {
      const me = await getCurrentUser()
      const u = me?.user ?? me
      if (u) {
        dispatch(setUser({
          name: u.name ?? null,
          email: u.email ?? null,
          password: null,
          cartdata: u.cartdata ?? null,
          wishlistdata: u.wishlistdata ?? null,
          orderdata: u.orderdata ?? null,
          addressdata: u.addressdata ?? null,
        }))
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Normalize cart items from user data itself
  const cartItems: CartItemMeta[] = useMemo(() => {
    if (!user?.cartdata) return []
    if (Array.isArray(user.cartdata)) {
      return user.cartdata
    } else if (typeof user.cartdata === 'object') {
      return Object.entries(user.cartdata).map(([productId, meta]) => ({
        productId,
        ...(meta as CartItemMeta),
      }))
    }
    return []
  }, [user])

  const itemCount = cartItems.length

  if (!user?.email)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <p className="text-veblyssText">Please login to view your cart</p>
      </div>
    )

  return (
    <div className="bg-veblyssBackground min-h-screen pb-16">
      <section className="py-20 text-center">
        <h1 className="font-playfair text-4xl md:text-6xl text-[#FFECE0] mb-4">
          Your Cart ({itemCount})
        </h1>
        <p className="font-opensans text-veblyssTextLight max-w-2xl mx-auto">
          Items in your cart. Proceed to checkout when ready.
        </p>
      </section>

      <section className="container mx-auto px-4">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <h2 className="font-playfair text-2xl mb-4">Your cart is empty</h2>
            <p className="text-veblyssText mb-6">Browse products and add items to your cart.</p>
            <Link href="/products" className="inline-block px-6 py-3 rounded-xl font-bold bg-[#368581] text-[#FAF9F6]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {cartItems.map((item) => {
              const pid = item.productId || item.id!
              const qty = Number(item.quantity || item.qty || 1)

              return (
                <div key={pid} className="bg-white rounded-xl shadow-lg overflow-hidden flex items-center">
                  <div className="w-32 h-32 bg-gray-100 relative">
                    {item.image ? (
                      <Image src={item.image} alt={item.name || 'Product'} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="font-playfair text-xl font-semibold text-veblyssText mb-2">{item.name}</h3>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">₹{item.price?.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Qty: {qty}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <button
                      onClick={async () => {
                        try {
                          const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
                          const res = await fetch(`${API}/api/cart/${pid}`, {
                            method: 'DELETE',
                            credentials: 'include',
                          })
                          if (!res.ok) throw new Error('Failed to remove item')
                          await refreshUser()
                        } catch (e) {
                          console.error(e)
                        }
                      }}
                      className="px-4 py-2 border rounded-lg font-semibold text-veblyssPrimary"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
