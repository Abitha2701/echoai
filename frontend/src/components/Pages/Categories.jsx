import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, Microscope, Heart, Briefcase, Film, Trophy, 
  Leaf, Landmark, Smartphone, Shield, Car, GraduationCap,
  UtensilsCrossed, Globe, ChevronRight
} from 'lucide-react';
import { newsAPI } from '../../services/api';
import ArticleCard from '../News/ArticleCard';
import ArticleSkeleton from '../News/ArticleSkeleton';

const Categories = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'technology', name: 'Technology', icon: Cpu, color: 'blue', description: 'Tech innovations & startups' },
    { id: 'science', name: 'Science', icon: Microscope, color: 'purple', description: 'Research & discoveries' },
    { id: 'health', name: 'Health', icon: Heart, color: 'green', description: 'Medical & wellness' },
    { id: 'business', name: 'Business', icon: Briefcase, color: 'orange', description: 'Markets & finance' },
    { id: 'entertainment', name: 'Entertainment', icon: Film, color: 'pink', description: 'Movies, music & culture' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'red', description: 'Games & competitions' },
    { id: 'environment', name: 'Environment', icon: Leaf, color: 'emerald', description: 'Climate & sustainability' },
    { id: 'politics', name: 'Politics', icon: Landmark, color: 'indigo', description: 'Government & policy' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'cyan', description: 'Smartphones & apps' },
    { id: 'security', name: 'Security', icon: Shield, color: 'slate', description: 'Cybersecurity & privacy' },
    { id: 'automotive', name: 'Automotive', icon: Car, color: 'violet', description: 'Cars & transportation' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'amber', description: 'Learning & academia' },
    { id: 'food', name: 'Food', icon: UtensilsCrossed, color: 'rose', description: 'Culinary & dining' },
    { id: 'world', name: 'World', icon: Globe, color: 'teal', description: 'International news' }
  ];

  const fallbackArticlesByCategory = {
    technology: [
      {
        _id: 'tech-1',
        title: 'Next-Generation Computing: Quantum Processors Go Mainstream',
        description: 'Major tech companies announce commercial quantum computing services for businesses.',
        imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
        category: 'technology',
        source: { name: 'Tech World' },
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        readTime: 5
      },
      {
        _id: 'tech-2',
        title: 'AI Assistant Revolution: New Capabilities Announced',
        description: 'Latest AI models demonstrate advanced reasoning and problem-solving abilities.',
        imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
        category: 'technology',
        source: { name: 'AI Today' },
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        readTime: 6
      }
    ],
    science: [
      {
        _id: 'sci-1',
        title: 'Breakthrough in Fusion Energy Research',
        description: 'Scientists achieve net energy gain in controlled fusion reaction, marking historic milestone.',
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        category: 'science',
        source: { name: 'Science Daily' },
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        readTime: 7
      }
    ],
    health: [
      {
        _id: 'health-1',
        title: 'New Vaccine Shows 95% Effectiveness in Trials',
        description: 'Groundbreaking vaccine technology offers hope for multiple disease prevention.',
        imageUrl: 'https://images.unsplash.com/photo-1582719478248-54e9f2af90b6?auto=format&fit=crop&w=1200&q=80',
        category: 'health',
        source: { name: 'Medical News' },
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        readTime: 6
      }
    ],
    business: [
      {
        _id: 'biz-1',
        title: 'Tech Startup Raises Record $500M in Funding',
        description: 'Innovative company attracts major investment for revolutionary platform.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        category: 'business',
        source: { name: 'Business Wire' },
        publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        readTime: 4
      }
    ],
    sports: [
      {
        _id: 'sport-1',
        title: 'Underdog Team Wins Championship in Stunning Upset',
        description: 'Historic victory as unexpected champions emerge in thrilling final match.',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
        category: 'sports',
        source: { name: 'Sports News' },
        publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
        readTime: 5
      }
    ],
    entertainment: [
      {
        _id: 'ent-1',
        title: 'Blockbuster Film Breaks Opening Weekend Records',
        description: 'Highly anticipated movie surpasses all expectations at global box office.',
        imageUrl: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
        category: 'entertainment',
        source: { name: 'Entertainment Weekly' },
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        readTime: 4
      }
    ]
  };

  const fetchCategoryNews = async (categoryId) => {
    setLoading(true);
    try {
      const response = await newsAPI.getNewsByCategory(categoryId);
      const results = response.data.data || [];
      const fallback = fallbackArticlesByCategory[categoryId] || fallbackArticlesByCategory.technology;
      setArticles(results.length > 0 ? results : fallback);
    } catch (error) {
      console.error('Error fetching category news:', error);
      const fallback = fallbackArticlesByCategory[categoryId] || fallbackArticlesByCategory.technology;
      setArticles(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryNews(selectedCategory);
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 transition-colors duration-200 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Browse by Category</h1>
          <p className="text-lg text-slate-600">Explore news across different topics and interests</p>
        </div>

        {/* Categories Grid */}
        {!selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 border-2 border-transparent hover:border-${category.color}-200 text-left group`}
              >
                <div className={`bg-${category.color}-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className={`h-7 w-7 text-${category.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-slate-600 text-sm mb-3">{category.description}</p>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm">
                  Explore <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Back Button and Category Header */}
            <div className="mb-8">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium mb-4 flex items-center gap-2"
              >
                ← Back to Categories
              </button>
              
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                {(() => {
                  const cat = categories.find(c => c.id === selectedCategory);
                  return (
                    <div className="flex items-center gap-4">
                      <div className={`bg-${cat.color}-100 w-16 h-16 rounded-xl flex items-center justify-center`}>
                        <cat.icon className={`h-8 w-8 text-${cat.color}-600`} />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-900">{cat.name}</h2>
                        <p className="text-slate-600">{cat.description}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            ) : articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-100">
                <p className="text-slate-600 text-lg">No articles found in this category yet.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;
