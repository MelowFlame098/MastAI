import { json } from '@sveltejs/kit';
import { AuthService } from '$lib/server/auth/auth';
import { authMiddleware } from '$lib/server/middleware/auth';
import type { RequestHandler } from './$types';

// GET /api/auth/access?userId=xxx - Get user's database access (admin only)
export const GET: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const url = new URL(event.request.url);
		const userId = url.searchParams.get('userId');

		if (!userId) {
			return json({ error: 'User ID is required' }, { status: 400 });
		}

		const access = await AuthService.getUserDatabaseAccess(userId);
		return json({ access });
	} catch (error) {
		console.error('Error fetching user access:', error);
		return json({ error: 'Failed to fetch user access' }, { status: 500 });
	}
};

// POST /api/auth/access - Grant database access (admin only)
export const POST: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const { userId, databaseId, permission } = await event.request.json();

		if (!userId || !databaseId || !permission) {
			return json({ 
				error: 'User ID, database ID, and permission are required' 
			}, { status: 400 });
		}

		if (!['read', 'write', 'admin'].includes(permission)) {
			return json({ 
				error: 'Permission must be read, write, or admin' 
			}, { status: 400 });
		}

		await AuthService.grantDatabaseAccess(userId, databaseId, permission);
		return json({ message: 'Access granted successfully' }, { status: 201 });
	} catch (error: any) {
		console.error('Error granting access:', error);
		return json({ error: error.message || 'Failed to grant access' }, { status: 400 });
	}
};

// DELETE /api/auth/access - Revoke database access (admin only)
export const DELETE: RequestHandler = async (event) => {
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	try {
		const { userId, databaseId } = await event.request.json();

		if (!userId || !databaseId) {
			return json({ 
				error: 'User ID and database ID are required' 
			}, { status: 400 });
		}

		await AuthService.revokeDatabaseAccess(userId, databaseId);
		return json({ message: 'Access revoked successfully' });
	} catch (error: any) {
		console.error('Error revoking access:', error);
		return json({ error: error.message || 'Failed to revoke access' }, { status: 400 });
	}
};