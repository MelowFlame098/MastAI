import { extend } from "$lib/log";
import type { D1Database } from "@cloudflare/workers-types";
import { getAllDatabases } from "./config";

const log = extend("dbms");

export function DBMS(
	env: Record<string, Fetcher | D1Database | string>,
): Record<string, D1Database> {
	const keys = Object.keys(env).filter((k) => k.startsWith("DB"));
	log("Static Database Bindings:", keys.join(", "));

	// Get static databases from environment variables
	const staticDatabases: Record<string, D1Database> = {};
	for (const k of keys) {
		const e = env[k];
		if (typeof e === "string") {
			continue;
		}
		if (!("prepare" in e)) {
			continue;
		}
		staticDatabases[k.replace(/^DB_?/, "") || "default"] = e;
	}

	// Combine static and dynamic databases
	const allDatabases = getAllDatabases(staticDatabases);
	log("Total databases (static + dynamic):", Object.keys(allDatabases).length);
	
	return allDatabases;
}
