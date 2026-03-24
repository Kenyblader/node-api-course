import prisma from '../db/prisma.js';

const refreshTokenRepository = {
    async saveRefreshToken ({token, userId, expiresAt}){
        const refresh = await prisma.refreshToken.create({
            data: {
                token,
                user:{connect: { id: userId}},
                expiresAt
            }
        })

        return refresh;
    },

    async fingByToken (token){
        return await prisma.refreshToken.findUnique({ where:{ token}});
    },

    async delete(token){
        return await prisma.refreshToken.deleteMany({ where: { token } });
    }

}

export default refreshTokenRepository;