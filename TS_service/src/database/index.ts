// src/database/index.ts
import mysql from 'mysql2/promise'; // Kasutame promise-põhist API-t
import { config } from '../config';

let pool: mysql.Pool | null = null;

export const initializeMySQL = async () => {
    try {
        pool = mysql.createPool({
            host: config.mysqlHost,
            user: config.mysqlUser,
            password: config.mysqlPassword,
            database: config.mysqlDatabase,
            waitForConnections: true,
            connectionLimit: 10, // Mitme ühenduse loomine korraga
            queueLimit: 0
        });

        // Testi ühendust
        await pool.getConnection();
        console.log('Successfully connected to MySQL database.');
    } catch (error) {
        console.error('Failed to connect to MySQL database:', error);
        process.exit(1); // Rakenduse sulgemine, kui DB-ga ei saa ühendust
    }
};

// Funktsioon andmebaasi ühenduse saamiseks (kasutatakse DAO-des/mudelites)
export const getMySQLPool = () => {
    if (!pool) {
        throw new Error('MySQL pool has not been initialized. Call initializeMySQL() first.');
    }
    return pool;
};

// Funktsioon andmebaasi ühenduse sulgemiseks graceful shutdown'i käigus
export const closeMySQL = async () => {
    if (pool) {
        await pool.end();
        console.log('MySQL connection pool closed.');
    }
};