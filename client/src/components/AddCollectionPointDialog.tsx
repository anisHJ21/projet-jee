import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { WasteType, ContainerStatus, CollectionPoint } from "./CollectionPointCard";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  wasteType: z.enum(["plastic", "organic", "glass", "paper", "metal", "mixed"]),
  status: z.enum(["operational", "maintenance", "full", "damaged"]),
  fillLevel: z.number().min(0).max(100),
  lat: z.string().refine((val) => !isNaN(parseFloat(val)), "Invalid latitude"),
  lng: z.string().refine((val) => !isNaN(parseFloat(val)), "Invalid longitude"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCollectionPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<CollectionPoint, "id">) => void;
  editingPoint?: CollectionPoint;
}

export function AddCollectionPointDialog({
  open,
  onOpenChange,
  onSubmit,
  editingPoint,
}: AddCollectionPointDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: editingPoint
      ? {
          name: editingPoint.name,
          address: editingPoint.address,
          wasteType: editingPoint.wasteType,
          status: editingPoint.status,
          fillLevel: editingPoint.fillLevel,
          lat: editingPoint.coordinates.lat.toString(),
          lng: editingPoint.coordinates.lng.toString(),
        }
      : {
          name: "",
          address: "",
          wasteType: "mixed",
          status: "operational",
          fillLevel: 0,
          lat: "36.8065",
          lng: "10.1815",
        },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      name: values.name,
      address: values.address,
      wasteType: values.wasteType as WasteType,
      status: values.status as ContainerStatus,
      fillLevel: values.fillLevel,
      coordinates: {
        lat: parseFloat(values.lat),
        lng: parseFloat(values.lng),
      },
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingPoint ? "Edit Collection Point" : "Add Collection Point"}
          </DialogTitle>
          <DialogDescription>
            {editingPoint
              ? "Update the collection point details below."
              : "Fill in the details for the new collection point."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Central Plaza Container" 
                      {...field} 
                      data-testid="input-point-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., 123 Main Street" 
                      {...field}
                      data-testid="input-point-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wasteType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waste Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-waste-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="plastic">Plastic</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="metal">Metal</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="fillLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fill Level: {field.value}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                      data-testid="slider-fill-level"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="lat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="36.8065" 
                        {...field}
                        data-testid="input-latitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lng"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="10.1815" 
                        {...field}
                        data-testid="input-longitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" data-testid="button-save-point">
                {editingPoint ? "Save Changes" : "Add Point"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
