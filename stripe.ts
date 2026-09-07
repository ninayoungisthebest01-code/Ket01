'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

type CartLine = {
  id: number
  quantity: number
}

export async function createCheckoutSession(lines: CartLine[]) {
  const validatedLines = lines
    .map(({ id, quantity }) => ({ product: PRODUCTS.find((item) => item.id === id), quantity }))
    .filter((line): line is { product: (typeof PRODUCTS)[number]; quantity: number } => Boolean(line.product) && Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 10)

  if (!validatedLines.length || validatedLines.length !== lines.length) {
    throw new Error('Invalid cart')
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    ui_mode: 'hosted_page',
    line_items: validatedLines.map(({ product, quantity }) => ({
      price_data: {
        currency: 'pen',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: Math.round(product.price * 100),
      },
      quantity,
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/?checkout=cancelled`,
  })

  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL')
  }

  return session.url
}
