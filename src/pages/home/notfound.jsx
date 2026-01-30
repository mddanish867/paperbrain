import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const quickLinks = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    { path: '/chat', label: 'Chat with PDF', icon: <Search className="h-4 w-4" /> },
    { path: '/code-review', label: 'Code Review', icon: <AlertCircle className="h-4 w-4" /> },
    { path: '/documentation', label: 'Documentation', icon: <Home className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-2xl text-center">
          {/* Error Number */}
          <div className="mb-8 inline-flex items-center justify-center rounded-full bg-blue-100 p-6">
            <div className="text-6xl font-bold text-blue-600">404</div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="mb-8 text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
            Don't worry, here are some helpful links to get you back on track.
          </p>

          {/* Main Action */}
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Homepage
            </Link>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-semibold text-gray-900">
              Quick Links
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="group flex items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-4 text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span className="text-blue-600 group-hover:text-blue-700">
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search Help */}
          <div className="mt-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <p className="text-sm text-gray-500">
                Can't find what you're looking for?
              </p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                <Search className="h-4 w-4" />
                Search our documentation
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-200/30 blur-3xl" />
    </div>
  );
};

export default NotFoundPage;