import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || './dev.db',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secrtet',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN || 'no origin',
}

const requiredEnvVars = ['PORT', 'DB_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'ALLOWED_ORIGIN', 'JWT_REFRESH_SECRET'];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Environment variable ${varName} is required but not set.`);
    }
});

export default config;