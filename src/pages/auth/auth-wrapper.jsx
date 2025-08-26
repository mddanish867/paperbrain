import { useState } from "react"
import { FileText } from "lucide-react"
import Login from "./login"
import Register from "./register"
import ForgotPassword from "./forgot-password"
import ResetPassword from "./reset-password"

type  = "login" | "register" | "forgot-password" | "reset-password"


export default function AuthWrapper({
  onLogin,
  onRegister,
  onSendResetEmail,
  onResetPassword,
  resetToken,
}) {
  const [currentView, setCurrentView] = useState<AuthView>(resetToken ? "reset-password" : "login")

  const handleResetSuccess = () => {
    setCurrentView("login")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">PDF Chat</h1>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          {currentView === "login" && (
            <Login
              onSwitchToRegister={() => setCurrentView("register")}
              onSwitchToForgotPassword={() => setCurrentView("forgot-password")}
              onLogin={onLogin}
            />
          )}

          {currentView === "register" && (
            <Register onSwitchToLogin={() => setCurrentView("login")} onRegister={onRegister} />
          )}

          {currentView === "forgot-password" && (
            <ForgotPassword onSwitchToLogin={() => setCurrentView("login")} onSendResetEmail={onSendResetEmail} />
          )}

          {currentView === "reset-password" && resetToken && (
            <ResetPassword token={resetToken} onResetPassword={onResetPassword} onSuccess={handleResetSuccess} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
