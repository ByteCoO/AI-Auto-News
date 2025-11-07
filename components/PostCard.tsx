import React from 'react';

interface PostCardProps {
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  avatar: string;
}

const PostCard = ({ title, date, author, category, image, avatar }: PostCardProps) => {
  return (
    <div className="bg-white border border-secondary-100 rounded-xl overflow-hidden">
      <div className="h-60 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="bg-[rgba(75,107,251,0.05)] text-primary text-sm font-medium px-3 py-1 rounded-md">
            {category}
          </span>
          <span className="text-sm text-secondary-500">{date}</span>
        </div>
        <h3 className="text-secondary-800 font-semibold mb-3 line-clamp-2">{title}</h3>
        <div className="flex items-center">
          <div 
            className="w-9 h-9 rounded-full bg-cover mr-3" 
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
          <span className="text-secondary-400 text-sm">{author}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;