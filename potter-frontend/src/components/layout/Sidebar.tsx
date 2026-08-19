// src/components/Sidebar.tsx

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r p-4">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 ${
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/plants"
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 ${
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`
          }
        >
          Plants
        </NavLink>

        <NavLink
          to="/shelves"
          className={({ isActive }) =>
            `block rounded-md px-3 py-2 ${
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
            }`
          }
        >
          Shelves
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
