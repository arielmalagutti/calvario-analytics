export type TagsDTO =  {
  tags: Array<string | null>;
}

export type MusicBodyDTO =  {
  id: string;
  title: string;
}

export type MusicTagsDTO = MusicBodyDTO & TagsDTO

export type MusicDTO =  MusicBodyDTO | MusicTagsDTO

export type MusicInfoDTO = Omit<MusicDTO, "tags"> & {
  last_played_date: string | null;
  times_played_this_month: number;
  times_played_this_year: number;
}