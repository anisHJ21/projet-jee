import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, MapPin, Edit, Trash2, Calendar } from "lucide-react";

export type EmployeeStatus = "available" | "on_duty" | "off_duty" | "on_leave";
export type EmployeeRole = "driver" | "collector" | "supervisor" | "technician";

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  phone: string;
  email: string;
  assignedZone?: string;
  shiftsThisWeek: number;
  joinDate: string;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit?: (employee: Employee) => void;
  onDelete?: (id: string) => void;
  onAssign?: (employee: Employee) => void;
}

const statusConfig: Record<EmployeeStatus, { label: string; color: string }> = {
  available: { label: "Available", color: "bg-emerald-500" },
  on_duty: { label: "On Duty", color: "bg-blue-500" },
  off_duty: { label: "Off Duty", color: "bg-slate-400" },
  on_leave: { label: "On Leave", color: "bg-amber-500" },
};

const roleConfig: Record<EmployeeRole, { label: string; variant: "default" | "secondary" | "outline" }> = {
  driver: { label: "Driver", variant: "default" },
  collector: { label: "Collector", variant: "secondary" },
  supervisor: { label: "Supervisor", variant: "outline" },
  technician: { label: "Technician", variant: "secondary" },
};

export function EmployeeCard({ employee, onEdit, onDelete, onAssign }: EmployeeCardProps) {
  const statusCfg = statusConfig[employee.status];
  const roleCfg = roleConfig[employee.role];
  const initials = employee.name.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <Card className="hover-elevate" data-testid={`card-employee-${employee.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span 
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${statusCfg.color}`}
              title={statusCfg.label}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{employee.name}</h3>
              <Badge variant={roleCfg.variant}>{roleCfg.label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{statusCfg.label}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5" />
          <span>{employee.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">{employee.email}</span>
        </div>
        {employee.assignedZone && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Zone: <strong>{employee.assignedZone}</strong></span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{employee.shiftsThisWeek} shifts this week</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        {employee.status === "available" && (
          <Button 
            size="sm" 
            className="flex-1"
            onClick={() => onAssign?.(employee)}
            data-testid={`button-assign-${employee.id}`}
          >
            Assign to Route
          </Button>
        )}
        {employee.status !== "available" && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            disabled
          >
            {employee.status === "on_duty" ? "Currently Assigned" : "Not Available"}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onEdit?.(employee)}
          data-testid={`button-edit-employee-${employee.id}`}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onDelete?.(employee.id)}
          data-testid={`button-delete-employee-${employee.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
