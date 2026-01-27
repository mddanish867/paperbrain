import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../auth/protected-route";
import { Upload, FileText, X, MessageCircle, Loader } from "lucide-react";
import { uploadDocumentApi } from "../../api/documents";
import Home from "../home/home";
import DocumentUploadLoader from "../../components/loader/DocumentUploadLoader ";
export default function UploadPage() {
  const navigate = useNavigate();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /* -------------------------------------------------------
     Restore state on refresh / navigation
  ------------------------------------------------------- */
  useEffect(() => {
    const storedFile = sessionStorage.getItem("uploadedFile");
    const pdfUrl = sessionStorage.getItem("pdfUrl");

    if (storedFile && pdfUrl) {
      setUploadedFile(JSON.parse(storedFile));
      setCurrentPdfUrl(pdfUrl);
    }
  }, []);

  /* -------------------------------------------------------
     Upload file (single API call)
  ------------------------------------------------------- */
  const uploadFileToBackend = async (file) => {
    if (isUploading) return;

    setIsUploading(true);
    try {
      const res = await uploadDocumentApi(file);

      const fileData = {
        id: res.id,
        name: file.name,
        size: file.size,
        type: file.type,
        session_id: res.session_id,
        chunk_count: res.chunk_count,
      };

      sessionStorage.setItem("uploadedFile", JSON.stringify(fileData));

      sessionStorage.setItem("pdfUrl", res.file_url);


      setUploadedFile(fileData);
      setCurrentPdfUrl(url);
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* -------------------------------------------------------
     Handlers
  ------------------------------------------------------- */
  const handleFileUpload = (file) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    uploadFileToBackend(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const removeFile = () => {
    sessionStorage.removeItem("uploadedFile");
    sessionStorage.removeItem("pdfUrl");
    setUploadedFile(null);
    setCurrentPdfUrl(null);
  };

  const uploadNewFile = () => {
    removeFile(); // explicit hard reset
  };

  const hasFile = Boolean(uploadedFile && currentPdfUrl);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 relative">
        <Home />

        {/* ---------- Global Loader ---------- */}
        {isUploading && (
          <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              {/* <Loader className="h-20 w-20 animate-spin text-blue-600" /> */}
              <DocumentUploadLoader/>
            </div>
          </div>
        )}

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">

            {/* ✅ Upload new file link (TOP RIGHT) */}
            {hasFile && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={uploadNewFile}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Upload new file
                </button>
              </div>
            )}

            
            {!hasFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  Drop your PDF here or browse
                </h3>
                <p className="text-gray-500 mb-4">
                  PDF only · max 10MB
                </p>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex px-6 py-3 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
                >
                  Choose File
                </label>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-6 space-y-6">

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button onClick={removeFile}>
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                <div className="h-96 border rounded-lg overflow-hidden">
                  <iframe
                    src={currentPdfUrl}
                    title="PDF Preview"
                    className="w-full h-full"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate("/chat")}
                    className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
                  >
                    Start Chatting
                  </button>

                  <button
                    onClick={() => navigate("/summary")}
                    className="flex-1 bg-white py-3 rounded-lg border"
                  >
                    Generate Summary
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ---------- Features (UNCHANGED) ---------- */}
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
