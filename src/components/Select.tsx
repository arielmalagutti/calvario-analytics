import { OrganizationDTO } from "@/dtos";

import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectProps = {
  selectedOrg: string;
  setOrg: (value: string) => void;
};

const ORGS: {
  name: OrganizationDTO;
  Icon?: string;
}[] = [
  { name: "jubac", Icon: "" },
  { name: "ibc", Icon: "" },
];

export function Select({ selectedOrg, setOrg }: SelectProps) {
  return (
    <ShadSelect
      defaultValue={selectedOrg}
      value={selectedOrg}
      onValueChange={(value) => setOrg(value)}
    >
      <SelectTrigger className="gap-2 border-none p-0 text-xl font-medium">
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
              <img src={org.Icon} alt={`${org.name.toUpperCase()} icon`} />
            )}
            {org.name.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </ShadSelect>
  );
}
