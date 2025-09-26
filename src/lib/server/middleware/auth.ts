import { error, redirect } from '@sveltejs/kit';
import { AuthService } from '../auth/auth';
import type { RequestEvent } from '@sveltejs/kit';

export interface AuthMiddlewareOptions {
	requireAuth?: boolean;
	requireAdmin?: boolean;
	requireDatabaseAccess?: {
		databaseId: string;
		permission: 'read' | 'write' | 'admin';
	};
	redirectTo?: string;
}

/**
 * Authentication middleware for protecting routes
 */
export async function authMiddleware(
	event: RequestEvent,
	options: AuthMiddlewareOptions = {}
) {
	const {
		requireAuth = false,
		requireAdmin = false,
		requireDatabaseAccess,
		redirectTo = '/login'
	} = options;

	// Get user from locals (set by hooks.server.ts)
	const user = event.locals.user;

	// Check if authentication is required
	if (requireAuth && !user) {
		if (event.request.headers.get('accept')?.includes('application/json')) {
			throw error(401, { message: 'Authentication required' });
		} else {
			throw redirect(302, redirectTo);
		}
	}

	// Check if admin privileges are required
	if (requireAdmin && (!user || user.role !== 'admin')) {
		if (event.request.headers.get('accept')?.includes('application/json')) {
			throw error(403, { message: 'Admin privileges required' });
		} else {
			throw redirect(302, '/');
		}
	}

	// Check database access permissions
	if (requireDatabaseAccess && user) {
		const { databaseId, permission } = requireDatabaseAccess;
		const hasPermission = await AuthService.hasPermission(
			user.id,
			databaseId,
			permission
		);

		if (!hasPermission) {
			if (event.request.headers.get('accept')?.includes('application/json')) {
				throw error(403, { 
					message: `Insufficient permissions for database: ${databaseId}` 
				});
			} else {
				throw redirect(302, '/');
			}
		}
	}

	return user;
}

/**
 * Helper function to check if user has database access
 */
export async function checkDatabaseAccess(
	userId: string,
	databaseId: string,
	permission: 'read' | 'write' | 'admin'
): Promise<boolean> {
	return await AuthService.hasPermission(userId, databaseId, permission);
}

/**
 * Helper function to get user's accessible databases
 */
export async function getUserAccessibleDatabases(
	userId: string,
	allDatabases: Record<string, any>
): Promise<Record<string, any>> {
	const user = await AuthService.getUserById(userId);
	
	// Admin users have access to all databases
	if (user?.role === 'admin') {
		return allDatabases;
	}

	// Filter databases based on user permissions
	const accessibleDatabases: Record<string, any> = {};
	const userAccess = await AuthService.getUserDatabaseAccess(userId);

	for (const access of userAccess) {
		if (allDatabases[access.database_id]) {
			accessibleDatabases[access.database_id] = allDatabases[access.database_id];
		}
	}

	return accessibleDatabases;
}