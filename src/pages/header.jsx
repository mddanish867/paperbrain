import { FileText, LogOut, User } from "lucide-react"
import { useAuth } from "../context/auth-context"
import { useState } from "react"

export default function Header({ uploadedFile, onRemoveFile, onShowLibrary }) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold text-foreground">PDF Chat</h1>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onShowLibrary}
              className="rounded-lg bg-secondary px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              <span className="hidden sm:inline">My Library</span>
              <span className="sm:hidden">Library</span>
            </button>

            {uploadedFile && (
              <button
                onClick={onRemoveFile}
                className="rounded-lg bg-secondary px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                <span className="hidden sm:inline">New Document</span>
                <span className="sm:hidden">New</span>
              </button>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 rounded-lg bg-primary px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg">
                  <div className="p-3 border-b border-border">
                    <p className="font-medium text-card-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
