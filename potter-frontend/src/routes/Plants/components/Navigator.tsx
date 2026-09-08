import Search from "#components/utils/Search";
import useDebounce from "#hooks/useDebounce";
import {
  FunnelSimpleIcon,
  PlusIcon,
  SortAscendingIcon,
  SortDescendingIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Filters } from "../Plants";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import AddNewPlantButton from "#components/utils/AddNewPlantButton";

interface NavigatorProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const Navigator = ({ filters, setFilters }: NavigatorProps) => {
  const [search, setSearch] = useState(filters.query);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      query: debouncedSearch,
    }));
  }, [debouncedSearch, setFilters]);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sort_order: prev.sort_order === "asc" ? "desc" : "asc",
    }));
  };

  const sortingOptions = [
    { label: "Added On", value: "added_on" },
    { label: "Name", value: "name" },
    { label: "Species", value: "species" },
    { label: "Height", value: "height_cm" },
    { label: "Pot Size", value: "pot_size" },
  ];
  const FilteringOptions = [
    { label: "All", value: "ALL" },
    { label: "Indoor", value: "INDOOR" },
    { label: "Outdoor", value: "OUTDOOR" },
  ];

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {/* Search */}
      <Search
        value={search}
        onChange={setSearch}
        placeholder="Search plants..."
        className="w-full md:max-w-72"
      />

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Status */}

        {/* Location */}
        <Tabs
          value={filters.location_type}
          onValueChange={(value) =>
            updateFilter("location_type", value as Filters["location_type"])
          }
        >
          <TabsList className={"bg-secondary/30 rounded-full p-0 h-10!"}>
            {FilteringOptions.map(({ label, value }) => (
              <TabsTrigger
                value={value}
                className={
                  "data-active:bg-secondary rounded-full min-w-20 data-active:text-primary"
                }
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
            sortingOptions.find((opt) => opt.value === filters.sort_by)?.label
          }
          onValueChange={(value) =>
            updateFilter("sort_by", value as Filters["sort_by"])
          }
        >
          <SelectTrigger className="w-42 h-10! border[0.5px] border-muted bg-card">
            <p className="text-muted-foreground">Sort By: </p>
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
          className={"size-10 bg-card border-muted border-[0.5px]"}
        >
          {filters.sort_order === "asc" ? (
            <SortAscendingIcon size={20} />
          ) : (
            <SortDescendingIcon size={20} />
          )}
        </Button>

        {/* Mobile filter button */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="md:hidden"
        >
          <FunnelSimpleIcon size={20} />
        </Button>
        <AddNewPlantButton>
          <span className="button-custom">
            <PlusIcon size={16} /> Add Plant
          </span>
        </AddNewPlantButton>
      </div>
    </div>
  );
};

export default Navigator;
