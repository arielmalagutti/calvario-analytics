import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { MusicTagsDTO, OrganizationDTO } from "@/dtos";
import { MusicTable } from "@/components/Tables/MusicTable";
import { MUSICS_TAGS_MOCK } from "@/MOCK_DATA";
import { Button } from "@/components/ui/button";

export default function Musics() {
  const [musics, setMusics] = useState<MusicTagsDTO[]>([]);

  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("ibc");
  const [musicFormOpen, setMusicFormOpen] = useState(false);

  async function fetchMusics(organization: OrganizationDTO) {
    console.log(organization);
    try {
      // const { data } = await supabase.rpc("music_info").select();
      // console.log("dataaa", data);
      // if (data) setMusics(data);
      setMusics(MUSICS_TAGS_MOCK);
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
              MUSICS
            </h1>

            {/**<ChevronRight className="h-8 w-8 font-medium text-gray-500" />

            <OrgSelection selectedOrg={selectedOrg} setOrg={setSelectedOrg} /> */}
          </div>
          <Button
            className="rounded-lg bg-transparent p-2 transition-colors hover:bg-zinc-800 dark:text-foreground"
            onClick={() => setMusicFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Music</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {/* {musicFormOpen && <MusicForm />} */}

        <MusicTable data={musics} onRefresh={() => fetchMusics(selectedOrg)} />
      </div>
    </>
  );
}
