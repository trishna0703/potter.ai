import Search from "#components/utils/Search";
import useDebounce from "#hooks/useDebounce";
import { SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import type { ConcernFilters } from "../HealthConcerns";

interface ConcernFilterProps {
  filters: ConcernFilters;
  setFilters: React.Dispatch<React.SetStateAction<ConcernFilters>>;
}

const ConcernFilter = ({ filters, setFilters }: ConcernFilterProps) => {
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

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const sortingOptions = [
    {
      label: "Reported On",
      value: "reported_on",
    },
    {
      label: "Occurred On",
      value: "occurred_on",
    },
    {
      label: "Species",
      value: "species",
    },
  ];

  const filteringOptions = [
    {
      label: "Open",
      value: "OPEN",
    },
    {
      label: "Closed",
      value: "CLOSED",
    },
  ];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Search */}
      <Search
        value={search}
        onChange={setSearch}
        placeholder="Search concerns..."
        className="w-full md:max-w-72"
      />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3">
        {/* Status */}
        <Tabs
          value={filters.status}
          onValueChange={(value) =>
            updateFilter("status", value as ConcernFilters["status"])
          }
          className="w-full sm:w-max"
        >
          <TabsList className="h-10! w-full rounded-full bg-secondary/30 p-0">
            {filteringOptions.map(({ label, value }) => (
              <TabsTrigger
                value={value}
                className="min-w-20 rounded-full data-active:bg-secondary data-active:text-primary"
                key={value}
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sort */}
        <Select
          value={
            sortingOptions.find((opt) => opt.value === filters.sort_by)?.value
          }
          onValueChange={(value) =>
            updateFilter("sort_by", value as ConcernFilters["sort_by"])
          }
        >
          <SelectTrigger className="h-10! w-42 border-[0.5px] border-muted bg-card">
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

        {/* Sort direction */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSortOrder}
          title={
            filters.sort_order === "asc" ? "Sort ascending" : "Sort descending"
          }
          className="size-10 border-[0.5px] border-muted bg-card"
        >
          {filters.sort_order === "asc" ? (
            <SortAscendingIcon size={20} />
          ) : (
            <SortDescendingIcon size={20} />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConcernFilter;
