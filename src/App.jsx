import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/auth/protected-route";
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import UploadPage from "./pages/upload/upload";
import ChatPage from "./pages/chat/ChatPage";
import Summary from "./pages/summary/summary";
import  ResearchReportGenerator from "./pages/research/research";
import LoginPage from "./pages/auth/LoginPage";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-ppassword";
import NotFoundPage from "./pages/home/notfound";
import AboutPage from "./pages/home/about";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login2" element={<Login />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> 
        <Route path="/about" element={<AboutPage />} />  

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <Summary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/research"
          element={
            <ProtectedRoute>
              <ResearchReportGenerator />
            </ProtectedRoute>
          }
        />
         <Route path="*" element={<NotFoundPage />} />  
       
      </Routes>
    </Router>
  );
}

export default App;