import { createContext, useContext, useEffect, useState } from "react";

import { OrganizationDTO, WorshipDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";

type WorshipContextType = {
  worships: WorshipDTO[];

  fetchWorships: (organization: OrganizationDTO) => void;

  isWorshipLoading: boolean;
};

const WorshipContext = createContext({} as WorshipContextType);

export function WorshipProvider({ children }: { children: React.ReactNode }) {
  const [worships, setWorships] = useState<WorshipDTO[]>([]);

  const [isWorshipLoading, setIsWorshipLoading] = useState(false);

  async function fetchWorships(organization: OrganizationDTO) {
    try {
      setIsWorshipLoading(true);

      const { data, error } = await supabase
        .rpc("worship_info", { p_org: organization })
        .select("*");

      if (error) throw new Error(error.message);

      setWorships(data);
    } finally {
      setIsWorshipLoading(false);
    }
  }

  useEffect(() => {
    console.log({ worships });
  }, [worships]);

  return (
    <WorshipContext.Provider
      value={{
        worships,

        fetchWorships,

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
