import React, { useState, useEffect } from "react";
import DocumentUploader from "../components/DocumentUploader";
import ChatInterface from "../components/ChatInterface";
import DocumentList from "../components/DocumentList";
import { FileText } from "lucide-react";

const MainChat = () => {
  const [documents, setDocuments] = useState([]);
  const [refreshDocs, setRefreshDocs] = useState(0);

  useEffect(() => {
    fetchDocuments();
  }, [refreshDocs]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/documents`);
      const docs = await response.json();
      setDocuments(docs);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDocumentUploaded = () => setRefreshDocs((prev) => prev + 1);
  const handleDocumentDeleted = () => setRefreshDocs((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="container mx-auto px-4 py-8">
        

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <DocumentUploader onUploadSuccess={handleDocumentUploaded} />
            <DocumentList documents={documents} onDocumentDelete={handleDocumentDeleted} />
          </div>

          {/* Right Panel - Chat */}
          <div className="lg:col-span-2">
            <ChatInterface />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
