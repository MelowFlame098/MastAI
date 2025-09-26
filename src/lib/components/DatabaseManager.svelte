<script lang="ts">
	import { onMount } from "svelte";
	import { t } from "svelte-i18n";
	import type { DatabaseConfig } from "$lib/server/db/config";

	export let onDatabaseAdded: (database: DatabaseConfig) => void = () => {};

	let databases: DatabaseConfig[] = [];
	let loading = false;
	let error = "";
	let showAddForm = false;
	let editingDatabase: DatabaseConfig | null = null;

	// Form data
	let formData = {
		name: "",
		description: "",
		connectionString: "",
		apiToken: "",
		accountId: "",
		databaseId: "",
		isActive: true
	};

	onMount(() => {
		loadDatabases();
	});

	async function loadDatabases() {
		loading = true;
		error = "";
		try {
			const response = await fetch("/api/databases");
			const data = await response.json();
			if (data.success) {
				databases = data.databases;
			} else {
				error = "Failed to load databases";
			}
		} catch (err) {
			error = "Failed to connect to server";
			console.error("Load databases error:", err);
		} finally {
			loading = false;
		}
	}

	async function addDatabase() {
		if (!formData.name.trim()) {
			error = "Database name is required";
			return;
		}

		loading = true;
		error = "";
		try {
			const response = await fetch("/api/databases", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData)
			});
			
			const data = await response.json();
			if (data.success) {
				databases = [...databases, data.database];
				onDatabaseAdded(data.database);
				resetForm();
				showAddForm = false;
			} else {
				error = data.error || "Failed to add database";
			}
		} catch (err) {
			error = "Failed to add database";
			console.error("Add database error:", err);
		} finally {
			loading = false;
		}
	}

	async function updateDatabase() {
		if (!editingDatabase) return;

		loading = true;
		error = "";
		try {
			const response = await fetch(`/api/databases?id=${editingDatabase.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData)
			});
			
			const data = await response.json();
			if (data.success) {
				databases = databases.map(db => 
					db.id === editingDatabase!.id ? data.database : db
				);
				editingDatabase = null;
				resetForm();
			} else {
				error = data.error || "Failed to update database";
			}
		} catch (err) {
			error = "Failed to update database";
			console.error("Update database error:", err);
		} finally {
			loading = false;
		}
	}

	async function removeDatabase(id: string) {
		if (!confirm("Are you sure you want to remove this database connection?")) {
			return;
		}

		loading = true;
		error = "";
		try {
			const response = await fetch(`/api/databases?id=${id}`, {
				method: "DELETE"
			});
			
			const data = await response.json();
			if (data.success) {
				databases = databases.filter(db => db.id !== id);
			} else {
				error = data.error || "Failed to remove database";
			}
		} catch (err) {
			error = "Failed to remove database";
			console.error("Remove database error:", err);
		} finally {
			loading = false;
		}
	}

	async function testConnection(database: DatabaseConfig) {
		loading = true;
		error = "";
		try {
			const response = await fetch("/api/databases/test", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: database.id })
			});
			
			const data = await response.json();
			if (data.success) {
				alert(`Connection to "${database.name}" successful!`);
			} else {
				alert(`Connection failed: ${data.error}`);
			}
		} catch (err) {
			alert("Failed to test connection");
			console.error("Test connection error:", err);
		} finally {
			loading = false;
		}
	}

	function startEdit(database: DatabaseConfig) {
		editingDatabase = database;
		formData = {
			name: database.name,
			description: database.description || "",
			connectionString: database.connectionString || "",
			apiToken: database.apiToken || "",
			accountId: database.accountId || "",
			databaseId: database.databaseId || "",
			isActive: database.isActive
		};
		showAddForm = true;
	}

	function resetForm() {
		formData = {
			name: "",
			description: "",
			connectionString: "",
			apiToken: "",
			accountId: "",
			databaseId: "",
			isActive: true
		};
		editingDatabase = null;
	}

	function cancelEdit() {
		showAddForm = false;
		resetForm();
	}
</script>

<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<div class="flex items-center justify-between mb-6">
			<h2 class="card-title text-2xl">
				<svg class="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
					<path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
				</svg>
				Database Connections
			</h2>
			<button 
				class="btn btn-primary gap-2" 
				on:click={() => showAddForm = true}
				disabled={loading}
			>
				<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
				</svg>
				Add Database
			</button>
		</div>

		{#if error}
			<div class="alert alert-error mb-4">
				<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
				</svg>
				{error}
			</div>
		{/if}

		{#if loading}
			<div class="flex justify-center py-8">
				<span class="loading loading-spinner loading-lg text-primary"></span>
			</div>
		{/if}

		<!-- Add/Edit Form -->
		{#if showAddForm}
			<div class="card bg-base-200 mb-6">
				<div class="card-body">
					<h3 class="card-title text-lg mb-4">
						{editingDatabase ? 'Edit Database' : 'Add New Database'}
					</h3>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="form-control">
							<label class="label" for="db-name">
								<span class="label-text font-medium">Database Name *</span>
							</label>
							<input 
								id="db-name"
								type="text" 
								class="input input-bordered" 
								bind:value={formData.name}
								placeholder="Enter database name"
								required
							/>
						</div>

						<div class="form-control">
							<label class="label" for="db-description">
								<span class="label-text font-medium">Description</span>
							</label>
							<input 
								id="db-description"
								type="text" 
								class="input input-bordered" 
								bind:value={formData.description}
								placeholder="Optional description"
							/>
						</div>

						<div class="form-control">
							<label class="label" for="db-account-id">
								<span class="label-text font-medium">Account ID</span>
							</label>
							<input 
								id="db-account-id"
								type="text" 
								class="input input-bordered" 
								bind:value={formData.accountId}
								placeholder="Cloudflare Account ID"
							/>
						</div>

						<div class="form-control">
							<label class="label" for="db-database-id">
								<span class="label-text font-medium">Database ID</span>
							</label>
							<input 
								id="db-database-id"
								type="text" 
								class="input input-bordered" 
								bind:value={formData.databaseId}
								placeholder="D1 Database ID"
							/>
						</div>

						<div class="form-control md:col-span-2">
							<label class="label" for="db-api-token">
								<span class="label-text font-medium">API Token</span>
							</label>
							<input 
								id="db-api-token"
								type="password" 
								class="input input-bordered" 
								bind:value={formData.apiToken}
								placeholder="Cloudflare API Token"
							/>
						</div>

						<div class="form-control md:col-span-2">
							<label class="label" for="db-connection-string">
								<span class="label-text font-medium">Connection String</span>
							</label>
							<input 
								id="db-connection-string"
								type="text" 
								class="input input-bordered" 
								bind:value={formData.connectionString}
								placeholder="Optional connection string"
							/>
						</div>

						<div class="form-control">
							<label class="label cursor-pointer">
								<span class="label-text font-medium">Active</span>
								<input 
									type="checkbox" 
									class="checkbox checkbox-primary" 
									bind:checked={formData.isActive}
								/>
							</label>
						</div>
					</div>

					<div class="card-actions justify-end mt-6">
						<button class="btn btn-ghost" on:click={cancelEdit} disabled={loading}>
							Cancel
						</button>
						<button 
							class="btn btn-primary" 
							on:click={editingDatabase ? updateDatabase : addDatabase}
							disabled={loading || !formData.name.trim()}
						>
							{editingDatabase ? 'Update' : 'Add'} Database
						</button>
					</div>
				</div>
			</div>
		{/if}

		<!-- Database List -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			{#each databases as database (database.id)}
				<div class="card bg-base-200 border border-base-300">
					<div class="card-body">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<h3 class="card-title text-lg">
									{database.name}
									{#if database.isActive}
										<div class="badge badge-success badge-sm">Active</div>
									{:else}
										<div class="badge badge-error badge-sm">Inactive</div>
									{/if}
								</h3>
								{#if database.description}
									<p class="text-base-content/70 text-sm mt-1">{database.description}</p>
								{/if}
								<div class="text-xs text-base-content/50 mt-2">
									Created: {new Date(database.createdAt).toLocaleDateString()}
								</div>
							</div>
						</div>

						<div class="card-actions justify-end mt-4">
							<button 
								class="btn btn-sm btn-outline btn-info gap-1" 
								on:click={() => testConnection(database)}
								disabled={loading}
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
								</svg>
								Test
							</button>
							<button 
								class="btn btn-sm btn-outline gap-1" 
								on:click={() => startEdit(database)}
								disabled={loading}
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
								</svg>
								Edit
							</button>
							<button 
								class="btn btn-sm btn-outline btn-error gap-1" 
								on:click={() => removeDatabase(database.id)}
								disabled={loading}
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
								</svg>
								Remove
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if databases.length === 0 && !loading}
			<div class="text-center py-12">
				<svg class="h-16 w-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
				</svg>
				<h3 class="text-lg font-medium text-base-content/70 mb-2">No databases configured</h3>
				<p class="text-base-content/50 mb-4">Add your first database connection to get started</p>
				<button class="btn btn-primary" on:click={() => showAddForm = true}>
					Add Database
				</button>
			</div>
		{/if}
	</div>
</div>