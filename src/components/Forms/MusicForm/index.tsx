import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

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
import { Input } from "@/components/ui/input";
import Creatable from "@/components/ui/CustomSelect/Creatable";

import { TagDTO } from "@/dtos";

import { X } from "lucide-react";

type dataType = Record<"value" | "label", string>;
export type MusicFormType = {
  title: string;
  tags?: dataType[];
};

type MusicFormProps = {
  onClose: () => void;
  handleMusicInsertion: () => void;
};

export function MusicForm({ onClose, handleMusicInsertion }: MusicFormProps) {
  const { toast } = useToast();

  const [tags, setTags] = useState<TagDTO[]>([]);

  const defaultValues = {
    title: "",
    tags: [],
  } as MusicFormType;

  const form = useForm<MusicFormType>({ defaultValues });

  async function fetchTags() {
    try {
      const { data, error } = await supabase.from("tag").select("*");

      if (error) throw new Error(error.message);

      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name));

      setTags(sortedData);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }
      setTags([]);
    }
  }

  const handleForm = async ({ title, tags }: MusicFormType) => {
    try {
      if (tags?.length) {
        const { error } = await supabase.rpc("add_music", {
          p_music_title: title,
          p_tags: tags.map((tag) => tag.value),
        });

        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase.from("music").insert({ title });

        if (error) throw new Error(error.message);
      }

      handleMusicInsertion();

      form.reset();

      toast({
        title: `Music ${title} added`,
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
    fetchTags();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleForm)}
        className="grid gap-4 py-4"
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <CardTitle>Registrar música</CardTitle>
              <Button
                onClick={() => onClose()}
                className="bg-transparent hover:bg-zinc-800"
              >
                <X className="text-white" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Título</FormLabel>
                  <Input
                    {...field}
                    className="max-h-9"
                    placeholder="Utilize o primeiro verso da música como título. Exemplo: Ao que está assentado"
                  />
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Creatable
                      {...field}
                      isMulti
                      placeholder="Selecione..."
                      options={tags.map((tag) => {
                        return {
                          value: tag.name,
                          label: tag.name,
                        };
                      })}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">Registrar música</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
