import React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  ChartBarIcon,
  BuildingStorefrontIcon, // Placeholder for Toolbox
  CommandLineIcon,       // Placeholder for Desktop Commander
  CpuChipIcon,           // Placeholder for Sequential Thinking
  WindowIcon,            // Placeholder for the last item
} from '@heroicons/react/24/solid'; // Using solid icons
import Link from 'next/link';

const cardData = [
  {
    id: 1,
    Icon: BuildingStorefrontIcon, // Replace with actual icon if available
    title: 'Toolbox',
    verified: true,
    handle: '@smithery/toolbox',
    description: 'Toolbox dynamically routes to all MCPs in the Smithery registry based on your agent\'s need. When an MCP requires configuration, our tool...',
    tagType: 'Remote',
    tagIcon: GlobeAltIcon,
    usage: '23.72k',
  },
  {
    id: 2,
    Icon: CommandLineIcon, // Replace with actual icon if available
    title: 'Desktop Commander',
    verified: false,
    handle: '@wonderwhy-er/desktop-commander',
    description: 'Execute terminal commands and manage files with diff editing capabilities. Coding, shell and terminal, task automation',
    tagType: 'Local',
    tagIcon: ComputerDesktopIcon,
    usage: '355.87k',
  },
  {
    id: 3,
    Icon: CpuChipIcon, // Replace with actual icon if available
    title: 'Sequential Thinking',
    verified: false,
    handle: '@smithery-ai/server-sequential-thinking',
    description: 'An MCP server implementation that provides a tool for dynamic and reflective problem-solving through a structured thinking process.',
    tagType: 'Remote',
    tagIcon: GlobeAltIcon,
    usage: '143.04k',
  },
  {
    id: 4,
    Icon: WindowIcon, // Placeholder Icon for the fourth card
    title: 'Browser Extension', // Assuming title based on 'B E' icon
    verified: false,
    handle: '@browser/extension', // Placeholder handle
    description: 'Provides browser interaction capabilities using .... with web ....', // Placeholder description
    tagType: 'Remote', // Assuming type
    tagIcon: GlobeAltIcon,
    usage: 'N/A', // Placeholder usage
  },
  // Add more card data objects here if needed
];

function PopularSection() {
  return (
    <div className="bg-white text-gray-800 py-8 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular</h2>
          <span className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded">
            1708
          </span>
          <Link href="#" legacyBehavior>
            <span className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              View all
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors">
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition-colors">
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Cards Section - Using Flexbox with Horizontal Scroll */}
      <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col flex-shrink-0 w-72 md:w-80 hover:border-gray-300 transition-colors duration-200" // Added border, adjusted width and hover effect
          >
            {/* Card Header */}
            <div className="flex items-center gap-2 mb-1">
               {/* Icon Placeholder - Adjust size and color */}
               <div className={`flex items-center justify-center h-8 w-8 ${card.id === 4 ? 'bg-red-600' : 'bg-gray-700'} rounded mr-1`}>
                 { card.id === 4 ? (
                     <span className="text-white font-bold text-sm">B</span> // Special case for the 'B E' icon
                 ) : (
                     <card.Icon className={`h-5 w-5 ${card.title === 'Toolbox' || card.title === 'Desktop Commander' ? 'text-orange-500' : 'text-gray-400'}`} />
                 )}
                 { card.id === 4 && <span className="text-orange-500 font-bold text-sm ml-1">E</span>} {/* Second letter for 'B E' */}
               </div>
              <h3 className={`font-semibold ${card.title === 'Toolbox' || card.title === 'Desktop Commander' || card.title === 'Sequential Thinking' || card.id === 4 ? 'text-orange-500' : 'text-white'}`}> {/* Orange title */}
                {card.title}
              </h3>
              {card.verified && (
                <CheckBadgeIcon className="h-5 w-5 text-orange-500" />
              )}
            </div>

            {/* Handle */}
            <p className="text-xs text-gray-500 mb-3">{card.handle}</p>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-4 flex-grow">
              {card.description}
            </p>

            {/* Footer */}
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700/50"> {/* Added border-top */}
              <span className="inline-flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-700">
                <card.tagIcon className="h-3 w-3 text-blue-400" /> {/* Blue icon for tag */}
                {card.tagType}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-600">
                <ChartBarIcon className="h-4 w-4 text-gray-500" /> {/* Usage icon */}
                {card.usage !== 'N/A' ? card.usage : ''} {/* Hide N/A display */}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularSection;