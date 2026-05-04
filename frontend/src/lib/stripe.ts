import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with publishable key from environment
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    'pk_test_your_publishable_key'
);

export const stripe = {
  redirectToCheckout: async (sessionId: string) => {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }
    // Use Stripe's redirectToCheckout method
    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  },
};

export default stripePromise;