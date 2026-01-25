export default function SourceChips({ sources = [] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-1">Sources:</p>
      <div className="flex flex-wrap gap-1">
        {sources.map((source, index) => (
          <div
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer"
            onClick={() => {
              // You can implement scroll to source in PDF here
              console.log('Source clicked:', source);
            }}
          >
            Page {source.page || 'N/A'}
            {source.score && (
              <span className="ml-1 text-[10px] opacity-75">
                ({Math.round(source.score * 100)}%)
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}