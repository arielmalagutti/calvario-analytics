import { AuthProvider, ThemeProvider, WorshipProvider } from "@/hooks/index";

import { Toaster } from "@/components/ui/toaster";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-full flex-col">
        <AuthProvider>
          <WorshipProvider>
            <RouterProvider router={router} />

            <Toaster />
          </WorshipProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
