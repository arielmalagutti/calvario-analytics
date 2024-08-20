import { useEffect, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

import { OrganizationDTO, WorshipDTO } from "@/dtos";
import { useWorship } from "@/hooks";

import { OrgSelection, WorshipTable } from "@/components";
import { WorshipForm } from "@/components/WorshipForm";
import { Button } from "@/components/ui/button";

export default function Worships() {
  const { fetchWorships, worships } = useWorship();

  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("ibc");
  const [worshipFormOpen, setWorshipFormOpen] = useState(false);
  const [worshipFormData, setWorshipFormData] = useState<
    (WorshipDTO & { formAction: string }) | null
  >(null);

  const onFormClose = () => {
    setWorshipFormData(null);
    setWorshipFormOpen(false);
  };

  const onWorshipEdit = (worship: WorshipDTO) => {
    setWorshipFormData({ ...worship, formAction: "Update" });
    setWorshipFormOpen(true);
  };

  useEffect(() => {
    fetchWorships(selectedOrg);
  }, [selectedOrg]);

  return (
    <>
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
              WORSHIPS
            </h1>

            <ChevronRight className="h-8 w-8 font-medium text-gray-500" />

            <OrgSelection selectedOrg={selectedOrg} setOrg={setSelectedOrg} />
          </div>
          <Button
            className="rounded-lg bg-transparent p-2 transition-colors hover:bg-zinc-800 dark:text-foreground"
            onClick={() => setWorshipFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Worship</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {worshipFormOpen && (
          <WorshipForm
            worship={worshipFormData}
            onClose={onFormClose}
            selectedOrg={selectedOrg}
          />
        )}

        <WorshipTable
          data={worships}
          onEdit={onWorshipEdit}
          onRefresh={() => fetchWorships(selectedOrg)}
        />
      </div>
    </>
  );
}
