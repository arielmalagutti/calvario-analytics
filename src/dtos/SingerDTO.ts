export type SingerDTO = {
  id: string;
  name: string;
  lastName?: string;
  role: SingerRole;
};

type SingerRole = "lead" | "backing";
