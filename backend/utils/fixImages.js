const mongoose = require('mongoose');
const Article = require('../models/Article');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Toggle to force refreshing all images (set FIX_FORCE=true when running)
const FORCE_UPDATE = process.env.FIX_FORCE === 'true';

// Multiple image options per category so articles get varied thumbnails
const categoryImages = {
  technology: [
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80'
  ],
  science: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1470165518754-609cab407e47?auto=format&fit=crop&w=1200&q=80'
  ],
  health: [
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80'
  ],
  business: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508387025002-73f3c6a45d5c?auto=format&fit=crop&w=1200&q=80'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1533613220915-609f6a6a7bca?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=1200&q=80'
  ],
  environment: [
    'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  ],
  politics: [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520454974743-201d305911eb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80'
  ]
};

// Keyword → themed image pools for more content-relevant fallbacks
const keywordPools = [
  {
    keys: ['ai', 'artificial intelligence', 'chatgpt', 'gpt', 'openai', 'deepmind', 'model', 'ml', 'machine learning', 'neural network', 'deep learning'],
    images: [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['quantum', 'qubit', 'superconduct', 'entangle', 'quantum computing'],
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['space', 'nasa', 'mars', 'moon', 'orbit', 'rocket', 'satellite', 'astronaut', 'spacex', 'telescope', 'galaxy', 'universe'],
    images: [
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['climate', 'environment', 'rainforest', 'biodiversity', 'sustainability', 'renewable', 'solar', 'wind energy', 'carbon', 'emission', 'global warming', 'eco'],
    images: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['health', 'hospital', 'cancer', 'vaccine', 'medical', 'doctor', 'nurse', 'surgery', 'treatment', 'drug', 'pharmaceutical', 'disease', 'pandemic', 'covid'],
    images: [
      'https://images.unsplash.com/photo-1582719478248-54e9f2af90b6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['finance', 'market', 'stocks', 'earnings', 'rally', 'wall street', 'trading', 'investment', 'bank', 'cryptocurrency', 'bitcoin', 'economy', 'inflation'],
    images: [
      'https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['sports', 'championship', 'match', 'tournament', 'football', 'soccer', 'basketball', 'baseball', 'olympics', 'athlete', 'win', 'game', 'player'],
    images: [
      'https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['movie', 'film', 'music', 'entertainment', 'festival', 'concert', 'album', 'actor', 'actress', 'cinema', 'streaming', 'netflix', 'spotify'],
    images: [
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533613220915-609f6a6a7bca?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['smartphone', 'iphone', 'android', 'app', 'mobile', 'tech gadget', 'device'],
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['cybersecurity', 'hack', 'breach', 'data leak', 'ransomware', 'security', 'privacy'],
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['electric vehicle', 'ev', 'tesla', 'automotive', 'car', 'autonomous', 'self-driving'],
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['election', 'voting', 'politics', 'government', 'president', 'congress', 'senate', 'policy'],
    images: [
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520454974743-201d305911eb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['war', 'military', 'conflict', 'defense', 'army', 'navy', 'weapon'],
    images: [
      'https://images.unsplash.com/photo-1436262513933-a0b06755c784?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522097969174-3c5b7531aba6?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['education', 'school', 'university', 'college', 'student', 'learning', 'teacher'],
    images: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    keys: ['food', 'restaurant', 'chef', 'cooking', 'recipe', 'culinary'],
    images: [
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];

// Legacy single-image defaults we previously used; replace them when seen
const legacyDefaults = new Set([
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533613220915-609f6a6a7bca?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80'
]);

// Track per-category assignment so we rotate images instead of repeating the first one
const categoryCounters = {};

const defaultPool = [
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80'
];

function pickImage(category) {
  const pool = categoryImages[category] || defaultPool;
  const index = categoryCounters[category] || 0;
  categoryCounters[category] = index + 1;
  return pool[index % pool.length];
}

function pickByContent(text, fallbackCategory) {
  const normalized = (text || '').toLowerCase();
  for (const pool of keywordPools) {
    if (pool.keys.some((k) => normalized.includes(k))) {
      return pool.images[Math.floor(Math.random() * pool.images.length)];
    }
  }
  return pickImage(fallbackCategory);
}

async function fixImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get all articles
    const articles = await Article.find({});
    console.log(`📊 Found ${articles.length} articles`);

    let updatedCount = 0;
    for (const article of articles) {
      const category = (article.category || 'technology').toLowerCase();
      const needsUpdate = FORCE_UPDATE || !article.imageUrl || legacyDefaults.has((article.imageUrl || '').trim());

      if (needsUpdate) {
        const text = `${article.title || ''} ${article.description || ''}`;
        article.imageUrl = pickByContent(text, category);
        await article.save();
        updatedCount++;
        console.log(`✅ Updated image for: ${article.title.substring(0, 50)}...`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} articles with images`);
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixImages();
