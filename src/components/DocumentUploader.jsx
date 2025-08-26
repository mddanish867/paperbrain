import React, { useState } from "react";

const DocumentUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => e.target.files?.[0] && setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/upload`, { method: "POST", body: formData });
      if (res.ok) {
        setFile(null);
        onUploadSuccess();
        alert("✅ Document uploaded successfully!");
      } else alert("❌ Upload failed");
    } catch (e) {
      console.error("Upload error:", e);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-rose-100">
      <h2 className="text-xl font-semibold mb-4 text-rose-600">Upload Document</h2>

      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
          dragActive ? "border-rose-500 bg-rose-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="space-y-2">
            <div className="text-4xl">📄</div>
            <p className="text-gray-600">{file ? file.name : "Drag & drop a PDF or click to select"}</p>
            <p className="text-sm text-gray-400">PDF files only</p>
          </div>
        </label>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full mt-4 bg-gradient-to-r from-rose-500 to-rose-900 text-white py-2 px-4 rounded-xl hover:opacity-90 transition disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
      )}
    </div>
  );
};

export default DocumentUploader;
