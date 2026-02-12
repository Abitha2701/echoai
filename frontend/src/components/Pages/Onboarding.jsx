import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, LayoutGrid, Bell, Image, BookOpen, ArrowRight, Sparkles } from 'lucide-react';
import { usePreferences } from '../../context/PreferencesContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { preferences, setPreferences } = usePreferences();

  const [selectedCategories, setSelectedCategories] = useState(preferences.preferredCategories || []);
  const [dailyDigest, setDailyDigest] = useState(preferences.dailyDigest);
  const [breakingNews, setBreakingNews] = useState(preferences.breakingNews);
  const [showImages, setShowImages] = useState(preferences.showImages);
  const [compactView, setCompactView] = useState(preferences.compactView);
  const [readingMode, setReadingMode] = useState(preferences.readingMode || 'comfortable');

  const categories = useMemo(() => ([
    {
      id: 'technology',
      name: 'Technology',
      description: 'AI, startups, and product launches.',
      tone: 'border-blue-200 bg-blue-50 text-blue-700'
    },
    {
      id: 'science',
      name: 'Science',
      description: 'Research, space, and discoveries.',
      tone: 'border-purple-200 bg-purple-50 text-purple-700'
    },
    {
      id: 'health',
      name: 'Health',
      description: 'Wellness, medicine, and biotech.',
      tone: 'border-emerald-200 bg-emerald-50 text-emerald-700'
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Markets, economy, and finance.',
      tone: 'border-amber-200 bg-amber-50 text-amber-700'
    },
    {
      id: 'world',
      name: 'World',
      description: 'Global politics and affairs.',
      tone: 'border-indigo-200 bg-indigo-50 text-indigo-700'
    },
    {
      id: 'environment',
      name: 'Environment',
      description: 'Climate, energy, and sustainability.',
      tone: 'border-teal-200 bg-teal-50 text-teal-700'
    }
  ]), []);

  useEffect(() => {
    if (preferences.onboardingComplete) {
      navigate('/reader', { replace: true });
    }
  }, [navigate, preferences.onboardingComplete]);

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((item) => item !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFinish = () => {
    setPreferences((prev) => ({
      ...prev,
      preferredCategories: selectedCategories,
      dailyDigest,
      breakingNews,
      showImages,
      compactView,
      readingMode,
      onboardingComplete: true
    }));
    navigate('/reader', { replace: true });
  };

  const handleSkip = () => {
    setPreferences((prev) => ({
      ...prev,
      onboardingComplete: true
    }));
    navigate('/reader', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-8 py-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-white/70">Personal setup</p>
                <h1 className="text-2xl md:text-3xl font-bold">Shape your ECHO AI experience</h1>
              </div>
            </div>
            <p className="text-white/80 max-w-2xl">
              Pick what you care about most and tune the feed for your pace. You can adjust this anytime.
            </p>
          </div>

          <div className="p-8 space-y-10">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Choose your focus topics</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => {
                  const selected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`border rounded-2xl p-4 text-left transition-all ${category.tone} ${selected ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:shadow-md'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-slate-900">{category.name}</p>
                          <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                        </div>
                        {selected && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6">
              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Digest & alerts</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-sm">
                    <span>Daily digest</span>
                    <input
                      type="checkbox"
                      checked={dailyDigest}
                      onChange={(e) => setDailyDigest(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                  <label className="flex items-center justify-between text-sm">
                    <span>Breaking alerts</span>
                    <input
                      type="checkbox"
                      checked={breakingNews}
                      onChange={(e) => setBreakingNews(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Image className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Feed style</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center justify-between text-sm">
                    <span>Show images</span>
                    <input
                      type="checkbox"
                      checked={showImages}
                      onChange={(e) => setShowImages(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                  <label className="flex items-center justify-between text-sm">
                    <span>Compact cards</span>
                    <input
                      type="checkbox"
                      checked={compactView}
                      onChange={(e) => setCompactView(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </label>
                </div>
              </div>

              <div className="border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Reading density</h3>
                </div>
                <div className="space-y-2">
                  {['compact', 'comfortable', 'spacious'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setReadingMode(mode)}
                      className={`w-full text-left px-3 py-2 rounded-xl border transition-all ${
                        readingMode === mode
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={handleSkip}
                className="text-slate-500 hover:text-slate-700 text-sm font-semibold"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all"
              >
                Finish setup
                <ArrowRight className="h-5 w-5" />
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
