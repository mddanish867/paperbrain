import { useState, useEffect } from "react";
import ProtectedRoute from "../auth/protected-route";
import { Link } from "react-router-dom";
import {
  FileText,
  MessageCircle,
  MessageSquareShare,
  Menu,
  X,
  Send,
} from "lucide-react";
import { sendMessageApi } from "../../api/chat";

export default function ChatPage() {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [currentPdfName, setCurrentPdfName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  /* ---------------- LOAD UPLOADED DOCUMENT ---------------- */
  useEffect(() => {
    const fileData = sessionStorage.getItem("uploadedFile");
    const pdfUrl = sessionStorage.getItem("pdfUrl");

    if (!fileData || !pdfUrl) return;

    const file = JSON.parse(fileData);

    setCurrentPdfName(file.name);
    setCurrentPdfUrl(pdfUrl);

    const chat = {
      id: file.session_id,
      name: `Chat with ${file.name}`,
      pdfName: file.name,
      lastMessage: "New conversation",
      timestamp: "Just now",
    };

    setChatSessions([chat]);
    setSelectedChat(chat.id);

    setMessages([
      {
        id: "system",
        text: `I've loaded "${file.name}". Ask me anything about it.`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }, []);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const fileData = JSON.parse(sessionStorage.getItem("uploadedFile"));
    if (!fileData) return;

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const res = await sendMessageApi({
        message: userMessage.text,
        session_id: fileData.session_id,
        document_id: fileData.id,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}_ai`,
          text: res.answer,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          text: err.message || "Chat failed",
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const createNewChat = () => {
    const id = Date.now().toString();
    const chat = {
      id,
      name: `New Chat`,
      pdfName: currentPdfName,
      lastMessage: "New conversation",
      timestamp: "Just now",
    };
    setChatSessions((p) => [chat, ...p]);
    setSelectedChat(id);
    setMessages([]);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-50">

        {/* ---------------- TOP BAR (OPEN SIDEBAR BUTTON HERE) ---------------- */}
        <div className="h-14 bg-white border-b flex items-center px-4 gap-3">
          {!isLeftPanelOpen ? (
            <button
              onClick={() => setIsLeftPanelOpen(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          ):
          (
            <div className="w-[245px] border-r flex justify-between items-center">
                <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <Link to="/" className="text-xl font-bold text-gray-900">
              PaperBrain
            </Link>
          </div>
                <button
                  onClick={() => setIsLeftPanelOpen(false)}
                  className="p-2 rounded hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
          )
          }
        
        </div>

        {/* ---------------- MAIN LAYOUT ---------------- */}
        <div className="flex flex-1 overflow-hidden">

          {/* SIDEBAR */}
          {isLeftPanelOpen && (
            <div className="w-[260px] bg-white border-r flex flex-col">             

              <button
                onClick={createNewChat}
                className="m-2 flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 rounded px-2 py-1"
              >
                <MessageSquareShare className="h-4 w-4" />
                New Chat
              </button>

              <div className="flex-1 overflow-y-auto">
                {chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 cursor-pointer border-b ${
                      selectedChat === chat.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <p className="text-sm font-medium">{chat.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {chat.pdfName}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF VIEWER */}
          <div className="flex-1 bg-gray-100 p-4">
            <div className="h-full bg-white border rounded flex items-center justify-center">
              {currentPdfUrl ? (
                <iframe
                  src={currentPdfUrl}
                  title="PDF"
                  className="w-full h-full"
                />
              ) : (
                <div className="text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-2" />
                  No PDF loaded
                </div>
              )}
            </div>
          </div>

          {/* CHAT */}
          <div className="w-[380px] bg-white border-l flex flex-col">
            <div className="p-4 border-b flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Chat</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      m.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 border"
                    }`}
                  >
                    <p className="text-sm">{m.text}</p>
                    <p className="text-xs mt-1 text-gray-500">
                      {m.timestamp}
                    </p>

                    {!m.isUser && (
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <button>👍</button>
                        <button>👎</button>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(m.text)
                          }
                        >
                          📋
                        </button>
                        <button
                          onClick={() =>
                            setActiveMenuId(
                              activeMenuId === m.id ? null : m.id
                            )
                          }
                        >
                          ⋮
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="text-sm text-gray-500">
                  AI is typing…
                </div>
              )}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSendMessage()
                }
                placeholder="Ask about the document…"
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
