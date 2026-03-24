import {z} from 'zod';

export const registerSchema = z.object({
    nom: z.string().min(3, 'Le nom d\'utilisateur doit comporter au moins 3 caractères'),
    email: z.email('adresse mail invalide'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères')
        .regex(/[A-Z]/, 'Doit contenir une majuscule')
        .regex(/[0-9]/, 'Doit contenir un chiffre'),
    role: z.enum(['user', 'admin'], 'Rôle invalide').optional(),
});

export const loginSchema = z.object({
    email: z.email('adresse mail invalide'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
});

