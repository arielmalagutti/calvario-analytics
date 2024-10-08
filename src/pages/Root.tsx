import { Header } from "@/components";
import { useAuth } from "@/hooks";
import { Outlet } from "react-router-dom";

export default function Root() {
  const { user } = useAuth();

  return (
    <>
      <Header user={user} />

      <div className="flex flex-1 justify-center px-12 py-6">
        <div className="w-full max-w-screen-xl">
          <Outlet />
        </div>
      </div>
    </>
  );
}
