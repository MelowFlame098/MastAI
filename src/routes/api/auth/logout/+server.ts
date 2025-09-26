import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		const sessionId = cookies.get('session');

		if (sessionId) {
			await AuthService.logout(sessionId);
		}

		// Clear session cookie
		const response = json({ success: true, message: 'Logged out successfully' });
		response.headers.set(
			'Set-Cookie',
			'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0'
		);

		return response;
	} catch (error) {
		console.error('Logout error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Logout failed' },
			{ status: 500 }
		);
	}
};