import { z } from "zod";

export const SignInSchema = z.object({
    username: z.string().min(1, { message: "Please enter your username" }),
    password: z
        .string()
        .min(1, {
            message: "Please enter your password",
        })
        .min(6, {
            message: "Password must be at least 6 characters long",
        }),
});

export const SignUpSchema = z
    .object({
        username: z.string().min(1, { message: "Please enter your username" }).min(3, { message: "Username must be at least 3 characters long" }).max(20, { message: "Username must be less than 20 characters long" }),
        password: z
            .string()
            .min(1, {
                message: "Please enter your password",
            })
            .min(6, {
                message: "Password must be at least 6 characters long",
            }),
        confirm_password: z.string(),
    })
    .refine((data: SignUpFormValues) => data.password === data.confirm_password, {
        message: "Passwords don't match.",
        path: ["confirm_password"],
    });


export type SignInFormValues = z.infer<typeof SignInSchema>;
export type SignUpFormValues = z.infer<typeof SignUpSchema>;
