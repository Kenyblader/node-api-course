import ms from "ms";
import userService from "../services/user.service.js";
import { generateRefreshToken, generateToken, verifyToken } from "../utils/jwt.js";
import config from "../config/env.js";

const generateAuthResponse = async (user) => {
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role });
    console.log('le token est : ', refreshToken,' et', ms(config.JWT_REFRESH_EXPIRES_IN));
    await userService.saveRefreshToken({
        token: refreshToken,
        userId:user.id, 
        expiresAt: new Date(Date.now() + ms(config.JWT_REFRESH_EXPIRES_IN)) 
    });
    return {
        refresh: {
            token: refreshToken,
            expiresAt: ms(config.JWT_REFRESH_EXPIRES_IN)
        }   ,
        data: {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        }
    };
}

const AuthController = {

    async register(req, res, next) {
        try {
            const user = await userService.createUser(req.body);
            const authResponse = await generateAuthResponse(user);
            res.cookie('refreshToken', authResponse.refresh.token,{
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: authResponse.refresh.expiresAt
            });
            res.status(201).json(authResponse.data);
        } catch (error) {
            next(error);
        }
    }, 
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await userService.findUserByEmailAndPassword(email, password);
            if (user) {
                const authResponse = await generateAuthResponse(user);
                res.cookie('refreshToken', authResponse.refresh.token,{
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: authResponse.refresh.expiresAt
                });
                res.status(200).json(authResponse.data);
            } else {
                res.status(401).json({ message: "email ou mot de passe invalide" });
            }
        } catch (error) {
            next(error);
        }
    },

    async me(req, res, next) {
        try {
            const userId = req.user.userId; // Assurez-vous que l'ID de l'utilisateur est disponible dans req.user
            console.log("Fetching user info for userId:", req.user);
            const user = await userService.findUserById(userId);
            if (user) {
                res.status(200).json({ user: { id: user.id, nom: user.nom, email: user.email , role: user.role }, });
            } else {
                res.status(404).json({ message: "Utilisateur non trouvé" });
            }
        } catch (error) {
            next(error);
        }
    },

    async refresh(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) return res.status(401).json({ error: 'Refresh token manquant' });

          
            const stored = await userService.findByToken(refreshToken);
            if (!stored || stored.expiresAt < new Date()) {
            return res.status(401).json({ error: 'Refresh token invalide ou expiré' });
            }

           console.log("le refresh token", refreshToken);
            const payload = verifyToken({token:refreshToken, secret: config.JWT_REFRESH_SECRET});
            console.log("le payload: ", payload)

            const accessToken = generateToken({ userId: payload.userId, email: payload.email, role: payload.role });
            res.json({ accessToken });
        } catch (err) {
            next(err);
        }
    },

    async logout(req, res, next) {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (refreshToken) {
                await userService.delete(refreshToken);
            }
            res.clearCookie('refreshToken');
            res.json({ message: 'Déconnecté' });
        } catch (error) {
            next(error)
        }
    }
}

export default AuthController;