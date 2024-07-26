import { supabase } from "@/lib/supabase";

import { format } from "date-fns";
import { MusicInfoDTO } from "@/dtos";

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

export const columns: ColumnDef<MusicInfoDTO>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Music
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("title")}</div>
    ),
  },
  {
    accessorKey: "last_played_date",
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
      const lastPlayedDate: string | undefined =
        row.getValue("last_played_date");

      if (lastPlayedDate) {
        const date = new Date(lastPlayedDate);
        const formattedDate = format(date, `MMMM dd yyyy`);
        return <div className="w-full max-w-64">{formattedDate}</div>;
      }

      return <div className="w-full max-w-64">-</div>;
    },
  },
  {
    accessorKey: "times_played_this_month",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          This month
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const playedThisMonth: number | undefined = row.getValue(
        "times_played_this_month",
      );

      if (!playedThisMonth) return <div className="w-full max-w-64">-</div>;

      return <div className="w-full max-w-64">{playedThisMonth}</div>;
    },
  },
  {
    accessorKey: "times_played_this_month",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          This year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const playedThisYear: number | undefined = row.getValue(
        "times_played_this_month",
      );

      if (!playedThisYear) return <div className="w-full max-w-64">-</div>;

      return <div className="w-full max-w-64">{playedThisYear}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const music = row.original;

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
              onClick={() => deleteItem(music.id)}
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
