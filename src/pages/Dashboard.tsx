import { useEffect, useState } from "react";
import { ChevronRight, EllipsisVertical } from "lucide-react";

import { OrganizationDTO } from "@/dtos";
import { useAuth, useWorship } from "@/hooks";

import { Header, OrgSelection, WorshipTable } from "@/components";
import { WorshipForm } from "@/components/WorshipForm";

export function Dashboard() {
  const { user } = useAuth();

  const { fetchWorships, worships } = useWorship();

  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("ibc");
  const [worshipFormOpen, setWorshipFormOpen] = useState(false);

  useEffect(() => {
    fetchWorships(selectedOrg);
  }, [fetchWorships, selectedOrg]);

  return (
    <>
      <Header user={user} />

      <div className="flex flex-1 justify-center px-12 py-6">
        <div className="flex w-full max-w-screen-xl flex-1 flex-col gap-6">
          <div className="sticky flex w-full items-center justify-between">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  DASHBOARD
                </h1>

                <ChevronRight className="h-10 w-10 font-medium text-gray-500" />

                <OrgSelection
                  selectedOrg={selectedOrg}
                  setOrg={setSelectedOrg}
                />
              </div>

              <button
                className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-zinc-800 dark:text-gray-500 dark:hover:text-gray-300"
                onClick={() => setWorshipFormOpen((prev) => !prev)}
              >
                <EllipsisVertical size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            {worshipFormOpen && <WorshipForm />}

            <WorshipTable
              data={worships}
              onRefresh={() => fetchWorships(selectedOrg)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
