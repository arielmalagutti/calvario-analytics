import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { MusicInfoDTO } from "@/dtos/MusicDTO";

import { MusicsTable, LoginSheet, Loading } from "@/components/index";
import { Header } from "@/components/Header";

export function Home() {
  const [musics, setMusics] = useState<MusicInfoDTO[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  let eventCalled = 0;

  function openLogin() {
    if (eventCalled >= 5) setLoginOpen(true);
    eventCalled++;
  }

  async function fetchMusics() {
    try {
      setIsLoading(true);
      const { data } = await supabase.rpc("music_info").select();
      if (data) setMusics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMusics();
  }, []);

  return (
    <>
      <Header />

      <div className="max-w-screen-xl w-full flex flex-col justify-center p-12">
        <div className="flex flex-1">
          {!isLoading ? (
            <MusicsTable data={musics} onRefresh={fetchMusics} />
          ) : (
            <Loading />
          )}
        </div>
      </div>

      {loginOpen && <LoginSheet onClose={() => (eventCalled = 0)} />}
    </>
  );
}
