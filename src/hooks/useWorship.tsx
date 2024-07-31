import { createContext, useContext, useState } from "react";

import { OrganizationDTO, SingerDTO, WorshipDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { CreateWorshipSchema } from "@/schemas/WorshipSchemas";
import { worshipDataMock } from "@/MOCK_DATA";

type WorshipContextType = {
  worships: WorshipDTO[];

  fetchWorships: (organization: OrganizationDTO) => void;
  addWorship: (data: CreateWorshipSchema) => void;

  isWorshipLoading: boolean;
};

const WorshipContext = createContext({} as WorshipContextType);

export function WorshipProvider({ children }: { children: React.ReactNode }) {
  const [worships, setWorships] = useState<WorshipDTO[]>([]);

  const [isWorshipLoading, setIsWorshipLoading] = useState(false);

  async function fetchWorships(org: OrganizationDTO) {
    try {
      setIsWorshipLoading(true);

      // const { data, error } = await supabase
      //   .rpc("get_worship_details", { p_org: org })
      //   .select("*");

      const data = worshipDataMock;

      // if (error) throw new Error(error.message);

      const worshipData: WorshipDTO[] = data.map(
        ({ singers, worship_id, worship_date, music_titles }) => {
          if (singers === null) singers = [];

          if (music_titles === null) music_titles = [];

          return {
            worship_id,
            worship_date,
            org,
            lead: singers.find((singer) => singer.role === "lead") as SingerDTO,
            singers: singers
              .filter((singer) => singer.role === "backing")
              .sort((a, b) => a.name.localeCompare(b.name)) as SingerDTO[],
            music_titles,
          };
        },
      );
      console.log("mock worship d", data);
      console.log("mock worship", worshipData);
      setWorships(worshipData);
    } finally {
      setIsWorshipLoading(false);
    }
  }

  async function addWorship({
    date,
    org,
    musics,
    lead_id,
    singers_id,
  }: CreateWorshipSchema): Promise<void> {
    return await supabase
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
        addWorship,

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
