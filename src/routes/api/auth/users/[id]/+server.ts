import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import { authMiddleware } from '$lib/server/middleware/auth';
import type { RequestHandler } from './$types';

// GET /api/auth/users/[id] - Get user by ID (admin only)
export const GET: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const { id } = event.params;
		const user = await AuthService.getUserById(id);

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ user });
	} catch (error) {
		console.error('Error fetching user:', error);
		return json({ error: 'Failed to fetch user' }, { status: 500 });
	}
};

// PUT /api/auth/users/[id] - Update user (admin only)
export const PUT: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const { id } = event.params;
		const updates = await event.request.json();
		
		const user = await AuthService.updateUser(id, updates);

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
		const { id } = event.params;
		const success = await AuthService.deleteUser(id);

		if (!success) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({ message: 'User deleted successfully' });
	} catch (error: any) {
		console.error('Error deleting user:', error);
		return json({ error: error.message || 'Failed to delete user' }, { status: 400 });
	}
};