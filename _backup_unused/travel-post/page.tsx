
import { NextPage } from 'next';
import Image from 'next/image';

const TravelBlogPost: NextPage = () => {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          <header className="text-center mb-12">
            <div className="flex justify-center items-center mb-4">
              <Image
                src="/avatar-placeholder.png"
                alt="Cruz Mcintyre"
                width={56}
                height={56}
                className="rounded-full"
              />
              <div className="ml-4 text-left">
                <p className="font-bold text-lg">Cruz Mcintyre</p>
                <p className="text-sm text-gray-500">Author</p>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              A Foodie’s Guide to Europe: Best Culinary Experiences by Country
            </h1>
            <div className="flex justify-center items-center text-sm text-gray-500 space-x-4">
              <span>4 Mins Read</span>
              <span>&middot;</span>
              <span>Nov 29, 2024</span>
            </div>
          </header>

          <hr className="border-gray-200 dark:border-gray-700 mb-12" />

          <div className="prose prose-lg max-w-none mx-auto">
            <p className="lead">
              Europe is a treasure trove of culinary delights, offering a diverse array of flavors, techniques, and traditions. For food enthusiasts, the continent provides endless opportunities to indulge in authentic dishes and unforgettable dining experiences.
            </p>
            <figure className="my-12">
              <Image
                src="/blog-thumbnail-03.png"
                alt="A table with various European dishes"
                width={1216}
                height={400}
                className="rounded-lg"
              />
            </figure>
            <div className="flex items-center my-8">
              <hr className="w-16 border-t-2 border-gray-300 dark:border-gray-600" />
              <p className="ml-4 text-xl font-medium">
                Here’s a country-by-country guide to some of the best culinary experiences in Europe.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">France: Haute Cuisine and Pastries</h2>
              <p>
                <strong>Must-Try Dishes:</strong> Coq au Vin, Ratatouille, and Bouillabaisse.
              </p>
              <p>
                <strong>Signature Experience:</strong> Savoring a croissant and espresso at a Parisian café or dining at a Michelin-starred restaurant in Lyon.
              </p>
              <p>
                <strong>Don’t Miss:</strong> A wine-tasting tour in Bordeaux or Champagne.
              </p>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Italy: The Heart of Comfort Food</h2>
              <p>
                <strong>Must-Try Dishes:</strong> Pizza Margherita, Risotto alla Milanese, and Gelato.
              </p>
              <p>
                <strong>Signature Experience:</strong> Enjoying fresh pasta in Bologna or a Neapolitan pizza in Naples.
              </p>
              <p>
                <strong>Don’t Miss:</strong> A vineyard tour in Tuscany to sample Chianti wines.
              </p>
            </div>
            
            {/* ... more sections for other countries ... */}

          </div>
        </article>
      </div>
    </main>
  );
};

export default TravelBlogPost;
