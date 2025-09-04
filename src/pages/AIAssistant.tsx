const AIAssistantSkeleton = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-8 animate-pulse">
      {/* Page title indicator */}
      <div className="flex justify-center mb-8">
        <span className="text-sm text-gray-400 font-medium px-4 py-1 bg-gray-100 rounded-full">
          AI Assistant page coming soon
        </span>
      </div>

      {/* Page header skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-4"></div>
      </div>

      {/* Page content skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      </div>
    </div>
  );
};

export default AIAssistantSkeleton;