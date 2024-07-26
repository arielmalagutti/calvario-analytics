import { createContext, useContext, useEffect, useState } from "react";

import { OrganizationDTO, WorshipDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { worshipData } from "@/MOCK_DATA";
import { CreateWorshipSchema } from "@/schemas/WorshipSchemas";
import { useAuth } from "./useAuth";

type WorshipContextType = {
  worships: WorshipDTO[];

  fetchWorships: (organization: OrganizationDTO) => void;
  handleWorship: (data: CreateWorshipSchema) => void;

  isWorshipLoading: boolean;
};

const WorshipContext = createContext({} as WorshipContextType);

export function WorshipProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
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

      setWorships(data as unknown as WorshipDTO[]);
    } finally {
      setIsWorshipLoading(false);
    }
  }

  async function handleWorship(data: CreateWorshipSchema) {
    // await supabase.from("worship").insert([data]).select();
  }

  useEffect(() => {
    console.log({ worships });
  }, [worships]);

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
