import { useState } from "react";
import { AddCollectionPointDialog } from "../AddCollectionPointDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AddCollectionPointDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)} data-testid="button-open-dialog">
        <Plus className="h-4 w-4 mr-2" />
        Add Collection Point
      </Button>
      <AddCollectionPointDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          console.log("New collection point:", data);
        }}
      />
    </div>
  );
}
