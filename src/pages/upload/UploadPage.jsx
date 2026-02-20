import { useState, useEffect } from "react";
import { MessageCircle, FileText, Upload } from "lucide-react";
import ProtectedRoute from "../auth/protected-route";
import Home from "../home/home";
import DocumentUploadLoader from "../../components/loader/DocumentUploadLoader ";
import FileUploadZone from "./FileUploadZone";
import FilePreviewCard from "./FilePreviewCard";
import { uploadDocumentApi } from "../../api/documents";

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentPdfUrl, setCurrentPdfUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /* ── Restore state on refresh / navigation ── */
  useEffect(() => {
    const storedFile = sessionStorage.getItem("uploadedFile");
    const pdfUrl = sessionStorage.getItem("pdfUrl");

    if (storedFile && pdfUrl) {
      setUploadedFile(JSON.parse(storedFile));
      setCurrentPdfUrl(pdfUrl);
    }
  }, []);

  /* ── Upload ── */
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

      // Persist to session so a hard-refresh doesn't lose the file
      sessionStorage.setItem("uploadedFile", JSON.stringify(fileData));
      sessionStorage.setItem("pdfUrl", res.file_url);

      // ✅ FIX: was `setCurrentPdfUrl(url)` — `url` was never defined
      setUploadedFile(fileData);
      setCurrentPdfUrl(res.file_url);
    } catch (err) {
      alert(err.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  /* ── Helpers ── */
  const removeFile = () => {
    sessionStorage.removeItem("uploadedFile");
    sessionStorage.removeItem("pdfUrl");
    setUploadedFile(null);
    setCurrentPdfUrl(null);
  };

  const hasFile = Boolean(uploadedFile && currentPdfUrl);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 relative">
        <Home />

        {/* ── Global upload loader overlay ── */}
        {isUploading && (
          <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
            <DocumentUploadLoader />
          </div>
        )}

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">

            {/* "Upload new file" shortcut shown only when a file is active */}
            {hasFile && (
              <div className="flex justify-end mb-4">
                <button
                  onClick={removeFile}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Upload new file
                </button>
              </div>
            )}

            {/* ── Zone vs Preview ── */}
            {!hasFile ? (
              <FileUploadZone
                onFileSelect={uploadFileToBackend}
                isUploading={isUploading}
              />
            ) : (
              <FilePreviewCard
                uploadedFile={uploadedFile}
                pdfUrl={currentPdfUrl}
                onRemove={removeFile}
              />
            )}
          </div>
        </main>

        {/* ── Feature cards (unchanged) ── */}
        <div className="max-w-7xl mx-auto mb-10 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
            <FeatureCard
              icon={<MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />}
              iconBg="bg-accent/10"
              title="Smart Conversations"
              description="Ask questions about your document and get intelligent, context-aware responses."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
              iconBg="bg-primary/10"
              title="Document Analysis"
              description="Comprehensive analysis of your PDF content with key insights and summaries."
            />
            <FeatureCard
              icon={<Upload className="h-6 w-6 sm:h-8 sm:w-8 text-violet-500" />}
              iconBg="bg-secondary/10"
              title="Easy Upload"
              description="Simply drag and drop your PDF or tap to upload. Supports all standard PDF formats."
              className="sm:col-span-2 lg:col-span-1"
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

/* ── Small internal helper so the feature grid stays tidy ── */
function FeatureCard({ icon, iconBg, title, description, className = "" }) {
  return (
    <div
      className={`text-center p-4 sm:p-6 rounded-lg bg-card border border-border ${className}`}
    >
      <div className={`rounded-full ${iconBg} p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4`}>
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-xs sm:text-sm">{description}</p>
    </div>
  );
}