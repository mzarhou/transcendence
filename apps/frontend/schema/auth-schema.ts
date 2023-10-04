import z from "zod";

export const tokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type TokensResponse = z.infer<typeof tokensResponseSchema>;
