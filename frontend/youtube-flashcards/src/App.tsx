import "./App.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ModeToggle } from "./components/ThemeToggler";
import MainPage from "./components/MainPage";
import { Landing } from "./components/Landing";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
        <div className="w-full h-[100vh] grid grid-cols-1  lg:grid-cols-[1fr_2fr] relative">
          <Landing />
          <MainPage />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
