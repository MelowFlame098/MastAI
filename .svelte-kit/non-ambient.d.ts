
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/admin" | "/api" | "/api/auth" | "/api/auth/access" | "/api/auth/login" | "/api/auth/logout" | "/api/auth/me" | "/api/auth/register" | "/api/auth/users" | "/api/auth/users/[id]" | "/api/databases" | "/api/databases/test" | "/api/db" | "/api/db/[database]" | "/api/db/[database]/all" | "/api/db/[database]/assistant" | "/api/db/[database]/dump" | "/api/db/[database]/dump/[filename]" | "/api/db/[database]/exec" | "/api/db/[database]/[table]" | "/api/db/[database]/[table]/data" | "/db" | "/db/[database]" | "/db/[database]/[table]" | "/login" | "/themes" | "/themes/enhanced" | "/themes/[theme]";
		RouteParams(): {
			"/api/auth/users/[id]": { id: string };
			"/api/db/[database]": { database: string };
			"/api/db/[database]/all": { database: string };
			"/api/db/[database]/assistant": { database: string };
			"/api/db/[database]/dump": { database: string };
			"/api/db/[database]/dump/[filename]": { database: string; filename: string };
			"/api/db/[database]/exec": { database: string };
			"/api/db/[database]/[table]": { database: string; table: string };
			"/api/db/[database]/[table]/data": { database: string; table: string };
			"/db/[database]": { database: string };
			"/db/[database]/[table]": { database: string; table: string };
			"/themes/[theme]": { theme: string }
		};
		LayoutParams(): {
			"/": { id?: string; database?: string; filename?: string; table?: string; theme?: string };
			"/admin": Record<string, never>;
			"/api": { id?: string; database?: string; filename?: string; table?: string };
			"/api/auth": { id?: string };
			"/api/auth/access": Record<string, never>;
			"/api/auth/login": Record<string, never>;
			"/api/auth/logout": Record<string, never>;
			"/api/auth/me": Record<string, never>;
			"/api/auth/register": Record<string, never>;
			"/api/auth/users": { id?: string };
			"/api/auth/users/[id]": { id: string };
			"/api/databases": Record<string, never>;
			"/api/databases/test": Record<string, never>;
			"/api/db": { database?: string; filename?: string; table?: string };
			"/api/db/[database]": { database: string; filename?: string; table?: string };
			"/api/db/[database]/all": { database: string };
			"/api/db/[database]/assistant": { database: string };
			"/api/db/[database]/dump": { database: string; filename?: string };
			"/api/db/[database]/dump/[filename]": { database: string; filename: string };
			"/api/db/[database]/exec": { database: string };
			"/api/db/[database]/[table]": { database: string; table: string };
			"/api/db/[database]/[table]/data": { database: string; table: string };
			"/db": { database?: string; table?: string };
			"/db/[database]": { database: string; table?: string };
			"/db/[database]/[table]": { database: string; table: string };
			"/login": Record<string, never>;
			"/themes": { theme?: string };
			"/themes/enhanced": Record<string, never>;
			"/themes/[theme]": { theme: string }
		};
		Pathname(): "/" | "/admin" | "/admin/" | "/api" | "/api/" | "/api/auth" | "/api/auth/" | "/api/auth/access" | "/api/auth/access/" | "/api/auth/login" | "/api/auth/login/" | "/api/auth/logout" | "/api/auth/logout/" | "/api/auth/me" | "/api/auth/me/" | "/api/auth/register" | "/api/auth/register/" | "/api/auth/users" | "/api/auth/users/" | `/api/auth/users/${string}` & {} | `/api/auth/users/${string}/` & {} | "/api/databases" | "/api/databases/" | "/api/databases/test" | "/api/databases/test/" | "/api/db" | "/api/db/" | `/api/db/${string}` & {} | `/api/db/${string}/` & {} | `/api/db/${string}/all` & {} | `/api/db/${string}/all/` & {} | `/api/db/${string}/assistant` & {} | `/api/db/${string}/assistant/` & {} | `/api/db/${string}/dump` & {} | `/api/db/${string}/dump/` & {} | `/api/db/${string}/dump/${string}` & {} | `/api/db/${string}/dump/${string}/` & {} | `/api/db/${string}/exec` & {} | `/api/db/${string}/exec/` & {} | `/api/db/${string}/${string}` & {} | `/api/db/${string}/${string}/` & {} | `/api/db/${string}/${string}/data` & {} | `/api/db/${string}/${string}/data/` & {} | "/db" | "/db/" | `/db/${string}` & {} | `/db/${string}/` & {} | `/db/${string}/${string}` & {} | `/db/${string}/${string}/` & {} | "/login" | "/login/" | "/themes" | "/themes/" | "/themes/enhanced" | "/themes/enhanced/" | `/themes/${string}` & {} | `/themes/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | string & {};
	}
}