<script lang="ts">
	import { onMount } from 'svelte';

	interface User {
		id: string;
		username: string;
		email: string;
		role: 'admin' | 'user';
		active: boolean;
		created_at: string;
	}

	interface DatabaseAccess {
		user_id: string;
		database_id: string;
		permission: 'read' | 'write' | 'admin';
		granted_at: string;
	}

	let users: User[] = [];
	let selectedUser: User | null = null;
	let userAccess: DatabaseAccess[] = [];
	let loading = false;
	let error = '';
	let success = '';

	// Form data for new user
	let newUser = {
		username: '',
		email: '',
		password: '',
		role: 'user' as 'admin' | 'user'
	};

	// Form data for granting access
	let accessForm = {
		databaseId: '',
		permission: 'read' as 'read' | 'write' | 'admin'
	};

	onMount(() => {
		loadUsers();
	});

	async function loadUsers() {
		try {
			loading = true;
			const response = await fetch('/api/auth/users');
			const data = await response.json();
			
			if (response.ok) {
				users = data.users;
			} else {
				error = data.error || 'Failed to load users';
			}
		} catch (err) {
			error = 'Failed to load users';
		} finally {
			loading = false;
		}
	}

	async function createUser() {
		try {
			loading = true;
			error = '';
			success = '';

			const response = await fetch('/api/auth/users', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newUser)
			});

			const data = await response.json();

			if (response.ok) {
				success = 'User created successfully';
				newUser = { username: '', email: '', password: '', role: 'user' };
				await loadUsers();
			} else {
				error = data.error || 'Failed to create user';
			}
		} catch (err) {
			error = 'Failed to create user';
		} finally {
			loading = false;
		}
	}

	async function deleteUser(userId: string) {
		if (!confirm('Are you sure you want to delete this user?')) return;

		try {
			loading = true;
			const response = await fetch(`/api/auth/users/${userId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				success = 'User deleted successfully';
				await loadUsers();
				if (selectedUser?.id === userId) {
					selectedUser = null;
					userAccess = [];
				}
			} else {
				const data = await response.json();
				error = data.error || 'Failed to delete user';
			}
		} catch (err) {
			error = 'Failed to delete user';
		} finally {
			loading = false;
		}
	}

	async function toggleUserStatus(user: User) {
		try {
			loading = true;
			const response = await fetch(`/api/auth/users/${user.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ active: !user.active })
			});

			if (response.ok) {
				success = `User ${user.active ? 'deactivated' : 'activated'} successfully`;
				await loadUsers();
			} else {
				const data = await response.json();
				error = data.error || 'Failed to update user';
			}
		} catch (err) {
			error = 'Failed to update user';
		} finally {
			loading = false;
		}
	}

	async function loadUserAccess(user: User) {
		try {
			selectedUser = user;
			const response = await fetch(`/api/auth/access?userId=${user.id}`);
			const data = await response.json();
			
			if (response.ok) {
				userAccess = data.access;
			} else {
				error = data.error || 'Failed to load user access';
			}
		} catch (err) {
			error = 'Failed to load user access';
		}
	}

	async function grantAccess() {
		if (!selectedUser) return;

		try {
			loading = true;
			const response = await fetch('/api/auth/access', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: selectedUser.id,
					databaseId: accessForm.databaseId,
					permission: accessForm.permission
				})
			});

			if (response.ok) {
				success = 'Access granted successfully';
				accessForm = { databaseId: '', permission: 'read' };
				await loadUserAccess(selectedUser);
			} else {
				const data = await response.json();
				error = data.error || 'Failed to grant access';
			}
		} catch (err) {
			error = 'Failed to grant access';
		} finally {
			loading = false;
		}
	}

	async function revokeAccess(databaseId: string) {
		if (!selectedUser) return;

		try {
			loading = true;
			const response = await fetch('/api/auth/access', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: selectedUser.id,
					databaseId
				})
			});

			if (response.ok) {
				success = 'Access revoked successfully';
				await loadUserAccess(selectedUser);
			} else {
				const data = await response.json();
				error = data.error || 'Failed to revoke access';
			}
		} catch (err) {
			error = 'Failed to revoke access';
		} finally {
			loading = false;
		}
	}
</script>

