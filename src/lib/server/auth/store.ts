import type { User, Session, UserDatabaseAccess } from './types';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

// In-memory stores (in production, these would be in a database)
const users = new Map<string, User>();
const sessions = new Map<string, Session>();
const userDatabaseAccess = new Map<string, UserDatabaseAccess>();

// Create default admin user
const defaultAdminId = randomUUID();
const defaultAdmin: User = {
	id: defaultAdminId,
	username: 'admin',
	email: 'admin@localhost',
	password_hash: bcrypt.hashSync('admin123', 10),
	role: 'admin',
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
	is_active: true
};

users.set(defaultAdminId, defaultAdmin);

export class AuthStore {
	// User management
	static async createUser(userData: {
		username: string;
		email: string;
		password: string;
		role?: 'admin' | 'user';
	}): Promise<User> {
		// Check if username or email already exists
		for (const user of users.values()) {
			if (user.username === userData.username) {
				throw new Error('Username already exists');
			}
			if (user.email === userData.email) {
				throw new Error('Email already exists');
			}
		}

		const userId = randomUUID();
		const passwordHash = await bcrypt.hash(userData.password, 10);
		
		const user: User = {
			id: userId,
			username: userData.username,
			email: userData.email,
			password_hash: passwordHash,
			role: userData.role || 'user',
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			is_active: true
		};

		users.set(userId, user);
		return user;
	}

	static async getUserById(id: string): Promise<User | null> {
		return users.get(id) || null;
	}

	static async getUserByUsername(username: string): Promise<User | null> {
		for (const user of users.values()) {
			if (user.username === username) {
				return user;
			}
		}
		return null;
	}

	static async getUserByEmail(email: string): Promise<User | null> {
		for (const user of users.values()) {
			if (user.email === email) {
				return user;
			}
		}
		return null;
	}

	static async getAllUsers(): Promise<User[]> {
		return Array.from(users.values());
	}

	static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
		const user = users.get(id);
		if (!user) return null;

		const updatedUser = {
			...user,
			...updates,
			updated_at: new Date().toISOString()
		};

		users.set(id, updatedUser);
		return updatedUser;
	}

	static async deleteUser(id: string): Promise<boolean> {
		// Don't allow deleting the default admin
		if (id === defaultAdminId) {
			throw new Error('Cannot delete default admin user');
		}

		// Delete user sessions
		for (const [sessionId, session] of sessions.entries()) {
			if (session.user_id === id) {
				sessions.delete(sessionId);
			}
		}

		// Delete user database access
		for (const [accessId, access] of userDatabaseAccess.entries()) {
			if (access.user_id === id) {
				userDatabaseAccess.delete(accessId);
			}
		}

		return users.delete(id);
	}

	// Session management
	static async createSession(userId: string, userAgent?: string, ipAddress?: string): Promise<Session> {
		const sessionId = randomUUID();
		const token = randomUUID();
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

		const session: Session = {
			id: sessionId,
			user_id: userId,
			token,
			expires_at: expiresAt.toISOString(),
			created_at: new Date().toISOString(),
			user_agent: userAgent,
			ip_address: ipAddress
		};

		sessions.set(sessionId, session);
		return session;
	}

	static async getSessionByToken(token: string): Promise<Session | null> {
		for (const session of sessions.values()) {
			if (session.token === token && new Date(session.expires_at) > new Date()) {
				return session;
			}
		}
		return null;
	}

	static async deleteSession(sessionId: string): Promise<boolean> {
		return sessions.delete(sessionId);
	}

	static async deleteUserSessions(userId: string): Promise<void> {
		for (const [sessionId, session] of sessions.entries()) {
			if (session.user_id === userId) {
				sessions.delete(sessionId);
			}
		}
	}

	static async cleanExpiredSessions(): Promise<void> {
		const now = new Date();
		for (const [sessionId, session] of sessions.entries()) {
			if (new Date(session.expires_at) <= now) {
				sessions.delete(sessionId);
			}
		}
	}

	// Database access management
	static async grantDatabaseAccess(
		userId: string,
		databaseId: string,
		permission: 'read' | 'write' | 'admin',
		grantedBy: string
	): Promise<UserDatabaseAccess> {
		// Check if access already exists
		for (const access of userDatabaseAccess.values()) {
			if (access.user_id === userId && access.database_id === databaseId) {
				// Update existing access
				access.permission = permission;
				access.granted_at = new Date().toISOString();
				access.granted_by = grantedBy;
				return access;
			}
		}

		const accessId = randomUUID();
		const access: UserDatabaseAccess = {
			id: accessId,
			user_id: userId,
			database_id: databaseId,
			permission,
			granted_at: new Date().toISOString(),
			granted_by: grantedBy
		};

		userDatabaseAccess.set(accessId, access);
		return access;
	}

	static async revokeDatabaseAccess(userId: string, databaseId: string): Promise<boolean> {
		for (const [accessId, access] of userDatabaseAccess.entries()) {
			if (access.user_id === userId && access.database_id === databaseId) {
				userDatabaseAccess.delete(accessId);
				return true;
			}
		}
		return false;
	}

	static async getUserDatabaseAccess(userId: string): Promise<UserDatabaseAccess[]> {
		const userAccess: UserDatabaseAccess[] = [];
		for (const access of userDatabaseAccess.values()) {
			if (access.user_id === userId) {
				userAccess.push(access);
			}
		}
		return userAccess;
	}

	static async getDatabaseUsers(databaseId: string): Promise<UserDatabaseAccess[]> {
		const databaseUsers: UserDatabaseAccess[] = [];
		for (const access of userDatabaseAccess.values()) {
			if (access.database_id === databaseId) {
				databaseUsers.push(access);
			}
		}
		return databaseUsers;
	}

	static async hasPermission(
		userId: string,
		databaseId: string,
		requiredPermission: 'read' | 'write' | 'admin'
	): Promise<boolean> {
		// Admin users have access to all databases
		const user = await this.getUserById(userId);
		if (user?.role === 'admin') {
			return true;
		}

		// Check specific database access
		for (const access of userDatabaseAccess.values()) {
			if (access.user_id === userId && access.database_id === databaseId) {
				// Permission hierarchy: admin > write > read
				if (access.permission === 'admin') return true;
				if (access.permission === 'write' && requiredPermission !== 'admin') return true;
				if (access.permission === 'read' && requiredPermission === 'read') return true;
			}
		}

		return false;
	}
}