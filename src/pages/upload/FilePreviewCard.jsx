import { FileText, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * FilePreviewCard
 * Shows the uploaded file name, size, an iframe PDF preview,
 * and action buttons once the document has been processed.
 */
export default function FilePreviewCard({ uploadedFile, pdfUrl, onRemove }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg border p-6 space-y-6">
      {/* ── File meta ── */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-red-500 shrink-0" />
          <div>
            <p className="font-medium text-gray-800 truncate max-w-xs">
              {uploadedFile.name}
            </p>
            <p className="text-sm text-gray-500">
              {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB &nbsp;·&nbsp;
              {uploadedFile.chunk_count} chunks
            </p>
          </div>
        </div>

        <button
          onClick={onRemove}
          title="Remove file"
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </button>
      </div>

      {/* ── PDF preview ── */}
      <div className="h-96 border rounded-lg overflow-hidden bg-gray-50">
        <iframe
          src={pdfUrl}
          title="PDF Preview"
          className="w-full h-full"
        />
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/chat")}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:bg-blue-700 hover:scale-[1.02] transition-colors font-medium"
        >
          Start Chatting
        </button>

        <button
          onClick={() => navigate("/summary")}
          className="flex-1 bg-white py-3 rounded-lg border border-gray-300 hover:bg-gray-50 hover:scale-[1.02] transition-colors font-medium"
        >
          Generate Summary
        </button>
      </div>
    </div>
  );
}