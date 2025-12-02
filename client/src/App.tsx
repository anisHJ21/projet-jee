import { useQuery, useMutation } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
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
import type { Notification as DbNotification } from "@shared/schema";

function transformNotification(n: DbNotification): Notification {
  return {
    id: n.id,
    type: n.type as Notification["type"],
    title: n.title,
    message: n.message,
    timestamp: n.timestamp,
    read: n.read,
  };
}

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

function AppContent() {
  const { data: dbNotifications = [] } = useQuery<DbNotification[]>({
    queryKey: ["/api/notifications"],
  });

  const notifications = dbNotifications.map(transformNotification);

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("PATCH", `/api/notifications/${id}`, { read: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/notifications/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDismiss = (id: string) => {
    dismissMutation.mutate(id);
  };

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
