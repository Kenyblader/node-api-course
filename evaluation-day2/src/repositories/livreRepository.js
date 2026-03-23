import prisma from '../db/prisma.js';

const livreRepository = {
    async findAll(filters = {}) {
        const where = {};
        if (filters.titre) {
            where.titre = { contains: filters.titre, mode: 'insensitive' };
        }
        if (filters.auteur) {
            where.auteur = { contains: filters.auteur, mode: 'insensitive' };
        }
        if (filters.genre) {
            where.genre = { contains: filters.genre, mode: 'insensitive' };
        }
        if (filters.disponible !== undefined) {
            where.disponible = filters.disponible === 'true';
        }
        const livres = await prisma.livre.findMany({
            where: {
                ...where,
            }
        });
        return livres;
    },

    async findById(id) {
        const livre = await prisma.livre.findUnique({
            where: { id },
        });
        return livre;
    },

    async createLivre({ titre, auteur, annee, genre, disponible }) {
        const newLivre = await prisma.livre.create({
            data: {
                titre,
                auteur,
                annee,
                genre,
                disponible,
            },
        });
        return newLivre;
    },

    async updateLivre(id, { titre, auteur, annee, genre, disponible }) {
        const updatedLivre = await prisma.livre.update({
            where: { id },
            data: {
                titre,
                auteur,
                annee,
                genre,
                disponible,
            },
        });
        return updatedLivre;
    },

    async deleteLivre(id) {
        await prisma.livre.delete({
            where: { id },
        });
    }
};

export default livreRepository;