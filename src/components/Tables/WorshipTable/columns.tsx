import { format } from "date-fns";
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

import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";

export const getColumns = ({
  onDelete,
}: {
  onDelete: (worship: WorshipDTO) => void;
}): ColumnDef<WorshipDTO>[] => [
  {
    accessorKey: "worship_date",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>Date</span>
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
        const formattedDate = format(new Date(date), `MMMM dd yyyy`);
        return <div className="w-[8.25rem]">{formattedDate}</div>;
      }

      return <div className="w-[8.25rem]">-</div>;
    },
  },

  {
    accessorKey: "lead.name",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>Lead</span>
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
      const lead: SingerDTO = row.getValue("lead");

      return <div className="w-full max-w-64">{lead ? lead.name : ""}</div>;
    },
  },

  {
    accessorKey: "singers",
    header: "Singers",
    cell: ({ row }) => {
      const singers: SingerDTO[] = row.getValue("singers");

      if (!singers.length) return <div className="w-full max-w-44">-</div>;

      return (
        <ul className="w-full max-w-64">
          {singers.map((singer, id) => {
            return (
              <li key={id} className="dark:text-gray-300">
                - {singer.name}
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    accessorKey: "music_titles",
    header: "Musics",
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onDelete(worship)}
              className="text-red-700 focus:text-red-500 dark:text-red-600"
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
