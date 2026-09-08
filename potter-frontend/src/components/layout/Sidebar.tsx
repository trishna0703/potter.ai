// src/components/Sidebar.tsx

import { ROUTES } from "#lib/routes";
import {
  ArchiveIcon,
  HandHeartIcon,
  LeafIcon,
  PottedPlantIcon,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-58 min-h-dvh bg-card p-4 md:flex flex-col hidden">
      <div aria-label="logo" className="flex gap-2 items-center pb-6 px-3">
        <LeafIcon size={32} weight="fill" color="var(--primary)" />
        <span className="text-title text-4xl font-bold">Potter.ai</span>
      </div>
      <nav className="space-y-2">
        <NavLink
          to={ROUTES.DASHBOARD}
          className={({ isActive }) =>
            `hidden rounded-md px-3 py-2 ${
              isActive
                ? "bg-secondary/30 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to={ROUTES.PLANTS}
          className={({ isActive }) =>
            `rounded-md px-3 py-2 flex gap-2 items-center ${
              isActive
                ? "bg-secondary/30 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <PottedPlantIcon
                size={20}
                weight={isActive ? "fill" : "regular"}
              />
              Plants
            </>
          )}
        </NavLink>

        <NavLink
          to={ROUTES.SHELVES}
          className={({ isActive }) =>
            `hidden rounded-md px-3 py-2 ${
              isActive
                ? "bg-secondary/30 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ArchiveIcon size={20} weight={isActive ? "fill" : "regular"} />
              Shelves
            </>
          )}
        </NavLink>
        <NavLink
          to={ROUTES.CONCERNS}
          className={({ isActive }) =>
            `flex gap-2 items-center rounded-md px-3 py-2 ${
              isActive
                ? "bg-secondary/30 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <HandHeartIcon size={20} weight={isActive ? "fill" : "regular"} />
              Concerns
            </>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto w-full">
        <img
          src="/sidebar-filler.png"
          alt="sidebar-filler-image"
          className="w-32 opacity-50"
        />
      </div>
    </aside>
  );
};

export default Sidebar;
