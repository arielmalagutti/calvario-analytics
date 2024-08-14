import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Creatable from "@/components/ui/CustomSelect/Creatable";
import { Input } from "@/components/ui/input";

import { MusicTagsDTO, MusicDTO } from "@/dtos";

import {
  ArrowUpDown,
  Check,
  MoreHorizontal,
  Pen,
  Trash,
  X,
} from "lucide-react";
import { TAGS_MOCK } from "@/MOCK_DATA";
import Select from "node_modules/react-select/dist/declarations/src/Select";
import { RefObject } from "react";
import { GroupBase, Options } from "react-select";

type EditingCellType = { rowId: string; column: string; isEditing: boolean };

type MusicTableRowProps = {
  selectedTags: RefObject<Select<unknown, boolean, GroupBase<unknown>>>;
  editingCell: EditingCellType;
  setEditingCell: React.Dispatch<React.SetStateAction<EditingCellType>>;
  updateTitle: (value: MusicDTO) => void;
  updateTags: (value: MusicTagsDTO) => Promise<void>;
  onDelete: (id: string, title: string) => void;
};

export const getColumns = ({
  selectedTags,
  editingCell,
  setEditingCell,
  updateTitle,
  updateTags,
  onDelete,
}: MusicTableRowProps): ColumnDef<MusicTagsDTO>[] => {
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
      cell: ({ row }) => {
        const title: string = row.getValue("title");

        const { rowId, column, isEditing } = editingCell;
        const isEditingTitle =
          rowId === row.id && column === "title" && isEditing;

        return (
          <>
            {isEditingTitle ? (
              <Input
                defaultValue={title}
                onKeyUp={(e) => {
                  if (e.code === "Enter") {
                    updateTitle({
                      id: row.original.id,
                      title: (e.target as HTMLInputElement).value,
                    });
                    setEditingCell({
                      rowId: row.id,
                      column: "title",
                      isEditing: false,
                    });
                  }
                }}
              />
            ) : (
              <div>{title}</div>
            )}
          </>
        );
      },
      sortingFn: (rowA, rowB, columnId) => {
        return (rowA.getValue(columnId) as string).localeCompare(
          rowB.getValue(columnId) as string,
          "br",
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags: string[] = row.getValue("tags");

        const { rowId, column, isEditing } = editingCell;
        const isEditingTags =
          rowId === row.id && column === "tags" && isEditing;

        const musicHasTags = tags[0] !== null;

        const handleOnCLick = async () => {
          const newTags = selectedTags
            .current!.getValue()
            .map((t) => (t as { label: string; value: string }).value);

          await updateTags({
            id: row.original.id,
            title: row.original.title,
            tags: newTags,
          });

          setEditingCell({
            rowId: row.id,
            column: "tags",
            isEditing: false,
          });
        };

        return (
          <>
            {isEditingTags ? (
              <div className="flex items-center gap-2">
                <Creatable
                  ref={selectedTags}
                  isMulti
                  placeholder="Add tags to the music"
                  options={TAGS_MOCK.map((tag) => {
                    return { label: tag.name, value: tag.name };
                  })}
                  defaultValue={
                    musicHasTags
                      ? tags.map((tag: string) => {
                          return { label: tag, value: tag };
                        })
                      : null
                  }
                  onChange={(e) => {
                    if (selectedTags.current)
                      selectedTags.current.state.selectValue =
                        e as Options<unknown>;
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={() =>
                    setEditingCell({
                      rowId: row.id,
                      column: "tags",
                      isEditing: false,
                    })
                  }
                  className="h-fit w-fit bg-transparent p-1 hover:bg-zinc-800"
                >
                  <X size={24} className="text-red-600" />
                </Button>
                <Button
                  onClick={async () => await handleOnCLick()}
                  className="h-fit w-fit bg-transparent p-1 hover:bg-zinc-800"
                >
                  <Check size={24} className="text-green-600" />
                </Button>
              </div>
            ) : musicHasTags ? (
              <div className="flex w-full max-w-64 flex-wrap gap-2">
                {tags.map((tag, id) => {
                  return (
                    <Badge
                      key={id}
                      variant="outline"
                      className="rounded-md border border-transparent bg-secondary px-1.5 py-0.5 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80"
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div className="w-full max-w-44">-</div>
            )}
          </>
        );
      },
      filterFn: "arrIncludesAll",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const music = row.original;

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
                onClick={() =>
                  setEditingCell({
                    rowId: row.id,
                    column: "title",
                    isEditing: true,
                  })
                }
                className="text-md flex items-center gap-1"
              >
                <Pen size={16} />
                <span className="mt-[1px]">Edit title</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setEditingCell({
                    rowId: row.id,
                    column: "tags",
                    isEditing: true,
                  })
                }
                className="text-md flex items-center gap-1"
              >
                <Pen size={16} />
                <span className="mt-[1px]">Edit tags</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(music.id, music.title)}
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
};
