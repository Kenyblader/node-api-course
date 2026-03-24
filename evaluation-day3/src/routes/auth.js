import { Router } from "express";
import validate from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import AuthController from "../controllers/auth.controller.js";
import authenticate from "../middleware/authentificate.js";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

const authRouter = Router();

const authLimiter = rateLimit({windowMs:15*60*1000, max: 10, message:{error: "trop de requette attendre 15 min"}})

authRouter.post('/login', 
    authLimiter,
    body('email').normalizeEmail(),
    body('texte').trim().escape(),
    validate(loginSchema),
     AuthController.login
);

authRouter.post('/register',
    authLimiter,
    body('email').normalizeEmail(),
    body('texte').trim().escape(),
    validate(registerSchema), 
    AuthController.register
);

authRouter.post('/refresh', AuthController.refresh );

authRouter.post('/logout', AuthController.logout);



authRouter.get('/me', authenticate, AuthController.me);

export default authRouter;
