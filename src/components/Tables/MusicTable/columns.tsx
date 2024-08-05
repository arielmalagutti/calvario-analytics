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
import { Badge } from "@/components/ui/badge";

export function getColumns<TData>(): ColumnDef<TData>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <div className="flex cursor-default items-center gap-1">
            <span>Title</span>
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="p-1"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("title")}</div>,
      sortingFn: (rowA, rowB, columnId) => {
        return (rowA.original[columnId] as string).localeCompare(
          rowB.original[columnId] as string,
          "br",
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags: string[] = row.getValue("tags");

        if (tags[0] === null) return <div className="w-full max-w-44">-</div>;

        return (
          <>
            <div className="flex w-full max-w-64 flex-wrap gap-2">
              {tags.map((tag, id) => {
                if (!tag) return "–";

                return (
                  <Badge
                    key={id}
                    variant="outline"
                    className="dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          </>
        );
      },
      filterFn: "arrIncludesAll",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        // const music = row.original;

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
                onClick={() => {}}
                className="text-md flex items-center gap-1 text-red-700 hover:text-red-500 focus:text-red-500 dark:text-red-600"
              >
                <Trash size={16} />
                <span className="mt-[1px]">Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
