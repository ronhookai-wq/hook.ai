export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_TK4HKPyyMY0gnz',
    priceId: 'price_1SNQ9NIu8atC8qcjJ8gp98A3',
    name: 'Basic',
    description: 'Perfect for individuals getting started with essential features and basic support.',
    price: 10.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_TK4HuCI0zW3hzb',
    priceId: 'price_1SNQ8eIu8atC8qcjaddSKFNG',
    name: 'Pro',
    description: 'Ideal for growing businesses with advanced features, priority support, and enhanced capabilities.',
    price: 25.00,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_TK4IB6pkcH27FA',
    priceId: 'price_1SNQ9lIu8atC8qcjoQFf5WtA',
    name: 'Agency',
    description: 'Complete solution for agencies and enterprises with unlimited access, dedicated support, and premium features.',
    price: 59.00,
    currency: 'usd',
    mode: 'subscription'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return stripeProducts.find(product => product.priceId === priceId);
};

export const formatPrice = (price: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(price);
};