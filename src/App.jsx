import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MainChat from "./services/MainChat";
import Header from "./pages/header";
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import UploadPage from "./pages/pdf/upload";
import ChatPage from "./pages/chat/chat";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
