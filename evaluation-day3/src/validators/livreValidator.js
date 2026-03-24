import z from "zod";

export const livreSchema = z.object({
    titre: z.string().min(1, 'Le titre est requis'),
    auteur: z.string().min(2, 'L\'auteur doit comporter au moins 2 caractères'),
    annee: z.number().min(1000, 'L\'année de publication est invalide')
    .max(new Date().getFullYear(), 'L\'année de publication ne peut pas être dans le futur'),
    genre: z.enum(['Fiction', 'Non-Fiction', 'Science', 'Fantasy'], 'Genre invalide').optional(),
    disponible: z.boolean().default(true),
});

export const updateLivreSchema = livreSchema.partial();
