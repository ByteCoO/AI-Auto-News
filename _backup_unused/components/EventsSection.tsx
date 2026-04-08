export default function EventsSection() {
  const events = [
    {
      id: 1,
      name: "Comic-Con International",
      date: { day: 12, month: "APR" },
      people: "12.9k people joined"
    },
    {
      id: 2,
      name: "Hogwarts Legacy Fans",
      date: { day: 24, month: "APR" },
      people: "5.3k people joined"
    },
    {
      id: 3,
      name: "Life is Strange Meeting",
      date: { day: 30, month: "APR" },
      people: "1.5k people joined"
    }
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-white">Nearest Events</h2>
          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">230</span>
        </div>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="bg-[#252525] rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400">{event.date.month}</span>
                <span className="text-sm font-bold text-white">{event.date.day}</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{event.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{event.people}</p>
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