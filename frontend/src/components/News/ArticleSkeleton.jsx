import React from 'react';

const ArticleSkeleton = () => {
  const shimmer = 'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:animate-[shimmer_1.6s_infinite]';

  return (
    <div className="h-full bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col p-4 space-y-4 animate-fadeInUp">
      <div className={`h-40 rounded-xl bg-gray-200 ${shimmer}`} />
      <div className={`h-4 w-24 rounded-full bg-gray-200 ${shimmer}`} />
      <div className={`h-5 w-11/12 rounded-full bg-gray-200 ${shimmer}`} />
      <div className={`h-4 w-4/5 rounded-full bg-gray-200 ${shimmer}`} />
      <div className="flex items-center justify-between pt-2">
        <div className={`h-4 w-24 rounded-full bg-gray-200 ${shimmer}`} />
        <div className={`h-4 w-16 rounded-full bg-gray-200 ${shimmer}`} />
      </div>
    </div>
  );
};

export default ArticleSkeleton;
