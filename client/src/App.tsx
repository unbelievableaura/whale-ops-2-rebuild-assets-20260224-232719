import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BackgroundMusic from "./components/BackgroundMusic";
import Loading from "./pages/Loading";
import Home from "./pages/Home";
import Emotes from "./pages/Emotes";
import Roadmap from "./pages/Roadmap";
import Assets from "./pages/Assets";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Loading} />
      <Route path={"/lobby"}>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path={"/emotes"}>
        <ProtectedRoute>
          <Emotes />
        </ProtectedRoute>
      </Route>
      <Route path={"/roadmap"}>
        <ProtectedRoute>
          <Roadmap />
        </ProtectedRoute>
      </Route>
      <Route path={"/assets"} component={Assets} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider
          defaultTheme="dark"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <BackgroundMusic />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
