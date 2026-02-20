import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";
import { useAuth } from "../../../context/auth-context";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "Chat" },
  { to: "/research", label: "Research" },
  { to: "/about", label: "About" },
];


export default function Navbar() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <FileText className="h-10 w-10 text-blue-600" />
            <div className="flex flex-col leading-tight">
              <span className="text-xl font-bold text-gray-900">PaperBrain</span>
              <p className="text-sm text-gray-500">Intelligent Platform</p>
            </div>
          </Link>

          {/* ── Desktop nav (centered) ── */}
          <nav className="hidden md:flex flex-1 justify-center space-x-6">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-black hover:text-blue-600 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right side: hamburger + auth ── */}
          <div className="flex items-center space-x-4 ml-auto">

            {/* Hamburger — mobile & tablet only */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden text-gray-700"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Authenticated: avatar + dropdown | Guest: login button */}
            {user ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}