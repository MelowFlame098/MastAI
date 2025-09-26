<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { page } from "$app/stores";
	import { is_dangerous } from "$lib/sql";
	import { t } from "svelte-i18n";
	import type { PageData } from "./$types";
	import type { D1Result } from "@cloudflare/workers-types";

	export let data: PageData;

	let query = "";
	$: danger = is_dangerous(query);

	function handler(evt: KeyboardEvent) {
		if (evt.code === "Enter" && evt.shiftKey === true && query) {
			run();
		}
	}

	let running = false;
	let duration: number | undefined;
	let error = "";
	async function run() {
		if (running) {
			return;
		}
		running = true;

		try {
			const q = query
				.split(";")
				.filter((q) => q.trim())
				.map((q) => q.replace(/\n/g, "\\n"))
				.join("\n");
			const res = await fetch(`/api/db/${$page.params.database}/exec`, {
				method: "POST",
				body: JSON.stringify({ query: q }),
			});

			const json = await res.json<
				D1Result<Record<string, unknown>> | { message: string; code?: number }
			>();
			if (json) {
				if (res.status == 500 && json.code == 400) {
					error = json?.message;
					duration = undefined;
				} else if (res.status == 500) {
					error = "An unknown error has occurred.  Check the browser devtools for more.";
					duration = undefined;
				} else {
					duration = json.duration;
					error = "";
					await invalidateAll();
				}
			} else {
				throw new Error("Unknown");
			}
		} catch (err) {
			error = err instanceof Error ? err.message : "Unknown";
			duration = undefined;
		} finally {
			running = false;
		}
	}
</script>

<svelte:head>
	<title>{$page.params.database} | {$t("d1-manager.name")}</title>
	<meta
		name="description"
		content={$t("d1-manager-manage-db", { values: { db: $page.params.database } })}
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-6">
	<!-- Header Section -->
	<div class="mb-8">
		<div class="flex items-center gap-4 mb-6">
			<div class="avatar placeholder">
				<div class="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg">
					<svg class="h-8 w-8 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
						<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
					</svg>
				</div>
			</div>
			<div>
				<h1 class="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
					{$page.params.database}
				</h1>
				<p class="text-base-content/70 text-lg">Database Management Console</p>
			</div>
		</div>
	</div>

	<!-- SQL Query Console Card -->
	<div class="card bg-base-100 shadow-xl border border-base-300 mb-8">
		<div class="card-body">
			<div class="flex items-center gap-3 mb-6">
				<div class="avatar placeholder">
					<div class="w-12 h-12 bg-gradient-to-r from-accent to-secondary rounded-lg">
						<svg class="h-6 w-6 text-accent-content" fill="currentColor" viewBox="0 0 24 24">
							<path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
						</svg>
					</div>
				</div>
				<div>
					<h2 class="text-2xl font-bold text-base-content">SQL Query Console</h2>
					<p class="text-base-content/70">Execute SQL queries with real-time validation</p>
				</div>
			</div>

			<div class="space-y-4">
				<div class="form-control">
					<div class="relative">
						<textarea
							class="textarea textarea-bordered textarea-primary w-full min-h-[120px] font-mono text-sm resize-y transition-all duration-200 focus:min-h-[200px] pr-20"
							class:textarea-error={danger}
							placeholder="Enter your SQL query here... (Shift+Enter to execute)"
							bind:value={query}
							on:keydown={handler}
						></textarea>
						<div class="absolute top-3 right-3 flex flex-col gap-2">
							{#if danger}
								<div class="tooltip tooltip-left" data-tip="Potentially dangerous query">
									<div class="badge badge-error badge-sm">
										<svg class="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z"/>
										</svg>
										Danger
									</div>
								</div>
							{/if}
							{#if running}
								<div class="loading loading-spinner loading-sm text-primary"></div>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-3 items-center justify-between">
					<div class="flex gap-2">
						<button
							class="btn btn-primary gap-2 shadow-lg hover:shadow-xl transition-all duration-200"
							class:loading={running}
							disabled={running || !query.trim()}
							on:click={run}
						>
							{#if !running}
								<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8 5v14l11-7z"/>
								</svg>
							{/if}
							{running ? "Executing..." : "Execute Query"}
						</button>
						<button
							class="btn btn-outline btn-secondary"
							disabled={!query.trim()}
							on:click={() => query = ""}
						>
							Clear
						</button>
					</div>
					
					{#if duration !== undefined}
						<div class="badge badge-success gap-1">
							<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
							</svg>
							{duration}ms
						</div>
					{/if}
				</div>

				{#if error}
					<div class="alert alert-error shadow-lg">
						<svg class="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
							<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z"/>
						</svg>
						<div>
							<h3 class="font-bold">Query Error</h3>
							<div class="text-sm opacity-90">{error}</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Tables Overview Card -->
	<div class="card bg-base-100 shadow-xl border border-base-300">
		<div class="card-body">
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center gap-3">
					<div class="avatar placeholder">
						<div class="w-12 h-12 bg-gradient-to-r from-info to-primary rounded-lg">
							<svg class="h-6 w-6 text-info-content" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
							</svg>
						</div>
					</div>
					<div>
						<h2 class="text-2xl font-bold text-base-content">Database Tables</h2>
						<p class="text-base-content/70">{data.db.length} tables available</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each data.db as table (table.name)}
					<a
						href="/db/{$page.params.database}/{table.name}"
						class="card bg-base-200 hover:bg-base-300 border border-base-300 hover:border-primary transition-all duration-200 hover:shadow-lg cursor-pointer"
					>
						<div class="card-body p-4">
							<div class="flex items-center gap-3">
								<div class="avatar placeholder">
									<div class="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-lg">
										<svg class="h-5 w-5 text-secondary-content" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
										</svg>
									</div>
								</div>
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold text-base-content truncate">{table.name}</h3>
									<p class="text-sm text-base-content/70">{table.columns.length} columns</p>
								</div>
								<svg class="h-5 w-5 text-base-content/50" fill="currentColor" viewBox="0 0 24 24">
									<path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
								</svg>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>
