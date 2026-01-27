import { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  SendHorizontal,
  ThumbsUp,
  ThumbsDown,
  Copy,
  CopyCheck,
  Share2,
  RefreshCw,
  Bot,
  FileText,
  User,
} from "lucide-react";
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
  streamingMessageId,
}) {
  const messagesEndRef = useRef(null);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const renderMessageContent = (message) => {
    if (message.isStreaming && message.text === "") {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      );
    }

    return (
      <div className="markdown-wrapper">
        <MarkdownRenderer content={message.text} />
        {!message.isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <SourceChips sources={message.sources} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-[450px] bg-white border-l flex flex-col">
      <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-gray-800">Document Chat</span>
        </div>
        {messages.length > 0 && (
          <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full border">
            {messages.filter((m) => !m.isUser).length} AI responses
          </div>
        )}
      </div>
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="space-y-4 min-h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-full mb-4">
                <MessageCircle className="h-16 w-16 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-700">
                Start a conversation with the document
              </p>
              <p className="text-xs mt-1 text-gray-500 text-center max-w-xs">
                Ask questions about the PDF content, request summaries, or
                analyze specific sections
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[90%] ${message.isUser ? "w-fit" : ""}`}>
                  {/* Avatar and name */}
                  <div
                    className={`flex items-center gap-2 mb-1 ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-white" />
                        </div>                       
                      </div>
                    )}
                    {message.isUser && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-gray-700">
                          You
                        </span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`rounded-3xl px-4 py-3 ${
                      message.isUser
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-md"
                        : "bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-tl-md shadow-sm"
                    } ${message.isStreaming ? "border-blue-300 shadow-sm" : ""}`}
                  >
                    {renderMessageContent(message)}

                    {/* Message actions and timestamp */}
                    <div
                      className={`flex items-center justify-between mt-3 pt-2 ${message.isUser ? "border-blue-500" : "border-gray-200"} border-t`}
                    >
                      <span
                        className={`text-xs ${message.isUser ? "text-blue-200" : "text-gray-400"}`}
                      >
                        {message.timestamp}
                        {message.isRegeneration && (
                          <span className="ml-1 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                            Regenerated
                          </span>
                        )}
                      </span>

                      {!message.isUser && !message.isStreaming && (
                        <div className="flex items-center gap-1">
                          {/* Like button */}
                          <button
                            onClick={() => handleFeedback(message.id, "like")}
                            className={`p-1.5 rounded-full transition-all ${
                              message.feedback?.liked
                                ? "bg-gradient-to-r from-green-100 to-green-50 text-green-600 shadow-sm"
                                : "hover:bg-gray-100 hover:shadow-sm"
                            }`}
                            title="Like this response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          {/* Dislike button */}
                          <button
                            onClick={() =>
                              handleFeedback(message.id, "dislike")
                            }
                            className={`p-1.5 rounded-full transition-all ${
                              message.feedback?.disliked
                                ? "bg-gradient-to-r from-red-100 to-red-50 text-red-600 shadow-sm"
                                : "hover:bg-gray-100 hover:shadow-sm"
                            }`}
                            title="Dislike this response"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>

                          {/* Copy button */}
                          <button
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(
                                  message.text,
                                );
                                setCopiedMessageId(message.id);
                                // Reset icon after 2 seconds
                                setTimeout(() => {
                                  setCopiedMessageId(null);
                                }, 2000);
                              } catch (err) {
                                // Fallback
                                const textArea =
                                  document.createElement("textarea");
                                textArea.value = message.text;
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand("copy");
                                document.body.removeChild(textArea);
                                setCopiedMessageId(message.id);
                                setTimeout(() => {
                                  setCopiedMessageId(null);
                                }, 2000);
                              }
                            }}
                            className="p-1.5 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all"
                            title="Copy to clipboard"
                          >
                            {copiedMessageId === message.id ? (
                              <CopyCheck className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Share button */}
                          <button
                            onClick={() => handleShare(message.id)}
                            className="p-1.5 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Regenerate button */}
                          <button
                            onClick={() => handleRegenerate(message.id)}
                            className="p-1.5 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all"
                            title="Regenerate response"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isTyping && !streamingMessageId && (
            <div className="flex justify-start">
              <div className="max-w-[90%]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>                    
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input area */}
      <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-white">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && handleSendMessage()
            }
            placeholder="Ask about the document… (Press Shift+Enter for new line)"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white placeholder-gray-500"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-5 py-3 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-200 disabled:from-blue-500 disabled:to-blue-400 disabled:cursor-not-allowed shadow-sm hover:shadow"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>

        {isTyping && (
          <p className="text-xs text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
            AI is thinking...
          </p>
        )}
      </div>
      {/* Custom styles for better markdown rendering */}      
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

        /* Additional markdown styling - REMOVED THE .markdown-content reference */
        .markdown-wrapper :global(*) {
          line-height: 1.6;
        }

        .markdown-wrapper :global(*):first-child {
          margin-top: 0;
        }

        .markdown-wrapper :global(*):last-child {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
