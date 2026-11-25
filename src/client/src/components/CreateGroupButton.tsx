import { useState } from "react";
import type { GroupWithMembership } from "../../../shared/groupTypes";
import { Button } from "./Button";
import { CreateGroupDialog } from "./CreateGroupDialog";

interface CreateGroupButtonProps {
  // Called with the new group after it was created. Use it to refresh a list.
  onCreated?: (group: GroupWithMembership) => void;
}

// A "Create group" button that opens the create-group dialog.
export function CreateGroupButton({ onCreated }: CreateGroupButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        fullWidth={false}
        onClick={() => {
          setOpen(true);
        }}
      >
        Create group
      </Button>
      <CreateGroupDialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        onCreated={onCreated}
      />
    </>
  );
}
