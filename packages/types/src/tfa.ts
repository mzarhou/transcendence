import z from "zod";

export const enable2faSchema = z.object({
  tfaCode: z.string().regex(/\d{6}/),
});

export type Enable2faType = z.infer<typeof enable2faSchema>;
