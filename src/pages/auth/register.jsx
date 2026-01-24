import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/auth-context"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")

  const { register, registerLoading } = useAuth()
  const navigate = useNavigate()

  const onSwitchToLogin = () => {
    navigate("/login")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    try {
      await register({
        username: name,     // 🔑 backend expects `username`
        email,
        password,
      })

      // optional: redirect to verify/login
      navigate("/login")
    } catch (err) {
      console.error("Register error:", err)
      setError(err.message || "Failed to create account")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">

          <div className="flex flex-col mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join us to start chatting with your PDFs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={registerLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={registerLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={registerLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  disabled={registerLoading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={registerLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  disabled={registerLoading}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              {registerLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
