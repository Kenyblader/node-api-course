import { Router } from "express";
import livreController from "../controllers/livre.controller.js";
import authenticate from "../middleware/authentificate.js";
import authorize from "../middleware/authorize.js";

const livreRouter = Router();

livreRouter.get('/', livreController.getAllLivres);

livreRouter.get('/:id', livreController.getLivreById);

livreRouter.post('/', authenticate, livreController.createLivre);

livreRouter.put('/:id', authenticate, livreController.updateLivre);

livreRouter.delete('/:id', authenticate, authorize('admin'), livreController.deleteLivre);


livreRouter.post('/:id/emprunter',authenticate, livreController.emprunterLivre);

livreRouter.post('/:id/retourner', authenticate, livreController.retournerLivre);

export default livreRouter;