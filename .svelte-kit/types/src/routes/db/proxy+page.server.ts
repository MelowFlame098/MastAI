// @ts-nocheck
import { DBMS } from "$lib/server/db/dbms";
import { getUserAccessibleDatabases, authMiddleware } from "$lib/server/middleware/auth";
import type { PageServerLoad } from "./$types";

export const load = async (event: Parameters<PageServerLoad>[0]) => {
	// Require authentication for database access
	await authMiddleware(event, {
		requireAuth: true
	});

	const allDatabases = DBMS(event.platform?.env || {});
	
	// Filter databases based on user permissions
	let accessibleDatabases = allDatabases;
	if (event.locals.user) {
		accessibleDatabases = await getUserAccessibleDatabases(event.locals.user.id, allDatabases);
	}

	return {
		dbms: accessibleDatabases
	};
};
