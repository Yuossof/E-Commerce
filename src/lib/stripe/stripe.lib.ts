import Stripe from 'stripe';
import config from '../../config/env';
// Test mode key; don't put live keys in code. See https://docs.stripe.com/keys-best-practices.
export const stripeClient = new Stripe(config.stripeSecretKey);

