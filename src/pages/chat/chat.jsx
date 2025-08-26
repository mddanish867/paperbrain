
import { useState, useEffect } from "react"
import ProtectedRoute from "../auth/protected-route"
import { FileText, MessageCircle, Plus, Menu, X, Send } from "lucide-react"




export default function ChatPage() {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
  const [chatSessions, setChatSessions] = useState([
    {
      id: "1",
      name: "Research Paper Discussion",
      pdfName: "research-paper.pdf",
      lastMessage: "What are the main findings?",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      name: "Contract Review",
      pdfName: "contract.pdf",
      lastMessage: "Explain clause 5.2",
      timestamp: "1 day ago",
    },
  ])
  const [selectedChat, setSelectedChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null)
  const [currentPdfName, setCurrentPdfName] = useState("")

  // Load uploaded file from sessionStorage
  useEffect(() => {
    const fileData = sessionStorage.getItem("uploadedFile")
    const pdfUrl = sessionStorage.getItem("pdfUrl")

    if (fileData && pdfUrl) {
      const file = JSON.parse(fileData)
      setCurrentPdfName(file.name)
      setCurrentPdfUrl(pdfUrl)

      // Create a new chat session for the uploaded file
      const newChatId = Date.now().toString()
      const newChat = {
        id: newChatId,
        name: `Chat with ${file.name}`,
        pdfName: file.name,
        lastMessage: "New conversation",
        timestamp: "Just now",
      }

      setChatSessions((prev) => [newChat, ...prev])
      setSelectedChat(newChatId)
      setMessages([
        {
          id: "1",
          text: `Hello! I've loaded your PDF "${file.name}". What would you like to know about it?`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }, [])

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId)
    const chat = chatSessions.find((c) => c.id === chatId)
    if (chat) {
      setCurrentPdfName(chat.pdfName)
      // In a real app, you would load the actual PDF and messages for this chat
      setMessages([
        {
          id: "1",
          text: `Loaded chat for ${chat.pdfName}. Previous conversation restored.`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: `I understand you're asking about "${newMessage}". Based on the PDF content, here's what I found...`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const createNewChat = () => {
    const newChatId = Date.now().toString()
    const newChat = {
      id: newChatId,
      name: `New Chat ${chatSessions.length + 1}`,
      pdfName: currentPdfName,
      lastMessage: "New conversation",
      timestamp: "Just now",
    }

    setChatSessions((prev) => [newChat, ...prev])
    setSelectedChat(newChatId)
    setMessages([
      {
        id: "1",
        text: "Hello! How can I help you with this document?",
        isUser: false,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-gray-50 flex">
        {/* Left Panel - Chat History */}
        <div
          className={`${
            isLeftPanelOpen ? "w-80" : "w-0"
          } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col overflow-hidden`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Chats</h2>
              <button
                onClick={createNewChat}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === chat.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{chat.pdfName}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                {isLeftPanelOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">PDF Chat</span>
              </div>
              <div className="flex-1" />
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
            </div>
          </div>

          {/* Content Area - PDF and Chat */}
          <div className="flex-1 flex">
            {/* PDF Viewer - Middle */}
            <div className="flex-1 bg-gray-100 p-4">
              <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                {currentPdfUrl ? (
                  <iframe src={currentPdfUrl} className="w-full h-full rounded-lg" title="PDF Viewer" />
                ) : (
                  <div className="text-center text-gray-500">
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>No PDF loaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Window - Right */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-gray-900">Chat</h3>
                </div>
                {currentPdfName && <p className="text-sm text-gray-500 mt-1">{currentPdfName}</p>}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isUser ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask about the PDF..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
