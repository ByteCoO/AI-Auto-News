export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#090B10]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500"></div>
        <p className="mt-6 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}
