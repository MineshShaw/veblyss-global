'use client'
import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<Record<string, any>>({}) // productId -> meta saved by user

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        // Fetch the current user record which includes wishlistdata
        const userRes = await fetch('/api/user', { credentials: 'include' })
        if (userRes.status === 401) {
          // not authenticated — show a clear message (or empty cart)
          setWishlist({})
          setProducts([])
          setError('You are not signed in. Please log in to view saved items.')
          setLoading(false)
          return
        }
        if (!userRes.ok) throw new Error('Failed to load user data')
        const userData = await userRes.json()

        // tolerate different back-end shapes
        const saved = userData.wishlistdata || userData.wishlist || (userData.user && userData.user.wishlistdata) || {}
        setWishlist(saved || {})

        const ids = Object.keys(saved || {})
        if (ids.length === 0) {
          setProducts([])
          setLoading(false)
          return
        }

        // try bulk product fetch, fallback to individual fetches
        const prodRes = await fetch(`/api/products?ids=${ids.join(',')}`)
        if (!prodRes.ok) {
          const proms = ids.map((id) =>
            fetch(`/api/products/${id}`).then((r) => {
              if (!r.ok) throw new Error('product fetch failed')
              return r.json()
            })
          )
          const prods = await Promise.all(proms)
          // If individual endpoints return { product } or raw, normalize:
          setProducts(
            prods.map((p: any) => (p.product ? p.product : p))
          )
        } else {
          const data = await prodRes.json()
          setProducts(Array.isArray(data.products) ? data.products : data)
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const itemCount = useMemo(() => Object.keys(wishlist).length, [wishlist])

  if (loading)
    return (
      <div className="bg-veblyssBackground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-veblyssText">Loading wishlist...</p>
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
            <Link href="/" className="text-sm text-veblyssPrimary">
              Go Home
            </Link>
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
          Saved Items
        </h1>
        <p className="font-opensans text-veblyssTextLight max-w-2xl mx-auto">
          Items you've saved to your wishlist. You can move them to cart or remove them.
        </p>
      </section>

      <section className="container mx-auto px-4">
        {products.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg">
            <h2 className="font-playfair text-2xl mb-4">Your wishlist is empty</h2>
            <p className="text-veblyssText mb-6">Browse products and save items for later.</p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 rounded-xl font-bold"
              style={{ backgroundColor: '#368581', color: '#FAF9F6', fontFamily: 'Open Sans' }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p: any) => {
              const pid = p._id || p.id || ''
              const meta = wishlist[pid] || wishlist[p._id] || wishlist[p.id] || {}
              return (
                <div key={pid || Math.random()} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="h-64 bg-gray-300 relative overflow-hidden">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} className="object-cover w-full h-full" fill />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="font-playfair font-semibold text-xl text-veblyssText mb-2">{p.name}</h3>
                    <p className="text-sm text-veblyssText mb-4">{p.description}</p>

                    <div className="mb-4">
                      <span className="text-2xl font-bold">₹{(p.price ?? meta.price ?? 0).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        onClick={async () => {
                          // move to cart: POST /api/cart { productId, quantity:1 }
                          try {
                            const res = await fetch('/api/cart', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              credentials: 'include',
                              body: JSON.stringify({ productId: pid, quantity: 1 }),
                            })
                            if (!res.ok) throw new Error('Could not add to cart')
                            // optionally remove from wishlist on success
                            await fetch(`/api/wishlist/${pid}`, { method: 'DELETE', credentials: 'include' })
                            // optimistic UI update
                            setProducts((ps) => ps.filter((prod) => (prod._id || prod.id) !== pid))
                            setWishlist((w) => {
                              const next = { ...w }
                              delete next[pid]
                              return next
                            })
                          } catch (err: any) {
                            setError(err.message || 'Action failed')
                          }
                        }}
                        className="px-4 py-2 rounded-lg bg-veblyssPrimary text-white font-semibold"
                        style={{ backgroundColor: '#368581' }}
                      >
                        Move to Cart
                      </button>

                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/wishlist/${pid}`, {
                              method: 'DELETE',
                              credentials: 'include',
                            })
                            if (!res.ok) throw new Error('Could not remove item')
                            setProducts((ps) => ps.filter((prod) => (prod._id || prod.id) !== pid))
                            setWishlist((w) => {
                              const next = { ...w }
                              delete next[pid]
                              return next
                            })
                          } catch (err: any) {
                            setError(err.message || 'Could not remove item')
                          }
                        }}
                        className="px-4 py-2 rounded-lg border font-semibold text-veblyssPrimary"
                      >
                        Remove
                      </button>
                    </div>
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