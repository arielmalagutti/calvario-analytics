import { format } from "date-fns";
import { MusicInfoDTO } from "@/dtos";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { ArrowUpDown } from "lucide-react";

export const getColumns = (): ColumnDef<MusicInfoDTO>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>Title</span>
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
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
    sortingFn: (rowA, rowB, columnId) => {
      return (rowA.getValue(columnId) as string).localeCompare(
        rowB.getValue(columnId) as string,
        "br",
      );
    },
  },
  {
    accessorKey: "last_played_date",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>Last Played Date</span>
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
      const lastPlayedDate: string | undefined =
        row.getValue("last_played_date");

      if (lastPlayedDate) {
        const date = new Date(lastPlayedDate);
        const formattedDate = format(date, `MMMM dd yyyy`);
        return <div className="w-full max-w-64">{formattedDate}</div>;
      }

      return <div className="w-full max-w-64">Has not been played yet</div>;
    },
  },
  {
    accessorKey: "times_played_this_month",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>This month</span>
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
      const playedThisMonth: number = row.getValue("times_played_this_month");

      if (!playedThisMonth) return <div className="w-full max-w-64">-</div>;

      return <div className="w-full max-w-64">{playedThisMonth}</div>;
    },
  },
  {
    accessorKey: "times_played_this_year",
    header: ({ column }) => {
      return (
        <div className="flex cursor-default items-center gap-1">
          <span>This year</span>
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
      const playedThisYear: number = row.getValue("times_played_this_year");

      if (!playedThisYear) return <div className="w-full max-w-64">-</div>;

      return <div className="w-full max-w-64">{playedThisYear}</div>;
    },
  },
];
