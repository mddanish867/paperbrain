import { useState, useEffect } from "react"
import { MessageCircle, Calendar, Trash2, ArrowLeft, Plus } from "lucide-react"



export default function ChatHistory({ pdfId, onSelectChat, onNewChat, onBack }) {
  const [chatSessions, setChatSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchChatHistory()
  }, [pdfId])

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/pdfs/${pdfId}/chats`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setChatSessions(data.chats)
      }
    } catch (error) {
      console.error("[v0] Error fetching chat history:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this chat session?")) {
      return
    }

    try {
      const response = await fetch(`/api/pdfs/${pdfId}/chats/${chatId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        setChatSessions(chatSessions.filter((chat) => chat.id !== chatId))
      }
    } catch (error) {
      console.error("[v0] Error deleting chat:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full lg:w-96 bg-card border border-border rounded-lg flex-col min-h-0">
        <div className="p-4 border-b border-border">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="h-3 bg-muted rounded w-24"></div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full lg:w-96 bg-card border border-border rounded-lg flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <button onClick={onBack} className="p-1 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h3 className="font-medium text-card-foreground text-sm sm:text-base">Chat History</h3>
            <p className="text-xs text-muted-foreground">{chatSessions.length} sessions</p>
          </div>
        </div>
        <button
          onClick={onNewChat}
          className="flex items-center space-x-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3 w-3" />
          <span>New</span>
        </button>
      </div>

      {/* Chat Sessions */}
      <div className="flex-1 overflow-auto">
        {chatSessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h4 className="font-medium text-card-foreground mb-2">No chat history</h4>
            <p className="text-sm text-muted-foreground mb-4">Start your first conversation with this PDF</p>
            <button
              onClick={onNewChat}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                className="group p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => onSelectChat(chat.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-card-foreground text-sm truncate mb-1">{chat.title}</h4>
                    <p className="text-xs text-muted-foreground truncate mb-2">{chat.lastMessage}</p>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(chat.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{chat.messageCount} messages</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
