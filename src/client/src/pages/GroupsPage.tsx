import { useEffect, useMemo, useState } from "react";
import { fetchMyGroups } from "../api/group";
import { ApiError } from "../backendRaw";
import { GroupCard } from "../components/GroupCard";
import { SearchInput } from "../components/SearchInput";
import {
  SegmentedFilter,
  type FilterOption,
} from "../components/SegmentedFilter";
import { type UserGroupCardItem } from "../../../shared/groupTypes";

type MembershipStatusFilter = "all" | "approved" | "pending";

const STATUS_OPTIONS: readonly FilterOption<MembershipStatusFilter>[] = [
  { id: "all", label: "All" },
  { id: "approved", label: "Approved" },
  { id: "pending", label: "Pending" },
];

export function GroupsPage() {
  const [groups, setGroups] = useState<UserGroupCardItem[]>([]);
  const [statusFilter, setStatusFilter] =
    useState<MembershipStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchMyGroups()
      .then((loadedGroups) => {
        if (!cancelled) {
          setErrorMessage(null);
          setGroups(loadedGroups);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorMessage(
            err instanceof ApiError
              ? err.message
              : "Failed to load your groups.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return groups.filter((group) => {
      if (statusFilter !== "all" && group.status !== statusFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const titleMatch = group.title.toLowerCase().includes(normalizedQuery);
      const tagsMatch = (group.tags ?? "")
        .toLowerCase()
        .includes(normalizedQuery);
      return titleMatch || tagsMatch;
    });
  }, [groups, statusFilter, searchQuery]);

  return (
    <>
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl leading-tight font-medium">My Groups</h1>
          <p className="mt-1 text-muted">
            Groups you belong to or have requested to join.
          </p>
        </div>

        <SegmentedFilter
          ariaLabel="Filter user groups by status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </section>

      <section aria-label="Search and user groups">
        <div className="mb-5">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search your groups by title or tags..."
          />
        </div>

        {errorMessage ? (
          <p className="rounded-xl border border-current/15 p-6 text-sm text-danger">
            {errorMessage}
          </p>
        ) : isLoading ? (
          <p className="rounded-xl border border-current/15 p-6 text-sm text-muted">
            Loading your groups…
          </p>
        ) : visibleGroups.length === 0 ? (
          <p className="rounded-xl border border-current/15 p-6 text-sm text-muted">
            No groups match your search or status filter.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGroups.map((group) => {
              return (
                <GroupCard
                  key={group.group_id}
                  group={group}
                  memberCount={group.member_count}
                  membershipStatus={group.status}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
