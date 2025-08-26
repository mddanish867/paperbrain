import { useState, useEffect } from "react"
import { FileText, MessageCircle, Calendar, Trash2, Eye, Search } from "lucide-react"
import { useAuth } from "../context/auth-context"



export default function PDFLibrary({ onSelectPDF, onUploadNew }) {
  const { user } = useAuth()
  const [pdfs, setPdfs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date" | "chats">("date")

  useEffect(() => {
    fetchPDFs()
  }, [])

  const fetchPDFs = async () => {
    try {
      const response = await fetch("/api/pdfs", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setPdfs(data.pdfs)
      }
    } catch (error) {
      console.error("[v0] Error fetching PDFs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePDF = async (pdfId, e) => {
    e.stopPropagation()

    if (!confirm("Are you sure you want to delete this PDF and all its chat history?")) {
      return
    }

    try {
      const response = await fetch(`/api/pdfs/${pdfId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        setPdfs(pdfs.filter((pdf) => pdf.id !== pdfId))
      }
    } catch (error) {
      console.error("[v0] Error deleting PDF:", error)
    }
  }

  const filteredAndSortedPDFs = pdfs
    .filter((pdf) => pdf.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "chats":
          return b.chatCount - a.chatCount
        case "date":
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      }
    })

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-48 mx-auto"></div>
            <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My PDF Library</h2>
          <p className="text-muted-foreground">Manage your uploaded documents and chat history</p>
        </div>
        <button
          onClick={onUploadNew}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Upload New PDF
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="chats">Sort by Chats</option>
        </select>
      </div>

      {/* PDF Grid */}
      {filteredAndSortedPDFs.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery ? "No PDFs found" : "No PDFs uploaded yet"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? "Try adjusting your search terms" : "Upload your first PDF to start chatting with documents"}
          </p>
          {!searchQuery && (
            <button
              onClick={onUploadNew}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Upload Your First PDF
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPDFs.map((pdf) => (
            <div
              key={pdf.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => onSelectPDF(pdf)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <button
                  onClick={(e) => handleDeletePDF(pdf.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-card-foreground truncate" title={pdf.name}>
                    {pdf.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{(pdf.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(pdf.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{pdf.chatCount} chats</span>
                  </div>
                </div>

                {pdf.lastChatAt && (
                  <p className="text-xs text-muted-foreground">
                    Last chat: {new Date(pdf.lastChatAt).toLocaleDateString()}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">Click to view</span>
                  <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {pdfs.length > 0 && (
        <div className="mt-8 p-6 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">{pdfs.length}</p>
              <p className="text-sm text-muted-foreground">Total PDFs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pdfs.reduce((sum, pdf) => sum + pdf.chatCount, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Chats</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {(pdfs.reduce((sum, pdf) => sum + pdf.size, 0) / 1024 / 1024).toFixed(1)} MB
              </p>
              <p className="text-sm text-muted-foreground">Total Storage</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
