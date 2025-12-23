import React from "react";
import { FileText, ArrowRight, Bot, Sparkles, UploadCloud } from "lucide-react";
import { useAuth } from "../../context/auth-context";

const Hero = () => {
  const { user } = useAuth();

  // Running text content
  const marqueeItems = [
    "Legal Contracts",
    "Scientific Papers",
    "Financial Reports",
    "User Manuals",
    "Lecture Notes",
    "Resumes & CVs",
    "Medical Records",
    "E-books",
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white selection:bg-blue-100">
      {/* --- BACKGROUND MATRIX EFFECT --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {/* Radial Gradient Mask to fade grid at edges */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>

      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        
        {/* --- MAIN BENTO GRID LAYOUT --- */}
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-2">
          
          {/* LEFT COL: Text Content */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            
            {/* Badge */}
            <div className="mb-6 inline-flex items-center self-center justify-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 lg:self-start">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>AI-Powered Analysis v2.0</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Chat with your <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PDF Documents
              </span>
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Transform static documents into intelligent conversations. Upload
              any PDF and instantly extract insights, summaries, and answers
              using our advanced matrix processing engine.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              {user ? (
                <a
                  href="/upload"
                  className="group inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-[1.02]"
                >
                  <UploadCloud className="mr-2 h-5 w-5" />
                  Upload PDF
                </a>
              ) : (
                <a
                  href="/login"
                  className="group inline-flex items-center justify-center rounded-xl bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:scale-[1.02]"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              )}
              
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                Free Tier Available
              </div>
            </div>
          </div>

          {/* RIGHT COL: Visual Element (Bento Card Look) */}
          <div className="relative mt-12 hidden lg:block">
            {/* Abstract Decorative blob */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 opacity-20 blur-xl"></div>
            
            {/* The Card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-2xl backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
                            <FileText className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Annual_Report_2024.pdf</p>
                            <p className="text-xs text-gray-500">14.2 MB • Processed</p>
                        </div>
                    </div>
                </div>

                {/* Chat Simulation */}
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                           <Bot className="h-5 w-5"/>
                        </div>
                        <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-2 text-sm text-gray-700">
                            Hello! I've analyzed your financial report. What would you like to know?
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
                           <span className="text-xs">You</span>
                        </div>
                        <div className="rounded-2xl rounded-tr-none bg-blue-600 px-4 py-2 text-sm text-white shadow-md">
                            Summarize the Q4 revenue growth.
                        </div>
                    </div>
                     <div className="flex gap-3 opacity-75">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                           <Bot className="h-5 w-5"/>
                        </div>
                        <div className="rounded-2xl rounded-tl-none bg-gray-100 px-4 py-2 text-sm text-gray-700">
                           <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Stats Card (Bento element) */}
            <div className="absolute -bottom-6 -left-6 rounded-xl border border-gray-100 bg-white p-4 shadow-xl">
                <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-gray-900">98% Accuracy</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RUNNING TEXT (MARQUEE) --- */}
      <div className="absolute bottom-0 w-full border-t border-gray-100 bg-white/50 py-4 backdrop-blur-md">
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex gap-16">
            {/* We duplicate the array to ensure smooth infinite loop */}
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
              <span
                key={index}
                className="text-sm font-semibold uppercase tracking-widest text-gray-400"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- CSS FOR ANIMATIONS --- */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;