import { z } from "zod";

export const createWorshipSchema = z.object({
  date: z.date(),
  org: z.string(),
  musics: z.array(z.string()),
  singers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
    }),
  ),
});

export type CreateWorshipSchema = z.infer<typeof createWorshipSchema>;