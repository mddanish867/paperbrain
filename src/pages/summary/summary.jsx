import { useEffect, useState } from "react";
import ProtectedRoute from "../auth/protected-route";
import { useNavigate } from "react-router-dom";
import { FileText, Loader2 } from "lucide-react";
import { generateSummaryApi } from "../../api/summary";
import ReactMarkdown from "react-markdown";

export default function Summary() {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const fileData = JSON.parse(sessionStorage.getItem("uploadedFile"));
        if (!fileData) {
          navigate("/upload"); // if no file uploaded, redirect
          return;
        }

        const res = await generateSummaryApi({
          doc_id: fileData.id,
          session_id: fileData.session_id,
        });

        setSummary(res.summary); // backend returns { summary: "..." }
      } catch (err) {
        console.error("Summary fetch failed:", err);
        setError(err.message || "Failed to generate summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [navigate]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-bold text-foreground">
                  PaperBrain
                </h1>
              </div>
              <a href="/upload" className="text-gray-600 hover:text-gray-900">
                Back to Upload
              </a>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Generating summary...</p>
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <div className="prose max-w-none">
                <ReactMarkdown>{summary}</ReactMarkdown>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
