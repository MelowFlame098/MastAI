<script lang="ts">
	import { t } from "svelte-i18n";
	import type { PluginData } from "./type";
	import { z } from "zod";
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

	let record = Object.fromEntries<{ type: string; val: string; err: string; nullable: boolean }>(
		cols.map(({ name, type, dflt_value, notnull }) => [
			name,
			{
				type,
				val: dflt_value ?? "",
				err: type_check(type, dflt_value ?? ""),
				nullable: !!notnull,
			},
		]),
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
	let error:
		| {
				error: {
					message: string;
					cause?: string;
				};
		  }
		| undefined;

	async function add() {
		if (running) {
			return;
		}
		running = true;

		const data = Object.fromEntries(
			Object.entries(record)
				.map(([key, { type, val, nullable }]) => {
					switch (type) {
						case "INTEGER":
							return [key, val ? val : undefined];
						case "TEXT":
							return [key, nullable ? (val ? val : undefined) : val];
						case "REAL":
							return [key, nullable ? (val ? val : undefined) : val];

							return [key, val ? val : undefined];
						default:
							return [key, val];
					}
				})
				.filter(([_, val]) => val !== undefined),
		);

		try {
			const res = await fetch(`/api/db/${database}/${table}/data`, {
				method: "POST",
				body: JSON.stringify(data),
			});

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
				throw new Error($t("plugin.run-query.no-result"));
			}
		} catch (err) {
			error = {
				error: {
					message:
						err instanceof Error ? err.message : $t("plugin.run-query.unknown-error"),
				},
			};
			result = undefined;
		} finally {
			running = false;
		}
	}

	function input_type(type: string): string {
		switch (type) {
			case "INTEGER":
				return "number";
			case "TEXT":
				return "text";
			case "REAL":
				return "number";
			case "BLOB":
				return "file";
			default:
				return "text";
		}
	}

	function type_check(type: string, val: string): string {
		try {
			switch (type) {
				case "INTEGER":
					z.string()
						.regex(/^\d*$/, $t("plugin.add-record.integer-is-required"))
						.parse(val);
					break;
				case "TEXT":
					z.string().parse(val);
					break;
				case "REAL":
					z.string()
						.regex(/^\d*(\.\d+)?$/, $t("plugin.add-record.real-is-required"))
						.parse(val);
					break;
				case "BLOB":
					z.string().parse(val);
					break;
				default:
					z.string().parse(val);
					break;
			}
		} catch (err) {
			if (err instanceof z.ZodError) {
				return err.issues[0].message;
			}
		}
		return "";
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-4">
			<div class="flex items-center gap-3">
				<div class="avatar placeholder">
					<div class="w-10 h-10 bg-gradient-to-r from-success to-info rounded-lg">
						<Icon icon="mdi:plus-circle" class="text-success-content text-xl" />
					</div>
				</div>
				<div>
					<h3 class="text-lg font-semibold text-base-content">Add New Record</h3>
					<p class="text-sm text-base-content/70">Insert a new row into {table}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Form -->
	<div class="card bg-base-100 shadow-lg border border-base-300">
		<div class="card-body p-6">
			<div class="space-y-4">
				{#each cols as col, i (col.name)}
					<div class="form-control">
						<label class="label" for="field-{col.name}">
							<span class="label-text font-medium flex items-center gap-2">
								{#if col.pk}
									<Icon icon="mdi:key" class="text-warning text-sm" title="Primary Key" />
								{:else if !col.notnull}
									<Icon icon="mdi:circle-outline" class="text-base-content/30 text-sm" title="Nullable" />
								{:else}
									<Icon icon="mdi:asterisk" class="text-error text-xs" title="Required" />
								{/if}
								{col.name}
							</span>
							<span class="label-text-alt badge badge-ghost badge-sm font-mono">
								{col.type}
							</span>
						</label>
						
						{#if input_type(col.type) !== "file"}
							<input
								id="field-{col.name}"
								class="input input-bordered w-full transition-all duration-200 focus:input-primary"
								class:input-error={record[col.name].err}
								class:input-success={!record[col.name].err && record[col.name].val}
								type={input_type(col.type)}
								on:input={(e) => {
									const err = type_check(col.type, e.currentTarget.value);
									record[col.name] = {
										type: col.type,
										val: e.currentTarget.value,
										err,
										nullable: !!col.notnull,
									};
								}}
								placeholder={col.dflt_value || `Enter ${col.name}...`}
								disabled={running}
							/>
							{#if record[col.name].err}
								<label class="label">
									<span class="label-text-alt text-error flex items-center gap-1">
										<Icon icon="mdi:alert-circle" class="text-sm" />
										{record[col.name].err}
									</span>
								</label>
							{/if}
						{:else}
							<div class="alert alert-warning">
								<Icon icon="mdi:file-upload" class="h-5 w-5" />
								<span>File upload not supported yet</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Submit Button -->
			<div class="card-actions justify-end mt-6 pt-4 border-t border-base-300">
				<button 
					class="btn btn-primary gap-2 min-w-32"
					class:loading={running}
					on:click={add} 
					disabled={running || Object.values(record).some(r => r.err)}
				>
					{#if !running}
						<Icon icon="mdi:plus" class="text-lg" />
					{/if}
					{$t("plugin.add-record.add")}
				</button>
			</div>
		</div>
	</div>

	<!-- Results -->
	{#if result}
		<div class="alert alert-success shadow-lg">
			<svg class="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
				<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
			</svg>
			<div>
				<h3 class="font-bold">{$t("plugin.add-record.success")}</h3>
				<div class="text-sm opacity-90">
					{$t("plugin.add-record.n-ms", {
						values: {
							n: result.meta.duration.toFixed(2),
						},
					})}
				</div>
			</div>
		</div>
	{:else if error}
		<div class="alert alert-error shadow-lg">
			<svg class="h-6 w-6 shrink-0" fill="currentColor" viewBox="0 0 24 24">
				<path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 16v2h2v-2h-2zm0-6v4h2v-4h-2z"/>
			</svg>
			<div>
				<h3 class="font-bold">{$t("plugin.add-record.error")}</h3>
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
					<p class="text-base-content/70 mt-2">Adding record...</p>
				</div>
			</div>
		</div>
	{/if}
</div>
