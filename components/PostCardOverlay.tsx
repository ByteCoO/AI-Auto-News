import React from 'react';

interface PostCardOverlayProps {
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  avatar: string;
}

const PostCardOverlay = ({ title, date, author, category, image, avatar }: PostCardOverlayProps) => {
  return (
    <div className="relative h-[450px] rounded-xl overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-[rgba(20,22,36,0.4)]"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-secondary-800 to-transparent">
        <div className="bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-md inline-block mb-4">
          {category}
        </div>
        <h2 className="text-white text-3xl font-bold mb-6">{title}</h2>
        <div className="flex items-center">
          <div 
            className="w-14 h-14 rounded-full bg-cover mr-4" 
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
          <div>
            <div className="text-white font-medium">{author}</div>
            <div className="text-secondary-300">{date}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardOverlay;