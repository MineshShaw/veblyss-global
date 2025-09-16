import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'change-me'

function getUserIdFromReq(req) {
  // prefer req.user if auth middleware populated it
  const uid = req.user?.id || req.user?._id
  if (uid) return uid

  // otherwise look for token cookie or Authorization header
  const token = req.cookies?.token || (req.headers.authorization || '').split(' ')[1]
  if (!token) return null

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return payload.id || payload._id || null
  } catch (err) {
    console.error('token verify failed in cart route:', err?.message || err)
    return null
  }
}

// POST /api/cart  -> add/update a single product (body: { productId, quantity, name, price, image })
router.post('/', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' })
    }

    const { productId, quantity = 1, name, price, image } = req.body || {}
    if (!productId) {
      return res.status(400).json({ error: 'productId required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const cart = user.cartdata || {}
    // store snapshot for quick display; overwrite quantity if exists
    cart[productId] = { quantity, name, price, image }

    user.cartdata = cart
    await user.save()

    return res.json({ cart: user.cartdata })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/cart  -> update quantity { productId, quantity }
router.patch('/', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' })
    }
    const { productId, quantity } = req.body || {}
    if (!productId) {
      return res.status(400).json({ error: 'productId required' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const cart = user.cartdata || {}
    if (Number(quantity) <= 0) {
      delete cart[productId]
    } else {
      cart[productId] = { ...(cart[productId] || {}), quantity: Number(quantity) }
    }

    user.cartdata = cart
    await user.save()
    return res.json({ cart: user.cartdata })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/cart/:productId -> remove item
router.delete('/:productId', async (req, res) => {
  try {
    const userId = getUserIdFromReq(req)
    if (!userId) {
      return res.status(401).json({ error: 'Unauthenticated' })
    }
    const { productId } = req.params || {}
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const cart = user.cartdata || {}
    if (cart[productId]) {
      delete cart[productId]
    }
    user.cartdata = cart
    await user.save()
    return res.json({ cart: user.cartdata })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error' })
  }
})

export default router