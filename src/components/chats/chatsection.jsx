import { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, ThumbsUp, ThumbsDown, Copy, Share2, RefreshCw } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";
import SourceChips from "./SourceChips";

export default function ChatSection({
  messages,
  isTyping,
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleRegenerate,
  handleFeedback,
  handleShare,
  streamingMessageId
}) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const renderMessageContent = (message) => {
    if (message.isStreaming && message.text === '') {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      );
    }

    return (
      <div className="prose prose-sm max-w-none">
        <MarkdownRenderer content={message.text} />
        {!message.isUser && message.sources && message.sources.length > 0 && (
          <SourceChips sources={message.sources} />
        )}
      </div>
    );
  };

  return (
    <div className="w-[450px] bg-white border-l flex flex-col">
      <div className="p-4 border-b flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-blue-600" />
        <span className="font-medium">Chat</span>
      </div>

      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-4 min-h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle className="h-12 w-12 mb-2" />
              <p className="text-sm">Start a conversation with the document</p>
              <p className="text-xs mt-1">Ask questions about the PDF content</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] px-3 py-2 rounded-lg ${
                    message.isUser 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-100 border border-gray-200"
                  } ${message.isStreaming ? 'border-blue-300 shadow-sm' : ''}`}
                >
                  {renderMessageContent(message)}
                  
                  <div className={`flex items-center justify-between mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    <span className="text-xs opacity-75">
                      {message.timestamp}
                      {message.isRegeneration && (
                        <span className="ml-1 text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">
                          Regenerated
                        </span>
                      )}
                    </span>
                    
                    {!message.isUser && !message.isStreaming && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleFeedback(message.id, 'like')}
                          className={`p-1 rounded transition-colors ${
                            message.feedback?.liked 
                              ? 'bg-green-100 text-green-600' 
                              : 'hover:bg-gray-200'
                          }`}
                          title="Like this response"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleFeedback(message.id, 'dislike')}
                          className={`p-1 rounded transition-colors ${
                            message.feedback?.disliked 
                              ? 'bg-red-100 text-red-600' 
                              : 'hover:bg-gray-200'
                          }`}
                          title="Dislike this response"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => navigator.clipboard.writeText(message.text)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleShare(message.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => handleRegenerate(message.id)}
                          className="p-1 rounded hover:bg-gray-200 transition-colors"
                          title="Regenerate response"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && !streamingMessageId && (
            <div className="flex justify-start">
              <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about the document…"
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || isTyping}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        
        {isTyping && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI is thinking...
          </p>
        )}
      </div>

      {/* Scrollbar styling */}
      <style jsx>{`
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
}