// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: Record<string, D1Database>;
			user?: {
				id: string;
				username: string;
				email: string;
				role: 'admin' | 'user';
				is_active: boolean;
			};
			session?: {
				id: string;
				expires_at: string;
			};
		}
		// interface PageData {}
		interface Platform {
			env: {
				[key: string]: D1Database;
			};
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
