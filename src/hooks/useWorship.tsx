import { createContext, useContext, useEffect, useState } from "react";

import { OrganizationDTO, WorshipDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { CreateWorshipSchema } from "@/schemas/WorshipSchemas";
import { worshipData } from "@/MOCK_DATA";

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

  async function fetchWorships(organization: OrganizationDTO) {
    try {
      setIsWorshipLoading(true);

      // const { data, error } = await supabase
      //   .rpc("worship_info", { p_org: organization })
      //   .select("*");

      const data = worshipData;

      // if (error) throw new Error(error.message);
      data.forEach((d) => {
        if (d.singers === null) d.singers = [];
        if (d.music_titles === null) d.music_titles = [];
      });
      console.log("mock worship", data);
      setWorships(data as unknown as WorshipDTO[]);
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
