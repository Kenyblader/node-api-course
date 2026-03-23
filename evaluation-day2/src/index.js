import dotenv from 'dotenv';
import express from 'express';
import config from './config/env.js';
import authRouter from './routes/auth.js';
import livreRouter from './routes/livre.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/livres', livreRouter);
    

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
