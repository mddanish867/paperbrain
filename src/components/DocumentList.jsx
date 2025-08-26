import React from "react";
import { Trash2 } from "lucide-react";

const DocumentList = ({ documents, onDocumentDelete }) => {
  const handleDelete = async (docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/documents/${docId}`, { method: "DELETE" });
        if (res.ok) onDocumentDelete();
        else alert("Failed to delete document");
      } catch (e) {
        console.error("Delete error:", e);
        alert("Failed to delete document");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-rose-100">
      <h2 className="text-xl font-semibold mb-4 text-rose-600">Uploaded Documents</h2>

      {documents.length === 0 ? (
        <p className="text-gray-400 italic">No documents uploaded yet 📂</p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.doc_id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium text-gray-800 truncate">{doc.filename}</p>
                <p className="text-sm text-gray-500">{doc.chunk_count} chunks</p>
              </div>
              <button onClick={() => handleDelete(doc.doc_id)} className="text-red-600 hover:text-red-800">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
