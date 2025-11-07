import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary-50 border-t border-secondary-100 py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex flex-col space-y-6">
              <div>
                <h3 className="text-secondary-800 font-semibold text-lg mb-3">About</h3>
                <p className="text-secondary-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-secondary-800 font-medium">Email : info@jstemplate.net</p>
                <p className="text-secondary-800 font-medium">Phone : 880 123 456 789</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-secondary-800 font-semibold text-lg mb-6">Quick Link</h3>
            <div className="space-y-3">
              <a href="#" className="block text-secondary-600 hover:text-primary">Home</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">About</a>
              <a href="/bloglist" className="block text-secondary-600 hover:text-primary">Blog</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Archived</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Author</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Contact</a>
            </div>
          </div>
          
          <div>
            <h3 className="text-secondary-800 font-semibold text-lg mb-6">Category</h3>
            <div className="space-y-3">
              <a href="#" className="block text-secondary-600 hover:text-primary">Lifestyle</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Technology</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Travel</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Business</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Economy</a>
              <a href="#" className="block text-secondary-600 hover:text-primary">Sports</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-secondary-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-12 h-12 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold">MB</span>
            </div>
            <div>
              <h4 className="font-bold text-secondary-900">MetaBlog</h4>
              <p className="text-secondary-600 text-sm">© JS Template 2023. All Rights Reserved.</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="text-secondary-600 hover:text-primary">Terms of Use</a>
            <div className="h-5 w-px bg-secondary-200"></div>
            <a href="#" className="text-secondary-600 hover:text-primary">Privacy Policy</a>
            <div className="h-5 w-px bg-secondary-200"></div>
            <a href="#" className="text-secondary-600 hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;