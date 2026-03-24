import dotenv from 'dotenv';
import express from 'express';
import config from './config/env.js';
import authRouter from './routes/auth.js';
import livreRouter from './routes/livre.js';
import helmet from 'helmet';
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(helmet());

app.use(cors({
    origin: config.ALLOWED_ORIGIN.split(',') || (process.env.NODE_ENV === 'developpement'? '*': []),
    credentials: true
}));

app.use(rateLimit({windowMs: 15*60*1000, max: 100, 
    standardHeaders: true,     // Expose X-RateLimit-* dans les headers
    legacyHeaders: false,
    message: { error: 'Trop de requêtes. Réessayez dans 15 minutes.' },}));


app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true, limit: '10kb'}));
app.use(cookieParser());


app.use('/api/auth', authRouter);
app.use('/api/livres', livreRouter);

app.use(morgan(process.env.NODE_ENV === 'production'? 'combined': 'dev'));
app.use(notFound);
app.use(errorHandler);
    

const main = () =>{
        app.listen(config.PORT, () => {
        console.log(`Server is running on port ${config.PORT}`);
    });
}

export default main;


