import * as React from "react";
import { useWorship } from "@/hooks";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components";

import { getColumns } from "./columns";

import { WorshipDTO } from "@/dtos/index";

import { ChevronDown, RotateCw } from "lucide-react";
import { translateColumns } from "@/utils/utils";
import { cn } from "@/lib/utils";

type WorshipTableProps = {
  data: WorshipDTO[];
  userRole: string;
  onRefresh: () => void;
  onDelete: ({ worship_id, worship_date }: WorshipDTO) => void;
  onEdit: (worship: WorshipDTO) => void;
};

export function WorshipTable({
  data,
  userRole,
  onRefresh,
  onEdit,
  onDelete,
}: WorshipTableProps) {
  const { isWorshipLoading: isLoading } = useWorship();

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "worship_date",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const columns = getColumns({ onDelete, onEdit });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility: { ...columnVisibility, actions: userRole === "admin" },
      columnPinning: { left: ["worship_date"] },
    },
  });

  const [isRotateDisabled, setIsRotateDisabled] = React.useState(false);

  const handleRefreshClick = () => {
    if (!isRotateDisabled) {
      onRefresh();
      setIsRotateDisabled(true);
      setTimeout(() => setIsRotateDisabled(false), 3000); // Disable for 3 seconds
    }
  };

  const tableRow = isLoading ? (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        <Loading iconClasses="h-6 w-6" />
      </TableCell>
    </TableRow>
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row">
          <Input
            placeholder={"Filtrar datas: YYYY-MM-DD ou MM-DD..."}
            value={
              (table.getColumn("worship_date")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("worship_date")
                ?.setFilterValue(event.target.value)
            }
            className="sm:max-w-80"
          />

          <Input
            placeholder={"Filtrar ministro..."}
            value={(table.getColumn("lead")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("lead")?.setFilterValue(event.target.value)
            }
            className="sm:max-w-80"
          />
        </div>

        <div className="flex items-center justify-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {translateColumns(column.id)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            className="group"
            onClick={handleRefreshClick}
            disabled={isRotateDisabled}
          >
            <RotateCw className="h-4 w-4 font-medium group-hover:animate-spin-once" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn({
                        "sticky left-0 z-10 bg-background shadow-[-4px_0_4px_-4px_gray_inset] sm:bg-transparent sm:shadow-none":
                          header.column.getIsPinned(),
                      })}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn({
                          "sticky left-0 z-10 bg-background shadow-[-4px_0_4px_-4px_gray_inset] sm:bg-transparent sm:shadow-none":
                            cell.column.getIsPinned(),
                        })}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : tableRow}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} item(s) encontrados
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
