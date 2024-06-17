import { AuthProvider, ThemeProvider } from "@/hooks/index";

import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="h-screen w-full flex flex-col">
        <AuthProvider>
          {/* <Home /> */}
          <Dashboard />
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
