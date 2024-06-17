import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { WorshipDTO } from "@/dtos/index";

import { Header, Loading, LoginSheet, Select } from "@/components";
import { WorshipTable } from "@/components/Tables/WorshipTable";

import { ChevronRight } from "lucide-react";

export function Dashboard() {
  const [selectedOrg, setSelectedOrg] = useState("ibc");
  const [worships, setWorships] = useState<WorshipDTO[]>([]);

  const [eventCalled, setEventCalled] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  function openLogin() {
    if (eventCalled >= 5) setLoginOpen(true);
    setEventCalled((prev) => prev + 1);
  }

  async function fetchWorships() {
    try {
      setIsLoading(true);

      const { data } = await supabase
        .rpc("worship_info", { org: selectedOrg })
        .select();
      console.log(data);
      if (data) setWorships(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWorships();
  }, []);

  return (
    <>
      <Header />

      <div className="flex flex-1 justify-center">
        <div className="flex w-full max-w-screen-xl flex-1 flex-col gap-6">
          <div className="sticky flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => openLogin()} className="cursor-default">
                <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  DASHBOARD
                </h1>
              </button>

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

      {loginOpen && <LoginSheet />}
    </>
  );
}
