import { format } from "date-fns";
import { ControllerRenderProps } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { FormControl } from "./ui/form";

import { WorshipFormType } from "./Forms/WorshipForm";

import { Calendar as CalendarIcon } from "lucide-react";

export function DatePicker({
  field,
}: {
  field: ControllerRenderProps<WorshipFormType, "date">;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal",
              !field.value && "text-muted-foreground",
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onDayClick={field.onChange}
        />
      </PopoverContent>
    </Popover>
  );
}
