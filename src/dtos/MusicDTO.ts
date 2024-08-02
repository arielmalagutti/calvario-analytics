export type MusicDTO = {
  id: string;
  title: string,
}

export type MusicInfoDTO = MusicDTO & {
  last_played_date: string|null;
  times_played_this_month: number;
  times_played_this_year: number;
}
