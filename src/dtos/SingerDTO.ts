export type SingerDTO = {
  id: string;
  name: string;
  last_name?: string;
  role: SingerRole;
};

type SingerRole = "lead" | "backing";
