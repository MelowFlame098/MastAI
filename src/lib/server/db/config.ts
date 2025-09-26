import { extend } from "$lib/log";
import type { D1Database } from "@cloudflare/workers-types";

const log = extend("db-config");

export interface DatabaseConfig {
	id: string;
	name: string;
	description?: string;
	connectionString?: string;
	apiToken?: string;
	accountId?: string;
	databaseId?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface DatabaseConnection {
	config: DatabaseConfig;
	database: D1Database;
}

// In-memory storage for dynamic database connections
// In production, this should be persisted to a database or secure storage
let dynamicDatabases: Map<string, DatabaseConnection> = new Map();

/**
 * Get all configured databases (static + dynamic)
 */
export function getAllDatabases(
	staticDatabases: Record<string, D1Database>
): Record<string, D1Database> {
	const result: Record<string, D1Database> = { ...staticDatabases };
	
	// Add dynamic databases
	for (const [id, connection] of dynamicDatabases) {
		if (connection.config.isActive) {
			result[id] = connection.database;
		}
	}
	
	log("Total databases:", Object.keys(result).length);
	return result;
}

/**
 * Add a new dynamic database connection
 */
export async function addDatabaseConnection(config: Omit<DatabaseConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<DatabaseConfig> {
	const id = generateDatabaseId(config.name);
	const now = new Date().toISOString();
	
	const fullConfig: DatabaseConfig = {
		...config,
		id,
		createdAt: now,
		updatedAt: now,
	};

	// For now, we'll create a mock D1Database interface
	// In a real implementation, this would connect to the actual D1 database
	const mockDatabase = createMockD1Database(fullConfig);
	
	dynamicDatabases.set(id, {
		config: fullConfig,
		database: mockDatabase,
	});
	
	log("Added database:", id, config.name);
	return fullConfig;
}

/**
 * Remove a dynamic database connection
 */
export function removeDatabaseConnection(id: string): boolean {
	const removed = dynamicDatabases.delete(id);
	if (removed) {
		log("Removed database:", id);
	}
	return removed;
}

/**
 * Update a database configuration
 */
export function updateDatabaseConnection(id: string, updates: Partial<DatabaseConfig>): DatabaseConfig | null {
	const connection = dynamicDatabases.get(id);
	if (!connection) {
		return null;
	}
	
	const updatedConfig: DatabaseConfig = {
		...connection.config,
		...updates,
		id, // Ensure ID cannot be changed
		updatedAt: new Date().toISOString(),
	};
	
	connection.config = updatedConfig;
	dynamicDatabases.set(id, connection);
	
	log("Updated database:", id);
	return updatedConfig;
}

/**
 * Get all database configurations
 */
export function getDatabaseConfigs(): DatabaseConfig[] {
	return Array.from(dynamicDatabases.values()).map(conn => conn.config);
}

/**
 * Get a specific database configuration
 */
export function getDatabaseConfig(id: string): DatabaseConfig | null {
	const connection = dynamicDatabases.get(id);
	return connection ? connection.config : null;
}

/**
 * Test a database connection
 */
export async function testDatabaseConnection(config: DatabaseConfig): Promise<{ success: boolean; error?: string }> {
	try {
		const connection = dynamicDatabases.get(config.id);
		if (!connection) {
			return { success: false, error: "Database connection not found" };
		}
		
		// Test with a simple query
		await connection.database.prepare("SELECT 1").first();
		return { success: true };
	} catch (error) {
		log("Connection test failed:", error);
		return { 
			success: false, 
			error: error instanceof Error ? error.message : "Unknown error" 
		};
	}
}

/**
 * Generate a unique database ID
 */
function generateDatabaseId(name: string): string {
	const sanitized = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
	const timestamp = Date.now().toString(36);
	return `${sanitized}_${timestamp}`;
}

/**
 * Create a mock D1Database for development/testing
 * In production, this would create actual D1Database connections
 */
function createMockD1Database(config: DatabaseConfig): D1Database {
	// This is a simplified mock implementation
	// In a real implementation, you would use Cloudflare's D1 REST API
	// or establish proper D1Database connections
	
	return {
		prepare: (query: string) => ({
			bind: (...values: any[]) => ({
				first: async () => ({ success: true, meta: {}, results: [] }),
				run: async () => ({ success: true, meta: { changes: 0, last_row_id: 0, duration: 0 } }),
				all: async () => ({ success: true, meta: {}, results: [] }),
			}),
			first: async () => ({ success: true, meta: {}, results: [] }),
			run: async () => ({ success: true, meta: { changes: 0, last_row_id: 0, duration: 0 } }),
			all: async () => ({ success: true, meta: {}, results: [] }),
		}),
		dump: async () => new ArrayBuffer(0),
		batch: async (statements: any[]) => statements.map(() => ({ success: true, meta: {}, results: [] })),
		exec: async (query: string) => ({ count: 0, duration: 0 }),
	} as D1Database;
}