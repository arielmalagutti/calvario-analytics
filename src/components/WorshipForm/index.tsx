import { useState } from "react";
import { useForm } from "react-hook-form";

import { OrganizationDTO } from "@/dtos";
import {
  createWorshipSchema,
  CreateWorshipSchema,
} from "@/schemas/WorshipSchemas";

import { useAuth, useWorship } from "@/hooks";

import { DatePicker } from "@/components";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Combobox } from "@/components/ui/combobox";
import Creatable from "@/components/ui/CustomSelect/Creatable";

import { mock, mock2 } from "./mock";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

export function WorshipForm() {
  const { user } = useAuth();
  const form = useForm<CreateWorshipSchema>({
    defaultValues: { date: new Date(), musics: [], org: "ibc", singers: [] },
  });
  const { handleWorship } = useWorship();
  const { toast } = useToast();

  const [date, setDate] = useState<Date>();
  const [org, setOrg] = useState<OrganizationDTO>("ibc");
  const [lead, setLead] = useState("");
  const [musics, setMusics] = useState<{ id: string; title: string }[]>([]);
  const [singers, setSingers] = useState<
    { id: string; name: string; last_name: string | null }[]
  >([]);

  async function fetchMusics() {
    try {
      // const { data, error } = await supabase.from("singer").select("*");
      const data = mock;
      const error = null as unknown as { message: string };
      console.error(data);
      if (error) throw new Error(error.message);

      setMusics(data);
    } catch (err) {
      console.error("fetchMusics", err);
    }
  }

  async function fetchSingers() {
    try {
      // const { data, error } = await supabase.from("singer").select("*");
      const data = mock2;
      const error = null as unknown as { message: string };
      console.error(data);
      if (error) throw new Error(error.message);

      setSingers(data);
    } catch (err) {
      console.error("fetchSingers", err);
    }
  }

  const handleForm = (data: CreateWorshipSchema) => {
    try {
      // handleWorship(data);
      console.log(data);
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

  const fetchData = () => {
    fetchMusics();
    fetchSingers();
  };

  if (user.role !== "authenticated") return <></>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleForm)}
        className="grid gap-4 py-4"
      >
        <div className="grid grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <DatePicker field={field}></DatePicker>
              </FormItem>
            )}
          ></FormField>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Org</FormLabel>
                <FormControl>
                  <Combobox
                    data={[
                      { label: "IBC", value: "ibc" },
                      { label: "JUBAC", value: "jubac" },
                    ]}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lead</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="lead"
                    type="text"
                    value={lead}
                    className="col-span-3"
                    onChange={(e) => setLead(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Musics</FormLabel>
                <FormControl>
                  <Creatable
                    isMulti
                    options={musics.map((music) => {
                      return { label: music.title, value: music.id };
                    })}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <FormField
            control={form.control}
            name=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Singers</FormLabel>
                <FormControl>
                  <Creatable
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
      </form>
    </Form>
  );
}
