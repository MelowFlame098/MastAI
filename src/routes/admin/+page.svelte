<script lang="ts">
	import DatabaseManager from '$lib/components/DatabaseManager.svelte';
	import UserManager from '$lib/components/UserManager.svelte';

	let activeTab = 'databases';
</script>

<svelte:head>
	<title>Administration - MastAI</title>
</svelte:head>

<div class="container mx-auto p-6">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-2">Administration</h1>
		<p class="text-lg text-gray-600">Manage databases, users, and system settings</p>
	</div>

	<!-- Tab Navigation -->
	<div class="tabs tabs-boxed mb-6">
		<button 
			class="tab {activeTab === 'databases' ? 'tab-active' : ''}"
			on:click={() => activeTab = 'databases'}
		>
			Database Connections
		</button>
		<button 
			class="tab {activeTab === 'users' ? 'tab-active' : ''}"
			on:click={() => activeTab = 'users'}
		>
			User Management
		</button>
		<button 
			class="tab {activeTab === 'settings' ? 'tab-active' : ''}"
			on:click={() => activeTab = 'settings'}
		>
			System Settings
		</button>
		<button 
			class="tab {activeTab === 'info' ? 'tab-active' : ''}"
			on:click={() => activeTab = 'info'}
		>
			System Information
		</button>
	</div>

	<!-- Tab Content -->
	{#if activeTab === 'databases'}
		<div class="space-y-6">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">Database Connections</h2>
					<p class="text-gray-600 mb-4">
						Manage dynamic database connections. Add, edit, or remove database configurations.
					</p>
					<DatabaseManager />
				</div>
			</div>
		</div>
	{:else if activeTab === 'users'}
		<div class="space-y-6">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">User Management</h2>
					<p class="text-gray-600 mb-4">
						Manage user accounts and database access permissions.
					</p>
					<UserManager />
				</div>
			</div>
		</div>
	{:else if activeTab === 'settings'}
		<div class="space-y-6">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">System Settings</h2>
					<div class="alert alert-info">
						<svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>System settings management coming soon!</span>
					</div>
				</div>
			</div>
		</div>
	{:else if activeTab === 'info'}
		<div class="space-y-6">
			<div class="card bg-base-100 shadow-xl">
				<div class="card-body">
					<h2 class="card-title">System Information</h2>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div class="stat">
							<div class="stat-title">Application</div>
							<div class="stat-value text-lg">MastAI</div>
							<div class="stat-desc">Multi-database management system</div>
						</div>
						<div class="stat">
							<div class="stat-title">Version</div>
							<div class="stat-value text-lg">2.0.0</div>
							<div class="stat-desc">With authentication & user isolation</div>
						</div>
						<div class="stat">
							<div class="stat-title">Features</div>
							<div class="stat-value text-lg">Enhanced</div>
							<div class="stat-desc">Dynamic DB management, User auth, Access control</div>
						</div>
						<div class="stat">
							<div class="stat-title">Security</div>
							<div class="stat-value text-lg">Enabled</div>
							<div class="stat-desc">Role-based access control</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>