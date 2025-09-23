'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { getCurrentUser } from '@/lib/User'
import { setUser, updateCartQuantity, removeFromCart } from '@/redux/userSlice'
import { useRouter } from 'next/navigation'

// --- Type Definitions ---
interface CartItemMeta {
  productId?: string
  id?: string
  quantity?: number
  qty?: number
  name?: string
  image?: string
}

interface UserState {
  name: string | null
  email: string | null
  cartdata: CartItemMeta[] | null
}

// --- Component ---
export default function CartPage() {
  const user = useSelector((state: RootState) => state.user) as UserState
  const dispatch = useDispatch()
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const me = await getCurrentUser()
      const u = me?.user ?? me
      if (u) {
        dispatch(
          setUser({
            name: u.name ?? null,
            email: u.email ?? null,
            cartdata: Array.isArray(u.cartdata) ? u.cartdata : [],
            wishlistdata: u.wishlistdata ?? null,
            orderdata: u.orderdata ?? null,
            addressdata: u.addressdata ?? null,
          })
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Normalize wishlist items
  const cartItems: CartItemMeta[] = useMemo(() => {
    return Array.isArray(user?.cartdata) ? user.cartdata : []
  }, [user])

  const itemCount = cartItems.length

  // Local state for quantities
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({})

  // ✅ Sync localQuantities whenever cartdata changes
  useEffect(() => {
    if (Array.isArray(user?.cartdata)) {
      const synced = user.cartdata.reduce((acc, item) => {
        const pid = item.productId || item.id!
        acc[pid] = Number(item.quantity || item.qty || 1)
        return acc
      }, {} as Record<string, number>)
      setLocalQuantities(synced)
    }
  }, [user?.cartdata])

  const updateQuantity = async (pid: string, change: number) => {
    const currentQty = localQuantities[pid] || 1
    const newQty = Math.max(currentQty + change, 1)

    // ✅ Update UI + Redux instantly
    setLocalQuantities((prev) => ({ ...prev, [pid]: newQty }))
    dispatch(updateCartQuantity({ id: pid, quantity: newQty }))

    try {
      const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
      const res = await fetch(`${API}/api/cart`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: pid, quantity: newQty }),
      })
      if (!res.ok) throw new Error('Failed to update quantity')
      // Optionally refresh if backend returns updated wishlist
      await refreshUser()
    } catch (e) {
      console.error(e)
    }
  }

  const removeItem = async (pid: string) => {
    // ✅ Update UI + Redux instantly
    dispatch(removeFromCart(pid))
    setLocalQuantities((prev) => {
      const { [pid]: _, ...rest } = prev
      return rest
    })

    try {
      const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
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


  if (!user?.email)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <p className="text-veblyssText">Please login to view your wishlist</p>
      </div>
    )

  return (
    <div className="bg-veblyssBackground min-h-screen pb-16">
      <section className="py-20 text-center">
        <h1 className="font-playfair text-4xl md:text-6xl text-[#FFECE0] mb-4">
          Your Cart ({itemCount})
        </h1>
        <p className="font-opensans text-veblyssTextLight max-w-2xl mx-auto">
          Items in your wishlist. Proceed to checkout when ready.
        </p>
      </section>

      <section className="container mx-auto px-4">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <h2 className="font-serif text-2xl mb-4">Your wishlist is empty</h2>
            <p className="text-veblyssText mb-6">Browse products and add items to your wishlist.</p>
            <Link
              href="/products"
              // added hover scale and shadow
              className="inline-block px-6 py-3 rounded-xl font-bold bg-[#368581] text-[#FAF9F6] transition-transform duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#368581]/25"
            >
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
                    // added subtle hover scale and smoother transition for list items
                    className="bg-white rounded-xl shadow-lg overflow-hidden flex items-center p-2 gap-4 transition-transform duration-300 hover:scale-102 hover:shadow-xl"
                  >
                    <div className="w-32 h-32 bg-gray-100 relative flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name || 'Product'}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1">
                      <h3 className="font-playfair text-xl font-semibold text-veblyssText mb-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm text-gray-500">Qty: {qty}</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(pid, -1)}
                          // animated quantity controls
                          className="px-3 py-1 rounded-lg border transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-veblyssPrimary/20"
                        >
                          -
                        </button>
                        <button
                          onClick={() => updateQuantity(pid, 1)}
                          className="px-3 py-1 rounded-lg border transition-transform duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-veblyssPrimary/20"
                        >
                          +
                        </button>

                        <button
                          onClick={() => removeItem(pid)}
                          // animated remove button
                          className="ml-auto px-4 py-2 border rounded-lg font-semibold text-red-600 transition-colors transition-transform duration-200 hover:bg-red-50 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-200"
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
            <div className="bg-white rounded-xl shadow-lg p-6 text-right flex flex-col md:flex-row justify-between items-center mt-6 sticky bottom-0 z-10 transition-shadow duration-300">
              <button
                // animated gradient + hover/active transforms + shadow
                onClick={() => router.push('/contact')}
                className="mt-4 md:mt-0 px-6 py-3 rounded-xl font-bold text-[#FAF9F6] bg-gradient-to-r from-[#2aa18a] to-[#368581] hover:from-[#368581] hover:to-[#2aa18a] transition-transform duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#368581]/25"
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
