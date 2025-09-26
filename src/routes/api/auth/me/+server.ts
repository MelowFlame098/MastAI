import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const sessionId = cookies.get('session');

		if (!sessionId) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		const sessionData = await AuthService.validateSession(sessionId);

		if (!sessionData) {
			return json({ error: 'Invalid session' }, { status: 401 });
		}

		return json({
			success: true,
			user: sessionData.user,
			expires_at: sessionData.expires_at
		});
	} catch (error) {
		console.error('Get user error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to get user info' },
			{ status: 500 }
		);
	}
};