<div class="space-y-6">
	<!-- Error/Success Messages -->
	{#if error}
		<div class="alert alert-error">
			<svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{error}</span>
		</div>
	{/if}

	{#if success}
		<div class="alert alert-success">
			<svg class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{success}</span>
		</div>
	{/if}

	<!-- Create New User -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title">Create New User</h3>
			<form on:submit|preventDefault={createUser} class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="form-control">
						<label class="label" for="username">
							<span class="label-text">Username</span>
						</label>
						<input
							id="username"
							type="text"
							bind:value={newUser.username}
							class="input input-bordered"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label" for="email">
							<span class="label-text">Email</span>
						</label>
						<input
							id="email"
							type="email"
							bind:value={newUser.email}
							class="input input-bordered"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<input
							id="password"
							type="password"
							bind:value={newUser.password}
							class="input input-bordered"
							required
						/>
					</div>
					<div class="form-control">
						<label class="label" for="role">
							<span class="label-text">Role</span>
						</label>
						<select id="role" bind:value={newUser.role} class="select select-bordered">
							<option value="user">User</option>
							<option value="admin">Admin</option>
						</select>
					</div>
				</div>
				<button type="submit" class="btn btn-primary" disabled={loading}>
					{loading ? 'Creating...' : 'Create User'}
				</button>
			</form>
		</div>
	</div>

	<!-- Users List -->
	<div class="card bg-base-100 shadow-xl">
		<div class="card-body">
			<h3 class="card-title">Users</h3>
			{#if loading && users.length === 0}
				<div class="flex justify-center">
					<span class="loading loading-spinner loading-lg"></span>
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="table">
						<thead>
							<tr>
								<th>Username</th>
								<th>Email</th>
								<th>Role</th>
								<th>Status</th>
								<th>Created</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each users as user}
								<tr>
									<td>{user.username}</td>
									<td>{user.email}</td>
									<td>
										<div class="badge {user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}">
											{user.role}
										</div>
									</td>
									<td>
										<div class="badge {user.active ? 'badge-success' : 'badge-error'}">
											{user.active ? 'Active' : 'Inactive'}
										</div>
									</td>
									<td>{new Date(user.created_at).toLocaleDateString()}</td>
									<td>
										<div class="flex gap-2">
											<button
												class="btn btn-sm btn-info"
												on:click={() => loadUserAccess(user)}
											>
												Manage Access
											</button>
											<button
												class="btn btn-sm {user.active ? 'btn-warning' : 'btn-success'}"
												on:click={() => toggleUserStatus(user)}
											>
												{user.active ? 'Deactivate' : 'Activate'}
											</button>
											<button
												class="btn btn-sm btn-error"
												on:click={() => deleteUser(user.id)}
											>
												Delete
											</button>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>

	<!-- User Access Management -->
	{#if selectedUser}
		<div class="card bg-base-100 shadow-xl">
			<div class="card-body">
				<h3 class="card-title">Database Access for {selectedUser.username}</h3>
				
				<!-- Grant New Access -->
				<div class="mb-4">
					<h4 class="text-lg font-semibold mb-2">Grant Database Access</h4>
					<form on:submit|preventDefault={grantAccess} class="flex gap-4 items-end">
						<div class="form-control">
							<label class="label" for="databaseId">
								<span class="label-text">Database ID</span>
							</label>
							<input
								id="databaseId"
								type="text"
								bind:value={accessForm.databaseId}
								class="input input-bordered"
								placeholder="Enter database ID"
								required
							/>
						</div>
						<div class="form-control">
							<label class="label" for="permission">
								<span class="label-text">Permission</span>
							</label>
							<select id="permission" bind:value={accessForm.permission} class="select select-bordered">
								<option value="read">Read</option>
								<option value="write">Write</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<button type="submit" class="btn btn-primary" disabled={loading}>
							Grant Access
						</button>
					</form>
				</div>

				<!-- Current Access -->
				<div>
					<h4 class="text-lg font-semibold mb-2">Current Access</h4>
					{#if userAccess.length === 0}
						<p class="text-gray-500">No database access granted</p>
					{:else}
						<div class="overflow-x-auto">
							<table class="table table-sm">
								<thead>
									<tr>
										<th>Database ID</th>
										<th>Permission</th>
										<th>Granted At</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each userAccess as access}
										<tr>
											<td>{access.database_id}</td>
											<td>
												<div class="badge badge-outline">
													{access.permission}
												</div>
											</td>
											<td>{new Date(access.granted_at).toLocaleDateString()}</td>
											<td>
												<button
													class="btn btn-sm btn-error"
													on:click={() => revokeAccess(access.database_id)}
												>
													Revoke
												</button>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>