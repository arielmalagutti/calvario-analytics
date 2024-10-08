export type Tags =  {
  tags: Array<string | null>;
}

export type MusicDTO =  {
  id: string;
  title: string;
}

export type MusicTagsDTO = MusicDTO & Tags

export type MusicInfoDTO = Omit<MusicTagsDTO, "tags"> & {
  last_played_date: string | null;
  times_played_this_month: number;
  times_played_this_year: number;
}