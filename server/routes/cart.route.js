import express from 'express'
import User from '../models/user.model.js'

const router = express.Router()

// POST /api/cart  -> add/update a single product (body: { productId, quantity, name, price, image })
router.post('/', async (req, res) => {
  try {
    const userId = req.user?.id || req.cookies?.userId
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
    const userId = req.user?.id || req.cookies?.userId
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
      cart[productId].quantity = Number(quantity)
    }
    if (Number(quantity) <= 0) {
      delete cart[productId]
    } else cart[productId].quantity = Number(quantity)

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
    const userId = req.user?.id || req.cookies?.userId
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