<script lang="ts">
	import { t } from "svelte-i18n";
	import type { PluginData } from "./type";
	import type { Type } from "../sqlite";
	import { affinity, cast } from "../sqlite";
	import Icon from "@iconify/svelte";

	export let database: string;
	export let table: string;
	export let data: PluginData;

	const cols = data.db
		.find(({ name }) => name === table)
		?.columns.sort(({ cid: a }, { cid: b }) => a - b);

	if (!cols) {
		throw new Error(`Table not found: ${table} in ${database}`);
	}

	const types: Record<string, Type> = Object.fromEntries(
		cols.map(({ name, type }) => [name, affinity(type)]),
	);

	let running = false;
	let result:
		| {
				results: Record<string, unknown>[];
				success: boolean;
				meta: {
					duration: number;
					last_row_id: number;
					changes: number;
					served_by: string;
					internal_stats: null;
				};
		  }
		| undefined;
	let error: string | undefined;

	let files: FileList | undefined;
	let keys: string[] | undefined;
	let casted: any[][] | undefined;
	async function read() {
		if (running) {
			return;
		}
		running = true;

		try {
			const { parse } = await import("csv-parse/browser/esm/sync");
			const file = files?.[0];
			if (!file) {
				return;
			}

			const text = await file.text();
			const rows: Record<string, string>[] = parse(text, {
				columns: true,
				skip_empty_lines: true,
			});

			keys = Object.keys(rows[0]);
			for (const key of keys) {
				if (!types[key]) {
					throw new Error($t("plugin.csv.invalid-column-name-key", { values: { key } }));
				}
			}

			casted = rows.map((row) => {
				return (keys || []).map((key) => {
					const value = row[key];
					const type = types[key];
					return cast(value, type);
				});
			});

			error = undefined;
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				error = err.message;
			}
		} finally {
			running = false;
		}
	}

	async function import_csv() {
		if (running || !casted) {
			return;
		}
		running = true;

		try {
			const bodies = split(casted, 90_000);

			function split(arr: any[][], size: number): string[] {
				const bodies: string[] = [""];
				for (let i = 0; i < arr.length; i++) {
					if (bodies[bodies.length - 1].length >= size) {
						bodies.push("");
					}
					if (bodies[bodies.length - 1].length > 0) {
						bodies[bodies.length - 1] += ", ";
					}
					bodies[bodies.length - 1] +=
						`(${arr[i].map((x) => JSON.stringify(x)).join(", ")})`;
				}
				return bodies;
			}

			const queries = bodies.map(
				(body) => `INSERT INTO ${table} (${keys?.join(", ")}) VALUES ${body}`,
			);

			console.log(queries);
			let r: typeof result = undefined;
			for (const query of queries) {
				const res = await fetch(`/api/db/${database}/all`, {
					method: "POST",
					body: JSON.stringify({ query }),
				});

				const json = await res.json<any>();
				if (json) {
					if ("error" in json) {
						error = json?.error?.cause || json?.error?.message;
						r = undefined;
					} else {
						if (r) {
							r.meta.duration += json.meta.duration;
							r.meta.changes += json.meta.changes;
						} else {
							r = json;
						}
						error = undefined;
						files = undefined;
						keys = undefined;
						casted = undefined;
					}
					result = r;
				} else {
					throw new Error($t("plugin.csv.no-result"));
				}
			}
		} finally {
			running = false;
		}
	}

	async function export_csv() {
		if (running) {
			return;
		}
		running = true;

		try {
			const module = import("csv-stringify/browser/esm/sync");
			const res = await fetch(`/api/db/${database}/${table}/data`);
			const json = await res.json<any>();

			const { stringify } = await module;

			const csv = stringify(json, {
				header: true,
				columns: keys,
			});

			const a = document.createElement("a");
			a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
			a.setAttribute("download", `${table}.csv`);
			a.click();
			URL.revokeObjectURL(a.href);
			a.remove();
		} finally {
			running = false;
		}
	}
</script>

