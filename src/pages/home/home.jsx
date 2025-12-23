import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Link } from "react-router-dom";
import { FileText, Menu, X } from "lucide-react";

const Home = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16">

          {/* LEFT: Logo */}
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              PaperBrain
            </span>
          </div>

          {/* CENTER: Desktop Nav */}
          <nav className="hidden md:flex flex-1 justify-center space-x-6">
            <Link to="/" className="text-black hover:text-blue-600">
              Home
            </Link>
            <Link to="/research" className="text-black hover:text-blue-600">
              Research
            </Link>
          </nav>

          {/* RIGHT: Auth + Hamburger */}
          <div className="flex items-center space-x-4 ml-auto">

            {/* Hamburger (Mobile & Tablet) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden sm:block">
                    {user?.username || user?.email || "User"}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
                    <Link
                      to="/upload"
                      className="block px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Upload PDF
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 rounded-lg"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-b shadow-lg z-10">
            <nav className="flex flex-col space-y-4 px-6 py-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-black hover:text-blue-600"
              >
                Home
              </Link>
              <Link
                to="/research"
                onClick={() => setMobileMenuOpen(false)}
                className="text-black hover:text-blue-600"
              >
                Research
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Home;
