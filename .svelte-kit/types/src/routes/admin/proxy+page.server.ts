// @ts-nocheck
import { authMiddleware } from '$lib/server/middleware/auth';
import type { PageServerLoad } from './$types';

export const load = async (event: Parameters<PageServerLoad>[0]) => {
	// Require admin authentication
	await authMiddleware(event, {
		requireAuth: true,
		requireAdmin: true
	});

	return {};
};