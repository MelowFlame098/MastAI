<script lang="ts">
	import { t } from "svelte-i18n";
	import { is_dangerous, is_readonly } from "../sql";
	import { export_csv } from "$lib/csv";
	import Icon from "@iconify/svelte";

	export let database: string;
	export let table: string;

	let query = $t("show-first-10-records", { values: { table } });

	let running = false;
	let suggestion: string | undefined;
	$: danger = is_dangerous(suggestion || "");
	let result: D1Result<Record<string, unknown>> | undefined;
	let error: string | undefined;

	async function suggest() {
		if (running) {
			return;
		}
		running = true;

		try {
			const res = await fetch(`/api/db/${database}/assistant`, {
				method: "POST",
				body: JSON.stringify({ q: query, t: table }),
			});

			const json = await res.json<{ sql: string } | { message: string }>();
			if (json) {
				if ("message" in json) {
					throw new Error(json.message);
				}
				suggestion = json.sql;
			} else {
				throw new Error($t("plugin.semantic-query.no-result"));
			}
		} catch (e) {
			if (e instanceof Error) {
				error = e.message;
			} else {
				error = $t("plugin.semantic-query.unknown-error");
			}
		} finally {
			running = false;
			if (is_readonly(suggestion || "")) {
				run();
			}
		}
	}

	async function run() {
		if (!suggestion) {
			return;
		}
		if (running) {
			return;
		}
		running = true;

		try {
			const res = await fetch(`/api/db/${database}/all`, {
				method: "POST",
				body: JSON.stringify({ query: suggestion }),
			});

			const json = await res.json<D1Result<Record<string, unknown>> | { message: string }>();
			if (json) {
				if ("message" in json) {
					throw new Error(json.message);
				}
				result = json;
				error = undefined;
			} else {
				throw new Error($t("plugin.semantic-query.no-result"));
			}
		} catch (err) {
			result = undefined;
			if (err instanceof Error) {
				error = err.message;
			} else {
				error = $t("plugin.semantic-query.unknown-error");
			}
		} finally {
			running = false;
			setTimeout(() => {
				document.querySelector("#bottom")?.scrollIntoView({ behavior: "smooth" });
			}, 50);
		}
	}

	function suggest_handler(evt: KeyboardEvent) {
		if (evt.code === "Enter" && evt.shiftKey === true) {
			suggest();
		}
	}

	function run_handler(evt: KeyboardEvent) {
		if (evt.code === "Enter" && evt.shiftKey === true) {
			run();
		}
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-4">
			<div class="flex items-center gap-3">
				<div class="avatar placeholder">
					<div class="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg">
						<Icon icon="mdi:robot" class="text-primary-content text-xl" />
					</div>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-base-content">MastAI Query Assistant</h3>
					<p class="text-sm text-base-content/70">Ask questions in natural language</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Natural Language Query -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-6">
			<div class="form-control">
				<label class="label">
					<span class="label-text font-medium flex items-center gap-2">
						<Icon icon="mdi:message-text" class="text-primary" />
						Natural Language Query
					</span>
					<span class="label-text-alt text-base-content/50">Shift + Enter to suggest</span>
				</label>
				<div class="join">
					<textarea
						class="textarea textarea-bordered join-item flex-1 min-h-[4rem] resize-y transition-all duration-200 focus:textarea-primary"
						placeholder="e.g., Show me the top 10 users by registration date"
						bind:value={query}
						on:keypress={suggest_handler}
						disabled={running}
					></textarea>
					<button
						class="btn btn-primary join-item gap-2 min-w-[8rem]"
						class:loading={running}
						on:click={suggest}
						disabled={running || !query.trim()}
					>
						{#if !running}
							<Icon icon="mdi:auto-fix" class="text-lg" />
						{/if}
						{$t("plugin.semantic-query.suggest")}
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Generated SQL Query -->
	{#if suggestion || running}
		<div class="card bg-base-100 shadow-lg border border-base-300">
			<div class="card-body p-6">
				<div class="form-control">
					<label class="label">
						<span class="label-text font-medium flex items-center gap-2">
							<Icon icon="mdi:code-braces" class="text-secondary" />
							Generated SQL Query
						</span>
						<div class="flex items-center gap-2">
							{#if suggestion && danger}
								<span class="badge badge-error badge-sm gap-1">
									<Icon icon="mdi:alert" class="text-xs" />
									Dangerous
								</span>
							{:else if suggestion}
								<span class="badge badge-success badge-sm gap-1">
									<Icon icon="mdi:check" class="text-xs" />
									Safe
								</span>
							{/if}
							<span class="label-text-alt text-base-content/50">Shift + Enter to run</span>
						</div>
					</label>
					<div class="join">
						<textarea
							class="textarea textarea-bordered join-item flex-1 min-h-[5rem] font-mono text-sm resize-y transition-all duration-200 focus:textarea-primary"
							class:textarea-error={danger}
							placeholder={$t("suggestion-will-appear-here")}
							bind:value={suggestion}
							on:keypress={run_handler}
							disabled={running}
						></textarea>
						<button
							class="btn join-item gap-2 min-w-[8rem]"
							class:btn-primary={!danger}
							class:btn-error={danger}
							class:loading={running}
							on:click={run}
							disabled={running || !suggestion}
						>
							{#if !running}
								<Icon icon="mdi:play" class="text-lg" />
							{/if}
							{$t("plugin.semantic-query.run")}
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Results -->
	{#if result}
		<div class="card bg-base-100 shadow-lg border border-base-300">
			<div class="card-body p-6">
				<div class="flex items-center justify-between mb-4">
					<h4 class="text-lg font-semibold flex items-center gap-2">
						<Icon icon="mdi:table" class="text-success" />
						Query Results
					</h4>
					{#if result.results?.length}
						<button
							class="btn btn-outline btn-sm gap-2"
							on:click={() => (result ? export_csv(result.results, table) : undefined)}
						>
							<Icon icon="mdi:download" class="text-sm" />
							Export CSV
						</button>
					{/if}
				</div>

				{#if result.results?.length}
					<div class="overflow-x-auto border border-base-300 rounded-lg">
						<table class="table table-sm w-full">
							<thead>
								<tr class="bg-base-200">
									{#each Object.keys(result.results[0]) as key (key)}
										<th class="font-semibold normal-case">{key}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each result.results as row, i (i)}
									<tr class="hover:bg-base-50" class:bg-base-50={i % 2 === 0}>
										{#each Object.values(row) as value, j (j)}
											<td
												class="text-base-content font-mono text-sm"
												class:text-base-content/50={value === null}
											>
												{value === null ? "NULL" : value}
											</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<div class="flex items-center justify-between mt-4 pt-4 border-t border-base-300">
						<div class="flex items-center gap-4 text-sm text-base-content/70">
							<div class="flex items-center gap-1">
								<Icon icon="mdi:clock-outline" class="text-xs" />
								<span>{result.meta.duration.toFixed(2)}ms</span>
							</div>
							<div class="flex items-center gap-1">
								<Icon icon="mdi:database" class="text-xs" />
								<span>{result.results.length} rows</span>
							</div>
							{#if result.meta.changes}
								<div class="flex items-center gap-1">
									<Icon icon="mdi:pencil" class="text-xs" />
									<span>{result.meta.changes} changes</span>
								</div>
							{/if}
						</div>
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<Icon icon="mdi:database-off" class="text-base-content/30 mb-3 h-16 w-16" />
						<p class="text-base-content/70 text-lg">No results found</p>
						<p class="text-base-content/50 text-sm mt-1">The query executed successfully but returned no data</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Error Display -->
	{#if error}
		<div class="alert alert-error shadow-lg">
			<Icon icon="mdi:alert-circle" class="h-6 w-6" />
			<div>
				<h4 class="font-bold">Query Error</h4>
				<div class="text-sm opacity-90">{error}</div>
			</div>
		</div>
	{/if}

	<!-- Loading Overlay -->
	{#if running}
		<div class="fixed inset-0 bg-base-content/10 backdrop-blur-sm flex items-center justify-center z-50">
			<div class="card bg-base-100 shadow-2xl">
				<div class="card-body items-center text-center">
					<div class="loading loading-spinner loading-lg text-primary"></div>
					<p class="text-base-content/70 mt-2">Processing query...</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<div id="bottom"></div>
