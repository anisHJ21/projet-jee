import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell, Notification } from "@/components/NotificationBell";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import CollectionPoints from "@/pages/CollectionPoints";
import Employees from "@/pages/Employees";
import Vehicles from "@/pages/Vehicles";
import Routes from "@/pages/Routes";

// todo: remove mock functionality
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    title: "Container Full",
    message: "Container at Central Plaza has reached 95% capacity.",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "warning",
    title: "Low Fuel Alert",
    message: "Vehicle TU-5678-CD has fuel level below 25%.",
    timestamp: "15 minutes ago",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Route Completed",
    message: "Morning collection in North District completed.",
    timestamp: "1 hour ago",
    read: true,
  },
];

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/collection-points" component={CollectionPoints} />
      <Route path="/routes" component={Routes} />
      <Route path="/employees" component={Employees} />
      <Route path="/vehicles" component={Vehicles} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ecocollect-theme">
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                  </div>
                  <div className="flex items-center gap-2">
                    <NotificationBell
                      notifications={notifications}
                      onMarkAsRead={handleMarkAsRead}
                      onMarkAllAsRead={handleMarkAllAsRead}
                      onDismiss={handleDismiss}
                    />
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto bg-background">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
