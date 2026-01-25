import { MessageSquareShare, MoreVertical } from "lucide-react";

export default function Sidebar({
  isLeftPanelOpen,
  chatSessions,
  selectedChat,
  setSelectedChat,
  setCurrentPdfUrl,
  setCurrentPdfName,
  loadChatHistory,
  activeSessionMenu,
  setActiveSessionMenu,
  openRenameModal,
  openDeleteModal
}) {
  if (!isLeftPanelOpen) return null;

  return (
    <div className="w-[260px] bg-white border-r flex flex-col">
      <button className="m-2 flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-100 rounded px-2 py-1">
        <MessageSquareShare className="h-4 w-4" />
        New Chat
      </button>

      {/* Scrollable chat sessions with custom scrollbar */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          {chatSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No chat sessions yet
            </div>
          ) : (
            chatSessions.map((chat) => (
              <div
                key={chat.id}
                className={`relative mx-2 mb-1 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedChat === chat.id
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
                onClick={() => {
                  setSelectedChat(chat.id);
                  setCurrentPdfUrl(chat.file_url);
                  setCurrentPdfName(chat.pdfName);
                  loadChatHistory(chat.id);
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">                    
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {chat.pdfName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(chat.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSessionMenu(
                        activeSessionMenu === chat.id ? null : chat.id
                      );
                    }}
                    className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Session menu */}
                {activeSessionMenu === chat.id && (
                  <div
                    className="absolute right-2 top-10 bg-white border rounded-lg shadow-lg z-50 text-sm min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-t-lg"
                      onClick={() => openRenameModal(chat.id)}
                    >
                      Rename
                    </button>
                    <button
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                      onClick={() => openDeleteModal(chat.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
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