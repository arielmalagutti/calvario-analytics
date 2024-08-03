import { z } from "zod";

export const createWorshipSchema = z.object({
  date: z.string(),
  org: z.string(),
  musics: z.array(z.string()),
  lead_id:z.string(),
  singers_id: z.array(z.string()),
});

export type CreateWorshipSchema = z.infer<typeof createWorshipSchema>;