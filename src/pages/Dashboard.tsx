import { useEffect, useState } from "react";
import { ChevronRight, EllipsisVertical, Plus } from "lucide-react";

import { MusicInfoDTO, OrganizationDTO } from "@/dtos";

import { OrgSelection } from "@/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardTable } from "@/components/Tables/DashboardTable";
import { MUSICS_INFO_MOCK } from "@/MOCK_DATA";

export default function Worships() {
  const [musicsInfo, setMusicsInfo] = useState<MusicInfoDTO[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("ibc");
  // const [worshipFormOpen, setWorshipFormOpen] = useState(false);

  async function fetchMusics(p_org: OrganizationDTO) {
    console.log(p_org);
    try {
      // const { data,error } = await supabase.rpc("musics_info", {p_org}).select('*');

      const data = MUSICS_INFO_MOCK;

      // if (error) throw new Error(error.message);

      setMusicsInfo(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMusics(selectedOrg);
  }, [selectedOrg]);

  return (
    <>
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
              DASHBOARD
            </h1>

            <ChevronRight className="h-8 w-8 font-medium text-gray-500" />

            <OrgSelection selectedOrg={selectedOrg} setOrg={setSelectedOrg} />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-zinc-800 dark:text-gray-500 dark:hover:text-gray-300">
              <EllipsisVertical size={24} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {}}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Worship</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Singer</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>Add Music</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {/* {worshipFormOpen && <WorshipForm />} */}

        <DashboardTable
          data={musicsInfo}
          onRefresh={() => fetchMusics(selectedOrg)}
        />
      </div>
    </>
  );
}
