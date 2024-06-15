import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { MusicDTO } from "@/dtos/MusicDTO";
import { OrganizationDTO } from "@/dtos/OrganizationDTO";

import { MusicsTable, LoginSheet } from "@/components/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

import { ChevronRight, LoaderCircle } from "lucide-react";

const ORGS: {
  name: OrganizationDTO;
  Icon?: string;
}[] = [
  { name: "jubac", Icon: "" },
  { name: "ibc", Icon: "" },
];

export function Dashboard() {
  const [selectedOrg, setSelectedOrg] = useState("ibc");
  const [musics, setMusics] = useState<MusicDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  let eventCalled = 0;

  function openLogin() {
    if (eventCalled >= 5) setLoginOpen(true);
    eventCalled++;
  }

  async function fetchMusics() {
    try {
      setIsLoading(true);
      const { data } = await supabase.rpc("music_info");
      if (data) setMusics(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
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
          {!isLoading ? (
            <MusicsTable data={musics} onRefresh={fetchMusics} />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <LoaderCircle className="w-14 h-14 text-gray-600 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
