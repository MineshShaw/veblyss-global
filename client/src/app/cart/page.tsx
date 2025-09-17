'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { getCurrentUser } from '@/lib/Auth'
import { setUser } from '@/redux/userSlice'

// --- Type Definitions ---

interface Product {
  _id: string
  id?: string
  name: string
  description: string
  image: string
  price: number
  category: string
  quantity: number
}

interface CartItemMeta {
  productId?: string
  id?: string
  quantity?: number
  qty?: number
}

interface UserState {
  name: string | null
  email: string | null
  cartdata: CartItemMeta[] | Record<string, CartItemMeta> | null
  wishlistdata?: Record<string, any> | null
  orderdata?: Record<string, any> | null
  addressdata?: Record<string, any> | null
}

// --- Component ---

export default function CartPage() {
  const user = useSelector((state: RootState) => state.user) as UserState
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  const refreshUser = async () => {
    try {
      const me = await getCurrentUser()
      const u = me?.user ?? me
      if (u) dispatch(setUser({
        name: u.name ?? null,
        email: u.email ?? null,
        password: null,
        cartdata: u.cartdata ?? null,
        wishlistdata: u.wishlistdata ?? null,
        orderdata: u.orderdata ?? null,
        addressdata: u.addressdata ?? null,
      }))
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    const loadCartProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!user?.email || !user.cartdata) {
          setProducts([])
          return
        }

        let ids: string[] = []
        if (Array.isArray(user.cartdata)) {
          ids = user.cartdata.map((item) => item.productId || item.id).filter(Boolean) as string[]
        } else {
          ids = Object.keys(user.cartdata)
        }

        if (ids.length === 0) {
          setProducts([])
          return
        }

        const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
        const url = `${API}/api/products?ids=${ids.join(',')}`

        const res = await fetch(url, { credentials: 'include' })

        if (res.ok) {
          const data = await res.json()
          const prods = Array.isArray(data.products)
            ? data.products
            : Array.isArray(data)
            ? data
            : [data]

          setProducts(prods as Product[])
        } else {
          const proms = ids.map((id) =>
            fetch(`${API}/api/products/${id}`, { credentials: 'include' }).then((r) => {
              if (!r.ok) throw new Error('Product fetch failed')
              return r.json()
            })
          )
          const prods = await Promise.all(proms)
          const normalizedProducts: Product[] = prods.map((p) => ('product' in p ? p.product : p))
          setProducts(normalizedProducts)
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadCartProducts()
  }, [user])

  const itemCount = useMemo(() => {
    if (!user?.cartdata) return 0
    return Array.isArray(user.cartdata)
      ? user.cartdata.length
      : Object.keys(user.cartdata).length
  }, [user])

  if (loading)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <p className="text-veblyssText">Loading cart...</p>
      </div>
    )

  if (error)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="font-playfair text-2xl mb-4">Error</h2>
          <p className="text-veblyssText">{error}</p>
          <button onClick={refreshUser} className="text-veblyssPrimary text-sm mt-4">
            Retry / Refresh User Data
          </button>
        </div>
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
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <h2 className="font-playfair text-2xl mb-4">Your cart is empty</h2>
            <p className="text-veblyssText mb-6">Browse products and add items to your cart.</p>
            <Link href="/products" className="inline-block px-6 py-3 rounded-xl font-bold bg-[#368581] text-[#FAF9F6]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((p) => {
              const pid = p._id || p.id!

              const meta: CartItemMeta | undefined = Array.isArray(user.cartdata)
                ? user.cartdata.find((item) => item.productId === pid || item.id === pid)
                : user.cartdata[pid]

              const qty = meta?.quantity ?? meta?.qty ?? 1

              return (
                <div key={pid} className="bg-white rounded-xl shadow-lg overflow-hidden flex items-center">
                  <div className="w-32 h-32 bg-gray-100 relative">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="font-playfair text-xl font-semibold text-veblyssText mb-2">{p.name}</h3>
                    <p className="text-sm text-veblyssText mb-2">{p.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">₹{p.price.toFixed(2)}</span>
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
                          setError('Failed to remove item from cart')
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
