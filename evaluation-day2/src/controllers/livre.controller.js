import livreService from "../services/livre.service.js";

const livreController = {
    async getAllLivres(req, res, next) {
        try {
            const livres = await livreService.getAllLivres(req.query);
            res.status(200).json(livres);
        } catch (error) {
            next(error);
        }
    },

    async getLivreById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const livre = await livreService.getLivreById(id);
            if (livre) {
                res.status(200).json(livre);
            } else {
                res.status(404).json({ message: "Livre non trouvé" });
            }
        } catch (error) {
            next(error);
        }
    },

    async createLivre(req, res, next) {
        try {
            const newLivre = await livreService.createLivre(req.body);
            res.status(201).json(newLivre);
        } catch (error) {
            next(error);
        }
    },

    async updateLivre(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const updatedLivre = await livreService.updateLivre(id, req.body);
            if (updatedLivre) {
                res.status(200).json(updatedLivre);
            } else {
                res.status(404).json({ message: "Livre non trouvé" });
            }
        } catch (error) {
            next(error);
        }
    },

    async deleteLivre(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            await livreService.deleteLivre(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    },

    async emprunterLivre(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.userId; // Assurez-vous que l'ID de l'utilisateur est disponible dans req.user
            const livre = await livreService.emprunterLivre(userId, id);
            res.status(200).json(livre);
        } catch (error) {
            if(error.message === "Livre déjà emprunté") {
                res.status(400).json({ message: error.message });
            } else if(error.message === "Livre non trouvé") {
                res.status(409).json({ message: error.message });
             } 
            else {
                next(error);
            }
        }
    },

    async retournerLivre(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const userId = req.user.userId;
            const livre = await livreService.retournerLivre(id, userId);
            res.status(200).json(livre);
        } catch (error) {
            next(error);
        }
    }
}

export default livreController;