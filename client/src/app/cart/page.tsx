'use client'

import React, { useMemo, useState } from 'react'
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

  // Normalize cart items from user data
  const cartItems: CartItemMeta[] = useMemo(() => {
    if (!user?.cartdata) return []
    if (Array.isArray(user.cartdata)) return user.cartdata
    else if (typeof user.cartdata === 'object')
      return Object.entries(user.cartdata).map(([productId, meta]) => ({
        productId,
        ...(meta as CartItemMeta),
      }))
    return []
  }, [user])

  const itemCount = cartItems.length

  // Local state for quantities
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>(
    () =>
      cartItems.reduce((acc, item) => {
        const pid = item.productId || item.id!
        acc[pid] = Number(item.quantity || item.qty || 1)
        return acc
      }, {} as Record<string, number>)
  )

  const updateQuantity = async (pid: string, change: number) => {
    const newQty = Math.max((localQuantities[pid] || 1) + change, 1)
    setLocalQuantities((prev) => ({ ...prev, [pid]: newQty }))

    try {
      const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
      const res = await fetch(`${API}/api/cart/${pid}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQty }),
      })
      if (!res.ok) throw new Error('Failed to update quantity')
      await refreshUser()
    } catch (e) {
      console.error(e)
    }
  }

  const removeItem = async (pid: string) => {
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
  }

  // Calculate total price
  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const pid = item.productId || item.id!
      const qty = localQuantities[pid] || Number(item.quantity || item.qty || 1)
      const price = Number(item.price || 0)
      return sum + price * qty
    }, 0)
  }, [cartItems, localQuantities])

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
          <>
            <div className="max-h-[600px] overflow-y-auto space-y-4">
              {cartItems.map((item) => {
                const pid = item.productId || item.id!
                const qty = localQuantities[pid] || Number(item.quantity || item.qty || 1)

                return (
                  <div
                    key={pid}
                    className="bg-white rounded-xl shadow-lg overflow-hidden flex items-center p-2 gap-4"
                  >
                    <div className="w-32 h-32 bg-gray-100 relative flex-shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name || 'Product'} fill className="object-cover rounded-md" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1">
                      <h3 className="font-playfair text-xl font-semibold text-veblyssText mb-2">{item.name}</h3>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-2xl font-bold">₹{item.price?.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">Qty: {qty}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(pid, -1)}
                          className="px-3 py-1 rounded-lg border transition-transform hover:scale-110 duration-200"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border rounded-lg">{qty}</span>
                        <button
                          onClick={() => updateQuantity(pid, 1)}
                          className="px-3 py-1 rounded-lg border transition-transform hover:scale-110 duration-200"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeItem(pid)}
                          className="ml-auto px-4 py-2 border rounded-lg font-semibold text-red-600 transition-colors hover:bg-red-100 duration-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Total Price & Checkout */}
            <div className="bg-white rounded-xl shadow-lg p-6 text-right flex flex-col md:flex-row justify-between items-center mt-6 sticky bottom-0 z-10">
              <span className="text-xl md:text-2xl font-bold text-veblyssText">Total: ₹{totalPrice.toFixed(2)}</span>
              <button
                onClick={() => alert('Temporary checkout clicked!')}
                className="mt-4 md:mt-0 px-6 py-3 rounded-xl font-bold bg-[#368581] text-[#FAF9F6] transition-transform hover:scale-105 duration-300"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  )
}
