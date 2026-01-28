import { FileText } from "lucide-react";

export default function PDFViewer({ currentPdfUrl, currentPdfName }) {
  return (
    // p-6 padding was removed
    <div className="flex-1 bg-gradient-to-br from-blue-50 to-white"> 
      <div className="h-full bg-white border-blue-300 border-2  shadow-md overflow-hidden flex items-center justify-center">
        {currentPdfUrl ? (
          <div className="w-full h-full flex flex-col">
            {/* PDF Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 flex items-center gap-3 shadow-md">
              <FileText className="h-5 w-5 text-white" />
              <h2 className="text-white font-medium text-sm truncate">
                {currentPdfName || "Document.pdf"}
              </h2>
            </div>
            
            {/* PDF Content */}
            <iframe 
              src={currentPdfUrl} 
              title={currentPdfName || "PDF"} 
              className="w-full flex-1 bg-white border-none" 
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-12 w-12 text-blue-400" />
            </div>
            <p className="text-blue-900 font-medium text-lg mb-1">No PDF Loaded</p>
            <p className="text-blue-400 text-sm">Upload a PDF to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}