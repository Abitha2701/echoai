import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Bookmark, BookmarkCheck, ArrowRight, Sparkles } from 'lucide-react';
import { summaryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const ArticleCard = ({ article }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setSaving(true);
    try {
      if (isSaved) {
        await summaryAPI.unsaveArticle(article._id);
        setIsSaved(false);
        addToast('Removed from Saved', 'warning');
      } else {
        await summaryAPI.saveArticle(article._id);
        setIsSaved(true);
        addToast('Saved to your library', 'success');
      }
    } catch (error) {
      console.error('Error saving article:', error);
      addToast('Could not update saved articles. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const categoryColors = {
    technology: 'bg-blue-100 text-blue-700',
    science: 'bg-purple-100 text-purple-700',
    health: 'bg-green-100 text-green-700',
    business: 'bg-orange-100 text-orange-700',
    entertainment: 'bg-pink-100 text-pink-700',
    sports: 'bg-red-100 text-red-700',
    default: 'bg-gray-100 text-gray-700'
  };

  const fallbackImages = {
    technology: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80',
    science: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    health: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    business: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    entertainment: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    sports: 'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    default: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  };

  const categoryColor = categoryColors[article.category?.toLowerCase()] || categoryColors.default;

  return (
    <Link to={`/article/${article._id}`}>
      <div className="h-full bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105 transform flex flex-col group border border-gray-100 dark:border-gray-700">
        {/* Article Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                const key = (article.category || 'default').toLowerCase();
                e.target.src = fallbackImages[key] || fallbackImages.default;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              <Sparkles className="h-12 w-12 text-blue-400 opacity-70" />
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${categoryColor} backdrop-blur-sm shadow-lg transform group-hover:scale-110 transition-transform`}>
              {article.category}
            </span>
          </div>

          {/* Save Button */}
          {isAuthenticated && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="absolute top-4 right-4 p-2.5 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group/btn hover:scale-110"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
              ) : isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-blue-600 animate-pulse-glow" />
              ) : (
                <Bookmark className="h-5 w-5 text-gray-600 group-hover/btn:text-blue-600 transition-colors" />
              )}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
            {article.description}
          </p>

          {/* AI Summary Preview */}
          {article.aiSummary && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-3.5 mb-4 group-hover:border-blue-300 transition-colors">
              <div className="flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5 animate-pulse" />
                <p className="text-xs text-gray-700 line-clamp-2 font-medium">
                  {article.aiSummary}
                </p>
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 group-hover:text-gray-700 transition-colors">
              <Clock className="h-4 w-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600 font-semibold group-hover:translate-x-1 transition-all duration-200">
              <span>Read</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
