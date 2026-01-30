import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/auth-context";
import ProtectedRoute from "../auth/protected-route";
import { Menu, X, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import { getChatHistoryApi } from "../../api/chat";
import { 
  sendMessageStreamApi, 
  regenerateAnswerApi, 
  sendFeedbackApi, 
  shareMessageApi 
} from "../../api/chat";
import {
  listDocumentSessionsApi,
  deleteSessionApi,
  renameSessionApi
} from "../../api/documents";
import Sidebar from "../../components/chats/Sidebar.jsx";
import PDFViewer from "../../components/chats/PDFViewer";
import ChatSection from "../../components/chats/chatsection";
import Modal from "../../components/chats/Modal";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [currentPdfName, setCurrentPdfName] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeSessionMenu, setActiveSessionMenu] = useState(null);
  const [streamingMessageId, setStreamingMessageId] = useState(null);
  
  // Modal states
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSessionForAction, setSelectedSessionForAction] = useState(null);
  const [newSessionName, setNewSessionName] = useState("");

  // Load chat history with feedback support
  const loadChatHistory = async (session_id) => {
    try {
      const history = await getChatHistoryApi(session_id);

      if (!history || !Array.isArray(history.messages)) {
        setMessages([]);
        return;
      }

      const formatted = history.messages.flatMap((item, index) => [
        {
          id: item.question_id || `q_${index}`,
          text: item.question,
          isUser: true,
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          messageId: item.chat_id,
        },
        {
          id: item.answer_id || `a_${index}`,
          text: item.answer,
          isUser: false,
          timestamp: new Date(item.timestamp).toLocaleTimeString(),
          sources: item.sources || [],
          feedback: item.feedback || { liked: false, disliked: false },
          messageId: item.chat_id,
          isRegeneration: item.is_regeneration || false,
        },
      ]);
      
      setMessages(formatted);
    } catch (err) {
      console.error("Failed to load chat history:", err);
      toast.error("Failed to load chat history");
    }
  };

  // Load sidebar sessions
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
        console.error("Failed to load sessions:", err);
        toast.error("Failed to load sessions");
      }
    };

    loadSessions();
  }, []);

  // Streaming utility
  const readStream = async (reader, messageId, onChunk, onSources) => {
    const decoder = new TextDecoder();
    let fullResponse = '';
    let sources = [];

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'chunk' && data.content) {
                fullResponse += data.content;
                onChunk(fullResponse);
              } else if (data.type === 'sources' && data.sources) {
                sources = data.sources;
                onSources(sources);
              } else if (data.type === 'complete') {
                // Final update with sources
                return { fullResponse, sources, messageId: data.message_id };
              }
            } catch (e) {
              console.error('Error parsing stream data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream reading error:', error);
      throw error;
    }
    
    return { fullResponse, sources, messageId };
  };

  // Send message with streaming
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || isTyping) return;

    const activeSession = chatSessions.find(s => s.id === selectedChat);
    if (!activeSession) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      text: newMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString(),
    };

    const aiMessageId = `ai_${Date.now()}`;
    const aiMessage = {
      id: aiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      sources: [],
      isStreaming: true,
      feedback: { liked: false, disliked: false },
    };

    setMessages(prev => [...prev, userMessage, aiMessage]);
    setNewMessage("");
    setStreamingMessageId(aiMessageId);
    setIsTyping(true);

    try {
      const response = await sendMessageStreamApi({
        message: newMessage,
        session_id: activeSession.id,
        document_id: activeSession.document_id,
      });

      const reader = response.body.getReader();
      
      const { fullResponse, sources, messageId  } = await readStream(
        reader,
        aiMessageId,
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, text: chunk }
              : msg
          ));
        },
        (newSources) => {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, sources: newSources }
              : msg
          ));
        }
      );

      // Final update
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { 
              ...msg, 
              text: fullResponse, 
              sources,
              isStreaming: false,
              messageId: messageId || aiMessageId,
              feedback: { liked: false, disliked: false }
            }
          : msg
      ));

      reader.releaseLock();
    } catch (error) {
      console.error('Send message error:', error);
      toast.error("Failed to send message");
      // Remove the AI message if streaming failed
      setMessages(prev => prev.filter(msg => msg.id !== aiMessageId));
    } finally {
      setIsTyping(false);
      setStreamingMessageId(null);
    }
  };

  // Regenerate answer
  const handleRegenerate = async (messageId) => {
    if (!selectedChat || isTyping) return;

    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    const activeSession = chatSessions.find(s => s.id === selectedChat);
    if (!activeSession) return;

    // Create new message for regeneration
    const newAiMessageId = `ai_regenerate_${Date.now()}`;
    const regeneratedMessage = {
      id: newAiMessageId,
      text: '',
      isUser: false,
      timestamp: new Date().toLocaleTimeString(),
      sources: [],
      isStreaming: true,
      isRegeneration: true,
      feedback: { liked: false, disliked: false },
      originalMessageId: messageId,
    };

    // Replace the old AI message with new one
    setMessages(prev => {
      const newMessages = [...prev];
      const aiMessageIndex = newMessages.findIndex(m => m.id === messageId);
      if (aiMessageIndex !== -1) {
        newMessages[aiMessageIndex] = regeneratedMessage;
      }
      return newMessages;
    });

    setStreamingMessageId(newAiMessageId);
    setIsTyping(true);

    try {
      const response = await regenerateAnswerApi({
        message_id: parseInt(messageId.replace(/\D/g, '')), // Extract numeric ID
        session_id: activeSession.id,
        document_id: activeSession.document_id,
      });

      const reader = response.body.getReader();
      
      const { fullResponse, sources } = await readStream(
        reader,
        newAiMessageId,
        (chunk) => {
          setMessages(prev => prev.map(msg => 
            msg.id === newAiMessageId 
              ? { ...msg, text: chunk }
              : msg
          ));
        },
        (newSources) => {
          setMessages(prev => prev.map(msg => 
            msg.id === newAiMessageId 
              ? { ...msg, sources: newSources }
              : msg
          ));
        }
      );

      // Final update
      setMessages(prev => prev.map(msg => 
        msg.id === newAiMessageId 
          ? { 
              ...msg, 
              text: fullResponse, 
              sources,
              isStreaming: false,
              messageId: newAiMessageId 
            }
          : msg
      ));

      reader.releaseLock();
    } catch (error) {
      console.error('Regenerate error:', error);
      toast.error("Failed to regenerate answer");
      // Revert to original message
      setMessages(prev => prev.map(msg => 
        msg.id === newAiMessageId ? message : msg
      ));
    } finally {
      setIsTyping(false);
      setStreamingMessageId(null);
    }
  };

  // Send feedback
  const handleFeedback = async (messageId, feedbackType) => {
    try {
      const activeSession = chatSessions.find(s => s.id === selectedChat);
      if (!activeSession) {
      toast.error("No active session found");
      return;
    }
      // Get the actual message ID from backend
      const message = messages.find(m => m.id === messageId);
      if (!message) {
      toast.error("NO chat found for this session");
      return;
    }
      const backendMessageId = message.messageId;
       if (!backendMessageId) {
      console.error('No backend message ID found:', message);
      toast.error("Cannot send feedback - message not saved yet");
      return;
      }
      
      // Optimistic update
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          const newFeedback = { ...msg.feedback };
          if (feedbackType === 'like') {
            newFeedback.liked = !newFeedback.liked;
            if (newFeedback.liked) newFeedback.disliked = false;
          } else if (feedbackType === 'dislike') {
            newFeedback.disliked = !newFeedback.disliked;
            if (newFeedback.disliked) newFeedback.liked = false;
          }
          return { ...msg, feedback: newFeedback };
        }
        return msg;
      }));

      // Send to backend
      await sendFeedbackApi({
        message_id: backendMessageId,
        feedback_type: feedbackType,
        session_id: activeSession.id,
      });

    } catch (error) {
      console.error('Feedback error:', error);
      toast.error("Failed to send feedback");
    }
  };

  // Share message
  const handleShare = async (messageId) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    try {
      await shareMessageApi({
        message_id: parseInt(messageId.replace(/\D/g, '')), // Extract numeric ID
        message_text: message.text,
      });
      
      toast.success("Message copied to clipboard!");
    } catch (error) {
      console.error('Share error:', error);
      toast.error("Failed to share message");
    }
  };

  // Modal handlers (same as before)
  const openRenameModal = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    setSelectedSessionForAction(session);
    setNewSessionName(session.pdfName);
    setIsRenameModalOpen(true);
    setActiveSessionMenu(null);
  };

  const handleRenameConfirm = async () => {
    if (!selectedSessionForAction || !newSessionName.trim()) {
      setIsRenameModalOpen(false);
      return;
    }

    const prevSessions = [...chatSessions];

    // Optimistic update
    setChatSessions(prev =>
      prev.map(s =>
        s.id === selectedSessionForAction.id 
          ? { ...s, pdfName: newSessionName, name: `Chat with ${newSessionName}` } 
          : s
      )
    );

    try {
      await renameSessionApi(selectedSessionForAction.id, newSessionName);
      toast.success("Session renamed successfully");
    } catch {
      setChatSessions(prevSessions); // Rollback
      toast.error("Failed to rename session");
    } finally {
      setIsRenameModalOpen(false);
      setSelectedSessionForAction(null);
      setNewSessionName("");
    }
  };

  const openDeleteModal = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    setSelectedSessionForAction(session);
    setIsDeleteModalOpen(true);
    setActiveSessionMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSessionForAction) {
      setIsDeleteModalOpen(false);
      return;
    }

    const sessionId = selectedSessionForAction.id;
    const prevSessions = [...chatSessions];
    const wasSelected = selectedChat === sessionId;

    // Optimistic update
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    
    if (wasSelected) {
      setSelectedChat(null);
      setMessages([]);
      setCurrentPdfUrl(null);
      setCurrentPdfName("");
    }

    try {
      await deleteSessionApi(sessionId);
      toast.success("Session deleted successfully");
    } catch {
      setChatSessions(prevSessions); // Rollback
      toast.error("Failed to delete session");
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedSessionForAction(null);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col ">
        {/* Modals */}
        <Modal
          isOpen={isRenameModalOpen}
          onClose={() => setIsRenameModalOpen(false)}
          title="Rename Session"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Enter a new name for this chat session
            </p>
            <input
              type="text"
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Session name"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                disabled={!newSessionName.trim()}
              >
                Rename
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Session"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete "
              <span className="font-semibold">
                {selectedSessionForAction?.name}
              </span>
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>

        {/* Top Bar */}
        <div className="h-14 bg-white border-b flex items-center px-4 gap-3">
  {!isLeftPanelOpen ? (
    <button 
      onClick={() => setIsLeftPanelOpen(true)} 
      className="p-2 rounded hover:bg-gray-100"
    >
      <Menu className="h-5 w-5" />
    </button>
  ) : (
    <div className="w-[245px] border-r flex justify-between items-center pr-4">
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
  
  {/* Spacer to push auth to the right */}
  <div className="flex-1"></div>
  
  {/* Auth - Moved to right side */}
  {user ? (
    <div className="relative p-4">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center space-x-2"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>
        
      </button>

      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-20">
          <Link
            to="/upload"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Upload PDF
          </Link>
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link
      to="/login"
      className="bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 rounded-lg"
    >
      Login
    </Link>
  )}
</div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isLeftPanelOpen={isLeftPanelOpen}
            chatSessions={chatSessions}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            setCurrentPdfUrl={setCurrentPdfUrl}
            setCurrentPdfName={setCurrentPdfName}
            loadChatHistory={loadChatHistory}
            activeSessionMenu={activeSessionMenu}
            setActiveSessionMenu={setActiveSessionMenu}
            openRenameModal={openRenameModal}
            openDeleteModal={openDeleteModal}
          />

          <PDFViewer
            currentPdfUrl={currentPdfUrl}
            currentPdfName={currentPdfName}
          />

          <ChatSection
            messages={messages}
            isTyping={isTyping}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            handleRegenerate={handleRegenerate}
            handleFeedback={handleFeedback}            
            handleShare={handleShare}
            streamingMessageId={streamingMessageId}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}