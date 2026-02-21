import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
	apiVersion: '2024-12-18.acacia'
});

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const { month, day } = await request.json();

		// Validate inputs
		if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
			return json({ error: 'Invalid birthday' }, { status: 400 });
		}

		const origin = url.origin;

		// Create Stripe Checkout session
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Personalized Birthday Rarity Print',
							description: `Custom birthday print for ${month}/${day}`,
						},
						unit_amount: 1000, // $10.00 in cents
					},
					quantity: 1,
				},
			],
			mode: 'payment',
			success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${origin}/shop?month=${month}&day=${day}`,
			metadata: {
				month: month.toString(),
				day: day.toString(),
			},
		});

		return json({ url: session.url });
	} catch (err) {
		console.error('Stripe checkout error:', err);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
};
