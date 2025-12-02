import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, X, Clock, MapPin } from "lucide-react";

export type AlertSeverity = "critical" | "warning" | "info";

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertsListProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
  onDismiss?: (id: string) => void;
  maxHeight?: string;
}

const severityConfig: Record<AlertSeverity, { label: string; color: string; icon: typeof AlertTriangle }> = {
  critical: { label: "Critical", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20", icon: AlertTriangle },
  warning: { label: "Warning", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: AlertTriangle },
  info: { label: "Info", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20", icon: AlertTriangle },
};

export function AlertsList({ 
  alerts, 
  onAcknowledge, 
  onDismiss,
  maxHeight = "400px" 
}: AlertsListProps) {
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;
  const warningCount = alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length;

  return (
    <Card data-testid="alerts-list">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-lg">Active Alerts</CardTitle>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge variant="destructive">{criticalCount} Critical</Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
                {warningCount} Warnings
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea style={{ maxHeight }}>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-2 text-emerald-500" />
              <p>No active alerts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map((alert) => {
                const config = severityConfig[alert.severity];
                const Icon = config.icon;
                return (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${config.color} ${
                      alert.acknowledged ? "opacity-60" : ""
                    }`}
                    data-testid={`alert-${alert.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mt-1 -mr-1"
                            onClick={() => onDismiss?.(alert.id)}
                            data-testid={`button-dismiss-alert-${alert.id}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm opacity-80 mt-0.5">{alert.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs opacity-70">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </span>
                          {alert.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {alert.location}
                            </span>
                          )}
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2"
                            onClick={() => onAcknowledge?.(alert.id)}
                            data-testid={`button-acknowledge-${alert.id}`}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
