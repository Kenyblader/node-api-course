import { Router } from "express";
import validate from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authValidator.js";
import AuthController from "../controllers/auth.controller.js";
import authenticate from "../middleware/authentificate.js";

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), AuthController.login);

authRouter.post('/register', validate(registerSchema), AuthController.register);

authRouter.post('/logout', (req, res, next) => {
    // Handle logout
});

authRouter.get('/me', authenticate, AuthController.me);

export default authRouter;
