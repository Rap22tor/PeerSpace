import { useRef, useState, type FormEvent } from "react";
import { createGroup } from "../api/group";
import { getFormErrorMessage } from "../auth/errors";
import { ApiError } from "../backendRaw";
import {
  validateGroupCapacity,
  validateGroupDescription,
  validateGroupTags,
  validateGroupTitle,
} from "../validation/group";
import type { GroupWithMembership } from "../../../shared/groupTypes";
import { Button } from "./Button";
import { CheckboxField } from "./CheckboxField";
import { Dialog } from "./Dialog";
import { FormBanner } from "./FormBanner";
import { TextAreaField } from "./TextAreaField";
import { TextField } from "./TextField";

const DEFAULT_CAPACITY = "10";

interface GroupFormErrors {
  title?: string;
  description?: string;
  tags?: string;
  maxCapacity?: string;
}

interface CreateGroupDialogProps {
  open: boolean;
  onClose: () => void;
  // Called with the new group after the server accepted it.
  onCreated?: (group: GroupWithMembership) => void;
}

// The form is its own component, so it starts empty every time the dialog opens.
export function CreateGroupDialog({
  open,
  onClose,
  onCreated,
}: CreateGroupDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} title="Create a group">
      <CreateGroupForm onClose={onClose} onCreated={onCreated} />
    </Dialog>
  );
}

interface CreateGroupFormProps {
  onClose: () => void;
  onCreated?: (group: GroupWithMembership) => void;
}

function CreateGroupForm({ onClose, onCreated }: CreateGroupFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);
  const [isPrivate, setIsPrivate] = useState(false);
  const [errors, setErrors] = useState<GroupFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const tagsRef = useRef<HTMLInputElement>(null);
  const capacityRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }

    const nextErrors: GroupFormErrors = {
      title: validateGroupTitle(title),
      description: validateGroupDescription(description),
      tags: validateGroupTags(tags),
      maxCapacity: validateGroupCapacity(capacity),
    };
    setErrors(nextErrors);
    setFormError(null);

    if (nextErrors.title !== undefined) {
      titleRef.current?.focus();
      return;
    }
    if (nextErrors.description !== undefined) {
      descriptionRef.current?.focus();
      return;
    }
    if (nextErrors.tags !== undefined) {
      tagsRef.current?.focus();
      return;
    }
    if (nextErrors.maxCapacity !== undefined) {
      capacityRef.current?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const group = await createGroup({
        title: title.trim(),
        description,
        tags,
        isPrivate,
        maxCapacity: Number(capacity),
      });
      onCreated?.(group);
      onClose();
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmitError(error: unknown) {
    if (error instanceof ApiError && Object.keys(error.fields).length > 0) {
      const fieldErrors: GroupFormErrors = {
        title: error.fields.title,
        description: error.fields.description,
        tags: error.fields.tags,
        maxCapacity: error.fields.maxCapacity,
      };
      const hasVisibleError = Object.values(fieldErrors).some((message) => {
        return message !== undefined;
      });
      // Fields without an input (like isPrivate) would show nothing.
      if (hasVisibleError) {
        setErrors(fieldErrors);
        return;
      }
    }
    setFormError(getFormErrorMessage(error));
  }

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      {formError !== null ? <FormBanner>{formError}</FormBanner> : null}
      <TextField
        ref={titleRef}
        label="Title"
        autoFocus
        value={title}
        onChange={(value) => {
          setTitle(value);
          setErrors({ ...errors, title: undefined });
        }}
        error={errors.title}
      />
      <TextAreaField
        ref={descriptionRef}
        label="Description (optional)"
        value={description}
        onChange={(value) => {
          setDescription(value);
          setErrors({ ...errors, description: undefined });
        }}
        error={errors.description}
      />
      <TextField
        ref={tagsRef}
        label="Tags (optional)"
        hint="Comma-separated, for example: algorithms, exam prep"
        value={tags}
        onChange={(value) => {
          setTags(value);
          setErrors({ ...errors, tags: undefined });
        }}
        error={errors.tags}
      />
      <TextField
        ref={capacityRef}
        label="Maximum members"
        type="number"
        value={capacity}
        onChange={(value) => {
          setCapacity(value);
          setErrors({ ...errors, maxCapacity: undefined });
        }}
        error={errors.maxCapacity}
      />
      <CheckboxField
        label="Private group"
        checked={isPrivate}
        onChange={setIsPrivate}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          fullWidth={false}
          disabled={submitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button fullWidth={false} disabled={submitting}>
          {submitting ? "Creating…" : "Create group"}
        </Button>
      </div>
    </form>
  );
}
