import livreRepository from "../repositories/livreRepository.js";
import prisma from '../db/prisma.js';

class LivreService {
    async getAllLivres(filters = {}) {
        return await livreRepository.findAll(filters);
    }

    async getLivreById(id) {
        return await livreRepository.findById(id);
    }

    async createLivre(data) {
        return await livreRepository.createLivre(data);
    }

    async updateLivre(id, data) {
        return await livreRepository.updateLivre(id, data);
    }

    async deleteLivre(id) {
        return await livreRepository.deleteLivre(id);
    }

    async emprunterLivre(userId, livreId) {
        return await prisma.$transaction(async (tx) => {
            const livre = await tx.livre.findUnique({ where: { id: livreId } });
            if (!livre) throw new Error("Livre non trouvé");
            if (!livre.disponible) throw new Error("Livre déjà emprunté");

            // Créer l'emprunt
            await tx.emprunt.create({
                data: { userId, livreId }
            });

            // Mettre à jour la disponibilité du livre
            await tx.livre.update({
                where: { id: livreId },
                data: { disponible: false }
            });

            return { ...livre, disponible: false };
        });
    }

    async retournerLivre(livreId, userId) {
        return await prisma.$transaction(async (tx) => {
            const emprunt = await tx.emprunt.findFirst({
                where: { livreId, userId, dateRetour: null }
            });
            if (!emprunt) throw new Error("Aucun emprunt actif trouvé");

            // Mettre à jour la date de retour
            await tx.emprunt.update({
                where: { id: emprunt.id },
                data: { dateRetour: new Date() }
            });

            // Remettre le livre comme disponible
            await tx.livre.update({
                where: { id: livreId },
                data: { disponible: true }
            });

            return { message: "Livre retourné" };
        });
    }
}

export default new LivreService();