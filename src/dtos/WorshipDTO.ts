import { OrganizationDTO } from "./OrganizationDTO";
import { MusicDTO } from "./MusicDTO";
import { SingerDTO } from "./SingerDTO";

export type WorshipDTO = {
  id: string;
  date: Date;
  
  org: OrganizationDTO;
  lead: string;

  singers: SingerDTO[];
  musics: MusicDTO[]
}