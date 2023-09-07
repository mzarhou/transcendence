import z from "zod";

export const enable2faSchema = z.object({
  tfaCode: z.string().regex(/^\d{6}$/),
});

export type Enable2faType = z.infer<typeof enable2faSchema>;

export const provide2faCodeDtoSchema = z.object({
  tfaCode: z.string().regex(/^\d{6}$/),
});

export type Provide2faCodeType = z.infer<typeof provide2faCodeDtoSchema>;
