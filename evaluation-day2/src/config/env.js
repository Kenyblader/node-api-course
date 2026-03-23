import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL || './dev.db',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
}

const requiredEnvVars = ['PORT', 'DB_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Environment variable ${varName} is required but not set.`);
    }
});

export default config;