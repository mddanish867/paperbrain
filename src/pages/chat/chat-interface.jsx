import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, History, Trash2 } from "lucide-react"



export default function ChatInterface({
  extractedText,
  isChatOpen,
  onToggleChat,
  pdfId,
  chatId,
  onShowHistory,
}) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(chatId || null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (chatId && pdfId) {
      loadChatHistory(chatId)
    } else {
      setMessages([])
      setCurrentChatId(null)
    }
  }, [chatId, pdfId])

  const loadChatHistory = async (chatId) => {
    try {
      const response = await fetch(`/api/pdfs/${pdfId}/chats/${chatId}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(
          data.messages.map((msg) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        )
        setCurrentChatId(chatId)
      }
    } catch (error) {
      console.error("[v0] Error loading chat history:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message: inputMessage,
          pdfText: extractedText,
          pdfId,
          chatId: currentChatId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])

        if (data.chatId && !currentChatId) {
          setCurrentChatId(data.chatId)
        }
      } else {
        throw new Error("Failed to get AI response")
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error processing your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear this chat? This action cannot be undone.")) {
      setMessages([])
      setCurrentChatId(null)
    }
  }

  const suggestedQuestions = [
    "What is this document about?",
    "Can you summarize the main points?",
    "What are the key findings?",
    "Explain the important concepts",
  ]

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question)
  }

  return (
    <div className="w-full lg:w-96 bg-card border border-border rounded-lg flex-col min-h-0">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          <span className="font-medium text-card-foreground text-sm sm:text-base">Chat with PDF</span>
        </div>
        <div className="flex items-center space-x-2">
          {onShowHistory && (
            <button
              onClick={onShowHistory}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation"
              title="Chat History"
            >
              <History className="h-4 w-4" />
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation text-muted-foreground hover:text-destructive"
              title="Clear Chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onToggleChat}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <MessageCircle className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <h3 className="font-medium text-card-foreground mb-2 text-sm sm:text-base">Start a conversation</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              Ask questions about your PDF document
            </p>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="block w-full text-left p-2 text-xs sm:text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors touch-manipulation"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2.5 sm:p-3 ${
                message.isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <p className="text-xs sm:text-sm whitespace-pre-wrap">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-lg p-2.5 sm:p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="text-xs sm:text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-4 border-t border-border">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask a question about your PDF..."
            className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[2.5rem] touch-manipulation"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="rounded-lg bg-primary p-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation flex-shrink-0"
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  )
}
