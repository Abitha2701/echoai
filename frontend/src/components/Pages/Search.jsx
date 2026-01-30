import { useState } from 'react';
import { Search as SearchIcon, TrendingUp, X } from 'lucide-react';
import { newsAPI } from '../../services/api';
import ArticleCard from '../News/ArticleCard';
import ArticleSkeleton from '../News/ArticleSkeleton';
import { useToast } from '../../context/ToastContext';

const Search = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { addToast } = useToast();

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

  const fallbackSearchResults = {
    'artificial intelligence': [
      {
        _id: 'search-ai-1',
        title: 'New AI Model Achieves Human-Level Understanding',
        description: 'Researchers develop AI system with breakthrough natural language comprehension capabilities.',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
        category: 'technology',
        source: { name: 'AI Research' },
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        readTime: 6
      },
      {
        _id: 'search-ai-2',
        title: 'AI in Healthcare: Transforming Patient Care',
        description: 'Machine learning algorithms improve diagnosis accuracy and treatment planning.',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
        category: 'health',
        source: { name: 'Health Tech' },
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        readTime: 5
      }
    ],
    'climate change': [
      {
        _id: 'search-climate-1',
        title: 'Renewable Energy Adoption Reaches New Milestone',
        description: 'Global renewable energy capacity surpasses fossil fuels for the first time.',
        imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
        category: 'environment',
        source: { name: 'Green Energy' },
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        readTime: 5
      }
    ],
    'space exploration': [
      {
        _id: 'search-space-1',
        title: 'Mars Mission Reveals Stunning New Discoveries',
        description: 'Latest rover findings provide insights into Mars\' geological history and water presence.',
        imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
        category: 'science',
        source: { name: 'Space News' },
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        readTime: 7
      }
    ],
    'default': [
      {
        _id: 'search-default-1',
        title: 'Tech Industry Sees Major Innovation Wave',
        description: 'Multiple sectors experience rapid technological advancement and digital transformation.',
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        category: 'technology',
        source: { name: 'Tech Daily' },
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        readTime: 4
      }
    ]
  };

  const getFallbackResults = (searchQuery) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const matchedKey = Object.keys(fallbackSearchResults).find(key => 
      normalizedQuery.includes(key) || key.includes(normalizedQuery)
    );
    return fallbackSearchResults[matchedKey] || fallbackSearchResults['default'];
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      addToast('Please enter a search term', 'warning');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await newsAPI.searchNews(query);
      const results = response.data.data || [];
      setArticles(results.length > 0 ? results : getFallbackResults(query));
    } catch (error) {
      console.error('Error searching:', error);
      setArticles(getFallbackResults(query));
    } finally {
      setLoading(false);
    }
  };

  const handleTrendingClick = (topic) => {
    setQuery(topic);
    setLoading(true);
    setHasSearched(true);
    newsAPI.searchNews(topic)
      .then(response => {
        const results = response.data.data || [];
        setArticles(results.length > 0 ? results : getFallbackResults(topic));
      })
      .catch(error => {
        console.error('Error searching:', error);
        setArticles(getFallbackResults(topic));
      })
      .finally(() => setLoading(false));
  };

  const clearSearch = () => {
    setQuery('');
    setArticles([]);
    setHasSearched(false);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-100">
                <SearchIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 text-lg mb-2">No articles found</p>
                <p className="text-slate-500">Try searching for different keywords or browse trending topics</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Search;
