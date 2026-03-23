import userService from "../services/user.service.js";
import { generateToken } from "../utils/jwt.js";

const generateAuthResponse = async (user) => {
    const token = generateToken({ userId: user.id, email: user.email, role: user.role });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
        },
    };
}

const AuthController = {

    async register(req, res, next) {
        try {
            const user = await userService.createUser(req.body);
            const authResponse = await generateAuthResponse(user);
            res.status(201).json(authResponse);
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
                res.status(200).json(authResponse);
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
    }
}

export default AuthController;