import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

const home = () => {
     const { user, logout } = useAuth();
      const [showUserMenu, setShowUserMenu] = useState(false);
  return (
    <header className="">
        <div className="container mx-auto px-4 sm:px-6 ">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PaperBrain</span>
            </div>
             <div>
              <Link
                  to="/"
                  className="text-black py-2 lg transition-colors"
                >
                  Home
                </Link>
            </div>
 <div>
              <Link
                  to="/research"
                  className="text-black px-4 py-2 lg transition-colors"
                >
                  Research
                </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="hidden sm:block">
                      {user?.username || user?.email || "User"}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                      <div className="py-1">
                        <a
                          href="/upload"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Upload PDF
                        </a>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-600 text-white px-4 py-2 rounded-none hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              )}              
            </div>
           
          </div>
        </div>
      </header>
  )
}

export default home
