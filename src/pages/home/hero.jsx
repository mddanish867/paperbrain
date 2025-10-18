import { FileText } from "lucide-react";
import { useAuth } from "../../context/auth-context";

const hero = () => {
  const { user, logout } = useAuth();
  return (
    <section className="min-h-screen py-20">
      <div className="container py-16 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Chat with Your PDF Documents
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Upload any PDF document and start an intelligent conversation. Ask
          questions, get summaries, and extract insights instantly.
        </p>
        {user ? (
          <a
            href="/upload"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5" />
            <span>Upload PDF</span>
          </a>
        ) : (
          <a
            href="/login"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-none text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Get Started</span>
          </a>
        )}
      </div>
    </section>
  );
};

export default hero;
