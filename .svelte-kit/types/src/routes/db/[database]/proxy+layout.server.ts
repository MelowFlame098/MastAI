// @ts-nocheck
import { error } from "@sveltejs/kit";
import { DBMS } from "$lib/server/db/dbms";
import { authMiddleware, checkDatabaseAccess } from "$lib/server/middleware/auth";
import type { LayoutServerLoad } from "./$types";

export const load = async (event: Parameters<LayoutServerLoad>[0]) => {
	const { database } = event.params;

	// Require authentication
	const user = await authMiddleware(event, {
		requireAuth: true
	});

	const dbms = DBMS(event.platform?.env || {});
	const db = dbms[database];

	if (!db) {
		throw error(404, "Database not found");
	}

	// Check if user has access to this specific database
	if (user && user.role !== 'admin') {
		const hasAccess = await checkDatabaseAccess(user.id, database, 'read');
		if (!hasAccess) {
			throw error(403, "Access denied to this database");
		}
	}

	return { db, database };
};
