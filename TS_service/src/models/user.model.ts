import { getMySQLPool } from "../database";
import mysql from 'mysql2/promise';

interface User {
    id?: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export const userModel = {
    async createUsers(user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
        const pool = getMySQLPool();
        const [result] = await pool.execute<mysql.ResultSetHeader>(
            'INSERT INTO users (username, email, password_hash) VALUES (?,?,?)',
            [user.username, user.email, user.password_hash]
        );
        // Fetch the inserted user to get all fields including created_at and updated_at
        const [rows] = await pool.execute<mysql.RowDataPacket[]>(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [result.insertId]
        );
        return rows[0] as User;
    },

    async getAllUsers(): Promise<User[]> {
        const pool = getMySQLPool();
        const [rows] = await pool.execute<mysql.RowDataPacket[]>('Select * from users');
        return rows as User[];
    },

    async findUserByUsername(username: string): Promise<User | null> {
        const pool = getMySQLPool();
        const [rows] = await pool.execute<mysql.RowDataPacket[]>(
            'SELECT * FROM USERS WHERE username = ? LIMIT 1',
            [username]
        );
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as User
    }
}