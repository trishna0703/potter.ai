import useGetConcerns from "./hooks/useGetConcerns";
import { useMemo, useState } from "react";
import HealthConcernSkeleton from "./components/Skeleton";
import NoConcernFound from "./components/NoConcernFound";
import ConcernBanner from "./components/ConcernBanner";
import ConcernFilter from "./components/ConcernFilter";
import ConcernCard from "./components/ConcernCard";

type SortBy = "reported_on" | "occurred_on" | "species";
type SortOrder = "asc" | "desc";
export interface ConcernFilters {
  query: string;
  status: "OPEN" | "COMPLETED" | "ALL";
  sort_by: SortBy;
  sort_order: SortOrder;
  page: number;
  page_size: number;
}

const HealthConcerns = ({}) => {
  const [filters, setFilters] = useState<ConcernFilters>({
    query: "",
    status: "ALL",
    sort_by: "reported_on" as SortBy,
    sort_order: "asc" as SortOrder,
    page: 1,
    page_size: 10,
  });

  const query = Object.entries(filters)
    .filter(([key, value]) => {
      if (key === "query" && !value) return false;

      return true;
    })
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");

  const { getConcerns } = useGetConcerns();
  const { data: concerns, isLoading } = getConcerns(query);
  const { data: allConcerns } = getConcerns("status=ALL");

  const active = useMemo(
    () => allConcerns?.filter((c) => c.status === "OPEN").length ?? 0,
    [allConcerns],
  );
  const monitoring = useMemo(
    () => allConcerns?.filter((c) => c.status === "MONITORING").length ?? 0,
    [allConcerns],
  );
  const resolved = useMemo(
    () => allConcerns?.filter((c) => c.status === "COMPLETED").length ?? 0,
    [allConcerns],
  );

  return (
    <div className="flex flex-col gap-5">
      <ConcernBanner
        monitoring={monitoring}
        needAttention={active}
        resolved={resolved}
      />

      <ConcernFilter
        {...{ filters, setFilters, active, monitoring, resolved }}
        total={allConcerns?.length ?? 0}
      />

      {isLoading ? <HealthConcernSkeleton /> : null}
      {!isLoading && concerns && concerns.length === 0 ? (
        <NoConcernFound />
      ) : null}
      {concerns && concerns.length > 0 ? (
        <section className="h-auto flex flex-col gap-4 w-full">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-4">
            {concerns.map((concern) => (
              <ConcernCard {...{ concern }} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HealthConcerns;
