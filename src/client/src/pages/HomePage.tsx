import { useEffect, useMemo, useState } from "react";
import { fetchGroups } from "../api/group";
import { ApiError } from "../backendRaw";
import { GroupCard } from "../components/GroupCard";
import { SearchInput } from "../components/SearchInput";
import {
  SegmentedFilter,
  type FilterOption,
} from "../components/SegmentedFilter";
import { type CatalogGroupItem } from "../../../shared/groupTypes";

// The landing page for signed-in users. The groups sections stay empty until
// the group issues fill them with real data.

type VisibilityFilter = "all" | "public" | "private";

const VISIBILITY_OPTIONS: readonly FilterOption<VisibilityFilter>[] = [
  { id: "all", label: "All" },
  { id: "public", label: "Public" },
  { id: "private", label: "Private" },
];

export function HomePage() {
  //const { user } = useAuth();
  const [groups, setGroups] = useState<CatalogGroupItem[]>([]);
  const [filter, setFilter] = useState<VisibilityFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const isPrivate = filter === "all" ? undefined : filter === "private";

    fetchGroups({ isPrivate })
      .then((loadedGroups) => {
        if (!cancelled) {
          setErrorMessage(null);
          setGroups(loadedGroups);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setErrorMessage(
            err instanceof ApiError ? err.message : "Failed to load groups.",
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
  }, [filter]);

  // Client-side filtering by title and tags for instant search feedback
  const visibleGroups = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return groups;
    }

    return groups.filter((group) => {
      const titleMatch = group.title.toLowerCase().includes(normalizedQuery);
      const tagsMatch = (group.tags ?? "")
        .toLowerCase()
        .includes(normalizedQuery);
      return titleMatch || tagsMatch;
    });
  }, [groups, searchQuery]);

  return (
    <>
      <section className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl leading-tight font-medium">All Groups</h1>
          <p className="mt-1 text-muted">
            Browse public and private study groups across the platform.
          </p>
        </div>

        <SegmentedFilter
          ariaLabel="Filter groups by visibility"
          options={VISIBILITY_OPTIONS}
          value={filter}
          onChange={(nextFilter) => {
            if (nextFilter === filter) {
              return; // Early return if no change
            }

            setIsLoading(true);
            setFilter(nextFilter);
          }}
        />
      </section>

      <section aria-label="Search and group catalog">
        <div className="mb-5">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search groups by title or tags..."
          />
        </div>

        {errorMessage ? (
          <p className="rounded-xl border border-current/15 p-6 text-sm text-danger">
            {errorMessage}
          </p>
        ) : isLoading ? (
          <p className="rounded-xl border border-current/15 p-6 text-sm text-muted">
            Loading groups…
          </p>
        ) : visibleGroups.length === 0 ? (
          <p className="rounded-xl border border-current/15 p-6 text-sm text-muted">
            No groups match your search or filter.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGroups.map((group) => {
              return (
                <GroupCard
                  key={group.group_id}
                  group={group}
                  memberCount={group.member_count}
                  membershipStatus={group.membership_status}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
