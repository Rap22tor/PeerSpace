import type { StudySession } from "../../../shared/sessionTypes";

interface SessionItemProps {
  session: StudySession; // session data
  onEdit: (sessionId: number) => void; // callback for editing
  onDelete: (sessionId: number) => void; // callback for deleting
}

// Renders a single study session row with placeholder edit and delete actions.
export function SessionItem({ session, onEdit, onDelete }: SessionItemProps) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{session.title}</p>
        <p className="text-xs text-muted">
          {new Date(session.scheduled_at).toLocaleString()}
        </p>
        {session.meeting_link && (
          <p className="truncate text-xs text-accent">{session.meeting_link}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => {
            onEdit(session.session_id);
          }}
          className="h-8 cursor-pointer rounded-md border border-line px-3 text-xs font-medium text-fg transition hover:border-accent hover:text-accent active:scale-[0.99]"
        >
          Edit
        </button>
        {/* Keep delete neutral at rest and turn it red only on hover */}
        <button
          type="button"
          onClick={() => {
            onDelete(session.session_id);
          }}
          className="h-8 cursor-pointer rounded-md border border-line px-3 text-xs font-medium text-fg transition hover:border-danger hover:bg-danger-soft hover:text-danger active:scale-[0.99]"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
