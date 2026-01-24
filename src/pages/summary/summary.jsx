import { useEffect, useState } from "react";
import ProtectedRoute from "../auth/protected-route";
import { useNavigate } from "react-router-dom";
import { Loader2, Download } from "lucide-react";
import {
  generateSummaryApi,
  downloadSummaryDocxApi,
  downloadSummaryPdfApi,
} from "../../api/summary";
import Home from "../home/home";

export default function Summary() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState(null);

  /* -------------------------------------------------------
     Fetch summary from backend
  ------------------------------------------------------- */
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const fileData = JSON.parse(sessionStorage.getItem("uploadedFile"));
        if (!fileData) {
          navigate("/upload");
          return;
        }

        const res = await generateSummaryApi({
          doc_id: fileData.id,
          session_id: fileData.session_id,
        });

        setSummary(res);
      } catch (err) {
        if (err?.message?.includes("quota")) {
          setError("AI usage limit reached. Please try again later.");
        } else {
          setError(err?.message || "Failed to generate summary");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [navigate]);

  /* -------------------------------------------------------
     Download handlers
  ------------------------------------------------------- */
  const downloadDocx = async () => {
    try {
      setDocLoading(true);
      const fileData = JSON.parse(sessionStorage.getItem("uploadedFile"));
      if (!fileData) return navigate("/upload");

      const blob = await downloadSummaryDocxApi(fileData.id);
      downloadFile(blob, "Summary_Report.docx");
    } catch (err) {
      setError(err?.message || "Failed to download DOCX");
    } finally {
      setDocLoading(false);
    }
  };

  const downloadPdf = async () => {
    try {
      setPdfLoading(true);
      const fileData = JSON.parse(sessionStorage.getItem("uploadedFile"));
      if (!fileData) return navigate("/upload");

      const blob = await downloadSummaryPdfApi(fileData.id);
      downloadFile(blob, "Summary_Report.pdf");
    } catch (err) {
      setError(err?.message || "Failed to download PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /* -------------------------------------------------------
     Dynamic renderer (NO HARD CODING)
  ------------------------------------------------------- */
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">—</span>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-6 space-y-1">
          {value.map((item, idx) => (
            <li key={idx}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object") {
      return (
        <table className="min-w-full border border-gray-200 rounded mt-2">
          <tbody>
            {Object.entries(value).map(([k, v]) => (
              <tr key={k} className="border-b">
                <td className="px-3 py-2 font-medium bg-gray-50 capitalize">
                  {k.replace(/_/g, " ")}
                </td>
                <td className="px-3 py-2">{renderValue(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return (
      <p className="whitespace-pre-wrap leading-relaxed text-gray-800">
        {value}
      </p>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Home />

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">

            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin h-8 w-8" />
                <p className="mt-2">Generating summary…</p>
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <>
                {/* Actions */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={downloadDocx}
                    disabled={docLoading}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  >
                    {docLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Download size={16} />
                    )}
                    <span>Download DOCX</span>
                  </button>

                  <button
                    onClick={downloadPdf}
                    disabled={pdfLoading}
                    className="flex items-center gap-2 px-4 py-2 border rounded disabled:opacity-50"
                  >
                    {pdfLoading ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Download size={16} />
                    )}
                    <span>Download PDF</span>
                  </button>
                </div>

                {/* Dynamic Summary Preview */}
                <div className="space-y-8">
                  {Object.entries(summary).map(([section, value]) => (
                    <section key={section}>
                      <h2 className="text-xl font-semibold mb-2 capitalize">
                        {section.replace(/_/g, " ")}
                      </h2>
                      {renderValue(value)}
                    </section>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
