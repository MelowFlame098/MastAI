import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	try {
		const { username, password } = await request.json();

		if (!username || !password) {
			return json({ error: 'Username and password are required' }, { status: 400 });
		}

		const userAgent = request.headers.get('user-agent') || undefined;
		const ipAddress = getClientAddress();

		const sessionData = await AuthService.login(
			{ username, password },
			userAgent,
			ipAddress
		);

		// Set session cookie
		const response = json({
			success: true,
			user: sessionData.user,
			expires_at: sessionData.expires_at
		});

		response.headers.set(
			'Set-Cookie',
			`session=${sessionData.session_id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
		);

		return response;
	} catch (error) {
		console.error('Login error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Login failed' },
			{ status: 401 }
		);
	}
};