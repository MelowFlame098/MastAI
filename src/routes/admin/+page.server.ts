import { authMiddleware } from '$lib/server/middleware/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// Require admin authentication
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	return {};
};