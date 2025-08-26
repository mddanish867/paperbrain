import { useState } from "react"
import { useNavigate } from "react-router-dom"   // ✅ useNavigate instead of next/router
import ProtectedRoute from "../auth/protected-route"
import { FileText, Upload, X } from "lucide-react"

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()   // ✅

  const handleFileUpload = (file) => {
    if (file.type === "application/pdf") {
      setUploadedFile(file)
    } else {
      alert("Please upload a PDF file only.")
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const startChatting = async () => {
    if (!uploadedFile) return

    setIsUploading(true)
    // Store file in sessionStorage for the chat page
    const fileData = {
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type,
    }
    sessionStorage.setItem("uploadedFile", JSON.stringify(fileData))

    // Create object URL and store it
    const url = URL.createObjectURL(uploadedFile)
    sessionStorage.setItem("pdfUrl", url)
    navigate("/chat")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">PDF Chat</span>
              </div>
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Back to Home
              </a>
            </div>
          </div>
        </header>

        {/* Upload Interface */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Your PDF</h1>
              <p className="text-lg text-gray-600">Upload a PDF document to start chatting with it</p>
            </div>

            {!uploadedFile ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Drop your PDF here, or click to browse</h3>
                <p className="text-gray-500 mb-4">Supports PDF files up to 10MB</p>
                <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="file-upload" />
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
                      <h3 className="text-lg font-medium text-gray-900">{uploadedFile.name}</h3>
                      <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button onClick={removeFile} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <button
                  onClick={startChatting}
                  disabled={isUploading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isUploading ? "Processing..." : "Start Chatting"}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
