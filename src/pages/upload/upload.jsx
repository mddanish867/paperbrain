import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../auth/protected-route";
import { Upload, FileText, X, MessageCircle } from "lucide-react";
import { uploadDocumentApi } from "../../api/documents";
import Home from "../home/home";

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (file) => {
    if (file.type === "application/pdf") {
      setUploadedFile(file);
    } else {
      alert("Please upload a PDF file only.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const startChatting = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // upload file to backend
      const res = await uploadDocumentApi(uploadedFile);

      // Store backend response + file metadata in sessionStorage
      const fileData = {
        id: res.id,
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        session_id: res.session_id,
        chunk_count: res.chunk_count,
      };
      sessionStorage.setItem("uploadedFile", JSON.stringify(fileData));

      // Create object URL for preview
      const url = URL.createObjectURL(uploadedFile);
      sessionStorage.setItem("pdfUrl", url);
      // navigate to chat
      navigate("/chat");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.message || "Upload faailed");
    } finally {
      setIsUploading(false);
    }
  };

  const generateSummary = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    try {
      // upload file to backend
      const res = await uploadDocumentApi(uploadedFile);

      // Store backend response + file metadata in sessionStorage
      const fileData = {
        id: res.id,
        name: uploadedFile.name,
        size: uploadedFile.size,
        type: uploadedFile.type,
        session_id: res.session_id,
        chunk_count: res.chunk_count,
      };
      sessionStorage.setItem("uploadedFile", JSON.stringify(fileData));

      // Create object URL for preview
      const url = URL.createObjectURL(uploadedFile);
      sessionStorage.setItem("pdfUrl", url);
      // navigate to chat
      navigate("/summary");
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.message || "Upload faailed");
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Home />

        {/* Upload Interface */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Upload Your PDF
              </h1>
              <p className="text-lg text-gray-600">
                Upload a PDF document to start chatting with it
              </p>
            </div>

            {!uploadedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Drop your PDF here, or click to browse
                </h3>
                <p className="text-gray-500 mb-4">
                  Supports PDF files up to 10MB
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={startChatting}
                    disabled={isUploading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isUploading ? "Processing..." : "Start Chatting"}
                  </button>

                  <button
                    onClick={generateSummary}
                    disabled={isUploading}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {isUploading ? "Processing..." : "Generate Summary"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
        {/* Features */}
        <div className="max-w-7xl mx-auto mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <div className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border">
              <div className="rounded-full bg-accent/10 p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
                <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-accent text-green-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
                Smart Conversations
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Ask questions about your document and get intelligent,
                context-aware responses.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border">
              <div className="rounded-full bg-primary/10 p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
                Document Analysis
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Comprehensive analysis of your PDF content with key insights and
                summaries.
              </p>
            </div>
            <div className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border sm:col-span-2 lg:col-span-1">
              <div className="rounded-full bg-secondary/10 p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-secondary text-violet-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
                Easy Upload
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                Simply drag and drop your PDF or tap to upload. Supports all
                standard PDF formats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
