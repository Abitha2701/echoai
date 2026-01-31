import { useState, useEffect } from 'react';
import { newsAPI } from '../../services/api';
import ArticleCard from './ArticleCard';
import ArticleSkeleton from './ArticleSkeleton';
import { Search, Sparkles, TrendingUp, AlertCircle, Loader } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showTop, setShowTop] = useState(false);
  const { preferences } = usePreferences();
  const { articlesPerPage, compactView } = preferences;

  const categories = [
    { id: 'all', label: 'All', icon: '📰' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'science', label: 'Science', icon: '🔬' },
    { id: 'health', label: 'Health', icon: '⚕️' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { id: 'sports', label: 'Sports', icon: '⚽' }
  ];

  const fallbackArticles = [
    {
      _id: 'feed-1',
      title: 'Revolutionary AI Model Transforms Natural Language Processing',
      description: 'New breakthrough in artificial intelligence demonstrates human-level comprehension and reasoning capabilities.',
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      category: 'technology',
      source: { name: 'Tech Innovations' },
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      readTime: 6
    },
    {
      _id: 'feed-2',
      title: 'Space Mission Discovers Water on Distant Moon',
      description: 'NASA probe confirms presence of liquid water beneath ice surface, raising possibilities for extraterrestrial life.',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
      category: 'science',
      source: { name: 'Space Exploration' },
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      readTime: 7
    },
    {
      _id: 'feed-3',
      title: 'Breakthrough Treatment Shows Promise for Alzheimer\'s Disease',
      description: 'Clinical trials reveal significant improvement in cognitive function with new therapeutic approach.',
      imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
      category: 'health',
      source: { name: 'Medical Research Today' },
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      readTime: 8
    },
    {
      _id: 'feed-4',
      title: 'Global Markets Surge on Economic Recovery Signs',
      description: 'Stock indices reach new highs as economic indicators show sustained growth and job creation.',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      category: 'business',
      source: { name: 'Financial Times' },
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      readTime: 5
    },
    {
      _id: 'feed-5',
      title: 'Renewable Energy Surpasses Fossil Fuels in Power Generation',
      description: 'Historic milestone as wind and solar energy account for majority of electricity production.',
      imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
      category: 'environment',
      source: { name: 'Green Energy News' },
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      readTime: 6
    },
    {
      _id: 'feed-6',
      title: 'Championship Finals Set Record Viewership Numbers',
      description: 'Thrilling match captivates global audience, becoming most-watched sporting event in history.',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      category: 'sports',
      source: { name: 'Sports World' },
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      readTime: 4
    }
  ];

  const fetchNews = async (pageNum = 1, category = selectedCategory, query = searchQuery) => {
    try {
      setLoading(true);
      let response;

      if (query) {
        response = await newsAPI.searchNews(query, pageNum, articlesPerPage);
      } else if (category !== 'all') {
        response = await newsAPI.getNewsByCategory(category, pageNum, articlesPerPage);
      } else {
        response = await newsAPI.getNews(pageNum, articlesPerPage);
      }

      const results = response.data || [];
      const articlesToShow = results.length > 0 ? results : (pageNum === 1 ? fallbackArticles : []);

      if (pageNum === 1) {
        setArticles(articlesToShow);
      } else {
        setArticles(prev => [...prev, ...articlesToShow]);
      }

      setHasMore(results.length === articlesPerPage);
      setError('');
    } catch (err) {
      console.error('Error fetching news:', err);
      if (pageNum === 1) {
        setArticles(fallbackArticles);
      }
      setError('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1, selectedCategory, searchQuery);
    setPage(1);
  }, [selectedCategory, searchQuery, articlesPerPage]);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 360);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleRefresh = () => {
    setPage(1);
    fetchNews(1, selectedCategory, searchQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews(1, selectedCategory, searchQuery);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, selectedCategory, searchQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header Section */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-300 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 animate-fadeInUp">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-8 w-8 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Latest News & Summaries</h1>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4 space-y-3 md:space-y-0">
            <p className="text-blue-100 text-lg font-medium">Stay informed with AI-powered news summaries</p>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold shadow-sm backdrop-blur focus-ring flex items-center space-x-2"
              >
                <span>Refresh</span>
                <Loader className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-10 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:shadow-2xl transition-all duration-200 border border-gray-100 dark:border-gray-700">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mx-5" />
              <input
                type="text"
                placeholder="Search news by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 py-4 outline-none text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 text-base"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Category Filter */}
        <div className="mb-12 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center space-x-2 mb-5">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filter by Category</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center space-x-2 shadow-md hover:shadow-xl ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start space-x-3 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8 animate-fadeInUp">
            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && articles.length === 0 && (
          <div className="mb-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-8`}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <ArticleSkeleton key={idx} />
              ))}
            </div>
          </div>
        )}

        {/* News Grid */}
        {articles.length > 0 && (
          <div className="mb-12">
            <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-8`}>
              {articles.map((article, index) => (
                <div key={article._id} style={{animationDelay: `${index * 0.05}s`}} className="animate-fadeInUp">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={loadMore}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="text-lg">Load More Articles</span>
                  <Loader className="h-5 w-5" />
                </button>
              </div>
            )}

            {loading && articles.length > 0 && (
              <div className="flex justify-center py-12">
                <Loader className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && articles.length === 0 && !error && (
          <div className="text-center py-20">
            <Sparkles className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-xl font-bold mb-2">No news articles found</p>
            <p className="text-gray-500 text-lg">Try adjusting your search or selecting a different category</p>
          </div>
        )}
      </div>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-blue-500/80 transition transform hover:-translate-y-0.5"
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
};

export default NewsFeed;
