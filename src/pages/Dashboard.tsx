import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { MusicDTO } from "@/dtos/MusicDTO";
import { OrganizationDTO } from "@/dtos/OrganizationDTO";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { ChevronRight } from "lucide-react";
import { MusicsTable } from "@/components/Table";
import { LoginSheet } from "@/components/LoginSheet";

const ORGS: {
  name: OrganizationDTO;
  Icon?: string;
}[] = [
  { name: "jubac", Icon: "" },
  { name: "ibc", Icon: "" },
];

export function Dashboard() {
  const [musics, setMusics] = useState<MusicDTO[]>([]);
  const [selectedOrg, setSelectedOrg] = useState("ibc");
  const [loginOpen, setLoginOpen] = useState(false);

  let eventCalled = 0;

  function openLogin() {
    if (eventCalled >= 5) setLoginOpen(true);
    eventCalled++;
  }

  async function fetchMusics() {
    try {
      // const { data } = await supabase.from("Music").select();
      const data = [];
      if (data) setMusics(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(musics);
  }, [musics]);

  useEffect(() => {
    fetchMusics();
  }, []);

  return (
    <>
      {loginOpen && <LoginSheet />}
      <div className="max-w-screen-xl w-full flex flex-col justify-center p-12">
        <div className="w-full sticky flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => openLogin()}
              className="
          cursor-default"
            >
              <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                DASHBOARD
              </h1>
            </button>

            <ChevronRight className="w-10 h-10 text-gray-500" />

            <Select
              defaultValue={selectedOrg}
              value={selectedOrg}
              onValueChange={(value) => setSelectedOrg(value)}
            >
              <SelectTrigger className="p-0 gap-2 text-xl font-medium border-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {ORGS.map((org, id) => (
                  <SelectItem
                    key={id}
                    value={org.name}
                    className="font-medium text-gray-500"
                  >
                    {org.Icon && (
                      <img
                        src={org.Icon}
                        alt={`${org.name.toUpperCase()} icon`}
                      />
                    )}
                    {org.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ThemeToggle />
        </div>

        <div className="flex flex-1">
          <MusicsTable />
        </div>
      </div>
    </>
  );
}
