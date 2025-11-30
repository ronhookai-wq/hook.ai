import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { StripeProduct, formatPrice } from '../../stripe-config'
import { createCheckoutSession } from '../../lib/stripe'

interface PricingCardProps {
  product: StripeProduct
  isPopular?: boolean
}

export function PricingCard({ product, isPopular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const { url } = await createCheckoutSession({
        price_id: product.priceId,
        success_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing`,
        mode: product.mode,
      })
      
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 border-2' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <CardHeader className="text-center">
        <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
        <p className="text-gray-600">{product.description}</p>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">
            {formatPrice(product.price, product.currency)}
          </span>
          <span className="text-gray-600">/month</span>
        </div>
      </CardHeader>
      
      <CardContent>
        <ul className="space-y-3">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg
                className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button
          onClick={handleSubscribe}
          loading={loading}
          variant={isPopular ? 'primary' : 'outline'}
          className="w-full"
        >
          Get Started
        </Button>
      </CardFooter>
    </Card>
  )
}