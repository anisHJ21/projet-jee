import { EmployeeCard, Employee } from "../EmployeeCard";

// todo: remove mock functionality
const mockEmployees: Employee[] = [
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
];

export default function EmployeeCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {mockEmployees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onEdit={(e) => console.log("Edit employee:", e)}
          onDelete={(id) => console.log("Delete employee:", id)}
          onAssign={(e) => console.log("Assign employee:", e)}
        />
      ))}
    </div>
  );
}
