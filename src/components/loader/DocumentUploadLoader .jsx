// import { FileText, Database } from 'lucide-react';

// const DocumentUploadLoader = () => {
//   return (
//     <div className="flex items-center justify-center">
//       <div className="flex items-center gap-8">
//         {/* Document Icon */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-blue-400 blur-xl opacity-30 animate-pulse"></div>
//           <div className="relative bg-white p-4 rounded-2xl shadow-lg">
//             <FileText className="w-12 h-12 text-blue-600" strokeWidth={2} />
//           </div>
//         </div>

//         {/* Animated Arrows */}
//         <div className="flex flex-col">
//           <div className="flex gap-2">
//             {[0, 1, 2, 3, 4].map((index) => (
//               <div
//                 key={index}
//                 className="w-8 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-slide"
//                 style={{
//                   animationDelay: `${index * 0.2}s`,
//                 }}
//               ></div>
//             ))}
//           </div>
//           <p className="text-slate-600 font-medium text-lg">
//             Uploading Document...
//           </p>
//         </div>

//         {/* Database Icon */}
//         <div className="relative">
//           <div className="absolute inset-0 bg-purple-400 blur-xl opacity-30 animate-pulse"></div>
//           <div className="relative bg-white p-4 rounded-2xl shadow-lg">
//             <Database className="w-12 h-12 text-purple-600" strokeWidth={2} />
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes slide {
//           0%, 100% {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           50% {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         .animate-slide {
//           animation: slide 1.5s ease-in-out infinite;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DocumentUploadLoader;
// import React from 'react';
import { FileText, File } from "lucide-react";

const DocumentUploadLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="flex items-center gap-8">
        {/* GitHub Icon */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-4 rounded-2xl shadow-lg">
            <File className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        {/* Animated Arrows Moving */}
        <div className="flex flex-col items-center gap-2 relative w-48">
          <div className="relative w-full h-2 flex items-center overflow-hidden">
            {/* Multiple arrows moving continuously */}
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="absolute animate-arrow-travel"
                style={{
                  animationDelay: `${index * 0.7}s`,
                }}
              >
                <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                  <path
                    d="M0 8H22M22 8L15 1M22 8L15 15"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ))}
          </div>
          <p className="text-slate-600 font-medium text-sm whitespace-nowrap">
            Connecting to PaperBrain...
          </p>
        </div>

        {/* PaperBrain Logo */}
        <div className="relative">
          <div className="absolute inset-0 blur-xl opacity-30 animate-pulse"></div>
          <div className="relative  p-4 rounded-2xl shadow-lg">
            <div className="flex items-center space-x-2">
              <FileText className="h-12 w-12 text-blue-600" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900">
                  PaperBrain
                </span>
                <p className="text-sm text-gray-500">Intelligent Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes arrow-travel {
          0% {
            left: -24px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }
        
        .animate-arrow-travel {
          animation: arrow-travel 2.1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default DocumentUploadLoader;
