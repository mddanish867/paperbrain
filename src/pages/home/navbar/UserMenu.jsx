import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

const USER_MENU_LINKS = [
  { to: "/upload", label: "Upload PDF" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/account", label: "Account" },
];


export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      {/* ── Avatar trigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center space-x-2"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.username?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">
          {user?.username || user?.email || "User"}
        </span>
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
          {USER_MENU_LINKS.map(({ to, label }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-100 border-b transition-colors"
            >
              {label}
            </Link>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              logout();
            }}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}