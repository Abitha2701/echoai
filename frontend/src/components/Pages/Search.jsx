import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, TrendingUp, X, ArrowRight } from 'lucide-react';
import { newsAPI } from '../../services/api';
import ArticleCard from '../News/ArticleCard';
import ArticleSkeleton from '../News/ArticleSkeleton';
import { useToast } from '../../context/ToastContext';
import { usePreferences } from '../../context/PreferencesContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const { preferences } = usePreferences();
  const { articlesPerPage, compactView } = preferences;

  const trendingTopics = [
    'Artificial Intelligence',
    'Climate Change',
    'Space Exploration',
    'Cryptocurrency',
    'Electric Vehicles',
    'Quantum Computing',
    'Renewable Energy',
    'Biotechnology'
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      addToast('Please enter a search term', 'warning');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    setError('');
    try {
      const response = await newsAPI.searchNews(query, 1, articlesPerPage);
      const results = response.data || [];
      setArticles(results);
    } catch (error) {
      console.error('Error searching:', error);
      setError('Search is temporarily unavailable. Please try again soon.');
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingClick = (topic) => {
    setQuery(topic);
    setLoading(true);
    setHasSearched(true);
    setError('');
    newsAPI.searchNews(topic, 1, articlesPerPage)
      .then(response => {
        const results = response.data || [];
        setArticles(results);
      })
      .catch(error => {
        console.error('Error searching:', error);
        setError('Search is temporarily unavailable. Please try again soon.');
        setArticles([]);
      })
      .finally(() => setLoading(false));
  };

  const clearSearch = () => {
    setQuery('');
    setArticles([]);
    setHasSearched(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-indigo-50 py-8 transition-colors duration-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Search News</h1>
          <p className="text-lg text-slate-600">Find articles on topics that interest you</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-100">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for articles, topics, or keywords..."
                className="w-full pl-14 pr-24 py-4 text-lg border-2 border-slate-200 bg-white text-slate-900 rounded-xl focus:outline-none focus:border-sky-500 transition-colors placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-sky-600 text-white px-6 py-2 rounded-lg hover:bg-sky-700 transition-all font-medium shadow-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Trending Topics */}
        {!hasSearched && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-sky-600" />
              <h2 className="text-xl font-bold text-slate-900">Trending Topics</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleTrendingClick(topic)}
                  className="bg-white hover:bg-gradient-to-r hover:from-sky-600 hover:to-indigo-600 hover:text-white text-slate-700 px-5 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transition-all border border-slate-200"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {loading ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Searching...</h2>
            <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-6`}>
              {[...Array(6)].map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : hasSearched ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {articles.length > 0 
                  ? `Found ${articles.length} result${articles.length !== 1 ? 's' : ''} for "${query}"`
                  : `No results found for "${query}"`
                }
              </h2>
            </div>

            {error && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl px-4 py-3 mb-6">
                {error}
              </div>
            )}
            
            {articles.length > 0 ? (
              <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-6`}>
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-100">
                <SearchIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No articles found</p>
                <p className="text-slate-500 mb-6">Try a different query or jump back into your feed.</p>
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
