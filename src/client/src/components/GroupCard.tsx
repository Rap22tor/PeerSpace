import type {
  GroupSummary,
  GroupWithMembership,
  UserGroupItem,
} from "../../../shared/groupTypes";

type GroupCardData = GroupSummary | UserGroupItem | GroupWithMembership;

// casts different group types ito the same type
interface GroupCardProps {
  group: GroupCardData;
  memberCount?: number;
  membershipStatus?: "approved" | "pending" | null;
}

// gets the User's membership status in a group
function resolveMembershipStatus(
  group: GroupCardData,
  explicitStatus?: "approved" | "pending" | null,
): "approved" | "pending" | null {
  if (explicitStatus !== undefined) {
    return explicitStatus;
  }
  if ("status" in group) {
    return group.status ?? null;
  }
  return null;
}

export function GroupCard({
  group,
  memberCount = 0,
  membershipStatus,
}: GroupCardProps) {
  const isPrivate = group.is_private === 1;
  const effectiveStatus = resolveMembershipStatus(group, membershipStatus);

  const isApprovedMember = effectiveStatus === "approved";
  const isPendingRequest = effectiveStatus === "pending";
  const canSeeMemberCount = !isPrivate || isApprovedMember;

  const tagList = group.tags
    ? group.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  let statusLabel: string | null = null;
  if (isApprovedMember) {
    statusLabel = "You are a member";
  } else if (isPendingRequest) {
    statusLabel = "Request sent";
  }

  return (
    <article className="flex flex-col justify-between rounded-xl border border-current/15 p-5 shadow-xs transition hover:border-current/30">
      <div>
        <div className="mb-3 flex items-start justify-between gap-3">
          <h2 className="text-lg leading-snug font-medium">{group.title}</h2>

          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isPrivate
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
            }`}
          >
            {isPrivate ? "Private" : "Public"}
          </span>
        </div>

        {group.description && (
          <p className="mb-4 text-sm text-muted">{group.description}</p>
        )}

        {tagList.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {tagList.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-current/15 px-2 py-0.5 text-xs text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex min-h-5 flex-wrap items-center justify-between gap-2 border-t border-current/10 pt-3 text-xs text-muted">
        <span>
          {canSeeMemberCount
            ? `${memberCount}/${group.max_capacity} members`
            : ""}
        </span>

        {statusLabel && (
          <span className="font-medium text-current">{statusLabel}</span>
        )}
      </div>
    </article>
  );
}
