import { useAuth } from "../../context/auth-context"
import { useNavigate } from "react-router-dom"  
import { useEffect } from "react"
import { Loader2 } from "lucide-react"


export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()   

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login") 
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
