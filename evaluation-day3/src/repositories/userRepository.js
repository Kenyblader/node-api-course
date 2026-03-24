import prisma from '../db/prisma.js';

const userRepository = {
    async findByEmail(email) {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    },

    async createUser({ nom, email, password }) {
        const newUser = await prisma.user.create({
            data: {
                nom,
                email,
                password, // Assurez-vous de hasher le mot de passe avant de le stocker
            },
        });
        return newUser;
    },

    async findById(id) {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    }


};

export default userRepository;