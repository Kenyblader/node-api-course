
import { hash, compare } from '../utils/crypt.js';
import userRepository from '../repositories/userRepository.js';
import refreshTokenRepository from '../repositories/refreshTokenRepository.js';

class UserService {

    async createUser(data) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }
        console.log("Hashing password for user:", data);
        const hashedPassword = await hash(data.password);
        return await userRepository.createUser({ ...data, password: hashedPassword });
    }

    async findUserById(id) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }
        return user;
    }

    async findUserByEmailAndPassword(email, password) {
        const user = await userRepository.findByEmail(email);
        if (user && (await compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async saveRefreshToken({token, userId, expiresAt}){
    
        return await refreshTokenRepository.saveRefreshToken({token, userId, expiresAt});
    }

    async findByToken(token) {
        return await refreshTokenRepository.fingByToken(token);
    }

    async delete(token){
        return await refreshTokenRepository.delete(token);
    }

}

export default new UserService();
