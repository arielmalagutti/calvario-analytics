import { AuthProvider, ThemeProvider, WorshipProvider } from "@/hooks/index";

// import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";

import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex h-screen w-full flex-col">
        <AuthProvider>
          <WorshipProvider>
            {/* <Home /> */}
            <Dashboard />

            <Toaster />
          </WorshipProvider>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
