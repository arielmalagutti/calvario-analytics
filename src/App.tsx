import { AuthProvider, ThemeProvider } from "@/hooks/index";

import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="h-screen w-full flex justify-center">
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;
