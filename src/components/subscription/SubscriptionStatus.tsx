import React, { useEffect, useState } from 'react'
import { getUserSubscription } from '../../lib/stripe'
import { getProductByPriceId } from '../../stripe-config'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Alert } from '../ui/alert'

interface SubscriptionData {
  customer_id: string
  subscription_id: string | null
  subscription_status: string
  price_id: string | null
  current_period_start: number | null
  current_period_end: number | null
  cancel_at_period_end: boolean | null
  payment_method_brand: string | null
  payment_method_last4: string | null
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getUserSubscription()
        setSubscription(data)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Alert variant="info">
        No subscription found. Choose a plan to get started.
      </Alert>
    )
  }

  const product = subscription.price_id ? getProductByPriceId(subscription.price_id) : null
  const isActive = subscription.subscription_status === 'active'

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Current Subscription</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <span className="font-medium">Plan: </span>
            <span className={`px-2 py-1 rounded text-sm ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {product?.name || 'Unknown Plan'}
            </span>
          </div>
          
          <div>
            <span className="font-medium">Status: </span>
            <span className={`capitalize ${
              isActive ? 'text-green-600' : 'text-gray-600'
            }`}>
              {subscription.subscription_status.replace('_', ' ')}
            </span>
          </div>

          {subscription.current_period_end && (
            <div>
              <span className="font-medium">
                {subscription.cancel_at_period_end ? 'Expires on: ' : 'Renews on: '}
              </span>
              <span>
                {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
              </span>
            </div>
          )}

          {subscription.payment_method_brand && subscription.payment_method_last4 && (
            <div>
              <span className="font-medium">Payment Method: </span>
              <span className="capitalize">
                {subscription.payment_method_brand} ending in {subscription.payment_method_last4}
              </span>
            </div>
          )}

          {subscription.cancel_at_period_end && (
            <Alert variant="warning">
              Your subscription will be canceled at the end of the current billing period.
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}