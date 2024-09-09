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

import { OrganizationDTO, WorshipDTO } from "@/dtos";
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

type WorshipFormProps = {
  worship: (WorshipDTO & { formAction: string }) | null;
  onClose: () => void;
  selectedOrg: OrganizationDTO;
};

export function WorshipForm({
  worship,
  onClose,
  selectedOrg,
}: WorshipFormProps) {
  const { user } = useAuth();

  const { handleWorship, fetchWorships } = useWorship();
  const { toast } = useToast();

  const [musics, setMusics] = useState<{ id: string; title: string }[]>([]);
  const [singers, setSingers] = useState<
    { id: string; name: string; last_name: string | null }[]
  >([]);

  const formOptions = {
    defaultValues: {
      date: new Date(),
      org: { value: selectedOrg, label: selectedOrg.toUpperCase() },
      musics: [],
      lead: { value: "", label: "" },
      singers: [],
    } as WorshipFormType,
    values: worship
      ? ({
          date: new Date(worship.worship_date),
          org: {
            label: worship.org.toUpperCase(),
            value: worship.org,
          },
          musics: worship.music_titles.map((music) => {
            return { value: music, label: music };
          }),
          lead: {
            value: worship.lead.id,
            label: worship.lead.name,
          },
          singers:
            worship.singers.map((singer) => {
              return {
                value: singer.id,
                label: `${singer.name}${singer.last_name ? " " + singer.last_name : ""}`,
              };
            }) ?? [],
        } as WorshipFormType)
      : undefined,
  };

  const form = useForm<WorshipFormType>(formOptions);

  async function fetchMusics() {
    try {
      const { data, error } = await supabase.from("music").select("*");

      if (error) throw new Error(error.message);

      setMusics(data);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }

  async function fetchSingers() {
    try {
      const { data, error } = await supabase.from("singer").select("*");

      if (error) throw new Error(error.message);

      setSingers(data);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }
    }
  }

  const handleForm = async (formData: WorshipFormType) => {
    function parseData(
      baseData: WorshipFormType,
      newData: WorshipFormType,
    ): NullablePartial<WorshipFormType> {
      const changedData: NullablePartial<WorshipFormType> = {};

      for (const key of Object.keys(baseData)) {
        const baseValue = baseData[key as keyof WorshipFormType];
        const newValue = newData[key as keyof WorshipFormType];

        if (Array.isArray(baseValue) && Array.isArray(newValue)) {
          const [sortedBaseValue, sortedNewValue] = [
            [...baseValue],
            [...newValue],
          ].map((arr) => arr.sort((a, b) => a.value.localeCompare(b.value)));

          //@ts-expect-error vai dar erro ts
          changedData[key as typeof WorshipFormType] =
            JSON.stringify(sortedBaseValue) === JSON.stringify(sortedNewValue)
              ? null
              : newValue;
        }
        if (baseValue instanceof Date && newValue instanceof Date) {
          const baseTime =
            baseData.org?.value === "ibc" ? "T19:00:00" : "T19:30:00";
          const newTime =
            newData.org?.value === "ibc" ? "T19:00:00" : "T19:30:00";
          const baseDate = `${baseValue.toISOString().split("T")[0]}${baseTime}`;
          const newDate = `${newValue.toISOString().split("T")[0]}${newTime}`;

          //@ts-expect-error vai dar erro ts
          changedData[key as keyof WorshipFormType] =
            baseDate === newDate ? null : newDate;
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

    const parsedData =
      worship && formOptions.values
        ? parseData(formOptions.values, formData)
        : formData;

    try {
      const time = parsedData.date
        ? formData.org.value === "ibc"
          ? "T19:00:00"
          : "T19:30:00"
        : null;
      const date = parsedData.date
        ? `${formData.date.toISOString().split("T")[0]}${time}`
        : null;

      const handleWorshipProps = {
        date,
        lead_id: parsedData.lead?.value ?? null,
        musics: parsedData.musics?.map((music) => music.value) ?? null,
        org: parsedData.org?.value ?? null,
        singers_id: parsedData.singers?.map((singer) => singer.value) ?? null,
        worship_id: worship?.worship_id,
      };

      await handleWorship(handleWorshipProps);

      fetchWorships(selectedOrg);

      form.reset(formOptions.defaultValues);
      if (worship) onClose();

      const title = worship?.worship_id
        ? "Sessão de louvor atualizada"
        : "Sessão de louvor registrada";

      toast({
        title,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }
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
                {(worship?.formAction ?? "Registrar") + " sessão de louvor"}
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
                    <FormLabel>Data</FormLabel>
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
                        placeholder="Selecione..."
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
                    <FormLabel>Ministro</FormLabel>
                    <FormControl>
                      <Selectable
                        {...field}
                        placeholder="Selecione..."
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
                    <FormLabel>Músicas</FormLabel>
                    <FormControl>
                      <Creatable
                        {...field}
                        placeholder="Selecione..."
                        isMulti
                        options={musics.map((music) => {
                          return { value: music.title, label: music.title };
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
                    <FormLabel>Cantores</FormLabel>
                    <FormControl>
                      <Selectable
                        {...field}
                        placeholder="Selecione..."
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
              {(worship?.formAction ?? "Registrar") + " louvor"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
