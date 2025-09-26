/**
 * API endpoints for database configuration management
 */
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { 
	getDatabaseConfigs, 
	addDatabaseConnection, 
	updateDatabaseConnection, 
	removeDatabaseConnection,
	testDatabaseConnection,
	type DatabaseConfig 
} from "$lib/server/db/config";

// GET /api/databases - List all database configurations
export const GET: RequestHandler = async () => {
	try {
		const configs = getDatabaseConfigs();
		return json({
			success: true,
			databases: configs
		});
	} catch (err) {
		console.error("Failed to get database configs:", err);
		throw error(500, "Failed to retrieve database configurations");
	}
};

// POST /api/databases - Add a new database connection
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();
		
		// Validate required fields
		if (!data.name || typeof data.name !== 'string') {
			throw error(400, "Database name is required");
		}

		// Create database configuration
		const config = await addDatabaseConnection({
			name: data.name,
			description: data.description || "",
			connectionString: data.connectionString || "",
			apiToken: data.apiToken || "",
			accountId: data.accountId || "",
			databaseId: data.databaseId || "",
			isActive: data.isActive !== false, // Default to true
		});

		return json({
			success: true,
			database: config
		});
	} catch (err) {
		console.error("Failed to add database:", err);
		if (err instanceof Error && err.message.includes("400")) {
			throw err;
		}
		throw error(500, "Failed to add database connection");
	}
};

// PUT /api/databases/[id] - Update database configuration
export const PUT: RequestHandler = async ({ request, url }) => {
	try {
		const id = url.searchParams.get('id');
		if (!id) {
			throw error(400, "Database ID is required");
		}

		const data = await request.json();
		const updatedConfig = updateDatabaseConnection(id, data);
		
		if (!updatedConfig) {
			throw error(404, "Database not found");
		}

		return json({
			success: true,
			database: updatedConfig
		});
	} catch (err) {
		console.error("Failed to update database:", err);
		if (err instanceof Error && (err.message.includes("400") || err.message.includes("404"))) {
			throw err;
		}
		throw error(500, "Failed to update database connection");
	}
};

// DELETE /api/databases/[id] - Remove database connection
export const DELETE: RequestHandler = async ({ url }) => {
	try {
		const id = url.searchParams.get('id');
		if (!id) {
			throw error(400, "Database ID is required");
		}

		const removed = removeDatabaseConnection(id);
		
		if (!removed) {
			throw error(404, "Database not found");
		}

		return json({
			success: true,
			message: "Database connection removed successfully"
		});
	} catch (err) {
		console.error("Failed to remove database:", err);
		if (err instanceof Error && (err.message.includes("400") || err.message.includes("404"))) {
			throw err;
		}
		throw error(500, "Failed to remove database connection");
	}
};