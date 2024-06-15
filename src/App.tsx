import { ThemeProvider } from "./hooks";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="h-screen w-full flex justify-center">
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
