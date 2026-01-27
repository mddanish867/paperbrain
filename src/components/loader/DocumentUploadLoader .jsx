import React from 'react';
import { FileText, Database } from 'lucide-react';

const DocumentUploadLoader = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-8">
        {/* Document Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-2xl shadow-lg">
            <FileText className="w-12 h-12 text-blue-600" strokeWidth={2} />
          </div>
        </div>

        {/* Animated Arrows */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-slide"
                style={{
                  animationDelay: `${index * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
          <p className="text-slate-600 font-medium text-lg">
            Uploading Document...
          </p>
        </div>

        {/* Database Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-400 blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-2xl shadow-lg">
            <Database className="w-12 h-12 text-purple-600" strokeWidth={2} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0%, 100% {
            opacity: 0;
            transform: translateX(-20px);
          }
          50% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DocumentUploadLoader;