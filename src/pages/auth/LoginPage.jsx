import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  FileText,
  Github,
} from "lucide-react";
import { useAuth } from "../../context/auth-context";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login, loginLoading } = useAuth();
  const navigate = useNavigate();

  const onSwitchToRegister = () => {
    navigate("/register");
  };
  const onSwitchToForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await login({
        username_or_email: email,
        password,
      });

      // ensure auth state settles
      setTimeout(() => navigate("/"), 100);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    }
  };

  const handleOAuthLogin = (provider) => {
    // Implement OAuth login logic here
    console.log(`Logging in with ${provider}`);
    // Example: window.location.href = `/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-xl  overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-gray-200">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-4">
              <FileText className="h-12 w-12 text-blue-600" />
              <div className="text-left">
                <span  className="text-2xl font-bold text-gray-900">
                  PaperBrain
                </span>
                <p className="text-sm text-gray-500">Intelligent Platform</p>
              </div>
            </Link>
            <p className="text-gray-600">
              Sign in to continue with your account
            </p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Side - OAuth Buttons */}
            <div className="lg:w-1/2 p-8 border-r border-gray-200">
              <h3 className="text-xl font-semibold mb-6">Continue with</h3>
              
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleOAuthLogin("github")}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Github className="h-6 w-6" />
                  <span className="text-sm font-medium">GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("gitlab")}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189a.455.455 0 0 0-.867 0L16.418 9.45H7.582L4.919 1.263a.455.455 0 0 0-.867 0L1.388 9.452.045 13.587a.924.924 0 0 0 .331 1.023L12 23.054l11.624-8.443a.92.92 0 0 0 .331-1.024" />
                  </svg>
                  <span className="text-sm font-medium">GitLab</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("azure")}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                  </svg>
                  <span className="text-sm font-medium">Azure</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOAuthLogin("bitbucket")}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.778 1.213a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.528H9.522L8.17 8.464h7.561z" />
                  </svg>
                  <span className="text-sm font-medium">Bitbucket</span>
                </button>
              </div>
            </div>

            {/* Right Side - Email Login */}
            <div className="lg:w-1/2 p-8">
              <h3 className="text-xl font-semibold mb-6">Sign in with Email</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loginLoading}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loginLoading}
                      className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-50"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={loginLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onSwitchToForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={onSwitchToRegister}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}