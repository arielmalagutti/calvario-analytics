import { useEffect, useState } from "react";
import { ChevronRight, Plus } from "lucide-react";

import { OrganizationDTO, WorshipDTO } from "@/dtos";
import { useAuth, useWorship } from "@/hooks";

import { OrgSelection, WorshipTable } from "@/components";
import { WorshipForm } from "@/components/Forms/WorshipForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function Worships() {
  const { toast } = useToast();
  const { fetchWorships, worships } = useWorship();

  const [selectedOrg, setSelectedOrg] = useState<OrganizationDTO>("jubac");
  const [worshipFormOpen, setWorshipFormOpen] = useState(false);
  const [worshipFormData, setWorshipFormData] = useState<
    (WorshipDTO & { formAction: string }) | null
  >(null);

  const { userRole } = useAuth();

  const onFormClose = () => {
    setWorshipFormData(null);
    setWorshipFormOpen(false);
  };

  const onWorshipEdit = (worship: WorshipDTO) => {
    setWorshipFormData({ ...worship, formAction: "Atualizar" });
    setWorshipFormOpen(true);
  };

  const onWorshipDelete = async ({ worship_id, worship_date }: WorshipDTO) => {
    try {
      const { error } = await supabase
        .from("worship")
        .delete()
        .eq("id", worship_id);

      if (error) throw new Error(error.message);

      fetchWorships(selectedOrg);

      toast({
        title: `Louvor do dia ${worship_date} deletado`,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchWorships(selectedOrg);
  }, [selectedOrg]);

  return (
    <div className="flex flex-1 flex-col sm:gap-8">
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
              LOUVORES
            </h1>

            <ChevronRight className="h-8 w-8 font-medium text-gray-500" />

            <OrgSelection selectedOrg={selectedOrg} setOrg={setSelectedOrg} />
          </div>

          {userRole === "admin" ? (
            <Button
              className="ml-auto w-fit rounded-lg border border-input bg-transparent p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={() => setWorshipFormOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Registrar louvor</span>
            </Button>
          ) : null}
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
          userRole={userRole}
          onEdit={onWorshipEdit}
          onDelete={onWorshipDelete}
          onRefresh={() => fetchWorships(selectedOrg)}
        />
      </div>
    </div>
  );
}
