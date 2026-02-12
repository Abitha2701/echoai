import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { newsAPI, summaryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Share2,
  AlertCircle,
  Loader
} from 'lucide-react';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated } = useAuth();

  const fallbackArticle = {
    _id: id || 'fallback-1',
    title: 'Artificial Intelligence Revolution: How Machine Learning is Transforming Industries',
    description: 'Comprehensive analysis of AI\'s impact across healthcare, finance, transportation, and more.',
    content: `Artificial Intelligence has emerged as one of the most transformative technologies of the 21st century, revolutionizing industries and changing the way we live and work. From healthcare diagnostics to autonomous vehicles, AI applications are becoming increasingly sophisticated and ubiquitous.

In healthcare, machine learning algorithms are helping doctors diagnose diseases more accurately and quickly than ever before. AI-powered systems can analyze medical images, identify patterns in patient data, and even predict health outcomes with remarkable precision.

The financial sector has embraced AI for fraud detection, algorithmic trading, and personalized banking services. Machine learning models process vast amounts of transaction data in real-time, identifying suspicious activities and protecting customers from financial crimes.

Transportation is another sector experiencing a dramatic transformation. Self-driving cars, powered by advanced AI systems, are no longer science fiction but an emerging reality. These vehicles use computer vision, sensor fusion, and deep learning to navigate complex environments safely.

Looking ahead, experts predict that AI will continue to advance rapidly, bringing both opportunities and challenges. As we integrate these powerful technologies into our daily lives, it's crucial to address ethical considerations, ensure transparency, and develop appropriate regulations.`,
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    category: 'technology',
    source: { name: 'Tech Insights' },
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    readTime: 8,
    url: 'https://example.com/ai-revolution',
    aiSummary: 'AI is revolutionizing multiple industries including healthcare, finance, and transportation. Machine learning enables more accurate medical diagnoses, enhanced fraud detection, and the development of autonomous vehicles. While AI presents significant opportunities, addressing ethical considerations and developing appropriate regulations remain crucial challenges.'
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await newsAPI.getArticleById(id);
      setArticle(response.data || fallbackArticle);
      setError('');
    } catch (err) {
      console.error('Error fetching article:', err);
      setArticle(fallbackArticle);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    if (!article) return;

    setGeneratingSummary(true);
    try {
      const response = await summaryAPI.generateSummary(article._id);
      setArticle(prev => ({
        ...prev,
        aiSummary: response.data.summary
      }));
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated || !article) return;

    setSaving(true);
    try {
      if (isSaved) {
        await summaryAPI.unsaveArticle(article._id);
        setIsSaved(false);
      } else {
        await summaryAPI.saveArticle(article._id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const buildInsights = (articleData) => {
    const text = [articleData.title, articleData.description, articleData.content]
      .filter(Boolean)
      .join(' ');

    const quoteMatches = Array.from(text.matchAll(/"([^"]{20,200})"/g))
      .map((match) => match[1].trim())
      .filter((quote, index, arr) => arr.indexOf(quote) === index)
      .slice(0, 3);

    const statMatches = Array.from(
      text.matchAll(/\b\d{1,3}(?:,\d{3})*(?:\.\d+)?%?\b|\b\d{4}\b/g)
    )
      .map((match) => match[0])
      .filter((stat, index, arr) => arr.indexOf(stat) === index)
      .slice(0, 5);

    const stopWords = new Set([
      'The', 'A', 'An', 'In', 'On', 'At', 'For', 'And', 'But', 'With', 'From',
      'This', 'That', 'These', 'Those', 'Its', 'Their', 'His', 'Her', 'Our',
      'We', 'They', 'He', 'She', 'It', 'I', 'As', 'By', 'To', 'Of'
    ]);

    const entityMatches = Array.from(
      text.matchAll(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g)
    )
      .map((match) => match[1].trim())
      .filter((entity) => !stopWords.has(entity))
      .filter((entity, index, arr) => arr.indexOf(entity) === index)
      .slice(0, 8);

    return {
      quotes: quoteMatches,
      stats: statMatches,
      entities: entityMatches
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="text-center">
          <Loader className="h-16 w-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-200">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto text-center border border-gray-100 dark:border-gray-700">
          <AlertCircle className="h-16 w-16 text-red-600 dark:text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all font-bold group transform hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to News
          </Link>
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

  const categoryColor = categoryColors[article.category?.toLowerCase()] || categoryColors.default;
  const insights = buildInsights(article);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Header with Back Button */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold transition-all group hover:bg-blue-50 dark:hover:bg-blue-900/30 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to News</span>
          </Link>
          <Link
            to="/reader"
            className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60 px-4 py-2 rounded-lg"
          >
            <span>Reader Hub</span>
          </Link>
          <Link
            to="/categories"
            className="inline-flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60 px-4 py-2 rounded-lg"
          >
            <span>Categories</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeInUp">
        {/* Article Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-6 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          {/* Featured Image */}
          {article.imageUrl && (
            <div className="relative h-72 md:h-80 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Meta Info */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${categoryColor} shadow-sm`}>
                  {article.category}
                </span>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  <Clock className="h-5 w-5" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleShare}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 transform hover:scale-110"
                  title="Share article"
                >
                  <Share2 className="h-5 w-5" />
                </button>

                {isAuthenticated && (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                      isSaved
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70 shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save article'}
                  >
                    {saving ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : isSaved ? (
                      <BookmarkCheck className="h-5 w-5 animate-pulse-glow" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {article.description}
            </p>

            {/* Read Original Button */}
            {article.url && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl transition-all font-bold transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* AI Summary Section */}
          <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200 h-full">
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl shadow-md">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
                  </div>
                  <span>AI Summary</span>
                </h2>

                {!article.aiSummary && isAuthenticated && (
                  <button
                    onClick={generateSummary}
                    disabled={generatingSummary}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold transform hover:-translate-y-0.5"
                  >
                    {generatingSummary && <Loader className="h-5 w-5 animate-spin" />}
                    <span>{generatingSummary ? 'Generating...' : 'Generate Summary'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1">
                {article.aiSummary ? (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl p-6 shadow-sm h-full">
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-lg font-medium">
                      {article.aiSummary}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-2xl h-full flex flex-col items-center justify-center">
                    <Sparkles className="h-14 w-14 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-base font-semibold max-w-md">
                      {isAuthenticated
                        ? 'Click the button above to generate an AI summary of this article.'
                        : 'Sign in to generate AI summaries of articles.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insight Cards */}
          <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-200 h-full">
            <div className="p-6 md:p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Insight Cards</h2>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Auto-extracted</span>
              </div>

              <div className="grid grid-cols-1 gap-4 flex-1">
                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Key Entities</h3>
                  {insights.entities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {insights.entities.map((entity) => (
                        <span
                          key={entity}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No entities detected yet.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Key Stats</h3>
                  {insights.stats.length > 0 ? (
                    <ul className="space-y-2">
                      {insights.stats.map((stat) => (
                        <li key={stat} className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Figure</span>
                          <span className="text-base font-bold text-gray-900 dark:text-white">{stat}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No numbers or statistics found.
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5 shadow-sm">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Notable Quotes</h3>
                  {insights.quotes.length > 0 ? (
                    <ul className="space-y-3">
                      {insights.quotes.map((quote) => (
                        <li key={quote} className="text-sm text-gray-600 dark:text-gray-300 italic">
                          "{quote}"
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No quotes detected in the article content.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Content */}
        {article.content && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 mt-8 border border-gray-100 dark:border-gray-700 transition-colors duration-200">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Full Article</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap text-lg">
                {article.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
