import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

function verifyDownloadToken(token: string): { sessionId: string; month: number; day: number; exp: number } | null {
	try {
		const payload = Buffer.from(token, 'base64url').toString('utf-8');
		const data = JSON.parse(payload);
		
		// Check expiry
		if (data.exp < Date.now()) {
			return null;
		}
		
		return data;
	} catch {
		return null;
	}
}

export const GET: RequestHandler = async ({ url, fetch }) => {
	const token = url.searchParams.get('token');
	const month = url.searchParams.get('month');
	const day = url.searchParams.get('day');

	if (!token || !month || !day) {
		throw error(400, 'Missing required parameters');
	}

	// Verify token
	const tokenData = verifyDownloadToken(token);
	if (!tokenData) {
		throw error(403, 'Invalid or expired token');
	}

	// Validate month/day match token
	if (tokenData.month !== parseInt(month) || tokenData.day !== parseInt(day)) {
		throw error(403, 'Token does not match requested file');
	}

	// In Vercel, static files are served from the public URL, not filesystem
	// Fetch the file via HTTP since it's in the static directory
	const filename = `${month}-${day}.pdf`;
	const fileUrl = `/prints/${filename}`;
	
	try {
		// Fetch the static file
		const response = await fetch(fileUrl);
		
		if (!response.ok) {
			throw error(404, 'File not found');
		}

		const fileBuffer = await response.arrayBuffer();

		return new Response(fileBuffer, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="birthday-${month}-${day}.pdf"`,
				'Content-Length': fileBuffer.byteLength.toString()
			}
		});
	} catch (err) {
		console.error('File fetch error:', err);
		throw error(500, 'Failed to fetch file');
	}
};
