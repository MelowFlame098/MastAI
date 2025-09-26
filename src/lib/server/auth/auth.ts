import bcrypt from 'bcryptjs';
import { AuthStore } from './store';
import type { User, Session, AuthenticatedUser, SessionData, LoginRequest, CreateUserRequest } from './types';

export class AuthService {
	/**
	 * Authenticate user with username/email and password
	 */
	static async login(credentials: LoginRequest, userAgent?: string, ipAddress?: string): Promise<SessionData> {
		const { username, password } = credentials;

		// Find user by username or email
		let user = await AuthStore.getUserByUsername(username);
		if (!user) {
			user = await AuthStore.getUserByEmail(username);
		}

		if (!user) {
			throw new Error('Invalid credentials');
		}

		if (!user.is_active) {
			throw new Error('Account is disabled');
		}

		// Verify password
		const isValidPassword = await bcrypt.compare(password, user.password_hash);
		if (!isValidPassword) {
			throw new Error('Invalid credentials');
		}

		// Create session
		const session = await AuthStore.createSession(user.id, userAgent, ipAddress);

		// Return session data
		return {
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
				is_active: user.is_active
			},
			session_id: session.id,
			expires_at: session.expires_at
		};
	}

	/**
	 * Register a new user
	 */
	static async register(userData: CreateUserRequest): Promise<User> {
		// Validate input
		if (!userData.username || userData.username.length < 3) {
			throw new Error('Username must be at least 3 characters long');
		}

		if (!userData.email || !this.isValidEmail(userData.email)) {
			throw new Error('Valid email is required');
		}

		if (!userData.password || userData.password.length < 6) {
			throw new Error('Password must be at least 6 characters long');
		}

		// Create user
		const user = await AuthStore.createUser({
			username: userData.username,
			email: userData.email,
			password: userData.password,
			role: userData.role || 'user'
		});

		return user;
	}

	/**
	 * Validate session token and return user data
	 */
	static async validateSession(token: string): Promise<SessionData | null> {
		if (!token) return null;

		const session = await AuthStore.getSessionByToken(token);
		if (!session) return null;

		const user = await AuthStore.getUserById(session.user_id);
		if (!user || !user.is_active) {
			// Clean up invalid session
			await AuthStore.deleteSession(session.id);
			return null;
		}

		return {
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				role: user.role,
				is_active: user.is_active
			},
			session_id: session.id,
			expires_at: session.expires_at
		};
	}

	/**
	 * Logout user by deleting session
	 */
	static async logout(sessionId: string): Promise<boolean> {
		return await AuthStore.deleteSession(sessionId);
	}

	/**
	 * Logout user from all sessions
	 */
	static async logoutAll(userId: string): Promise<void> {
		await AuthStore.deleteUserSessions(userId);
	}

	/**
	 * Check if user has permission to access a database
	 */
	static async hasPermission(
		userId: string,
		databaseId: string,
		permission: 'read' | 'write' | 'admin'
	): Promise<boolean> {
		return await AuthStore.hasPermission(userId, databaseId, permission);
	}

	/**
	 * Grant database access to user
	 */
	static async grantDatabaseAccess(
		userId: string,
		databaseId: string,
		permission: 'read' | 'write' | 'admin',
		grantedBy: string
	) {
		return await AuthStore.grantDatabaseAccess(userId, databaseId, permission, grantedBy);
	}

	/**
	 * Revoke database access from user
	 */
	static async revokeDatabaseAccess(userId: string, databaseId: string): Promise<boolean> {
		return await AuthStore.revokeDatabaseAccess(userId, databaseId);
	}

	/**
	 * Get user's database access list
	 */
	static async getUserDatabaseAccess(userId: string) {
		return await AuthStore.getUserDatabaseAccess(userId);
	}

	/**
	 * Get all users with access to a database
	 */
	static async getDatabaseUsers(databaseId: string) {
		return await AuthStore.getDatabaseUsers(databaseId);
	}

	/**
	 * Clean up expired sessions
	 */
	static async cleanupExpiredSessions(): Promise<void> {
		await AuthStore.cleanExpiredSessions();
	}

	/**
	 * Validate email format
	 */
	private static isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	/**
	 * Get all users (admin only)
	 */
	static async getAllUsers(): Promise<User[]> {
		return await AuthStore.getAllUsers();
	}

	/**
	 * Get user by ID
	 */
	static async getUserById(id: string): Promise<User | null> {
		return await AuthStore.getUserById(id);
	}

	/**
	 * Update user
	 */
	static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
		return await AuthStore.updateUser(id, updates);
	}

	/**
	 * Delete user
	 */
	static async deleteUser(id: string): Promise<boolean> {
		return await AuthStore.deleteUser(id);
	}
}