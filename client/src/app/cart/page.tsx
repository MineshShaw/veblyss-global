'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { getCurrentUser } from '@/lib/Auth'
import { setUser } from '@/redux/userSlice'

export default function CartPage() {
  // use Redux user as the single source of truth (updated after add-to-cart)
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  //const [wishlist, setWishlist] = useState<Record<string, any>>({}) // productId -> meta saved by user

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        setProducts([])

        // If no signed in user or no cart saved on user, show empty cart
        if (!user || !user.email) {
          //setWishlist({})
          setProducts([])
          setLoading(false)
          return
        }

        // tolerate multiple shapes: cartdata could be array or map
        const cart = user.cartdata || {}
        //setWishlist(user.wishlistdata || {})

        let ids: string[] = []
        if (Array.isArray(cart)) {
          // array of items with productId
          ids = cart.map((it: any) => it.productId || it.id).filter(Boolean)
        } else if (typeof cart === 'object' && cart !== null) {
          // object map productId -> meta
          ids = Object.keys(cart)
        }

        if (ids.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        // call backend products endpoint using configured API base (fallback to localhost:5000)
        const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

        const url = `${API}/api/products?ids=${ids.join(',')}`
        const prodRes = await fetch(url, { credentials: 'include' })
        if (!prodRes.ok) {
          // fallback to individual fetches
          const proms = ids.map((id) =>
            fetch(`${API}/api/products/${id}`, { credentials: 'include' }).then((r) => {
              if (!r.ok) throw new Error('product fetch failed')
              return r.json()
            })
          )
          const prods = await Promise.all(proms)
          setProducts(prods.map((p: any) => (p.product ? p.product : p)))
        } else {
          const data = await prodRes.json()
          setProducts(Array.isArray(data.products) ? data.products : (Array.isArray(data) ? data : [data]).flat())
        }
      } catch (err: any) {
        setError(err?.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    load()
    // re-run when user changes (cart updated)
  }, [user])

  // If cart was updated elsewhere (e.g. addToCart), ensure we can refresh user state on demand
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

  const itemCount = useMemo(() => {
    if (!user || !user.cartdata) return 0
    if (Array.isArray(user.cartdata)) return user.cartdata.length
    return Object.keys(user.cartdata || {}).length
  }, [user])

  if (loading)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-veblyssText">Loading cart...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <div className="max-w-xl bg-white rounded-xl p-8 shadow-lg">
          <h2 className="font-playfair text-2xl mb-4">Error</h2>
          <p className="text-veblyssText">{error}</p>
          <div className="mt-4">
            <button onClick={refreshUser} className="text-sm text-veblyssPrimary">Retry / refresh</button>
          </div>
        </div>
      </div>
    )

  return (
    <div className="bg-veblyssBackground min-h-screen pb-16">
      <section className="relative py-20 text-center">
        <h1
          className="font-playfair font-bold text-4xl md:text-6xl mb-4"
          style={{ color: '#FFECE0', fontFamily: 'Playfair Display' }}
        >
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
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-xl font-bold"
              style={{ backgroundColor: '#368581', color: '#FAF9F6', fontFamily: 'Open Sans' }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((p: any) => {
              const pid = p._id || p.id || ''
              const meta = (user?.cartdata && (user.cartdata[pid] || (Array.isArray(user.cartdata) && user.cartdata.find((it:any)=>(it.productId===pid||it.id===pid))))) || {}
              const qty = meta?.quantity ?? meta?.qty ?? (meta?.quantity === 0 ? 0 : 1)
              return (
                <div key={pid || Math.random()} className="bg-white rounded-xl shadow-lg overflow-hidden flex items-center">
                  <div className="w-32 h-32 bg-gray-100 relative">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} className="object-cover" fill />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex-1">
                    <h3 className="font-playfair font-semibold text-xl text-veblyssText mb-2">{p.name}</h3>
                    <p className="text-sm text-veblyssText mb-2">{p.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold">₹{(p.price ?? 0).toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Qty: {qty}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <button
                      onClick={async () => {
                        // Remove item from cart on server then update UI via Redux or refetch user
                        try {
                          const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
                          const res = await fetch(`${API}/api/cart/${pid}`, {
                            method: 'DELETE',
                            credentials: 'include',
                          })
                          if (!res.ok) throw new Error('Could not remove item')
                          // refresh user state to reflect server-side change
                          await refreshUser()
                        } catch (err:any) {
                          setError(err?.message || 'Action failed')
                        }
                      }}
                      className="px-4 py-2 rounded-lg border font-semibold text-veblyssPrimary"
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