import { DBMS } from "$lib/server/db/dbms";
import { AuthService } from "$lib/server/auth/auth";
import type { Handle, HandleServerError } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	// Initialize database connections
	event.locals.db = DBMS(event.platform?.env);

	// Check for authentication
	const sessionId = event.cookies.get('session');
	if (sessionId) {
		try {
			const sessionData = await AuthService.validateSession(sessionId);
			if (sessionData) {
				event.locals.user = sessionData.user;
				event.locals.session = {
					id: sessionData.session_id,
					expires_at: sessionData.expires_at
				};
			}
		} catch (error) {
			console.error('Session validation error:', error);
			// Clear invalid session cookie
			event.cookies.delete('session', { path: '/' });
		}
	}

	// Clean up expired sessions periodically (simple approach)
	if (Math.random() < 0.01) { // 1% chance on each request
		AuthService.cleanupExpiredSessions().catch(console.error);
	}

	return resolve(event);
};

export const handleError: HandleServerError = ({ error, event }) => {
	console.error(error);

	if (error instanceof Error && error.message.includes("D1_ERROR")) {
		return {
			message: "Database connection error. Please check your D1 configuration.",
		};
	}

	return {
		message: "An unexpected error occurred.",
	};
};
