import { supabase } from "@/lib/supabase";

import { format } from "date-fns";
import { WorshipDTO } from "@/dtos";

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
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date: string | undefined = row.getValue("date");

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
      const name = row.getValue("singers");

      const leadName = `${name} $lastName`;
      return <div className="w-full max-w-64">{leadName}</div>;
    },
  },

  {
    accessorKey: "musics",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Musics
        </Button>
      );
    },
    cell: ({ row }) => {
      const musics: string[] = row.getValue("musics");

      if (!musics) return <div className="w-full max-w-64">-</div>;

      return <div className="w-full max-w-64">{musics.join(", ")}</div>;
    },
  },

  {
    accessorKey: "singers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Singers
        </Button>
      );
    },
    cell: ({ row }) => {
      const musics: string[] = row.getValue("singers");

      if (!musics) return <div className="w-full max-w-64">-</div>;

      return <div className="w-full max-w-64">{musics.join(", ")}</div>;
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const worship = row.original;

      async function deleteItem(id: string) {
        try {
          await supabase.from("music").delete().eq("id", id);
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
