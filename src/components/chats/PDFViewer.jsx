import { FileText } from "lucide-react";

export default function PDFViewer({ currentPdfUrl, currentPdfName }) {
  return (
    <div className="flex-1  p-4">
      <div className="h-full bg-white border rounded flex items-center justify-center">
        {currentPdfUrl ? (
          <iframe 
            src={currentPdfUrl} 
            title={currentPdfName || "PDF"} 
            className="w-full h-full" 
          />
        ) : (
          <div className="text-gray-400">
            <FileText className="h-16 w-16 mx-auto mb-2" />
            No PDF loaded
          </div>
        )}
      </div>
    </div>
  );
}