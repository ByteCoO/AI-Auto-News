import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group">
      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-transparent to-purple-600/20 z-10"></div>
      
      {/* Main hero image with enhanced effects */}
      <div className="relative overflow-hidden">
        <Image 
          src="/witcher-placeholder.jpg" 
          alt="The Witcher 4 Polaris" 
          width={1200} 
          height={630} 
          className="w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transition-transform duration-700 group-hover:scale-105"
          priority
          loading="eager"
          sizes="(max-width: 1024px) 100vw, 66vw"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTIwMCcgaGVpZ2h0PSc2MzAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9J2Z1bGwnIGhlaWdodD0nZnVsbCcgZmlsbD0nI2U2ZTZlNicvPjwvc3ZnPg=="
        />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-30 z-5">
          <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-float opacity-60"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-blue-300 rounded-full animate-float-slow opacity-70"></div>
          <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-float-reverse opacity-50"></div>
        </div>
      </div>
      
      {/* Enhanced hero content */}
      <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 z-20 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <div className="max-w-4xl">
          {/* Category badge */}
          <div className="inline-flex items-center px-3 py-1 bg-indigo-600/90 backdrop-blur-sm rounded-full text-xs font-medium text-white mb-3 transition-all duration-300 hover:bg-indigo-500">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            Gaming News
          </div>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-3 sm:mb-4 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              The Witcher 4 Polaris:
            </span>
            <br />
            Everything we know so far
          </h1>
          <p className="text-gray-200 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-2xl leading-relaxed">
            CDPR's upcoming RPG The Witcher 4 will put a new spin on Geralt's universe with revolutionary gameplay mechanics and stunning next-gen visuals.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">SJ</span>
                </div>
                <div>
                  <p className="text-sm text-white font-medium">Sam Johnson</p>
                  <p className="text-xs text-gray-400">3 min read • 2 hours ago</p>
                </div>
              </div>
            </div>
            
            <button className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 py-3 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
              <span className="font-semibold text-sm">Read More</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced trending news sidebar */}
      <div className="absolute right-4 sm:right-6 lg:right-8 top-4 sm:top-6 lg:top-8 z-20 space-y-3 hidden lg:block">
        <div className="mb-4">
          <h2 className="text-white text-sm font-bold mb-2 flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
            Trending Now
          </h2>
        </div>
        
        {[
          { img: '/news-1.jpg', title: 'The Witcher 4 Polaris: Latest updates', desc: 'CDPR\'s upcoming RPG...', author: 'Sam Johnson', time: '3 min read' },
          { img: '/news-2.jpg', title: 'Little nightmares III: First look', desc: '"You won\'t need to play..."', author: 'Paul Peters', time: '10 min read' },
          { img: '/news-3.jpg', title: 'Wolf among us 2: Release date', desc: 'Narrative adventure details...', author: 'Jimmy Laurens', time: '1 min read' },
          { img: '/news-4.jpg', title: 'Indiana Jones and the Great Circle', desc: 'Bethesda Softworks...', author: 'Bryan Kan', time: '5 min read' }
        ].map((item, index) => (
          <div key={index} className="group bg-black/60 backdrop-blur-md rounded-xl p-3 flex items-start space-x-3 w-[320px] transition-all duration-300 hover:bg-black/80 hover:transform hover:scale-105 hover:shadow-xl cursor-pointer border border-white/10 hover:border-white/20">
            <div className="w-14 h-14 flex-shrink-0">
              <Image 
                src={item.img} 
                alt={item.title} 
                width={56} 
                height={56} 
                className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
                sizes="56px" 
                loading="lazy" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.desc}</p>
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span>{item.author}</span>
                <span className="mx-1">•</span>
                <span>{item.time}</span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}