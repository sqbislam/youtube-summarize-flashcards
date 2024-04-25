import "./App.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { ModeToggle } from "./components/ThemeToggler";
import MainPage from "./components/MainPage";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ModeToggle />
        <MainPage />
      </ThemeProvider>
    </>
  );
}

export default App;
