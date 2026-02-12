import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Flame, Clock, ArrowUp, ArrowRight } from 'lucide-react';
import { newsAPI } from '../../services/api';
import ArticleCard from '../News/ArticleCard';
import ArticleSkeleton from '../News/ArticleSkeleton';
import { usePreferences } from '../../context/PreferencesContext';

const Trending = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');
  const [error, setError] = useState('');
  const { preferences } = usePreferences();                                  
  const { articlesPerPage, compactView } = preferences;

  const timeFilters = [
    { id: 'today', label: 'Today', icon: Clock },
    { id: 'week', label: 'This Week', icon: TrendingUp },
    { id: 'month', label: 'This Month', icon: ArrowUp }
  ];

  useEffect(() => {
    fetchTrendingNews();
  }, [timeFilter, articlesPerPage]);

  const fetchTrendingNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await newsAPI.getNews(1, Math.max(articlesPerPage, 12));
      const sortedArticles = (response.data || [])
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, Math.max(articlesPerPage, 12));
      setArticles(sortedArticles);
    } catch (error) {
      console.error('Error fetching trending news:', error);
      setError('Trending news is temporarily unavailable. Please try again soon.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-200 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 w-12 h-12 rounded-xl flex items-center justify-center">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Trending News</h1>
          </div>
          <p className="text-lg text-slate-600">Most popular stories right now</p>
        </div>

        {/* Time Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-slate-100">
          <div className="flex gap-3 flex-wrap">
            {timeFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTimeFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  timeFilter === filter.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <filter.icon className="h-5 w-5" />
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3 mb-8">
            {error}
          </div>
        )}

        {/* Featured Top Story */}
        {!loading && articles.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 mb-8 border-2 border-orange-200 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-orange-600" />
              <span className="text-orange-600 font-bold text-lg">🔥 Hottest Story</span>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <ArticleCard article={articles[0]} />
            </div>
          </div>
        )}

        {/* Trending Articles Grid */}
        {loading ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Loading trending articles...</h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-6`}>
              {[...Array(9)].map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : articles.length > 1 ? (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              More Trending Stories
            </h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-6`}>
              {articles.slice(1).map((article, index) => (
                <div key={article._id} className="relative">
                  <div className="absolute -top-3 -left-3 bg-gradient-to-r from-orange-400 to-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
                    {index + 2}
                  </div>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-100">
            <Flame className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg mb-2">No trending articles available</p>
            <p className="text-slate-500 mb-6">Try your personalized feed or explore categories.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Open feed
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center gap-2 border border-slate-200 px-4 py-2 rounded-xl font-semibold text-slate-600 hover:border-slate-300"
              >
                Browse categories
              </Link>
              <Link
                to="/reader"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold"
              >
                Reader hub
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
