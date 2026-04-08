import Image from 'next/image';

export default function PopularForums() {
  const forums = [
    {
      id: 1,
      title: "Butterflies locations",
      game: "Hogwarts Legacy",
      members: "10.9k members",
      icon: "/forum-1.jpg"
    },
    {
      id: 2,
      title: "RDR 2 Community Hub",
      game: "Red Dead Redemption",
      members: "14.6k members",
      icon: "/forum-2.jpg"
    },
    {
      id: 3,
      title: "Cheat codes",
      game: "Sims 4",
      members: "9.3k members",
      icon: "/forum-3.jpg"
    },
    {
      id: 4,
      title: "Armor drawings: all locations",
      game: "The Witcher 3",
      members: "10.7k members",
      icon: "/forum-4.jpg"
    },
    {
      id: 5,
      title: "How to get all achievements?",
      game: "Minecraft Bedrock",
      members: "7.8k members",
      icon: "/forum-5.jpg"
    },
    {
      id: 6,
      title: "Gameplay",
      game: "Little Nightmares",
      members: "6.5k members",
      icon: "/forum-6.jpg"
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Popular Forums</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {forums.map(forum => (
          <div key={forum.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image src={forum.icon} alt={forum.title} width={48} height={48} className="object-cover" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-800">{forum.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <p className="text-xs text-gray-500">{forum.game}</p>
                  <span className="text-gray-400">•</span>
                  <p className="text-xs text-gray-500">{forum.members}</p>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">1.5k+</span>
          </div>
        ))}
      </div>
    </div>
  );
}