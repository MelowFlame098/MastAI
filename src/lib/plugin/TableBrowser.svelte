<script lang="ts">
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import type { PluginData } from "./type";
	import Icon from "@iconify/svelte";

	export let database: string;
	export let table: string;
	export let data: PluginData;

	const cols =
		data.db
			.find(({ name }) => name === table)
			?.columns.sort(({ cid: a }, { cid: b }) => a - b)
			.map(({ name }) => name) || [];

	let locked = true;
	let offset = 0;
	let limit = 20;
	let order = "";
	let dir: "ASC" | "DESC" = "ASC";
	let select = "*";

	let running = false;
	let result: Record<string, unknown>[] | undefined;
	let error:
		| {
				error: {
					message: string;
					cause?: string;
				};
		  }
		| undefined;

	onMount(() => {
		run();
	});

	async function run() {
		if (running) {
			return;
		}
		running = true;

		try {
			const params = new URLSearchParams();
			params.set("select", `rowid AS _, ${select}`);
			params.set("offset", offset.toString());
			params.set("limit", limit.toString());
			if (order) {
				params.set("order", order);
				params.set("dir", dir);
			}
			const res = await fetch(`/api/db/${database}/${table}/data?${params.toString()}`);

			const json = await res.json<typeof result | typeof error>();
			if (json) {
				if ("error" in json) {
					error = json;
					result = undefined;
				} else {
					result = json;
					error = undefined;
				}
			} else {
				throw new Error($t("plugin.table-browser.no-result"));
			}
		} catch (err) {
			error = {
				error: {
					message:
						err instanceof Error
							? err.message
							: $t("plugin.table-browser.unknown-error"),
				},
			};
			result = undefined;
		} finally {
			running = false;
		}
	}

	function change_sort(col: string) {
		if (order === col) {
			dir = dir === "ASC" ? "DESC" : "ASC";
		} else {
			order = col;
			dir = "ASC";
		}
		run();
	}

	async function remove(rowid: unknown) {
		if (running) {
			return;
		}
		running = true;

		console.log("remove", rowid);

		try {
			if (typeof rowid !== "number") {
				throw new Error($t("plugin.table-browser.invalid-rowid"));
			}

			const res = await fetch(`/api/db/${database}/${table}/data/?rowid=${rowid}`, {
				method: "DELETE",
			});

			const json = await res.json<typeof error>();
			if (json) {
				if ("error" in json) {
					error = json;
				} else {
					error = undefined;
				}
			} else {
				throw new Error($t("plugin.table-browser.no-result"));
			}
		} catch (err) {
			error = {
				error: {
					message:
						err instanceof Error
							? err.message
							: $t("plugin.table-browser.unknown-error"),
				},
			};
			result = undefined;
		} finally {
			running = false;

			const err = error;
			await run();
			error = err;
		}
	}

	async function edit(rowid: unknown, col: string) {
		if (running) {
			return;
		}
		running = true;

		const record = result?.find((r) => r._ === rowid);

		console.log("edit", rowid, col, record);

		try {
			if (typeof rowid !== "number") {
				throw new Error($t("plugin.table-browser.invalid-rowid"));
			}
			if (!record) {
				throw new Error($t("plugin.table-browser.no-record"));
			}
			const res = await fetch(`/api/db/${database}/${table}/data/?rowid=${rowid}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...record,
					_: undefined,
				}),
			});
			const json = await res.json<typeof error>();
			if (json) {
				if ("error" in json) {
					error = json;
				} else {
					error = undefined;
				}
			} else {
				throw new Error($t("plugin.table-browser.no-result"));
			}
		} catch (err) {
			error = {
				error: {
					message:
						err instanceof Error
							? err.message
							: $t("plugin.table-browser.unknown-error"),
				},
			};
			result = undefined;
		} finally {
			running = false;

			const err = error;
			await run();
			error = err;
		}
	}
</script>

<div class="space-y-6">
	<!-- Header Controls -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-4">
			<div class="flex flex-wrap items-center justify-between gap-4">
				<div class="flex items-center gap-4">
					<div class="avatar placeholder">
						<div class="w-10 h-10 bg-gradient-to-r from-info to-primary rounded-lg">
							<svg class="h-5 w-5 text-info-content" fill="currentColor" viewBox="0 0 24 24">
								<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
							</svg>
						</div>
					</div>
					<div>
						<h3 class="text-lg font-semibold text-base-content">Table Browser</h3>
						<p class="text-sm text-base-content/70">Browse and edit table data</p>
					</div>
				</div>
				
				<div class="flex items-center gap-3">
					<!-- Lock/Unlock Toggle -->
					<label class="swap swap-rotate">
						<input type="checkbox" bind:checked={locked} />
						<div class="swap-on flex items-center gap-2 text-success">
							<Icon icon="mdi:lock-outline" class="text-lg" />
							<span class="text-sm font-medium">Locked</span>
						</div>
						<div class="swap-off flex items-center gap-2 text-warning">
							<Icon icon="mdi:lock-open-outline" class="text-lg" />
							<span class="text-sm font-medium">Unlocked</span>
						</div>
					</label>
					
					<!-- Refresh Button -->
					<button
						class="btn btn-sm btn-outline btn-primary gap-2"
						class:loading={running}
						disabled={running}
						on:click={run}
					>
						{#if !running}
							<Icon icon="mdi:refresh" class="text-lg" />
						{/if}
						Refresh
					</button>
				</div>
			</div>
			
			<!-- Pagination Controls -->
			<div class="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-base-300">
				<div class="flex items-center gap-3">
					<label class="label">
						<span class="label-text font-medium">Rows per page:</span>
					</label>
					<select
						class="select select-bordered select-sm w-20"
						bind:value={limit}
						on:change={run}
						disabled={running}
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>
				
				{#if result}
					<div class="flex items-center gap-2">
						<button
							class="btn btn-sm btn-outline"
							disabled={offset === 0 || running}
							on:click={() => {
								offset = 0;
								run();
							}}
						>
							<Icon icon="mdi:chevron-double-left" class="text-lg" />
						</button>
						<button
							class="btn btn-sm btn-outline"
							disabled={offset === 0 || running}
							on:click={() => {
								offset = Math.max(0, offset - limit);
								run();
							}}
						>
							<Icon icon="mdi:chevron-left" class="text-lg" />
						</button>
						
						<div class="badge badge-neutral px-4 py-2">
							{$t("plugin.table-browser.showing", {
								values: {
									from: result.length ? offset + 1 : offset,
									to: offset + result.length,
								},
							})}
						</div>
						
						<button
							class="btn btn-sm btn-outline"
							disabled={!result || result.length < limit || running}
							on:click={() => {
								offset += limit;
								run();
							}}
						>
							<Icon icon="mdi:chevron-right" class="text-lg" />
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<!-- Data Table -->
	{#if result}
		{#if result.length}
			<div class="card bg-base-100 shadow-lg border border-base-300 overflow-hidden">
				<div class="overflow-x-auto max-h-[70vh]">
					<table class="table table-sm table-pin-rows table-pin-cols">
						<thead>
							<tr class="bg-base-200">
								{#each cols as col (col)}
									<th
										class="cursor-pointer hover:bg-base-300 transition-colors duration-200 min-w-[120px]"
										on:click={() => change_sort(col)}
										title={$t("plugin.table-browser.click-to-sort-by", {
											values: { col },
										})}
									>
										<div class="flex items-center justify-between gap-2">
											<span class="font-semibold text-base-content">{col}</span>
											<div class="flex items-center gap-1">
												{#if order === col}
													<div class="badge badge-primary badge-xs">
														{dir === "ASC" ? "↑" : "↓"}
													</div>
												{:else}
													<Icon icon="mdi:sort" class="text-base-content/50 text-sm" />
												{/if}
											</div>
										</div>
									</th>
								{/each}
								<th class="w-16">
									<div class="flex items-center justify-center">
										<Icon icon="mdi:cog" class="text-base-content/50" />
									</div>
								</th>
							</tr>
						</thead>
						<tbody>
							{#each result as row, index (row._)}
								<tr class="hover:bg-base-200/50 group transition-colors duration-200" class:bg-base-100={index % 2 === 0} class:bg-base-50={index % 2 === 1}>
									{#each Object.keys(row) as key (key)}
										{#if key !== "_"}
											<td class="p-2">
												<div class="relative">
													{#if typeof row[key] === "number"}
														<input
															class="input input-ghost input-sm w-full text-sm font-mono hover:input-bordered focus:input-primary transition-all duration-200 disabled:bg-transparent disabled:cursor-not-allowed"
															type="number"
															bind:value={row[key]}
															on:blur={() => edit(row._, key)}
															disabled={locked || running}
															title={locked
																? $t("plugin.table-browser.table-is-locked")
																: "Click to edit"}
														/>
													{:else if typeof row[key] === "string" && row[key].length > 50}
														<div class="tooltip tooltip-top" data-tip={row[key]}>
															<input
																class="input input-ghost input-sm w-full text-sm hover:input-bordered focus:input-primary transition-all duration-200 disabled:bg-transparent disabled:cursor-not-allowed"
																bind:value={row[key]}
																on:change={() => edit(row._, key)}
																disabled={locked || running}
																title={locked
																	? $t("plugin.table-browser.table-is-locked")
																	: "Click to edit"}
															/>
														</div>
													{:else}
														<input
															class="input input-ghost input-sm w-full text-sm hover:input-bordered focus:input-primary transition-all duration-200 disabled:bg-transparent disabled:cursor-not-allowed"
															bind:value={row[key]}
															on:change={() => edit(row._, key)}
															disabled={locked || running}
															title={locked
																? $t("plugin.table-browser.table-is-locked")
																: "Click to edit"}
														/>
													{/if}
												</div>
											</td>
										{/if}
									{/each}
									<td class="p-2">
										<div class="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
											<button
												class="btn btn-sm btn-outline btn-error gap-1 hover:btn-error"
												on:click={() => remove(row._)}
												disabled={locked || running}
												title={locked ? $t("plugin.table-browser.table-is-locked") : "Delete row"}
											>
												<Icon icon="mdi:delete-outline" class="text-sm" />
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{:else}
			<div class="card bg-base-100 shadow-lg border border-base-300">
				<div class="card-body text-center py-12">
					<div class="avatar placeholder mb-4">
						<div class="w-16 h-16 bg-gradient-to-r from-base-300 to-base-400 rounded-lg">
							<Icon icon="mdi:database-off" class="text-2xl text-base-content/50" />
						</div>
					</div>
					<h3 class="text-lg font-semibold text-base-content mb-2">No Data Found</h3>
					<p class="text-base-content/70">
						{$t("plugin.table-browser.no-results")}
					</p>
				</div>
			</div>
		{/if}
	{/if}

	<!-- Error Display -->
	{#if error}
		<div class="alert alert-error shadow-lg">
			<svg class="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z"/>
			</svg>
			<div>
				<h3 class="font-bold">Error Loading Data</h3>
				<div class="text-sm opacity-90">{error.error.cause || error.error.message}</div>
			</div>
		</div>
	{/if}

	<!-- Loading Overlay -->
	{#if running}
		<div class="fixed inset-0 bg-base-content/10 backdrop-blur-sm flex items-center justify-center z-50">
			<div class="card bg-base-100 shadow-2xl">
				<div class="card-body items-center text-center">
					<div class="loading loading-spinner loading-lg text-primary"></div>
					<p class="text-base-content/70 mt-2">Loading data...</p>
				</div>
			</div>
		</div>
	{/if}
</div>
