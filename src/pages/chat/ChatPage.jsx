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
  ThumbsUp,
  ThumbsDown,
  Copy,
  MoreVertical
} from "lucide-react";

import { sendMessageApi, getChatHistoryApi } from "../../api/chat";
import { listDocumentSessionsApi } from "../../api/documents";

export default function ChatPage() {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [currentPdfName, setCurrentPdfName] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [activeSessionMenu, setActiveSessionMenu] = useState(null); // 👈 NEW

  /* ---------------- LOAD CHAT HISTORY ---------------- */
  const loadChatHistory = async (session_id) => {
    try {
      const history = await getChatHistoryApi(session_id);

      if (!history || !Array.isArray(history.messages)) {
        setMessages([]);
        return;
      }

      const formatted = history.messages.flatMap((item, index) => [
        {
          id: `q_${index}`,
          text: item.question,
          isUser: true,
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
        },
        {
          id: `a_${index}`,
          text: item.answer,
          isUser: false,
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
        },
      ]);

      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load chat history", err);
    }
  };

  /* ---------------- LOAD SIDEBAR SESSIONS ---------------- */
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessions = await listDocumentSessionsApi();

        const mapped = sessions.map((s) => ({
          id: s.session_id,
          document_id: s.document_id,
          name: `Chat with ${s.filename}`,
          pdfName: s.filename,
          file_url: s.file_url,
          chunk_count: s.chunk_count,
          created_at: s.created_at,
        }));

        setChatSessions(mapped);

        if (mapped.length > 0) {
          const first = mapped[0];
          setSelectedChat(first.id);
          setCurrentPdfUrl(first.file_url);
          setCurrentPdfName(first.pdfName);
          loadChatHistory(first.id);
        }
      } catch (err) {
        console.error("Failed to load document sessions", err);
      }
    };

    loadSessions();
  }, []);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const activeSession = chatSessions.find(s => s.id === selectedChat);
    if (!activeSession) return;

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    try {
      const res = await sendMessageApi({
        message: userMessage.text,
        session_id: activeSession.id,
        document_id: activeSession.document_id,
      });

      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}_ai`,
          text: res.response,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
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

  /* ---------------- SESSION ACTIONS ---------------- */

  const handleRenameSession = (sessionId) => {
    const newName = prompt("Enter new session name");
    if (!newName) return;

    setChatSessions(prev =>
      prev.map(s =>
        s.id === sessionId ? { ...s, name: newName } : s
      )
    );
    setActiveSessionMenu(null);
  };

  const handleDeleteSession = (sessionId) => {
    const confirmDelete = window.confirm("Delete this session?");
    if (!confirmDelete) return;

    setChatSessions(prev => prev.filter(s => s.id !== sessionId));

    if (selectedChat === sessionId) {
      setSelectedChat(null);
      setMessages([]);
      setCurrentPdfUrl(null);
      setCurrentPdfName("");
    }

    setActiveSessionMenu(null);
  };

  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col bg-gray-50">

        {/* ---------------- TOP BAR ---------------- */}
        <div className="h-14 bg-white border-b flex items-center px-4 gap-3">
          {!isLeftPanelOpen ? (
            <button
              onClick={() => setIsLeftPanelOpen(true)}
              className="p-2 rounded hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
          ) : (
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
          )}
        </div>

        {/* ---------------- MAIN ---------------- */}
        <div className="flex flex-1 overflow-hidden">

          {/* SIDEBAR */}
          {isLeftPanelOpen && (
            <div className="w-[260px] bg-white border-r flex flex-col">
              <button
                className="m-2 flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 rounded px-2 py-1"
              >
                <MessageSquareShare className="h-4 w-4" />
                New Chat
              </button>

              <div className="flex-1 overflow-y-auto">
                {chatSessions.map((chat) => (
                  <div
                    key={chat.id}
                    className={`relative p-4 border-b cursor-pointer ${
                      selectedChat === chat.id
                        ? "bg-blue-50 border-l-4 border-l-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedChat(chat.id);
                      setCurrentPdfUrl(chat.file_url);
                      setCurrentPdfName(chat.pdfName);
                      loadChatHistory(chat.id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{chat.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {chat.pdfName}
                        </p>
                      </div>

                      {/* 3 DOT MENU */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSessionMenu(
                            activeSessionMenu === chat.id ? null : chat.id
                          );
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {/* POPUP */}
                    {activeSessionMenu === chat.id && (
                      <div
                        className="absolute right-2 top-10 bg-white border rounded shadow-md z-50 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                          onClick={() => handleRenameSession(chat.id)}
                        >
                          Rename
                        </button>
                        <button
                          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100"
                          onClick={() => handleDeleteSession(chat.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PDF VIEWER */}
          <div className="flex-1 bg-gray-100 p-4">
            <div className="h-full bg-white border rounded flex items-center justify-center">
              {currentPdfUrl ? (
                <iframe src={currentPdfUrl} title="PDF" className="w-full h-full" />
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
                <div key={m.id} className={`flex ${m.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      m.isUser ? "bg-blue-600 text-white" : "bg-gray-100 border"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{m.text}</p>
                    <p className="text-xs mt-1 text-gray-500">{m.timestamp}</p>

                    {!m.isUser && (
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <ThumbsUp className="w-3 h-3 text-gray-400" />
                        <ThumbsDown className="w-3 h-3 text-gray-400" />
                        <button onClick={() => navigator.clipboard.writeText(m.text)}>
                          <Copy className="w-3 h-3 text-gray-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && <div className="text-sm text-gray-500">AI is typing…</div>}
            </div>

            <div className="p-4 border-t flex gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about the document…"
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 rounded-lg">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
