import React, { useState } from "react";
import axios from "axios";

async function uploadDocumentToVectorDB(file, docName) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docName", docName);

  try {
    const response = await axios.post(import.meta.env.VITE_API_BASE_URL + "/rag/data", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("✅ Upload response:", response.data);
    return { 
      success: true,
      data: response.data
    };

  } catch (error) {
    const errorMsg = error.response?.data?.error || 
                    error.message || 
                    "Upload failed due to network error";
    console.error("❌ Upload failed:", errorMsg);
    return { 
      success: false, 
      error: errorMsg 
    };
  }
}

const RAG = ({ onClose, onSubmit }) => {
  const [docName, setDocName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!docName) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
        setDocName(nameWithoutExt);
      }
    }
  };

  const handleSubmit = async () => {
    if (!docName || !selectedFile) {
      setError("Please provide a document name and select a file.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const { success, error } = await uploadDocumentToVectorDB(selectedFile, docName);

      if (success) {
        // Call onSubmit first with the success data
        if (typeof onSubmit === "function") {
          onSubmit({ docName, fileName: selectedFile.name });
        }
        
        // Then close the modal
        if (typeof onClose === "function") {
          onClose();
        }
      } else {
        setError(error || "Failed to upload document. Please try again.");
      }
    } catch (err) {
      console.error("❌ Exception during handleSubmit:", err);
      setError("Error uploading document. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl space-y-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-600">📄</span> Add RAG Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
            disabled={uploading}
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600" htmlFor="docName">
              Document Name <span className="text-red-500">*</span>
            </label>
            <input
              id="docName"
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Enter document name"
              className="w-full border border-gray-200 px-4 py-3 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
              autoFocus
              disabled={uploading}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="fileUpload" className="text-sm font-medium text-gray-600 block mb-1">
              Upload Document <span className="text-red-500">*</span>
            </label>
            <input
              id="fileUpload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="block w-full text-gray-700"
              disabled={uploading}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
            onClick={onClose}
            disabled={uploading}
          >
            <i className="ri-close-line"></i> Cancel
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            disabled={!docName.trim() || !selectedFile || uploading}
            onClick={handleSubmit}
          >
            {uploading ? (
              <>
                <i className="ri-loader-4-line ri-spin"></i> Uploading...
              </>
            ) : (
              <>
                <i className="ri-upload-line"></i> Upload Document
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RAG;