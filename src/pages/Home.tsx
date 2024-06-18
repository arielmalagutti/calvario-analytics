import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { MusicInfoDTO } from "@/dtos/MusicDTO";

import { Header, MusicsTable, LoginSheet, Loading } from "@/components/index";

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

      <div className="flex flex-1 justify-center">
        <div className="flex w-full max-w-screen-xl flex-1 flex-col">
          <h1 className="text-lg font-bold text-gray-400">All Musics</h1>

          <div className="flex flex-1">
            {!isLoading ? (
              <MusicsTable data={musics} onRefresh={fetchMusics} />
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>

      {loginOpen && <LoginSheet />}
    </>
  );
}
