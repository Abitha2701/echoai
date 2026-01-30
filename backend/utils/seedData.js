const Article = require('../models/Article');
const newsAPIService = require('./newsAPI');

const mockArticles = [
  {
    title: 'AI Breakthroughs: New Model Achieves Human-Level Performance',
    description: 'Researchers announce a revolutionary AI model that matches human performance on complex tasks.',
    content: 'A team of AI researchers has unveiled a groundbreaking model that demonstrates human-level performance across multiple domains. The breakthrough could have significant implications for industries ranging from healthcare to finance.',
    url: 'https://example.com/ai-breakthrough-1',
    imageUrl: 'https://images.unsplash.com/photo-1677442d019cecf8e5004a4bebf20e933d02cb1b7?w=600',
    source: { name: 'AI Research Daily', id: 'ai-research' },
    category: 'technology',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    readTime: 8
  },
  {
    title: 'Quantum Computing Milestone: New Record Set',
    description: 'Scientists achieve quantum advantage in solving practical problems.',
    content: 'In a major breakthrough for quantum computing, researchers have successfully demonstrated quantum advantage on a real-world problem, marking a significant milestone in the field.',
    url: 'https://example.com/quantum-1',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e3c3136db3f0?w=600',
    source: { name: 'Science Weekly', id: 'science-weekly' },
    category: 'technology',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    readTime: 6
  },
  {
    title: 'New Species Discovered in Amazon Rainforest',
    description: 'Scientists uncover a previously unknown species during rainforest expedition.',
    content: 'An international team of scientists has discovered a new species of tree frog in the Amazon rainforest, expanding our understanding of biodiversity in the region.',
    url: 'https://example.com/species-1',
    imageUrl: 'https://images.unsplash.com/photo-1580620773945-8871235ba48c?w=600',
    source: { name: 'Nature News', id: 'nature-news' },
    category: 'science',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    readTime: 5
  },
  {
    title: 'Breakthrough in Cancer Treatment Shows Promise',
    description: 'New immunotherapy approach demonstrates significant improvement in patient outcomes.',
    content: 'A new immunotherapy treatment has shown remarkable results in clinical trials, with patients experiencing significantly improved survival rates and quality of life.',
    url: 'https://example.com/cancer-1',
    imageUrl: 'https://images.unsplash.com/photo-1631217314831-c6227db76b6e?w=600',
    source: { name: 'Medical Today', id: 'medical-today' },
    category: 'health',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    readTime: 7
  },
  {
    title: 'Tech Giants Announce New Partnership',
    description: 'Two major technology companies join forces on ambitious new project.',
    content: 'In a surprising announcement, two leading technology companies have announced a strategic partnership to develop next-generation technologies that could reshape the industry.',
    url: 'https://example.com/partnership-1',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600',
    source: { name: 'Tech Crunch', id: 'techcrunch' },
    category: 'business',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    readTime: 4
  },
  {
    title: 'Climate Change Report: Urgent Action Required',
    description: 'Latest UN report highlights critical need for immediate climate action.',
    content: 'A comprehensive UN report on climate change emphasizes the urgency of implementing immediate and substantial measures to mitigate global warming and its impacts.',
    url: 'https://example.com/climate-1',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=600',
    source: { name: 'Environment News', id: 'env-news' },
    category: 'science',
    publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    readTime: 9
  },
  {
    title: 'Sports: Historic Victory at International Championships',
    description: 'Underdog team claims unexpected victory in major sporting event.',
    content: 'In an exciting upset at the international championships, an underdog team has claimed a historic victory, defeating the defending champions in a thrilling final match.',
    url: 'https://example.com/sports-1',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25ddfcbf042?w=600',
    source: { name: 'Sports Daily', id: 'sports-daily' },
    category: 'sports',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    readTime: 5
  },
  {
    title: 'Entertainment: New Blockbuster Film Breaks Records',
    description: 'Latest superhero film becomes highest-grossing opening weekend.',
    content: 'A newly released superhero film has shattered box office records, achieving the highest-grossing opening weekend in cinema history and exceeding all industry expectations.',
    url: 'https://example.com/entertainment-1',
    imageUrl: 'https://images.unsplash.com/photo-1533613220915-609f6a6a7bca?w=600',
    source: { name: 'Entertainment Weekly', id: 'entertainment-weekly' },
    category: 'entertainment',
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    readTime: 3
  }
];

async function seedDatabase() {
  try {
    // Check if articles already exist
    const existingCount = await Article.countDocuments();
    if (existingCount > 0) {
      console.log(`✅ Database already seeded with ${existingCount} articles`);
      return;
    }

    // Try to fetch real articles from NewsAPI
    console.log('📰 Attempting to fetch real news from NewsAPI...');
    try {
      const realArticles = await newsAPIService.getTopHeadlines();
      if (realArticles && realArticles.length > 0) {
        // Save real articles
        const savedArticles = [];
        for (const article of realArticles) {
          try {
            const sourceData = typeof article.source === 'object' 
              ? { name: article.source.name, id: article.source.id }
              : { name: article.source, id: '' };

            const newArticle = await Article.create({
              title: article.title,
              description: article.description || '',
              content: article.content || '',
              url: article.url,
              imageUrl: article.urlToImage || '',
              source: sourceData,
              category: 'technology',
              publishedAt: article.publishedAt,
              readTime: Math.ceil(((article.content || article.description || '').split(' ').length) / 200) || 5
            });
            savedArticles.push(newArticle);
          } catch (error) {
            // Skip articles that fail
          }
        }
        
        if (savedArticles.length > 0) {
          console.log(`✅ Seeded database with ${savedArticles.length} real articles from NewsAPI`);
          return;
        }
      }
    } catch (apiError) {
      console.warn('⚠️  NewsAPI unavailable:', apiError.message);
      console.log('ℹ️  Add a valid NEWS_API_KEY to fetch real articles from https://newsapi.org');
    }

    // Fallback to mock articles if API fails
    console.log('📦 Using mock articles as fallback...');
    await Article.insertMany(mockArticles);
    console.log(`✅ Seeded database with ${mockArticles.length} mock articles`);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
}

module.exports = seedDatabase;
