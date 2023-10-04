import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signupSchema = z.object({
  name: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInType = z.infer<typeof signinSchema>;
export type SignUpType = z.infer<typeof signupSchema>;
