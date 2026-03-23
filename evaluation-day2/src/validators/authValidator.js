import {z} from 'zod';

export const registerSchema = z.object({
    nom: z.string().min(3, 'Le nom d\'utilisateur doit comporter au moins 3 caractères'),
    email: z.email('adresse mail invalide'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
    confirmPassword: z.string().min(8, 'Le mot de passe de confirmation doit comporter au moins 8 caractères'),
    role: z.enum(['user', 'admin'], 'Rôle invalide, doit être USER ou ADMIN').optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
});

export const loginSchema = z.object({
    email: z.email('adresse mail invalide'),
    password: z.string().min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
});

