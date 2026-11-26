import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ApiError } from "../backendRaw";
import { fetchGroupById } from "../api/group";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/Button";
import { ButtonLink } from "../components/ButtonLink";
import { CommentItem } from "../components/CommentItem";
import { SessionItem } from "../components/SessionItem";
import type { GroupDetail } from "../../../shared/groupTypes";
import type { CommentWithAuthor } from "../../../shared/commentTypes";
import type { StudySession } from "../../../shared/sessionTypes";

interface GroupDetailPageProps {
  currentUserId?: number;
  currentUserMembershipStatus?: "approved" | "pending" | null;
}

export function GroupDetailPage({
  currentUserId,
  currentUserMembershipStatus,
}: GroupDetailPageProps) {
  // 1.
  // useParam() gets :id param from URL,
  // useState creates 4 states: group data, loading flag, not found flag, error message
  const { id } = useParams();

  // Read signed-in user from AuthContext so admin and membership checks work automatically.
  const { user, status: authStatus } = useAuth();

  // Server auth routes return `{ user: { id, email, username } }`.
  const resolvedUserId = currentUserId ?? (user as { id?: number } | null)?.id;

  //2.
  // setGroup(data/null) saves loaded group data
  // setNotFound(true/false) - 'not found' switcher
  // setErrorMessage() - error text message
  // setLoading(true/false) - loading indicator switcher

  const numericId = Number(id);
  const idIsValid = // Reject non-positive integers or strings with trailing characters (e.g. "12abc")
    Boolean(id) &&
    /^\d+$/.test(id!) &&
    Number.isSafeInteger(numericId) &&
    numericId > 0;

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadedForId, setLoadedForId] = useState<string | undefined>(undefined);
  const [sessions] = useState<StudySession[]>([]);
  const [comments] = useState<CommentWithAuthor[]>([]);
  const loading = idIsValid && loadedForId !== id;

  useEffect(() => {
    // Reject non-positive integers or strings with trailing characters (e.g. "12abc").
    if (!idIsValid || !id) {
      return; // no query sent to server
    }

    // 'cancelled' flag: ignore late responses if the component unmounts or id changes
    let cancelled = false;

    fetchGroupById(numericId) // GET /api/groups/:id with get(...) from backendRaw.ts, returns response.group
      .then((data) => {
        if (cancelled) {
          return;
        }
        setNotFound(false);
        setErrorMessage(null);
        setGroup(data); // passing the data into the group
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setGroup(null);
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          setErrorMessage(null);
        } else if (err instanceof Error) {
          setNotFound(false);
          setErrorMessage(err.message);
        } else {
          setNotFound(false);
          setErrorMessage("Failed to load group details.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadedForId(id);
        }
      });

    return () => {
      cancelled = true; // cleanup before next call
    };
  }, [id, idIsValid, numericId]);

  // 3.
  if (!idIsValid) {
    return (
      <section className="rounded-xl border border-line p-6 shadow-xs">
        <h1 className="text-xl font-semibold">Group not found</h1>
        <p className="mt-2 text-sm text-muted">
          This group does not exist or is private and unavailable.
        </p>
        <div className="mt-4">
          <Link
            to="/"
            className="text-sm font-medium text-accent hover:underline"
          >
            Back to all groups
          </Link>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="space-y-4" aria-busy="true">
        <p className="text-sm text-muted">Loading group details...</p>
      </section>
    );
  }

  if (notFound) {
    return (
      <section className="rounded-xl border border-line p-6 shadow-xs">
        <h1 className="text-xl font-semibold">Group not found</h1>
        <p className="mt-2 text-sm text-muted">
          This group does not exist or is private and unavailable.
        </p>
        <div className="mt-4">
          <Link
            to="/"
            className="text-sm font-medium text-accent hover:underline"
          >
            Back to all groups
          </Link>
        </div>
      </section>
    );
  }

  if (errorMessage || !group) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-danger/30 bg-danger-soft p-6 text-danger"
      >
        <h1 className="text-lg font-semibold">Could not load group</h1>
        <p className="mt-1 text-sm">
          {errorMessage ?? "An unexpected error occurred."}
        </p>
        <div className="mt-4">
          <Link
            to="/"
            className="text-sm font-medium text-fg underline hover:opacity-80"
          >
            Back to all groups
          </Link>
        </div>
      </section>
    );
  }

  // 4.
  const isPrivate = group.is_private === 1;
  const matchedMember =
    resolvedUserId !== undefined
      ? group.members.find((member) => {
          return member.user_id === resolvedUserId; // looks for the User in the group members list
        })
      : undefined;

  const isAdmin = matchedMember?.role === "admin"; // if the confirmed User is an Admin
  const effectiveStatus =
    currentUserMembershipStatus ?? (matchedMember ? "approved" : null); // who is the User: member, undefined (not a member), admin
  const tagList = group.tags
    ? group.tags // casts tags string into tagList
        .split(",")
        .map((tag) => {
          return tag.trim();
        })
        .filter(Boolean)
    : [];

  // Placeholder handlers until join, edit, and delete actions are wired up.
  const handleRequestJoin = () => {};
  const handleEditSession = (_sessionId: number) => {};
  const handleDeleteSession = (_sessionId: number) => {};
  const handleDeleteComment = (_commentId: number) => {};

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/"
          className="text-sm font-medium text-accent transition hover:underline"
        >
          &larr; Back to all groups
        </Link>
      </div>

      {/* Use md:grid-cols-3 so the 2/3 + 1/3 column split stays intact on tablets and up. */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <article className="rounded-xl border border-line bg-fg/[0.02] p-6 shadow-xs transition hover:border-current/25">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-semibold tracking-tight">
                {group.title}
              </h1>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  isPrivate
                    ? "bg-warning-soft text-warning"
                    : "bg-success-soft text-success"
                }`}
              >
                {isPrivate ? "Private" : "Public"}
              </span>
            </div>

            {group.description && (
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {group.description}
              </p>
            )}

            {tagList.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tagList.map((tag) => {
                  return (
                    <span
                      key={tag}
                      className="rounded-md border border-accent/25 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent"
                    >
                      #{tag}
                    </span>
                  );
                })}
              </div>
            )}
          </article>

          <section className="rounded-xl border border-line p-6 shadow-xs">
            <h2 className="mb-4 text-lg font-medium">Study Sessions</h2>

            {sessions.length === 0 ? (
              <p className="text-sm text-muted">No study sessions scheduled.</p>
            ) : (
              <ul className="divide-y divide-line">
                {sessions.map((session) => {
                  return (
                    <SessionItem
                      key={session.session_id}
                      session={session}
                      onEdit={handleEditSession}
                      onDelete={handleDeleteSession}
                    />
                  );
                })}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-line p-6 shadow-xs">
            <h2 className="mb-4 text-lg font-medium">Comments</h2>

            {comments.length === 0 ? (
              <p className="text-sm text-muted">No comments yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {comments.map((comment) => {
                  const isAuthor =
                    resolvedUserId !== undefined &&
                    comment.user_id === resolvedUserId;
                  const canDeleteComment = isAdmin || isAuthor;

                  return (
                    <CommentItem
                      key={comment.comment_id}
                      comment={comment}
                      canDelete={canDeleteComment}
                      onDelete={handleDeleteComment}
                    />
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6 md:col-span-1">
          <section className="rounded-xl border border-line bg-fg/[0.02] p-5 shadow-xs">
            {isAdmin ? (
              <ButtonLink to={`/groups/${group.group_id}/edit`}>
                Edit Group
              </ButtonLink>
            ) : effectiveStatus === "approved" ? (
              <p className="rounded-md bg-success-soft px-3 py-2 text-sm font-medium text-success">
                You are a member.
              </p>
            ) : effectiveStatus === "pending" ? (
              <p className="rounded-md bg-warning-soft px-3 py-2 text-sm font-medium text-warning">
                Request sent.
              </p>
            ) : authStatus === "loading" || resolvedUserId === undefined ? (
              <p className="text-sm text-muted">Checking membership...</p>
            ) : (
              <Button type="button" onClick={handleRequestJoin}>
                Request to Join
              </Button>
            )}
          </section>

          <section className="rounded-xl border border-line p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium">Members</h2>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-muted">
                {group.member_count}/{group.max_capacity}
              </span>
            </div>

            {group.members.length === 0 ? (
              <p className="text-sm text-muted">No approved members yet.</p>
            ) : (
              <ul className="divide-y divide-line">
                {group.members.map((member) => {
                  // Display initial badge to add visual rhythm without crowding member rows.
                  const initial =
                    member.username.trim().charAt(0).toUpperCase() || "?";
                  const isMemberAdmin = member.role === "admin";

                  return (
                    <li
                      key={member.user_id}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent"
                        >
                          {initial}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {member.username}
                          </p>
                          <p className="text-xs text-muted">
                            Joined{" "}
                            {new Date(member.joined_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 rounded-md border px-2 py-0.5 text-xs capitalize ${
                          isMemberAdmin
                            ? "border-accent/40 bg-accent/10 font-medium text-accent"
                            : "border-line text-muted"
                        }`}
                      >
                        {member.role}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
