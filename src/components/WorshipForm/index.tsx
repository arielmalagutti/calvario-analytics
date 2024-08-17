import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";

import { useAuth, useWorship } from "@/hooks";

import { DatePicker } from "@/components";
import { useToast } from "@/components/ui/use-toast";
import Creatable from "@/components/ui/CustomSelect/Creatable";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Selectable from "@/components/ui/CustomSelect/Select";

import { WorshipDTO } from "@/dtos";
import { MUSICS_MOCK, SINGERS_MOCK } from "./mock";
import { X } from "lucide-react";

type NullablePartial<T> = { [P in keyof T]?: T[P] | null };
type dataType = Record<"value" | "label", string>;
export type WorshipFormType = {
  date: Date;
  org: dataType;
  musics: dataType[];
  lead: dataType;
  singers: dataType[];
};

type a = {
  worship: (WorshipDTO & { formAction: string }) | null;
  onClose: () => void;
};

export function WorshipForm({ worship, onClose }: a) {
  const { user } = useAuth();

  const { handleWorship } = useWorship();
  const { toast } = useToast();

  const [musics, setMusics] = useState<{ id: string; title: string }[]>([]);
  const [singers, setSingers] = useState<
    { id: string; name: string; last_name: string | null }[]
  >([]);

  const defaultValues: WorshipFormType = {
    date: worship ? new Date(worship.worship_date) : new Date(),
    org: {
      label: worship?.org.toUpperCase() ?? "",
      value: worship?.org ?? "",
    },
    musics: worship
      ? worship.music_titles.map((music) => {
          return { value: music, label: music };
        })
      : [],
    lead: {
      value: worship?.lead?.id ?? "",
      label: worship?.lead?.name ?? "",
    },
    singers: worship
      ? worship.singers.map((singer) => {
          return { value: singer.id, label: singer.name };
        })
      : [],
  };

  const form = useForm<WorshipFormType>({ values: defaultValues });

  async function fetchMusics() {
    try {
      // const { data, error } = await supabase.from("music").select("*");
      const data = MUSICS_MOCK;

      console.error(data);
      // if (error) throw new Error(error.message);

      setMusics(data);
    } catch (err) {
      console.error("fetchMusics", err);
    }
  }

  async function fetchSingers() {
    try {
      // const { data, error } = await supabase.from("singer").select("*");
      const data = SINGERS_MOCK;

      console.error(data);
      // if (error) throw new Error(error.message);

      setSingers(data);
    } catch (err) {
      console.error("fetchSingers", err);
    }
  }

  const handleForm = async (data: WorshipFormType) => {
    function parseData(
      baseData: WorshipFormType,
      newData: WorshipFormType,
    ): NullablePartial<WorshipFormType> {
      const changedData: NullablePartial<WorshipFormType> = {};

      for (const key of Object.keys(baseData)) {
        const baseValue = baseData[key as keyof WorshipFormType];
        const newValue = newData[key as keyof WorshipFormType];

        if (Array.isArray(baseValue) && Array.isArray(newValue)) {
          const [sortedBaseValue, sortedNewValue] = [baseValue, newValue].map(
            (arr) => [...arr].sort((a, b) => a.value.localeCompare(b.value)),
          );
          //@ts-expect-error vai dar erro ts
          changedData[key as typeof WorshipFormType] =
            JSON.stringify(sortedBaseValue) === JSON.stringify(sortedNewValue)
              ? null
              : newValue;
        } else {
          //@ts-expect-error vai dar erro ts
          changedData[key as keyof WorshipFormType] =
            JSON.stringify(baseValue) === JSON.stringify(newValue)
              ? null
              : newValue;
        }
      }

      return changedData;
    }

    const parsedData = parseData(defaultValues, data);

    try {
      const time = worship?.org === "ibc" ? "T19:00:00" : "T19:30:00";
      const date = parsedData.date
        ? `${data.date.toISOString().split("T")[0]}${time}`
        : undefined;

      await handleWorship(
        {
          date,
          lead_id: parsedData.lead?.value ?? null,
          musics: parsedData.musics?.map((music) => music.label) ?? null,
          org: parsedData.org?.value ?? null,
          singers_id: parsedData.singers?.map((singer) => singer.value) ?? null,
        },
        worship?.worship_id,
      );

      // form.reset();

      toast({
        title: "Worship session added",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }

      console.error("handleForm", { error });
    }
  };

  useEffect(() => {
    fetchMusics();
    fetchSingers();
  }, []);

  if (user.role !== "authenticated") return <></>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleForm)}
        className="grid gap-4 py-4"
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>
                {(worship?.formAction ?? "Add") + " worship session"}
              </CardTitle>
              <Button
                onClick={() => onClose()}
                className="bg-transparent hover:bg-zinc-800"
              >
                <X className="text-white" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="col-span-1 flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <DatePicker field={field}></DatePicker>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="org"
                render={({ field }) => (
                  <FormItem className="col-span-1 flex flex-col">
                    <FormLabel>Org</FormLabel>
                    <FormControl>
                      <Selectable
                        {...field}
                        options={[
                          { label: "IBC", value: "ibc" },
                          { label: "JUBAC", value: "jubac" },
                        ]}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="lead"
                render={({ field }) => (
                  <FormItem className="col-span-2 flex flex-col">
                    <FormLabel>Lead</FormLabel>
                    <FormControl>
                      <Selectable
                        {...field}
                        options={singers.map((singer) => {
                          return {
                            value: singer.id,
                            label: `${singer.name}${singer.last_name ? " " + singer.last_name : ""}`,
                          };
                        })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="musics"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Musics</FormLabel>
                    <FormControl>
                      <Creatable
                        {...field}
                        isMulti
                        options={musics.map((music) => {
                          return { label: music.title, value: music.id };
                        })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name="singers"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Singers</FormLabel>
                    <FormControl>
                      <Selectable
                        {...field}
                        isMulti
                        options={singers.map((a) => {
                          return {
                            value: a.id,
                            label: `${a.name}${a.last_name ? " " + a.last_name : ""}`,
                          };
                        })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">
              {(worship?.formAction ?? "Add") + " worship"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
