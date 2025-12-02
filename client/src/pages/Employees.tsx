import { useState } from "react";
import { EmployeeCard, Employee } from "@/components/EmployeeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// todo: remove mock functionality
const initialEmployees: Employee[] = [
  {
    id: "1",
    name: "Ahmed Ben Salem",
    role: "driver",
    status: "available",
    phone: "+216 98 123 456",
    email: "ahmed.bensalem@municipality.tn",
    assignedZone: undefined,
    shiftsThisWeek: 3,
    joinDate: "2022-03-15",
  },
  {
    id: "2",
    name: "Fatima Bouazizi",
    role: "collector",
    status: "on_duty",
    phone: "+216 97 654 321",
    email: "fatima.b@municipality.tn",
    assignedZone: "North District",
    shiftsThisWeek: 5,
    joinDate: "2021-08-20",
  },
  {
    id: "3",
    name: "Mohamed Trabelsi",
    role: "supervisor",
    status: "on_leave",
    phone: "+216 95 111 222",
    email: "m.trabelsi@municipality.tn",
    assignedZone: undefined,
    shiftsThisWeek: 0,
    joinDate: "2020-01-10",
  },
  {
    id: "4",
    name: "Karim Souissi",
    role: "driver",
    status: "on_duty",
    phone: "+216 96 333 444",
    email: "k.souissi@municipality.tn",
    assignedZone: "Central District",
    shiftsThisWeek: 4,
    joinDate: "2021-05-12",
  },
  {
    id: "5",
    name: "Leila Hamdi",
    role: "technician",
    status: "available",
    phone: "+216 99 555 666",
    email: "l.hamdi@municipality.tn",
    assignedZone: undefined,
    shiftsThisWeek: 2,
    joinDate: "2023-01-05",
  },
  {
    id: "6",
    name: "Sami Mejri",
    role: "collector",
    status: "off_duty",
    phone: "+216 98 777 888",
    email: "s.mejri@municipality.tn",
    assignedZone: undefined,
    shiftsThisWeek: 5,
    joinDate: "2022-09-01",
  },
];

const employeeFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["driver", "collector", "supervisor", "technician"]),
  status: z.enum(["available", "on_duty", "off_duty", "on_leave"]),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  email: z.string().email("Invalid email address"),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export default function Employees() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      role: "collector",
      status: "available",
      phone: "",
      email: "",
    },
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleOpenDialog = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      form.reset({
        name: employee.name,
        role: employee.role,
        status: employee.status,
        phone: employee.phone,
        email: employee.email,
      });
    } else {
      setEditingEmployee(undefined);
      form.reset({
        name: "",
        role: "collector",
        status: "available",
        phone: "",
        email: "",
      });
    }
    setAddDialogOpen(true);
  };

  const handleSubmit = (values: EmployeeFormValues) => {
    if (editingEmployee) {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === editingEmployee.id
            ? { ...e, ...values }
            : e
        )
      );
    } else {
      const newEmployee: Employee = {
        ...values,
        id: Date.now().toString(),
        shiftsThisWeek: 0,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setEmployees((prev) => [...prev, newEmployee]);
    }
    setAddDialogOpen(false);
    setEditingEmployee(undefined);
    form.reset();
  };

  const handleDeleteEmployee = () => {
    if (employeeToDelete) {
      setEmployees((prev) => prev.filter((e) => e.id !== employeeToDelete));
      setEmployeeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">Employees</h1>
          <p className="text-muted-foreground">
            Manage sanitation workforce and assignments
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-employee">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-employees"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[130px]" data-testid="select-filter-role">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="supervisor">Supervisor</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]" data-testid="select-filter-emp-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="on_duty">On Duty</SelectItem>
              <SelectItem value="off_duty">Off Duty</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No employees found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={(e) => handleOpenDialog(e)}
              onDelete={(id) => {
                setEmployeeToDelete(id);
                setDeleteDialogOpen(true);
              }}
              onAssign={(e) => console.log("Assign employee:", e)}
            />
          ))}
        </div>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add Employee"}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee
                ? "Update the employee details below."
                : "Fill in the details for the new employee."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Ahmed Ben Salem"
                        {...field}
                        data-testid="input-employee-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employee-role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="driver">Driver</SelectItem>
                          <SelectItem value="collector">Collector</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="technician">Technician</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employee-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="on_duty">On Duty</SelectItem>
                          <SelectItem value="off_duty">Off Duty</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+216 98 123 456"
                        {...field}
                        data-testid="input-employee-phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="email@municipality.tn"
                        type="email"
                        {...field}
                        data-testid="input-employee-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-save-employee">
                  {editingEmployee ? "Save Changes" : "Add Employee"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employee? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
