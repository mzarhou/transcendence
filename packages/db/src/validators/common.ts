import { z } from "zod";

export const paginationSchema = z.object({
  skip: z.string().regex(/\d/).transform(Number).optional(),
  take: z.string().regex(/\d/).transform(Number).optional(),
});

export type PaginationType = z.infer<typeof paginationSchema>;
