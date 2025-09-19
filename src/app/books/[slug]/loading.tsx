export default function BookPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Reading Progress Placeholder */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div className="h-full bg-blue-600 animate-pulse" style={{ width: '0%' }} />
      </div>
      
      {/* Breadcrumb Skeleton */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-4 bg-gray-300" />
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-1 h-4 bg-gray-300" />
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <article className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            {/* Book Cover & Info Skeleton */}
            <div className="lg:col-span-1 mb-8 lg:mb-0">
              <div className="sticky top-8 space-y-6">
                {/* Image Gallery Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse mb-4" />
                  <div className="flex gap-2 justify-center">
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>

                {/* Quick Info Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Download Button Skeleton */}
                  <div className="pt-4 border-t">
                    <div className="w-full h-12 bg-gray-300 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Author Skeleton */}
              <header className="space-y-4">
                <div className="w-3/4 h-10 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                
                {/* Genres Skeleton */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
                  <div className="w-18 h-6 bg-gray-200 rounded-full animate-pulse" />
                </div>
              </header>

              {/* Summary Skeleton */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg space-y-3">
                <div className="w-20 h-5 bg-blue-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-blue-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-blue-200 rounded animate-pulse" />
                  <div className="w-2/3 h-4 bg-blue-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Main Content Skeleton */}
              <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
                <div className="w-48 h-7 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* Book Details Skeleton */}
              <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-gray-300 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Books Skeleton */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-4" />
            <div className="w-48 h-5 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
