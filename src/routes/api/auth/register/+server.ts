import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { username, email, password, role } = await request.json();

		if (!username || !email || !password) {
			return json({ error: 'Username, email, and password are required' }, { status: 400 });
		}

		// Check if user is authenticated and is admin (for creating admin users)
		if (role === 'admin') {
			const sessionId = request.headers.get('cookie')?.match(/session=([^;]+)/)?.[1];
			if (!sessionId) {
				return json({ error: 'Authentication required to create admin users' }, { status: 401 });
			}

			const sessionData = await AuthService.validateSession(sessionId);
			if (!sessionData || sessionData.user.role !== 'admin') {
				return json({ error: 'Admin privileges required to create admin users' }, { status: 403 });
			}
		}

		const user = await AuthService.register({
			username,
			email,
			password,
			role: role || 'user'
		});

		// Return user data without password hash
		const { password_hash, ...userWithoutPassword } = user;

		return json({
			success: true,
			user: userWithoutPassword,
			message: 'User registered successfully'
		});
	} catch (error) {
		console.error('Registration error:', error);
		return json(
			{ error: error instanceof Error ? error.message : 'Registration failed' },
			{ status: 400 }
		);
	}
};