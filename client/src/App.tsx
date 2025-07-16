import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import DesignPage from "@/pages/design";
import PlanPage from "@/pages/plan";
import DashboardPage from "@/pages/dashboard";
import RoomDungeonPage from "@/pages/room-dungeon";
import ScapesPage from "@/pages/scapes";
import PropsPage from "@/pages/props";
import ChatPage from "@/pages/chat";
import RulesPage from "@/pages/rules";
import Sidebar from "@/components/sidebar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/design" component={() => <AppLayout><DesignPage /></AppLayout>} />
        <Route path="/plan" component={() => <AppLayout><PlanPage /></AppLayout>} />
        <Route path="/dash" component={() => <AppLayout><DashboardPage /></AppLayout>} />
        <Route path="/scapes" component={() => <AppLayout><ScapesPage /></AppLayout>} />
        <Route path="/props" component={() => <AppLayout><PropsPage /></AppLayout>} />
        <Route path="/chat" component={() => <AppLayout><ChatPage /></AppLayout>} />
        <Route path="/rules" component={() => <AppLayout><RulesPage /></AppLayout>} />
        <Route path="/room/dungeon" component={() => <AppLayout><RoomDungeonPage /></AppLayout>} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 lg:ml-0">
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
