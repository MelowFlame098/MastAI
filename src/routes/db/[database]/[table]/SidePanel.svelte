<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { PageData } from "./$types";
	import { fly } from "svelte/transition";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import Icon from "@iconify/svelte";

	export let data: PageData;

	let show = false;

	onMount(() => {
		if (browser) {
			document.addEventListener("mousemove", move);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener("mousemove", move);
		}
	});

	function move(evt: MouseEvent) {
		if (!browser) {
			return;
		}

		if (!show) {
			show = evt.clientX >= window.innerWidth - 16;
		} else {
			show = evt.clientX >= window.innerWidth - 16 * 20;
		}
	}
</script>

{#if show}
	<div
		class="fixed top-0 right-0 z-50 h-full w-96 max-w-[85%] p-3"
		transition:fly={{ x: 100, duration: 200 }}
	>
		<div class="bg-base-100 border border-base-300 h-full overflow-hidden rounded-xl shadow-2xl backdrop-blur-sm">
			<!-- Header -->
			<div class="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300 p-4">
				<div class="flex items-center gap-3">
					<div class="avatar placeholder">
						<div class="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg">
							<Icon icon="mdi:database" class="text-primary-content text-lg" />
						</div>
					</div>
					<div>
						<h3 class="text-lg font-bold text-base-content">Database Schema</h3>
						<p class="text-sm text-base-content/70">{data.db.length} tables</p>
					</div>
				</div>
			</div>

			<!-- Tables List -->
			<div class="h-full overflow-y-auto p-4 space-y-4">
				{#each data.db as table, i (table.name)}
					<div class="card bg-base-50 border border-base-200 hover:border-primary/30 transition-all duration-200">
						<div class="card-body p-4">
							<!-- Table Header -->
							<div class="flex items-center justify-between mb-3">
								<a
									class="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary-focus transition-colors duration-200"
									href={`/db/${encodeURIComponent($page.params.database)}/${encodeURIComponent(table.name)}`}
								>
									<Icon icon="mdi:table" class="text-lg" />
									{table.name}
								</a>
								<div class="badge badge-neutral badge-sm">
									{table.columns.length} cols
								</div>
							</div>

							<!-- Columns List -->
							<div class="space-y-2">
								{#each table.columns as column (column.name)}
									<div class="flex items-center justify-between p-2 rounded-lg bg-base-100 border border-base-200">
										<div class="flex items-center gap-2">
											{#if column.pk}
												<Icon icon="mdi:key" class="text-warning text-sm" title="Primary Key" />
											{:else}
												<Icon icon="mdi:circle-small" class="text-base-content/30 text-sm" />
											{/if}
											<span class="font-medium text-base-content" class:text-warning={column.pk}>
												{column.name}
											</span>
										</div>
										<div class="badge badge-ghost badge-sm font-mono">
											{column.type}
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Footer -->
			<div class="border-t border-base-300 p-3 bg-base-50">
				<div class="flex items-center justify-center gap-2 text-sm text-base-content/60">
					<Icon icon="mdi:gesture-swipe-right" class="text-lg" />
					<span>Move mouse to edge to show/hide</span>
				</div>
			</div>
		</div>
	</div>
{/if}
