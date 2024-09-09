import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { MusicTagsDTO, TagDTO } from "@/dtos";
import { MusicTable } from "@/components/Tables/MusicTable";
import { Button } from "@/components/ui/button";
import { MusicForm } from "@/components/Forms/MusicForm";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

export default function Musics() {
  const { toast } = useToast();
  const [musics, setMusics] = useState<MusicTagsDTO[]>([]);
  const [tags, setTags] = useState<TagDTO[]>([]);

  const [musicFormOpen, setMusicFormOpen] = useState(false);

  const onFormClose = () => {
    setMusicFormOpen(false);
  };

  async function fetchMusics() {
    try {
      const { data, error } = await supabase
        .rpc("get_musics_with_tags")
        .select();

      if (error) throw new Error(error.message);

      if (data) setMusics(data);
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

  useEffect(() => {
    fetchMusics();
    fetchTags();
  }, []);

  return (
    <>
      <div className="sticky flex w-full items-center justify-between">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-medium text-gray-500 dark:text-gray-400">
              MUSICS
            </h1>
          </div>
          <Button
            className="rounded-lg bg-transparent p-2 transition-colors hover:bg-zinc-800 dark:text-foreground"
            onClick={() => setMusicFormOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Add Music</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6">
        {musicFormOpen && (
          <MusicForm
            onClose={onFormClose}
            handleMusicInsertion={() => fetchMusics()}
          />
        )}

        <MusicTable data={musics} tags={tags} onRefresh={() => fetchMusics()} />
      </div>
    </>
  );
}
