import { useState, useRef } from "react"
import { Upload, FileText, X, Loader2, MessageCircle } from "lucide-react"



export default function UploadInterface({
  onFileUpload,
  uploadedFile,
  isExtracting,
  onRemoveFile,
  onStartChatting,
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileUpload(files[0])
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileUpload(files[0])
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Chat with Your PDF Documents</h2>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
          Upload a PDF document and start asking questions. Our AI will analyze your document and provide intelligent
          responses based on the content.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 sm:p-8 lg:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? "border-primary bg-primary/5 scale-105"
            : "border-border hover:border-primary/50 hover:bg-muted/50"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4 sm:p-6">
            {isExtracting ? (
              <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 text-primary animate-spin" />
            ) : (
              <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              {isExtracting ? "Processing PDF..." : "Drop your PDF here"}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              {isExtracting ? "Extracting text and preparing for analysis" : "or tap to browse your files"}
            </p>
          </div>
          {!isExtracting && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-primary px-4 py-2 sm:px-6 sm:py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation"
            >
              Choose File
            </button>
          )}
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileInputChange} className="hidden" />
        </div>
      </div>

      {/* File Uploaded State */}
      {uploadedFile && !isExtracting && (
        <div className="mt-6 sm:mt-8">
          <div className="bg-card border border-border rounded-lg p-4 sm:p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                <div className="rounded-lg bg-primary/10 p-2 sm:p-3 flex-shrink-0">
                  <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-card-foreground truncate text-sm sm:text-base">
                    {uploadedFile.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                  </p>
                </div>
              </div>
              <button
                onClick={onRemoveFile}
                className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0 touch-manipulation"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">Document Ready for Analysis!</h2>
            <p className="text-muted-foreground mb-6 px-4">
              Your PDF has been processed and is ready for intelligent conversation.
            </p>
            <button
              onClick={onStartChatting}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors touch-manipulation"
            >
              Start Chatting
            </button>
          </div>
        </div>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
        <div className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border">
          <div className="rounded-full bg-accent/10 p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">Smart Conversations</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Ask questions about your document and get intelligent, context-aware responses.
          </p>
        </div>
        <div className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border">
          <div className="rounded-full bg-primary/10 p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">Document Analysis</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Comprehensive analysis of your PDF content with key insights and summaries.
          </p>
        </div>
        <div className="text-center p-4 sm:p-6 rounded-lg bg-card border border-border sm:col-span-2 lg:col-span-1">
          <div className="rounded-full bg-secondary/10 p-3 sm:p-4 w-fit mx-auto mb-3 sm:mb-4">
            <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-card-foreground mb-2">Easy Upload</h3>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Simply drag and drop your PDF or tap to upload. Supports all standard PDF formats.
          </p>
        </div>
      </div>
    </div>
  )
}
