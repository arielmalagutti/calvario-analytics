import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { OrganizationDTO } from "@/dtos";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks";

import { DatePicker } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

import { Plus } from "lucide-react";

const createWorshipSchema = z.object({
  date: z.string(),
  org: z.string(),
  musics: z.array(z.string()),
  singers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      role: z.string(),
    }),
  ),
});

type CreateWorshipSchema = z.infer<typeof createWorshipSchema>;

export function WorshipSheet() {
  const { user } = useAuth();
  const { register, handleSubmit } = useForm<CreateWorshipSchema>({
    resolver: zodResolver(createWorshipSchema),
  });
  const { toast } = useToast();

  const [date, setDate] = useState<Date>();
  const [org, setOrg] = useState<OrganizationDTO>("ibc");
  const [musics, setMusics] = useState<string>();
  const [singers, setSingers] = useState<string>();
  const [lead, setLead] = useState("");

  async function handleWorship(data: CreateWorshipSchema) {
    try {
      if (user && data) console.log({ data });
      // await supabase.from("worship").insert([data]).select();
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: error.name,
          description: error.message,
          variant: "destructive",
        });
      }

      console.error({ error });
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="group">
          <Plus className="h-4 w-4 group-hover:animate-spin-once" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>New worship session</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={() => handleSubmit(handleWorship)}
          className="grid gap-4 py-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>

            <DatePicker id="date" date={date} setDate={setDate} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="org" className="text-right">
              Org
            </Label>

            <Input
              {...register("org")}
              id="org"
              type="text"
              autoComplete="false"
              autoCorrect="false"
              placeholder="Organization (e.g. IBC)"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lead" className="text-right">
              Lead
            </Label>

            <Input
              id="lead"
              type="text"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="musics" className="text-right">
              Musics
            </Label>

            <Input
              {...register("musics")}
              id="musics"
              type="text"
              autoComplete="false"
              autoCorrect="false"
              value={musics}
              onChange={(e) => setMusics(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="singers" className="text-right">
              Singers
            </Label>

            <Input
              {...register("singers")}
              id="singers"
              type="text"
              autoComplete="false"
              autoCorrect="false"
              value={singers}
              onChange={(e) => setSingers(e.target.value)}
              className="col-span-3"
            />
          </div>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={() => handleWorship()}>
              Create worship
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
