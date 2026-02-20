import { Upload } from "lucide-react";

/**
 * FileUploadZone
 * Handles drag-and-drop + click-to-browse PDF selection.
 * Calls onFileSelect(file) when the user picks a valid PDF.
 */
export default function FileUploadZone({ onFileSelect, isUploading }) {
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
  };

  const validateAndSelect = (file) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file only.");
      return;
    }
    onFileSelect(file);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 transition-colors"
    >
      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700">
        Drop your PDF here or browse
      </h3>
      <p className="text-gray-500 mb-6">PDF only · max 10MB</p>

      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="file-upload"
        className={`inline-flex px-6 py-3 rounded-md text-white cursor-pointer transition-colors ${
          isUploading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isUploading ? "Uploading…" : "Choose File"}
      </label>
    </div>
  );
}