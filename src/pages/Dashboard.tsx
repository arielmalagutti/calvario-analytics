import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks";

import { OrgSelection } from "@/components";
import { DashboardTable } from "@/components/Tables/DashboardTable";

import { MusicInfoDTO, OrganizationDTO } from "@/dtos";

export default function Dashboard() {
  const { userRole } = useAuth();
  const { toast } = useToast();

  const [musicsInfo, setMusicsInfo] = useState<MusicInfoDTO[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("jubac");

  async function fetchMusics(p_org: OrganizationDTO) {
    try {
      const { data, error } = await supabase
        .rpc("musics_info", { p_org })
        .select("*");

      if (error) throw new Error(error.message);

      setMusicsInfo(data);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }

  useEffect(() => {
    fetchMusics(selectedOrg);
  }, [selectedOrg]);

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
              DASHBOARD
            </h1>

            <ChevronRight className="h-8 w-8 font-medium text-gray-500" />

            <OrgSelection selectedOrg={selectedOrg} setOrg={setSelectedOrg} />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        <DashboardTable
          data={musicsInfo}
          userRole={userRole}
          onRefresh={() => fetchMusics(selectedOrg)}
        />
      </div>
    </div>
  );
}
