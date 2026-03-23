import livreRepository from "../repositories/livreRepository.js";
import empruntRepository from "../repositories/empruntRepository.js";

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
       const livre = await livreRepository.findById(livreId);
       if (!livre) {
           throw new Error("Livre non trouvé");
       }
       if (livre.disponible) {
           livre.disponible = false;
           await livreRepository.updateLivre(livreId, livre);
           await empruntRepository.createEmprunt({ userId, livreId, dateEmprunt: new Date() });
           return livre;
       } else {
           throw new Error("Livre déjà emprunté");
       }
    }

    async retournerLivre(livreId, userId) {
        const emprunt = await empruntRepository.findByLivreIdAndUserId(livreId, userId);
        if (!emprunt) {
            throw new Error("Emprunt non trouvé pour ce livre et cet utilisateur");
        }
        const livre = await livreRepository.findById(livreId);
        if (!livre) {
            throw new Error("Livre non trouvé");
        }
        if (!livre.disponible) {
            livre.disponible = true;
            await livreRepository.updateLivre(livreId, livre);
            await empruntRepository.updateEmprunt(emprunt.id, { dateRetour: new Date() });
            return livre;
        } else {
            throw new Error("Livre non emprunté");
        }
    }
}

export default new LivreService();