import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import Stripe from 'stripe';
import { sign } from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
	apiVersion: '2024-12-18.acacia'
});

// Simple token generation using crypto
function generateDownloadToken(sessionId: string, month: number, day: number): string {
	const payload = JSON.stringify({
		sessionId,
		month,
		day,
		exp: Date.now() + 3600000 // 1 hour expiry
	});
	return Buffer.from(payload).toString('base64url');
}

export const GET: RequestHandler = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');

	if (!sessionId) {
		return json({ error: 'Missing session_id' }, { status: 400 });
	}

	try {
		// Retrieve session from Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Check if payment was successful
		if (session.payment_status !== 'paid') {
			return json({ error: 'Payment not completed' }, { status: 400 });
		}

		// Get birthday from metadata
		const month = parseInt(session.metadata?.month || '0');
		const day = parseInt(session.metadata?.day || '0');

		if (!month || !day) {
			return json({ error: 'Invalid session metadata' }, { status: 400 });
		}

		// Generate download token
		const token = generateDownloadToken(sessionId, month, day);

		return json({
			success: true,
			month,
			day,
			token
		});
	} catch (err) {
		console.error('Session verification error:', err);
		return json({ error: 'Failed to verify session' }, { status: 500 });
	}
};
