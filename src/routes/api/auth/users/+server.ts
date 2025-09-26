import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import { authMiddleware } from '$lib/server/middleware/auth';
import type { RequestHandler } from './$types';

// GET /api/auth/users - List all users (admin only)
export const GET: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const users = await AuthService.getAllUsers();
		return json({ users });
	} catch (error) {
		console.error('Error fetching users:', error);
		return json({ error: 'Failed to fetch users' }, { status: 500 });
	}
};

// POST /api/auth/users - Create new user (admin only)
export const POST: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const { username, email, password, role = 'user' } = await event.request.json();

		if (!username || !email || !password) {
			return json({ error: 'Username, email, and password are required' }, { status: 400 });
		}

		const user = await AuthService.register({
			username,
			email,
			password,
			role
		});

		return json({ user }, { status: 201 });
	} catch (error: any) {
		console.error('Error creating user:', error);
		return json({ error: error.message || 'Failed to create user' }, { status: 400 });
	}
};

// PUT /api/auth/users/[id] - Update user (admin only)
export const PUT: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const url = new URL(event.request.url);
		const userId = url.pathname.split('/').pop();
		
		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		const updates = await event.request.json();
		const user = await AuthService.updateUser(userId, updates);

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ user });
	} catch (error: any) {
		console.error('Error updating user:', error);
		return json({ error: error.message || 'Failed to update user' }, { status: 400 });
	}
};

// DELETE /api/auth/users/[id] - Delete user (admin only)
export const DELETE: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const url = new URL(event.request.url);
		const userId = url.pathname.split('/').pop();
		
		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		const success = await AuthService.deleteUser(userId);

		if (!success) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ message: 'User deleted successfully' });
	} catch (error: any) {
		console.error('Error deleting user:', error);
		return json({ error: error.message || 'Failed to delete user' }, { status: 400 });
	}
};