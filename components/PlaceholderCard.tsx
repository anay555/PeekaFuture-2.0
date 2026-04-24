// FIX: Implemented the PlaceholderCard component.
import React from 'react';

interface PlaceholderCardProps {
  title: string;
  description: string;
}

const PlaceholderCard: React.FC<PlaceholderCardProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
      <p className="text-base sm:text-lg text-gray-600 mb-6">{description}</p>
      <div className="bg-gray-100 border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-500 font-medium">Content coming soon...</p>
      </div>
    </div>
  );
};

export default PlaceholderCard;
