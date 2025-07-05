// src/config/index.ts
import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3030,
    redisHost: process.env.REDIS_HOST || 'redis',
    redisPort: process.env.REDIS_PORT || '6379',
    jwtSecret: process.env.JWT_SECRET || 'your_secret_key', // Tugev salasõna JWT jaoks!
    // Lisada siia MySQL konfiguratsioon
    mysqlHost: process.env.MYSQL_HOST || 'mysql',
    mysqlUser: process.env.MYSQL_USER || 'root',
    mysqlPassword: process.env.MYSQL_ROOT_PASSWORD || 'your_mysql_password',
    mysqlDatabase: process.env.MYSQL_DATABASE || 'taxi_db',

};

