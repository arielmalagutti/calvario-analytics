import { OrganizationDTO } from "./OrganizationDTO";
import { SingerDTO } from "./SingerDTO";

export type WorshipDTO = {
  id: string;
  worship_date: Date;
  org: OrganizationDTO;

  lead: string;
  singers: SingerDTO[];
  musics_titles: string[];
};
