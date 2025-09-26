// @ts-nocheck
import { DBMS } from '$lib/server/db/dbms';
import { getUserAccessibleDatabases } from '$lib/server/middleware/auth';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals, platform }: Parameters<LayoutServerLoad>[0]) => {
	const allDatabases = DBMS(platform?.env || {});
	
	// If user is authenticated, filter databases based on permissions
	let accessibleDatabases = allDatabases;
	if (locals.user) {
		accessibleDatabases = await getUserAccessibleDatabases(locals.user.id, allDatabases);
	}

	return {
		dbms: accessibleDatabases,
		user: locals.user,
		session: locals.session
	};
};
