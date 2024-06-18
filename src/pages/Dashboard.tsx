import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { WorshipDTO } from "@/dtos/index";

import { Header, Loading, Select } from "@/components";
import { WorshipTable } from "@/components/Tables/WorshipTable";

import { ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function Dashboard() {
  const { toast } = useToast();

  const [selectedOrg, setSelectedOrg] = useState("ibc");
  const [worships, setWorships] = useState<WorshipDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  async function fetchWorships() {
    try {
      setIsLoading(true);

      const { data } = await supabase
        .rpc("worship_info", { p_org: selectedOrg })
        .select("*");

      if (data) setWorships(data);
    } catch (error) {
      console.error(error);

      toast({
        title: "Error",
        description: "Error fetching data. Try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWorships();
  }, [selectedOrg]);

  return (
    <>
      <Header />

      <div className="flex flex-1 justify-center px-12 py-6">
        <div className="flex w-full max-w-screen-xl flex-1 flex-col gap-6">
          <div className="sticky flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                DASHBOARD
              </h1>

              <ChevronRight className="h-10 w-10 font-medium text-gray-500" />

              <Select selectedOrg={selectedOrg} setOrg={setSelectedOrg} />
            </div>
          </div>

          <div className="flex flex-1">
            {isLoading ? (
              <Loading />
            ) : (
              <WorshipTable data={worships} onRefresh={fetchWorships} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
