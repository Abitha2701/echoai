const axios = require("axios");

class NewsAPIService {
  constructor() {
    this.baseURL = "https://newsdata.io/api/1";
  }

  getApiKey() {
    if (!this.apiKey) {
      this.apiKey = process.env.NEWS_API_KEY;
      console.log("🔑 API Key loaded:", this.apiKey ? `${this.apiKey.substring(0, 10)}...` : "MISSING!");
    }
    return this.apiKey;
  }

  async getTopHeadlines(category = "", country = "us", page = 1) {
    try {
      const params = {
        apikey: this.getApiKey(),
        language: "en",
        country: country,
        size: 10
      };

      if (category && category.trim()) {
        params.category = category;
      }

      if (page && page > 1) {
        params.page = page;
      }

      console.log("🔍 Fetching news with params:", { ...params, apikey: "***" });
      const response = await axios.get(this.baseURL + "/news", { params, timeout: 10000 });
      console.log("✅ API Response status:", response.status);
      console.log("📰 Articles received:", response.data.results?.length || 0);
      
      if (response.data.results) {
        // Map NewsData.io response to our format
        return response.data.results.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content || article.description,
          image_url: article.image_url,
          url: article.link,
          source: article.source_id,
          category: article.category?.[0] || category,
          publishedAt: article.pubDate
        }));
      }
      return [];
    } catch (error) {
      console.error("❌ NewsData.io Error:", error.response?.data || error.message);
      console.error("❌ Status:", error.response?.status);
      console.warn("⚠️  Falling back to mock data...");
      return this.getMockArticles(category);
    }
  }

  async searchNews(query, page = 1) {
    try {
      if (!query || !query.trim()) {
        throw new Error("Search query is required");
      }

      const params = {
        apikey: this.getApiKey(),
        q: query,
        language: "en",
        size: 10
      };

      if (page && page > 1) {
        params.page = page;
      }

      const response = await axios.get(this.baseURL + "/news", { params, timeout: 10000 });
      
      if (response.data.results) {
        // Map NewsData.io response to our format
        return response.data.results.map(article => ({
          title: article.title,
          description: article.description,
          content: article.content || article.description,
          image_url: article.image_url,
          url: article.link,
          source: article.source_id,
          category: article.category?.[0] || "general",
          publishedAt: article.pubDate
        }));
      }
      return [];
    } catch (error) {
      console.error("NewsData.io Search Error:", error.response?.data?.message || error.message);
      console.warn("Falling back to mock data for search...");
      return this.getMockArticles(query);
    }
  }

  getMockArticles(category = "") {
    const fallbackCategory = category && category.trim() ? category : "technology";
    const now = Date.now();

    // Mock articles with proper image URLs
    return [
      {
        title: "AI Breakthroughs: New Model Achieves Human-Level Performance",
        description: "Researchers unveil an AI model that matches human-level reasoning on complex tasks, with better efficiency and safety controls.",
        content: "A new generation of AI models is delivering human-level reasoning while requiring fewer resources...",
        image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
        url: "https://example.com/ai-breakthrough-human-level",
        source: "Tech News Today",
        category: fallbackCategory,
        publishedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "New Species Discovered in Amazon Rainforest",
        description: "Scientists uncover a previously unknown species during a deep rainforest expedition, expanding biodiversity records.",
        content: "Biologists documenting rainforest biodiversity encountered a new species exhibiting unique adaptive traits...",
        image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        url: "https://example.com/amazon-new-species",
        source: "Science Daily",
        category: "science",
        publishedAt: new Date(now - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Quantum Computing Milestone: New Record Set",
        description: "Engineers achieve a major quantum advantage benchmark with improved error correction and stability.",
        content: "A research team demonstrated sustained quantum coherence while scaling qubit counts, setting a new industry record...",
        image_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80",
        url: "https://example.com/quantum-record",
        source: "Physics World",
        category: "technology",
        publishedAt: new Date(now - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Healthcare AI Cuts ER Wait Times",
        description: "Hospitals report reduced emergency room wait times after deploying triage AI assistants.",
        content: "Clinical teams are using AI to prioritize cases, leading to faster interventions and improved patient satisfaction...",
        image_url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
        url: "https://example.com/healthcare-ai-er",
        source: "Healthline",
        category: "health",
        publishedAt: new Date(now - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Global Markets Rally on Positive Earnings",
        description: "Tech and industrial stocks lead gains as quarterly earnings surpass forecasts across major indices.",
        content: "Investors responded to strong earnings beats, driving a broad-based rally and lifting market sentiment...",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        url: "https://example.com/markets-rally",
        source: "MarketWatch",
        category: "business",
        publishedAt: new Date(now - 7 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Championship Upset: Underdogs Claim the Title",
        description: "An unexpected victory reshapes the playoff picture as the underdogs secure the championship in overtime.",
        content: "The final quarter saw dramatic swings before the underdogs closed out in overtime, stunning analysts and fans alike...",
        image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
        url: "https://example.com/championship-upset",
        source: "ESPN",
        category: "sports",
        publishedAt: new Date(now - 8 * 60 * 60 * 1000).toISOString()
      }
    ];
  }
}

module.exports = new NewsAPIService();
