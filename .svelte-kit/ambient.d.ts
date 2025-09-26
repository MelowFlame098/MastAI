
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```sh
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const AHA_CHROME_CRASHPAD_PIPE_NAME: string;
	export const ALLUSERSPROFILE: string;
	export const APPDATA: string;
	export const APP_REGION: string;
	export const CLOUDIDE_APISERVER_BASE_URL: string;
	export const CLOUDIDE_PROVIDER_REGION: string;
	export const CommonProgramFiles: string;
	export const CommonProgramW6432: string;
	export const COMPUTERNAME: string;
	export const ComSpec: string;
	export const CURL_CA_BUNDLE: string;
	export const DriverData: string;
	export const EFC_17500_1592913036: string;
	export const ELECTRON_FORCE_IS_PACKAGED: string;
	export const ELECTRON_NO_ASAR: string;
	export const ELECTRON_RUN_AS_NODE: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const GDAL_DATA: string;
	export const HOMEDRIVE: string;
	export const HOMEPATH: string;
	export const ICUBE_APP_VERSION: string;
	export const ICUBE_BUILD_TIME: string;
	export const ICUBE_BUILD_VERSION: string;
	export const ICUBE_CODEMAIN_SESSION: string;
	export const ICUBE_ELECTRON_PATH: string;
	export const ICUBE_ENABLE_MARSCODE_NLS: string;
	export const ICUBE_IS_ELECTRON: string;
	export const ICUBE_MACHINE_ID: string;
	export const ICUBE_MARSCODE_VERSION: string;
	export const ICUBE_PRODUCT_PROVIDER: string;
	export const ICUBE_PROVIDER: string;
	export const ICUBE_PROXY_HOST: string;
	export const ICUBE_QUALITY: string;
	export const ICUBE_USE_IPV6: string;
	export const ICUBE_VSCODE_VERSION: string;
	export const LOCALAPPDATA: string;
	export const LOGONSERVER: string;
	export const NODE_ENV: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const OneDrive: string;
	export const OneDriveConsumer: string;
	export const OPENSSL_CONF: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const OS: string;
	export const Path: string;
	export const PATHEXT: string;
	export const POSTGIS_ENABLE_OUTDB_RASTERS: string;
	export const POSTGIS_GDAL_ENABLED_DRIVERS: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const ProgramData: string;
	export const ProgramFiles: string;
	export const ProgramW6432: string;
	export const PROJ_LIB: string;
	export const PSModulePath: string;
	export const PUBLIC: string;
	export const SESSIONNAME: string;
	export const SystemDrive: string;
	export const SystemRoot: string;
	export const TEMP: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const VSCODE_BUILTIN_EXTENSIONS_PATH: string;
	export const VSCODE_CODE_CACHE_PATH: string;
	export const VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
	export const VSCODE_CWD: string;
	export const VSCODE_ESM_ENTRYPOINT: string;
	export const VSCODE_EXTENSIONS_PATH: string;
	export const VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
	export const VSCODE_IPC_HOOK: string;
	export const VSCODE_NLS_CONFIG: string;
	export const VSCODE_PID: string;
	export const VSCODE_RUN_IN_ELECTRON: string;
	export const windir: string;
	export const ZES_ENABLE_SYSMAN: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		AHA_CHROME_CRASHPAD_PIPE_NAME: string;
		ALLUSERSPROFILE: string;
		APPDATA: string;
		APP_REGION: string;
		CLOUDIDE_APISERVER_BASE_URL: string;
		CLOUDIDE_PROVIDER_REGION: string;
		CommonProgramFiles: string;
		CommonProgramW6432: string;
		COMPUTERNAME: string;
		ComSpec: string;
		CURL_CA_BUNDLE: string;
		DriverData: string;
		EFC_17500_1592913036: string;
		ELECTRON_FORCE_IS_PACKAGED: string;
		ELECTRON_NO_ASAR: string;
		ELECTRON_RUN_AS_NODE: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		GDAL_DATA: string;
		HOMEDRIVE: string;
		HOMEPATH: string;
		ICUBE_APP_VERSION: string;
		ICUBE_BUILD_TIME: string;
		ICUBE_BUILD_VERSION: string;
		ICUBE_CODEMAIN_SESSION: string;
		ICUBE_ELECTRON_PATH: string;
		ICUBE_ENABLE_MARSCODE_NLS: string;
		ICUBE_IS_ELECTRON: string;
		ICUBE_MACHINE_ID: string;
		ICUBE_MARSCODE_VERSION: string;
		ICUBE_PRODUCT_PROVIDER: string;
		ICUBE_PROVIDER: string;
		ICUBE_PROXY_HOST: string;
		ICUBE_QUALITY: string;
		ICUBE_USE_IPV6: string;
		ICUBE_VSCODE_VERSION: string;
		LOCALAPPDATA: string;
		LOGONSERVER: string;
		NODE_ENV: string;
		NUMBER_OF_PROCESSORS: string;
		OneDrive: string;
		OneDriveConsumer: string;
		OPENSSL_CONF: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		OS: string;
		Path: string;
		PATHEXT: string;
		POSTGIS_ENABLE_OUTDB_RASTERS: string;
		POSTGIS_GDAL_ENABLED_DRIVERS: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		ProgramData: string;
		ProgramFiles: string;
		ProgramW6432: string;
		PROJ_LIB: string;
		PSModulePath: string;
		PUBLIC: string;
		SESSIONNAME: string;
		SystemDrive: string;
		SystemRoot: string;
		TEMP: string;
		TMP: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		VSCODE_BUILTIN_EXTENSIONS_PATH: string;
		VSCODE_CODE_CACHE_PATH: string;
		VSCODE_CRASH_REPORTER_PROCESS_TYPE: string;
		VSCODE_CWD: string;
		VSCODE_ESM_ENTRYPOINT: string;
		VSCODE_EXTENSIONS_PATH: string;
		VSCODE_HANDLES_UNCAUGHT_ERRORS: string;
		VSCODE_IPC_HOOK: string;
		VSCODE_NLS_CONFIG: string;
		VSCODE_PID: string;
		VSCODE_RUN_IN_ELECTRON: string;
		windir: string;
		ZES_ENABLE_SYSMAN: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
