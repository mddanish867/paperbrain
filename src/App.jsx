// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/auth/protected-route";
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import UploadPage from "./pages/pdf/upload";
import ChatPage from "./pages/chat/chat";
import Summary from "./pages/summary/summary";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
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
      </Routes>
    </Router>
  );
}

export default App;