import React from 'react';

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
            selectedCategory === category
              ? 'bg-brand-blue text-white shadow'
              : 'bg-brand-gray-200 text-brand-gray-600 hover:bg-brand-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
