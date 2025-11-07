import React from 'react';

const Newsletter = () => {
  return (
    <div className="bg-white rounded-xl p-8 mb-8 border border-secondary-100">
      <div className="mb-6">
        <h3 className="text-secondary-800 text-xl font-semibold mb-2">Weekly Newsletter</h3>
        <p className="text-secondary-500">Get blog articles and offers via email</p>
      </div>
      
      <form className="space-y-4">
        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full px-4 py-3 border border-secondary-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition-colors"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default Newsletter;