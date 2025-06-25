import React, { useRef } from 'react';
import { categories } from '../data/mockData';

const chunkCategories = (arr, size) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const CategoryList = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 1000;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const categoryPages = chunkCategories(categories, 20); // mỗi page gồm 20 category

  return (
    <div className="bg-[#f5f5f5] py-6">
      <div className="max-w-7xl mx-auto relative px-4">
        <h2 className="text-red-600 font-semibold text-lg mb-4">DANH MỤC</h2>

        {/* Nút mũi tên trái */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:scale-110"
        >
          &#8592;
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 scrollbar-hide"
        >
          {categoryPages.map((group, index) => (
            <div
              key={index}
              className="flex-shrink-0 min-w-[1000px] grid grid-cols-10 grid-rows-2 gap-4"
            >
              {group.map((category) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center text-center bg-white p-3 rounded shadow hover:bg-red-100 transition cursor-pointer"
                >
                  <div className="w-12 h-12 bg-red-200 rounded-full mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Nút mũi tên phải */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:scale-110"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};


export default CategoryList;
