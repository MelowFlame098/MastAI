export interface User {
	id: string;
	username: string;
	email: string;
	password_hash: string;
	role: 'admin' | 'user';
	created_at: string;
	updated_at: string;
	is_active: boolean;
}

export interface Session {
	id: string;
	user_id: string;
	token: string;
	expires_at: string;
	created_at: string;
	user_agent?: string;
	ip_address?: string;
}

export interface UserDatabaseAccess {
	id: string;
	user_id: string;
	database_id: string;
	permission: 'read' | 'write' | 'admin';
	granted_at: string;
	granted_by: string;
}

export interface CreateUserRequest {
	username: string;
	email: string;
	password: string;
	role?: 'admin' | 'user';
}

export interface LoginRequest {
	username: string;
	password: string;
}

export interface AuthenticatedUser {
	id: string;
	username: string;
	email: string;
	role: 'admin' | 'user';
	is_active: boolean;
}

export interface SessionData {
	user: AuthenticatedUser;
	session_id: string;
	expires_at: string;
}