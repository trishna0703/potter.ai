import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const Search = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchProps) => {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border-[0.5px] border-muted px-3 py-2 h-10 bg-card ${className}`}
    >
      <MagnifyingGlassIcon
        size={20}
        className="shrink-0 text-muted-foreground"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <XIcon size={16} />
        </button>
      )}
    </div>
  );
};

export default Search;
