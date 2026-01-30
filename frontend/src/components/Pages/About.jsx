import { Sparkles, Zap, Shield, TrendingUp, BookOpen, Award } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Summaries',
      description: 'Get concise, intelligent summaries of complex news articles using advanced AI technology.'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Stay informed with the latest news from trusted sources, updated in real-time.'
    },
    {
      icon: Shield,
      title: 'Curated Content',
      description: 'Access verified news from reliable sources across multiple categories.'
    },
    {
      icon: TrendingUp,
      title: 'Personalized Feed',
      description: 'Customize your news experience based on your interests and preferences.'
    },
    {
      icon: BookOpen,
      title: 'Save & Organize',
      description: 'Bookmark articles and summaries to read later, organized in your personal library.'
    },
    {
      icon: Award,
      title: 'Quality First',
      description: 'Every article is carefully selected to ensure accuracy and relevance.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Articles Summarized' },
    { number: '15+', label: 'News Categories' },
    { number: '99%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 text-slate-900 dark:text-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            About ECHO AI
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Your Personal News
            <span className="text-blue-600 dark:text-blue-400"> Intelligence Hub</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We leverage cutting-edge AI technology to transform how you consume news. 
            Stay informed without the information overload – get straight to what matters.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-slate-100">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Choose ECHO AI?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100"
              >
                <div className="bg-blue-100 dark:bg-blue-900 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-7 w-7 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-12 text-white text-center shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-blue-50 max-w-3xl mx-auto leading-relaxed">
            To empower readers with intelligent, concise, and actionable news summaries. 
            We believe that staying informed shouldn't mean drowning in information. 
            Our AI technology helps you understand the world faster, better, and more efficiently.
          </p>
        </div>

        {/* Technology Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Powered by Advanced AI</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Our summarization engine uses state-of-the-art natural language processing 
            to extract key insights from articles, saving you time while keeping you informed.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-6 py-3 rounded-full font-medium">Natural Language Processing</span>
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-6 py-3 rounded-full font-medium">Machine Learning</span>
            <span className="bg-blue-100 text-blue-700 px-6 py-3 rounded-full font-medium">Real-time Analysis</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
