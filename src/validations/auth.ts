import { z } from "astro:schema";

export const signUpSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Email inválido"),
    password: z.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(64, "La contraseña no puede superar 64 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});