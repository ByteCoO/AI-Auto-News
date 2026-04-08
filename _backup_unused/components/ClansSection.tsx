import Image from 'next/image';

export default function ClansSection() {
  const clans = [
    {
      id: 1,
      name: "Silver Wolves",
      league: "Gold League",
      members: "200.3k members",
      icon: "/clan-1.jpg"
    },
    {
      id: 2,
      name: "Phoenix Rising",
      league: "Silver League",
      members: "90.4k members",
      icon: "/clan-2.jpg"
    },
    {
      id: 3,
      name: "Dark Knights",
      league: "Bronze League",
      members: "30.9k members",
      icon: "/clan-3.jpg"
    }
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-white">Clans</h2>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">154</span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        {clans.map(clan => (
          <div key={clan.id} className="bg-[#252525] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image src={clan.icon} alt={clan.name} width={40} height={40} className="object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{clan.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-gray-400">{clan.league}</p>
                  <span className="text-gray-600">•</span>
                  <p className="text-xs text-gray-400">{clan.members}</p>
                </div>
              </div>
            </div>
            <button className="text-xs text-blue-500 hover:text-blue-400 font-medium flex items-center">
              <span className="mr-1">+</span> JOIN
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}