import { useEffect, useState } from "react";

import { OrganizationDTO } from "@/dtos";
import { useWorship } from "@/hooks";

import { Header, OrgSelection, WorshipTable } from "@/components";

import { ChevronRight } from "lucide-react";

export function Dashboard() {
  const { fetchWorships, worships } = useWorship();

  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("ibc");

  useEffect(() => {
    fetchWorships(selectedOrg);
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

              <OrgSelection selectedOrg={selectedOrg} setOrg={setSelectedOrg} />
            </div>
          </div>

          <div className="flex flex-1">
            {
              <WorshipTable
                data={worships}
                onRefresh={() => fetchWorships(selectedOrg)}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}
