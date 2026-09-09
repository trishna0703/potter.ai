import Search from "#components/utils/Search";
import useDebounce from "#hooks/useDebounce";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ConcernFilters } from "../HealthConcerns";
import { cn } from "#lib/utils";

interface ConcernFilterProps {
  active: number;
  monitoring: number;
  resolved: number;
  total: number;
  filters: ConcernFilters;
  setFilters: React.Dispatch<React.SetStateAction<ConcernFilters>>;
}

const ConcernFilter = ({
  active,
  resolved,
  monitoring,
  total,
  filters,
  setFilters,
}: ConcernFilterProps) => {
  const [search, setSearch] = useState(filters.query);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch, setFilters]);

  const updateFilter = <K extends keyof ConcernFilters>(
    key: K,
    value: ConcernFilters[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  const sortingOptions = [
    {
      label: "Newest first",
      value: "reported_on",
      order: "asc",
    },
    {
      label: "Newest last",
      value: "reported_on",
      order: "desc",
    },
  ];

  const filteringOptions = [
    {
      label: `All ${total ? `(${total})` : ""}`,
      value: "ALL",
    },
    {
      label: `Needs Attention ${active ? `(${active})` : ""}`,
      value: "OPEN",
    },
    {
      label: `Monitoring ${monitoring ? `(${monitoring})` : ""}`,
      value: "MONITORING",
    },
    {
      label: `Resolved ${resolved ? `(${resolved})` : ""}`,
      value: "COMPLETED",
    },
  ];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Status */}
      <div className="flex gap-2 overflow-x-scroll w-full no-scrollbar">
        {filteringOptions.map(({ label, value }) => (
          <Button
            value={value}
            variant={filters.status === value ? "secondary" : "outline"}
            className={cn(
              "min-w-20 rounded-full data-active:bg-secondary data-active:text-primary text-xs h-10! px-4",
              filters.status !== value
                ? "bg-card/70 border-muted text-muted-foreground"
                : "",
            )}
            onClick={() =>
              updateFilter("status", value as ConcernFilters["status"])
            }
            key={value}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-end gap-3">
        {/* Search */}
        <Search
          value={search}
          onChange={setSearch}
          placeholder="Search concerns..."
          className="w-full md:max-w-72"
        />
        {/* Sort */}
        <Select
          value={
            sortingOptions.find((opt) => opt.value === filters.sort_by)?.label
          }
          onValueChange={(value) => {
            let sortOrder = sortingOptions.find(
              (opt) => opt.value === filters.sort_by,
            )?.order;
            updateFilter("sort_by", value as ConcernFilters["sort_by"]);
            updateFilter(
              "sort_order",
              sortOrder as ConcernFilters["sort_order"],
            );
          }}
        >
          <SelectTrigger className="h-10! w-48 border-[0.5px] border-muted bg-card">
            <p className="text-muted-foreground">Sort By:</p>

            <SelectValue placeholder="Sort by" />
          </SelectTrigger>

          <SelectContent>
            {sortingOptions.map((opt) => (
              <SelectItem value={opt.value} key={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ConcernFilter;
