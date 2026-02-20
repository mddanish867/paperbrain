import { Link } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "Chat" },
  { to: "/research", label: "Research" },
  { to: "/about", label: "About" },
];

/**
 * MobileMenu
 * Slide-down nav drawer shown on small / medium screens.
 * @param {boolean}  isOpen
 * @param {function} onClose  – call on every link click to collapse the menu
 */
export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-b shadow-lg z-10">
      <nav className="flex flex-col space-y-4 px-6 py-4">
        {NAV_LINKS.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className="text-black hover:text-blue-600 transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}