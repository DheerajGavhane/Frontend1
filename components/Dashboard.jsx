import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import CreditScore from './CreditScore';
import TotalAccountBalance from './TotalBalance';
import IncomeExpenseCard from './IncomeExpense';
import NetWorthCard from './NetWorthCard';
import EpfDetails from './EpfDetails';
import MutualFund from './MutualFund';
import BankTransactions from './BankTransactions';
import RAG from './RAG';
import FutureMirror from './FutureMirror';
import UserContext from '../context/UserContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRAGModal, setShowRAGModal] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const userInfo = useContext(UserContext);

  // Fetch documents from vector DB
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/documents');
      if (response.data.success) {
        setDocuments(response.data.documents);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      alert('Error loading documents: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Delete document from vector DB
  const handleDelete = async (docName, originalFilename) => {
    // Create a custom confirmation dialog
    const confirmDelete = () => {
      return new Promise((resolve) => {
        // Create modal backdrop with blur effect
        const backdrop = document.createElement('div');
        backdrop.className = 'fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-50 backdrop-blur-sm';

        // Create modal container - matching RAG popup style
        const modal = document.createElement('div');
        modal.className = 'bg-white rounded-xl p-6 w-full max-w-md shadow-2xl space-y-6 border border-gray-100 mx-4';

        // Modal content - matching RAG popup structure
        modal.innerHTML = `
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span class="text-red-500">🗑️</span> Delete Document
          </h2>
          <button
            id="close-btn"
            class="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <i class="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div class="space-y-5">
          <div class="text-center">
            <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <i class="ri-error-warning-line text-2xl text-red-500"></i>
            </div>
            <p class="text-gray-600">
              Are you sure you want to delete 
              <span class="font-medium text-gray-800 block mt-1">"${originalFilename}"</span>
              from the knowledge base?
            </p>
            <p class="text-sm text-gray-500 mt-3">This action cannot be undone.</p>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-2">
          <button
            id="cancel-btn"
            class="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
          >
            <i class="ri-close-line"></i> Cancel
          </button>
          <button
            id="confirm-btn"
            class="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <i class="ri-delete-bin-line"></i> Delete Document
          </button>
        </div>
      `;

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);

        // Handle button clicks
        const confirmBtn = modal.querySelector('#confirm-btn');
        const cancelBtn = modal.querySelector('#cancel-btn');
        const closeBtn = modal.querySelector('#close-btn');

        const cleanup = () => {
          backdrop.remove();
          confirmBtn.removeEventListener('click', confirm);
          cancelBtn.removeEventListener('click', cancel);
          closeBtn.removeEventListener('click', cancel);
          backdrop.removeEventListener('click', backdropClick);
        };

        const confirm = () => {
          cleanup();
          resolve(true);
        };

        const cancel = () => {
          cleanup();
          resolve(false);
        };

        const backdropClick = (e) => {
          if (e.target === backdrop) {
            cancel();
          }
        };

        confirmBtn.addEventListener('click', confirm);
        cancelBtn.addEventListener('click', cancel);
        closeBtn.addEventListener('click', cancel);
        backdrop.addEventListener('click', backdropClick);
      });
    };

    const shouldDelete = await confirmDelete();
    if (!shouldDelete) {
      return;
    }

    setDeleting(prev => ({ ...prev, [docName]: true }));

    try {
      const response = await axios.delete(`/api/documents/${encodeURIComponent(docName)}`);
      if (response.data.success) {
        setDocuments(docs => docs.filter(doc => doc.docName !== docName));
        // Show success message with custom styling
        const successMsg = document.createElement('div');
        successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
        successMsg.innerHTML = `
        <i class="ri-checkbox-circle-line"></i>
        <span>Deleted ${response.data.deletedCount} chunks for ${originalFilename}</span>
      `;
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      // Show error message with custom styling
      const errorMsg = document.createElement('div');
      errorMsg.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
      errorMsg.innerHTML = `
      <i class="ri-error-warning-line"></i>
      <span>Error deleting document: ${error.response?.data?.error || error.message}</span>
    `;
      document.body.appendChild(errorMsg);
      setTimeout(() => errorMsg.remove(), 3000);
    } finally {
      setDeleting(prev => ({ ...prev, [docName]: false }));
    }
  };

  // Refresh documents after upload
  const handleRAGSubmit = async ({ docName, fileName }) => {
    setShowRAGModal(false);
    // Refresh the document list after successful upload
    await fetchDocuments();
  };

  // Filter and sort documents
  const filteredDocuments = documents
    .filter(doc =>
      doc.docName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.originalFilename.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      } else if (sortBy === 'oldest') {
        return new Date(a.timestamp) - new Date(b.timestamp);
      } else if (sortBy === 'name') {
        return a.docName.localeCompare(b.docName);
      }
      return 0;
    });

  // Load documents when RAG tab is activated
  useEffect(() => {
    if (activeTab === 'RAG') {
      fetchDocuments();
    }
  }, [activeTab]);

  return (
    <div className="w-full flex flex-col pt-1 px-4 pb-10 gap-y-5 mb-10">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-y-5">
          <CreditScore />
          <TotalAccountBalance />
          <IncomeExpenseCard />
          <NetWorthCard />
          <EpfDetails />
          <MutualFund />
          <BankTransactions />
        </div>
      )}

      {activeTab === 'RAG' && (
        <div className="flex flex-col items-center min-h-[60vh]">
          <div className="w-full max-w-6xl mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Knowledge Base</h2>
              <p className="text-gray-600 mb-6">Upload and manage documents for AI-powered insights</p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <button
                  onClick={() => setShowRAGModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <i className="ri-upload-cloud-line"></i> Upload Document
                </button>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Loading your documents...</p>
              </div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="w-full max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  Your Documents ({filteredDocuments.length})
                </h3>
                <span className="text-sm text-gray-500">
                  {documents.length} total • {filteredDocuments.length} filtered
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredDocuments.map((doc) => (
                  <div key={doc.docName} className="border border-gray-200 p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-200 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-3">
                        <i className="ri-file-text-line text-xl text-indigo-600"></i>
                      </div>

                      <button
                        onClick={() => handleDelete(doc.docName, doc.originalFilename)}
                        disabled={deleting[doc.docName]}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors group-hover:opacity-100 opacity-0"
                        title="Delete document"
                      >
                        {deleting[doc.docName] ? (
                          <i className="ri-loader-4-line animate-spin"></i>
                        ) : (
                          <i className="ri-delete-bin-line"></i>
                        )}
                      </button>
                    </div>

                    <h4 className="font-semibold text-gray-800 truncate mb-2 group-hover:text-indigo-600 transition-colors">
                      {doc.docName}
                    </h4>

                    <div className="text-sm text-gray-600 space-y-2 mb-4">
                      <p className="truncate">
                        <span className="font-medium">File:</span> {doc.originalFilename}
                      </p>
                      <div className="flex items-center text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {doc.chunkCount} chunks
                        </span>
                        <span className="mx-2">•</span>
                        <span>{doc.timestamp ? new Date(doc.timestamp).toLocaleDateString() : 'Unknown date'}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500 flex items-center">
                        <i className="ri-database-2-line mr-1"></i>
                        {doc.embeddingModel || 'all-mpnet-base-v2'}
                      </span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                        View details <i className="ri-arrow-right-line ml-1"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16 w-full max-w-2xl">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                <i className="ri-folder-open-line text-6xl mb-4 text-indigo-300"></i>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No documents found' : 'Your knowledge base is empty'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm
                    ? `No documents match "${searchTerm}"`
                    : 'Upload your first document to build your AI knowledge base'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setShowRAGModal(true)}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 mx-auto"
                  >
                    <i className="ri-upload-line"></i> Upload Document
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="px-5 py-2.5 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'futuremirror' && (
        <FutureMirror />
      )}

      {showRAGModal && (
        <RAG
          onClose={() => setShowRAGModal(false)}
          onSubmit={handleRAGSubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;