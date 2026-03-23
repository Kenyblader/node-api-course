import prisma from '../db/prisma.js';

const empruntRepository = {
    async findAll() {
        const emprunts = await prisma.emprunt.findMany({
            include: {
                user: true,
                livre: true,
            },
        });
        return emprunts;
    },

    async findById(id) {
        const emprunt = await prisma.emprunt.findUnique({
            where: { id },
            include: {
                user: true,
                livre: true,
            },
        });
        return emprunt;
    },

    async findByLivreIdAndUserId(livreId, userId) {
        const emprunt = await prisma.emprunt.findFirst({
            where: {
                livreId,
                userId,
                dateRetour: null,
            },
            include: {
                user: true,
                livre: true,
            },
        });
        return emprunt;
    },

    async createEmprunt({ userId, livreId, dateEmprunt }) {
        const newEmprunt = await prisma.emprunt.create({
            data: {
                user: { connect: { id: userId } },
                livre: { connect: { id: livreId } },
                dateEmprunt,
            },
        });
        return newEmprunt;
    },

    async updateEmprunt(id, {  dateRetour }) {
        const updatedEmprunt = await prisma.emprunt.update({
            where: { id },
            data: {
                dateRetour,
            },
        });
        return updatedEmprunt;
    },

    async deleteEmprunt(id) {
        await prisma.emprunt.delete({
            where: { id },
        });
    }
};

export default empruntRepository;