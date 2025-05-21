'use client';

import { FTNewsProvider } from '../contexts/FTNewsContext';
import FTNewsListComponent from './FTNewsListComponent';
import Link from 'next/link';

export default function FTNewsClientPage() {
  return (
    <FTNewsProvider>
      <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center text-orange-400">FT News</h1>
          <FTNewsListComponent />
        </div>
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/" className="block p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
            </svg>
          </Link>
        </div>
      </div>
    </FTNewsProvider>
  );
}