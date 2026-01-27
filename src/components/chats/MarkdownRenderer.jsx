import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  // Custom components for ReactMarkdown
  const components = {
    // Headers
    h1: ({ node, ...props }) => (
      <h1 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />
    ),
    h2: ({ node, ...props }) => (
      <h2 className="text-lg font-bold mt-3 mb-2 text-gray-800" {...props} />
    ),
    h3: ({ node, ...props }) => (
      <h3
        className="text-base font-semibold mt-2 mb-1 text-gray-700"
        {...props}
      />
    ),

    // Paragraph
    p: ({ node, ...props }) => (
      <p className="mb-2 leading-relaxed text-white-700" {...props} />
    ),

    // Lists
    ul: ({ node, ...props }) => (
      <ul className="ml-4 mb-2 list-disc space-y-1" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="ml-4 mb-2 list-decimal space-y-1" {...props} />
    ),
    li: ({ node, ...props }) => (
      <li className="text-gray-700 leading-relaxed" {...props} />
    ),

    // Bold and Italic
    strong: ({ node, ...props }) => (
      <strong className="font-bold text-gray-900" {...props} />
    ),
    em: ({ node, ...props }) => (
      <em className="italic text-gray-800" {...props} />
    ),

    // Code
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <div className="my-2 rounded-lg overflow-hidden border border-gray-300">
          <div className="bg-gray-800 text-gray-300 px-3 py-1 text-xs font-mono flex justify-between items-center">
            <span>{match[1]}</span>
            <button
              className="text-xs hover:text-white"
              onClick={() => {
                navigator.clipboard.writeText(
                  String(children).replace(/\n$/, ""),
                );
              }}
            >
              Copy
            </button>
          </div>
          <SyntaxHighlighter
            style={atomDark}
            language={match[1]}
            PreTag="div"
            className="!m-0 !rounded-none !bg-gray-900"
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded font-mono text-sm border border-gray-300"
          {...props}
        >
          {children}
        </code>
      );
    },

    // Blockquote
    blockquote: ({ node, ...props }) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-3 py-1 my-2 text-gray-700 italic bg-blue-50 rounded-r"
        {...props}
      />
    ),

    // Table
    table: ({ node, ...props }) => (
      <div className="overflow-x-auto my-3 border rounded-lg">
        <table className="min-w-full divide-y divide-gray-300" {...props} />
      </div>
    ),
    thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
    tbody: ({ node, ...props }) => (
      <tbody className="divide-y divide-gray-200" {...props} />
    ),
    th: ({ node, ...props }) => (
      <th
        className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
        {...props}
      />
    ),
    td: ({ node, ...props }) => (
      <td className="px-3 py-2 text-sm text-white border-b" {...props} />
    ),

    // Link
    a: ({ node, ...props }) => (
      <a
        className="text-blue-600 hover:text-blue-800 underline hover:underline-offset-2 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),

    // Horizontal Rule
    hr: ({ node, ...props }) => (
      <hr className="my-4 border-gray-300" {...props} />
    ),
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
