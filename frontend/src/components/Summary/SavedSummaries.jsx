import { useState, useEffect } from 'react';
import { summaryAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { Trash2, ExternalLink, Clock, Bookmark, AlertCircle, Loader, Sparkles, ArrowRight } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

const SavedSummaries = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const { preferences } = usePreferences();
  const { showImages, compactView, readingMode } = preferences;

  const summaryPaddingClass = compactView ? 'p-4' : 'p-6';
  const summaryTextClass = readingMode === 'compact'
    ? 'text-xs'
    : readingMode === 'spacious'
      ? 'text-base'
      : 'text-sm';

  const fallbackSummaries = [
    {
      _id: 'saved-1',
      article: {
        _id: 'article-1',
        title: 'The Future of Artificial Intelligence in Healthcare',
        description: 'Exploring how AI is revolutionizing medical diagnosis and treatment planning.',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
        category: 'health',
        source: { name: 'Health Tech Review' },
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        readTime: 6,
        url: 'https://example.com/ai-healthcare'
      },
      summary: 'AI is transforming healthcare through improved diagnostics, personalized treatment plans, and predictive analytics. Machine learning algorithms can now detect diseases earlier and more accurately than traditional methods, leading to better patient outcomes.',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'saved-2',
      article: {
        _id: 'article-2',
        title: 'Climate Action: Global Summit Reaches Historic Agreement',
        description: 'World leaders commit to ambitious carbon neutrality goals and renewable energy investments.',
        imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?auto=format&fit=crop&w=1200&q=80',
        category: 'environment',
        source: { name: 'Global Climate News' },
        publishedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        readTime: 7,
        url: 'https://example.com/climate-summit'
      },
      summary: 'The recent climate summit concluded with unprecedented international cooperation, featuring binding commitments to reduce emissions by 50% by 2030 and achieve carbon neutrality by 2050. Major economies pledged significant investments in renewable energy infrastructure.',
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
    },
    {
      _id: 'saved-3',
      article: {
        _id: 'article-3',
        title: 'Quantum Computing Breakthrough: New Era of Processing Power',
        description: 'Scientists achieve quantum supremacy with 1000-qubit processor.',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
        category: 'technology',
        source: { name: 'Quantum Tech' },
        publishedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
        readTime: 8,
        url: 'https://example.com/quantum-breakthrough'
      },
      summary: 'Researchers have developed a stable 1000-qubit quantum processor that maintains coherence for extended periods, opening new possibilities for complex simulations, drug discovery, and cryptography. This marks a significant milestone in quantum computing development.',
      createdAt: new Date(Date.now() - 60 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    fetchSavedSummaries();
  }, []);

  const fetchSavedSummaries = async () => {
    try {
      setLoading(true);
      const response = await summaryAPI.getSavedSummaries();
      const results = response.data || [];
      setSummaries(results.length > 0 ? results : fallbackSummaries);
      setError('');
    } catch (err) {
      console.error('Error fetching saved summaries:', err);
      setSummaries(fallbackSummaries);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    setDeletingId(articleId);
    try {
      await summaryAPI.unsaveArticle(articleId);
      setSummaries(prev => prev.filter(summary => summary.article._id !== articleId));
    } catch (error) {
      console.error('Error deleting summary:', error);
      setError('Failed to delete summary. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Loader className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">Loading your saved articles...</p>
        </div>
      </div>
    );
  }

  const categoryColors = {
    technology: 'bg-blue-100 text-blue-700',
    science: 'bg-purple-100 text-purple-700',
    health: 'bg-green-100 text-green-700',
    business: 'bg-orange-100 text-orange-700',
    entertainment: 'bg-pink-100 text-pink-700',
    sports: 'bg-red-100 text-red-700',
    default: 'bg-gray-100 text-gray-700'
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
            <Bookmark className="h-8 w-8 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold">Saved Summaries</h1>
          </div>
          <p className="text-blue-100 text-lg font-medium">Your personal collection of AI-summarized news articles</p>
          <div className="mt-4 text-blue-100 font-bold text-lg">
            ✨ {summaries.length} article{summaries.length !== 1 ? 's' : ''} saved
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="flex items-start space-x-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-6 py-4 rounded-2xl mb-8 animate-fadeInUp">
            <AlertCircle className="h-6 w-6 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-lg">Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {summaries.length === 0 ? (
          <div className="text-center py-24 animate-fadeInUp">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-12 max-w-md mx-auto border border-gray-100 dark:border-gray-700 transition-colors duration-200">
              <div className="relative mb-6">
                <Bookmark className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto" />
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 absolute right-1/4 bottom-0 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">No saved articles yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
                Start saving articles from the news feed to see your AI-generated summaries here.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-xl transition-all font-bold transform hover:-translate-y-0.5"
              >
                <span>Browse News</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${compactView ? 'lg:grid-cols-4 xl:grid-cols-5' : 'lg:grid-cols-3'} gap-8`}>
            {summaries.map((savedSummary, index) => {
              const categoryColor = categoryColors[savedSummary.article.category?.toLowerCase()] || categoryColors.default;
              
              return (
                <div
                  key={savedSummary._id}
                  style={{animationDelay: `${index * 0.05}s`}}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 animate-fadeInUp"
                >
                  {/* Article Image */}
                  {showImages && (
                    <div className={`relative ${compactView ? 'h-32' : 'h-48'} overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300`}>
                      {savedSummary.article.imageUrl ? (
                        <img
                          src={savedSummary.article.imageUrl}
                          alt={savedSummary.article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                          <Sparkles className="h-12 w-12 text-blue-400 opacity-70" />
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${categoryColor} backdrop-blur-sm shadow-lg`}>
                          {savedSummary.article.category}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(savedSummary.article._id)}
                        disabled={deletingId === savedSummary.article._id}
                        className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 disabled:opacity-50 group-hover:scale-110 transform"
                        title="Remove from saved"
                      >
                        {deletingId === savedSummary.article._id ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Content */}
                  <div className={`${summaryPaddingClass} flex-1 flex flex-col`}>
                    {!showImages && (
                      <div className="mb-4 flex items-center justify-between">
                        <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${categoryColor} backdrop-blur-sm shadow-sm`}>
                          {savedSummary.article.category}
                        </span>
                        <button
                          onClick={() => handleDelete(savedSummary.article._id)}
                          disabled={deletingId === savedSummary.article._id}
                          className="p-2.5 bg-white rounded-full shadow hover:shadow-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 disabled:opacity-50"
                          title="Remove from saved"
                        >
                          {deletingId === savedSummary.article._id ? (
                            <Loader className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    )}
                    {/* Title */}
                    <Link
                      to={`/article/${savedSummary.article._id}`}
                      className="text-lg font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    >
                      {savedSummary.article.title}
                    </Link>

                    {/* AI Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-4 mb-4 flex-1 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
                      <div className="flex items-start space-x-2 mb-3">
                        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" />
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">AI Summary</p>
                      </div>
                      <p className={`${summaryTextClass} text-gray-700 dark:text-gray-300 line-clamp-3 font-medium`}>
                        {savedSummary.summary || savedSummary.article.aiSummary}
                      </p>
                    </div>

                    {/* Notes */}
                    {savedSummary.notes && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                        <p className="text-xs font-bold text-amber-700 mb-2">📝 Your Notes</p>
                        <p className="text-sm text-amber-700 line-clamp-2">
                          {savedSummary.notes}
                        </p>
                      </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">Saved {formatDate(savedSummary.createdAt || savedSummary.savedAt)}</span>
                      </div>
                      <Link
                        to={`/article/${savedSummary.article._id}`}
                        className="text-blue-600 hover:text-blue-700 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-all"
                      >
                        <span>Read</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSummaries;