<div class="space-y-6">
	<!-- Import CSV Section -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-6">
			<div class="flex items-center gap-3 mb-4">
				<div class="avatar placeholder">
					<div class="w-10 h-10 bg-gradient-to-r from-success to-info rounded-lg">
						<Icon icon="mdi:file-upload" class="text-success-content text-xl" />
					</div>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-base-content">{$t("plugin.csv.import-csv")}</h3>
					<p class="text-sm text-base-content/70">Upload and import CSV data into {table}</p>
				</div>
			</div>

			<div class="form-control">
				<label class="label" for="csv">
					<span class="label-text font-medium flex items-center gap-2">
						<Icon icon="mdi:file-document" class="text-primary" />
						{$t("plugin.csv.select-a-csv-file")}
					</span>
					<span class="label-text-alt text-base-content/50">.csv files only</span>
				</label>
				<input
					id="csv"
					type="file"
					class="file-input file-input-bordered w-full transition-all duration-200 focus:file-input-primary"
					class:file-input-error={error}
					bind:files
					accept=".csv"
					on:change={read}
					disabled={running}
				/>
				{#if error}
					<label class="label">
						<span class="label-text-alt text-error flex items-center gap-1">
							<Icon icon="mdi:alert" class="text-xs" />
							{error}
						</span>
					</label>
				{/if}
			</div>

			{#if keys && casted?.length}
				<div class="mt-6">
					<div class="flex items-center justify-between mb-3">
						<h4 class="font-semibold flex items-center gap-2">
							<Icon icon="mdi:table-eye" class="text-info" />
							Preview ({casted.length} rows)
						</h4>
						<div class="badge badge-info badge-sm">{keys.length} columns</div>
					</div>
					
					<div class="overflow-x-auto border border-base-300 rounded-lg max-h-[50vh]">
						<table class="table table-sm w-full">
							<thead>
								<tr class="bg-base-200 sticky top-0 z-10">
									{#each keys as key (key)}
										<th class="font-semibold normal-case">{key}</th>
									{/each}
								</tr>
							</thead>
							<tbody>
								{#each casted as row, i (i)}
									<tr class="hover:bg-base-50" class:bg-base-50={i % 2 === 0}>
										{#each row as value, j (j)}
											<td class="text-base-content font-mono text-sm">{value}</td>
										{/each}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<button 
						class="btn btn-success w-full mt-4 gap-2" 
						class:loading={running}
						on:click={import_csv} 
						disabled={running}
					>
						{#if !running}
							<Icon icon="mdi:database-import" class="text-lg" />
						{/if}
						{$t("plugin.csv.import")}
					</button>
				</div>
			{/if}

			{#if result}
				<div class="alert alert-success mt-4">
					<Icon icon="mdi:check-circle" class="h-6 w-6" />
					<div>
						<h4 class="font-bold">Import Successful</h4>
						<div class="text-sm opacity-90">
							Imported {result.meta.changes} records in {result.meta.duration.toFixed(2)}ms
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Export CSV Section -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-6">
			<div class="flex items-center gap-3 mb-4">
				<div class="avatar placeholder">
					<div class="w-10 h-10 bg-gradient-to-r from-warning to-accent rounded-lg">
						<Icon icon="mdi:file-download" class="text-warning-content text-xl" />
					</div>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-base-content">{$t("plugin.csv.export-csv")}</h3>
					<p class="text-sm text-base-content/70">Download table data as CSV file</p>
				</div>
			</div>

			<button 
				class="btn btn-warning w-full gap-2" 
				class:loading={running}
				on:click={export_csv} 
				disabled={running}
			>
				{#if !running}
					<Icon icon="mdi:download" class="text-lg" />
				{/if}
				{$t("plugin.csv.export")}
			</button>
		</div>
	</div>

	<!-- Loading Overlay -->
	{#if running}
		<div class="fixed inset-0 bg-base-content/10 backdrop-blur-sm flex items-center justify-center z-50">
			<div class="card bg-base-100 shadow-2xl">
				<div class="card-body items-center text-center">
					<div class="loading loading-spinner loading-lg text-primary"></div>
					<p class="text-base-content/70 mt-2">Processing CSV...</p>
				</div>
			</div>
		</div>
	{/if}
</div>
