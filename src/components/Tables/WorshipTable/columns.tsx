import { supabase } from "@/lib/supabase";

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
} from "@radix-ui/react-dropdown-menu";

import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";

export const columns: ColumnDef<WorshipDTO>[] = [
  {
    accessorKey: "worship_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
          className="p-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: string | undefined = row.getValue("worship_date");

      if (date) {
        const formattedDate = format(new Date(date), `MMMM dd yyyy`);
        return <div className="w-full max-w-64">{formattedDate}</div>;
      }

      return <div className="w-full max-w-64">-</div>;
    },
  },

  {
    accessorKey: "lead",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Lead
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const singers: SingerDTO[] = row.getValue("singers");

      const leadName = singers.map((singer) => {
        if (singer.role === "lead") return singer.name;
      });

      return <div className="w-full max-w-64">{leadName}</div>;
    },
  },

  {
    accessorKey: "music_titles",
    header: () => {
      return <div className="cursor-default p-0">Musics</div>;
    },

    cell: ({ row }) => {
      const musics: string[] = row.getValue("music_titles");

      if (!musics) return <div className="w-full max-w-64">-</div>;

      return (
        <ul className="w-full max-w-64">
          {musics.sort().map((title, id) => (
            <li key={id} className="dark:text-gray-300">
              - {title}
            </li>
          ))}
        </ul>
      );
    },
  },

  {
    accessorKey: "singers",
    header: () => {
      return <div className="w-fit cursor-default p-0">Singers</div>;
    },
    cell: ({ row }) => {
      const singers: SingerDTO[] = row.getValue("singers");

      if (!singers) return <div className="w-full max-w-44">-</div>;

      if (singers.length === 1)
        return (
          <p className="dark:text-gray-300">
            {singers[0].role === "lead" ? "-" : singers[0].name}
          </p>
        );

      return (
        <ul className="w-full max-w-64">
          {singers.sort().map((singer, id) => {
            if (singer.role === "lead") return;
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const worship = row.original;

      async function deleteItem(id: string) {
        try {
          // await supabase.from("music").delete().eq("id", id);
        } catch (error) {
          console.error(error);
        }
      }

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
              onClick={() => deleteItem(worship.id)}
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
