import { createContext, useContext, useState } from "react";

import { OrganizationDTO, SingerDTO, WorshipDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { CreateWorshipSchema } from "@/schemas/WorshipSchemas";
import { WORSHIP_DATA_MOCK } from "@/MOCK_DATA";

type NullablePartial<T> = { [P in keyof T]?: T[P] | null };
type WorshipContextType = {
  worships: WorshipDTO[];
  fetchWorships: (organization: OrganizationDTO) => void;
  handleWorship: (
    data: NullablePartial<CreateWorshipSchema>,
    worship_id?: string,
  ) => Promise<void>;

  isWorshipLoading: boolean;
};

const WorshipContext = createContext({} as WorshipContextType);

export function WorshipProvider({ children }: { children: React.ReactNode }) {
  const [worships, setWorships] = useState<WorshipDTO[]>([]);

  const [isWorshipLoading, setIsWorshipLoading] = useState(false);

  async function fetchWorships(org: OrganizationDTO) {
    try {
      setIsWorshipLoading(true);

      const { data, error } = await supabase
        .rpc("get_worship_details", { p_org: org })
        .select("*");
      //
      // const data = WORSHIP_DATA_MOCK;
      //
      if (error) throw new Error(error.message);

      const worshipData: WorshipDTO[] = data.map(
        ({ singers, worship_id, worship_date, music_titles }) => {
          if (singers === null) singers = [];

          if (music_titles === null) music_titles = [];

          return {
            worship_id,
            worship_date,
            org,
            lead: singers.find(
              (singer: SingerDTO) => singer.role === "lead",
            ) as SingerDTO,
            singers: singers
              .filter((singer: SingerDTO) => singer.role === "backing")
              .sort((a: SingerDTO, b: SingerDTO) =>
                a.name.localeCompare(b.name),
              ) as SingerDTO[],
            music_titles,
          };
        },
      );

      setWorships(worshipData);
    } finally {
      setIsWorshipLoading(false);
    }
  }

  async function handleWorship({
    date,
    org,
    lead_id,
    musics,
    singers_id,
    worship_id,
  }: NullablePartial<CreateWorshipSchema & { worship_id?: string }>) {
    if (!date && !org && !lead_id && !musics && !singers_id)
      throw new Error("Can't update because nothing changed");

    if (worship_id) {
      await supabase
        .rpc("update_worship_session", {
          p_worship_id: worship_id,
          p_timestamp: date,
          p_org: org,
          p_musics_title: musics,
          p_lead_id: lead_id,
          p_singers_id: singers_id,
        })
        .then(({ error }) => {
          if (error) throw new Error(error.message);
        });
      return;
    }

    await supabase
      .rpc("add_worship", {
        p_timestamp: date,
        p_org_name: org,
        p_music_titles: musics,
        p_lead_id: lead_id,
        p_singers_id: singers_id,
      })
      .then(({ error }) => {
        if (error) throw new Error(error.message);
      });
  }

  return (
    <WorshipContext.Provider
      value={{
        worships,
        fetchWorships,
        handleWorship,

        isWorshipLoading,
      }}
    >
      {children}
    </WorshipContext.Provider>
  );
}

export function useWorship() {
  const data = useContext(WorshipContext);

  return data;
}
