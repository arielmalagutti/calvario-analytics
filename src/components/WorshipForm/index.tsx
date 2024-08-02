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

import { OrganizationDTO } from "@/dtos";
import { MUSICS_MOCK, SINGERS_MOCK } from "./mock";

type dataType = Record<"value" | "label", string>;
export type WorshipFormType = {
  date: Date;
  org: dataType;
  musics: dataType[];
  lead: dataType;
  singers: dataType[];
};

export function WorshipForm() {
  const { user } = useAuth();

  const { addWorship } = useWorship();
  const { toast } = useToast();

  const [org, setOrg] = useState<OrganizationDTO>("ibc");
  const [musics, setMusics] = useState<{ id: string; title: string }[]>([]);
  const [singers, setSingers] = useState<
    { id: string; name: string; last_name: string | null }[]
  >([]);

  const form = useForm<WorshipFormType>({
    defaultValues: {
      date: new Date(),
      org: { label: org.toUpperCase(), value: org },
      musics: [],
      lead: { label: "", value: "" },
      singers: [],
    },
  });

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
    try {
      const date =
        data.org.value === "ibc"
          ? data.date.toISOString().split("T")[0] + "T19:00:00"
          : data.date.toISOString().split("T")[0] + "T19:30:00";

      await addWorship({
        date,
        lead_id: data.lead.value,
        musics: data.musics.map((music) => music.label),
        org: data.org.value,
        singers_id: data.singers.map((singer) => singer.value),
      });

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
            <CardTitle>Add worship session</CardTitle>
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
            <Button type="submit">Add worship</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
