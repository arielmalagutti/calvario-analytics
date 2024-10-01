import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SingerDTO, WorshipDTO } from "@/dtos";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ArrowUpDown, MoreHorizontal, Pen, Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const getColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (worship: WorshipDTO) => void;
  onEdit: (worship: WorshipDTO) => void;
}): ColumnDef<WorshipDTO>[] => [
  {
    accessorKey: "worship_date",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>Data</span>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const date: string | undefined = row.getValue("worship_date");

      if (date) {
        const formattedDate = format(new Date(date), "dd MMMM yyyy", {
          locale: ptBR,
        });
        return <div className="w-[8.25rem]">{formattedDate}</div>;
      }

      return <div className="w-[8.25rem]">-</div>;
    },
  },

  {
    id: "lead",
    accessorKey: "lead.name",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>Ministro</span>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const lead: SingerDTO = row.original.lead;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{lead.name}</TooltipTrigger>
            <TooltipContent>{`${lead.name}${lead.last_name ? " " + lead.last_name : ""}`}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    accessorKey: "singers",
    header: "Cantores",
    cell: ({ row }) => {
      const singers: SingerDTO[] = row.getValue("singers");

      if (!singers.length) return <div className="w-full max-w-44">-</div>;

      return (
        <ul className="w-full max-w-64">
          {singers.map((singer, id) => {
            return (
              <li key={id} className="text-nowrap dark:text-gray-300">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>- {singer.name}</TooltipTrigger>
                    <TooltipContent>{`${singer.name}${singer.last_name ? " " + singer.last_name : ""}`}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    accessorKey: "music_titles",
    header: "Músicas",
    cell: ({ row }) => {
      const musics: string[] = row.getValue("music_titles");

      if (!musics.length) return <div className="w-full max-w-64">-</div>;

      return (
        <ul className="w-full max-w-64">
          {musics.map((title, id) => (
            <li key={id} className="dark:text-gray-300">
              - {title}
            </li>
          ))}
        </ul>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const worship = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                onEdit(worship);
              }}
              className="text-md flex items-center gap-1"
            >
              <Pen size={16} />
              <span className="mt-[1px]">Editar louvor</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(worship)}
              className="text-md flex items-center gap-1 text-red-700 hover:text-red-500 focus:text-red-500 dark:text-red-600"
            >
              <Trash size={16} />
              <span className="mt-[1px]">Deletar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
