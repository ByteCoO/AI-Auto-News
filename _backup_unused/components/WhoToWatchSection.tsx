import Image from 'next/image';

export default function WhoToWatchSection() {
  const streamers = [
    {
      id: 1,
      name: "Paul Ninja",
      game: "LIVE: Hogwarts Legacy",
      avatar: "/streamer-1.jpg"
    },
    {
      id: 2,
      name: "Arcane Avenger",
      game: "LIVE: The Witcher 3 Wild Hunt",
      avatar: "/streamer-2.jpg"
    },
    {
      id: 3,
      name: "Thunder",
      game: "LIVE: Team Branding",
      avatar: "/streamer-3.jpg"
    }
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-white">Who to Watch</h2>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">1.2k</span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        {streamers.map(streamer => (
          <div key={streamer.id} className="bg-[#252525] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image src={streamer.avatar} alt={streamer.name} width={40} height={40} className="object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{streamer.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <p className="text-xs text-gray-400">{streamer.game}</p>
                </div>
              </div>
            </div>
            <button className="text-xs text-blue-500 hover:text-blue-400 font-medium">
              GO TO STREAM
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}