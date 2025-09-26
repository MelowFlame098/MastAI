/**
 * API endpoint for testing database connections
 */
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { getDatabaseConfig, testDatabaseConnection } from "$lib/server/db/config";

// POST /api/databases/test - Test a database connection
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		
		if (!data.id) {
			throw error(400, "Database ID is required");
		}

		const config = getDatabaseConfig(data.id);
		if (!config) {
			throw error(404, "Database configuration not found");
		}

		const testResult = await testDatabaseConnection(config);
		
		return json({
			success: testResult.success,
			error: testResult.error,
			database: {
				id: config.id,
				name: config.name
			}
		});
	} catch (err) {
		console.error("Failed to test database connection:", err);
		if (err instanceof Error && (err.message.includes("400") || err.message.includes("404"))) {
			throw err;
		}
		throw error(500, "Failed to test database connection");
	}
};