import { useState } from "react"
import { FileText, ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react"

export default function PDFViewer({ uploadedFile, pdfUrl }) {
  const [zoom, setZoom] = useState(100)

  return (
    <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden flex-col min-h-0">
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
          <span className="font-medium text-card-foreground truncate text-sm sm:text-base">{uploadedFile?.name}</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <button
            onClick={() => setZoom(Math.max(50, zoom - 25))}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation"
          >
            <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <span className="text-xs sm:text-sm text-muted-foreground min-w-[3rem] sm:min-w-[4rem] text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-muted transition-colors touch-manipulation"
          >
            <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button className="hidden sm:block p-2 rounded-lg hover:bg-muted transition-colors">
            <Maximize2 className="h-4 w-4" />
          </button>
          <button className="hidden sm:block p-2 rounded-lg hover:bg-muted transition-colors">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-muted/30">
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
            title="PDF Viewer"
          />
        )}
      </div>
    </div>
  )
}
