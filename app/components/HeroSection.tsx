import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
      <Image 
        src="/witcher-placeholder.jpg" 
        alt="The Witcher 4 Polaris" 
        width={800} 
        height={400} 
        className="w-full h-[400px] object-cover"
      />
      
      <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          The Witcher 4 Polaris: <br />
          Everything we know so far
        </h1>
        <p className="text-gray-300 mb-4 max-w-xl">
          CDPR's upcoming RPG The Witcher 4 will put a new spin on Geralt's universe
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-400">Sam Johnson • 3 min read</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="absolute right-0 top-0 p-6 z-20 space-y-4">
        <div className="bg-[#1a1a1a] bg-opacity-80 rounded-lg p-3 flex items-start space-x-3 w-[300px]">
          <div className="w-16 h-16 flex-shrink-0">
            <Image src="/news-1.jpg" alt="News" width={64} height={64} className="rounded-md object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">The Witcher 4 Polaris: Latest updates</h3>
            <p className="text-xs text-gray-400 mt-1">CDPR's upcoming RPG...</p>
            <p className="text-xs text-gray-500 mt-1">Sam Johnson • 3 min read</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] bg-opacity-80 rounded-lg p-3 flex items-start space-x-3 w-[300px]">
          <div className="w-16 h-16 flex-shrink-0">
            <Image src="/news-2.jpg" alt="News" width={64} height={64} className="rounded-md object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Little nightmares III: First look</h3>
            <p className="text-xs text-gray-400 mt-1">"You won't need to play..."</p>
            <p className="text-xs text-gray-500 mt-1">Paul Peters • 10 min read</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] bg-opacity-80 rounded-lg p-3 flex items-start space-x-3 w-[300px]">
          <div className="w-16 h-16 flex-shrink-0">
            <Image src="/news-3.jpg" alt="News" width={64} height={64} className="rounded-md object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Wolf among us 2: Release date</h3>
            <p className="text-xs text-gray-400 mt-1">Narrative adventure details...</p>
            <p className="text-xs text-gray-500 mt-1">Jimmy Laurens • 1 min read</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] bg-opacity-80 rounded-lg p-3 flex items-start space-x-3 w-[300px]">
          <div className="w-16 h-16 flex-shrink-0">
            <Image src="/news-4.jpg" alt="News" width={64} height={64} className="rounded-md object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Indiana Jones and the Great Circle</h3>
            <p className="text-xs text-gray-400 mt-1">Bethesda Softworks...</p>
            <p className="text-xs text-gray-500 mt-1">Bryan Kan • 5 min read</p>
          </div>
        </div>
      </div>
    </div>
  );
}