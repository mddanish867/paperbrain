import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function MarkdownRenderer({ content }) {
  return (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        a({ node, children, ...props }) {
          return (
            <a className="text-blue-600 hover:underline" {...props}>
              {children}
            </a>
          );
        },
        ul({ node, children, ...props }) {
          return (
            <ul className="list-disc pl-4 space-y-1 my-2" {...props}>
              {children}
            </ul>
          );
        },
        ol({ node, children, ...props }) {
          return (
            <ol className="list-decimal pl-4 space-y-1 my-2" {...props}>
              {children}
            </ol>
          );
        },
        blockquote({ node, children, ...props }) {
          return (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props}>
              {children}
            </blockquote>
          );
        },
        table({ node, children, ...props }) {
          return (
            <div className="overflow-x-auto my-2">
              <table className="min-w-full divide-y divide-gray-200" {...props}>
                {children}
              </table>
            </div>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}