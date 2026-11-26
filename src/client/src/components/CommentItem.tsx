import type { CommentWithAuthor } from "../../../shared/commentTypes";

interface CommentItemProps {
  comment: CommentWithAuthor; // includes cmment_id, username, user_id, content, created_at
  canDelete: boolean; // delete button can be seen only to admin (isAdmin) or author (isAuthor)
  onDelete: (commentId: number) => void; // tells its parent about deleting a comment
}

// Renders a single group comment with an author initial badge and optional delete button.
export function CommentItem({
  comment,
  canDelete,
  onDelete,
}: CommentItemProps) {
  const initial = comment.username.trim().charAt(0).toUpperCase() || "?";

  return (
    <li className="space-y-1.5 py-3 first:pt-0 last:pb-0">
      <div className="flex items-center justify-between gap-2 text-xs text-muted">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent"
          >
            {initial}
          </span>
          <span className="font-medium text-fg">{comment.username}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{new Date(comment.created_at).toLocaleString()}</span>
          {/* Only group admins or the comment author can see the delete button */}
          {canDelete && (
            <button
              type="button"
              onClick={() => {
                onDelete(comment.comment_id);
              }}
              className="h-7 cursor-pointer rounded-md border border-line px-2.5 text-xs font-medium text-fg transition hover:border-danger hover:bg-danger-soft hover:text-danger active:scale-[0.99]"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="pl-8 text-sm leading-relaxed">{comment.content}</p>
    </li>
  );
}
