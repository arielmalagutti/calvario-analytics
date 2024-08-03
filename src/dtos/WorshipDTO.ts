import { OrganizationDTO } from "./OrganizationDTO";
import { SingerDTO } from "./SingerDTO";

export type WorshipDTO = {
  worship_id: string;
  worship_date: string;
  org: OrganizationDTO;

  lead?: SingerDTO;
  singers: SingerDTO[];
  music_titles: string[];
};
