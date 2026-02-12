import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  TrendingUp,
  Bookmark,
  Search,
  Layers,
  Sparkles,
  Target,
  BarChart3,
  CalendarDays,
  Bell,
  Eye,
  ArrowUpRight,
  Flame
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usePreferences } from '../../context/PreferencesContext';
import { summaryAPI } from '../../services/api';

const ReaderDashboard = () => {
  const { user } = useAuth();
  const { preferences, updatePreference } = usePreferences();
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState('');

  const statsData = user?.stats || {};
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
  const derivedDays = createdAt
    ? Math.max(1, Math.ceil((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;

  const summaryCount = savedSummaries.length;
  const articlesRead = statsData.articlesRead ?? statsData.savedArticles ?? summaryCount ?? 0;
  const summariesGenerated = statsData.summariesGenerated ?? statsData.savedArticles ?? summaryCount ?? 0;
  const daysActive = statsData.daysActive ?? derivedDays;
  const timeSavedMinutes = summariesGenerated * 4;
  const timeSavedHours = Math.round((timeSavedMinutes / 60) * 10) / 10;
  const timeSavedLabel = timeSavedHours >= 1 ? `${timeSavedHours} hrs` : `${timeSavedMinutes} mins`;
  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
  const goalPercent = Math.min(100, Math.round((articlesRead / 25) * 100));

  const quickActions = [
    {
      title: 'Open news feed',
      description: 'Fresh summaries from your sources.',
      icon: Newspaper,
      to: '/dashboard'
    },
    {
      title: 'Check trending',
      description: 'See what is surging right now.',
      icon: TrendingUp,
      to: '/trending'
    },
    {
      title: 'Saved summaries',
      description: 'Pick up where you left off.',
      icon: Bookmark,
      to: '/saved'
    },
    {
      title: 'Explore categories',
      description: 'Shape your focus by topic.',
      icon: Layers,
      to: '/categories'
    },
    {
      title: 'Search the archive',
      description: 'Find the story you need.',
      icon: Search,
      to: '/search'
    }
  ];

  const toggles = [
    {
      key: 'dailyDigest',
      label: 'Daily digest',
      description: 'Morning recap at 7:30am.',
      icon: CalendarDays
    },
    {
      key: 'breakingNews',
      label: 'Breaking alerts',
      description: 'Only high-signal updates.',
      icon: Bell
    },
    {
      key: 'showImages',
      label: 'Show images',
      description: 'Visual cards in your feed.',
      icon: Eye
    }
  ];

  useEffect(() => {
    const fetchSavedSummaries = async () => {
      try {
        setSavedLoading(true);
        const response = await summaryAPI.getSavedSummaries();
        setSavedSummaries(response.data || []);
        setSavedError('');
      } catch (error) {
        console.error('Error fetching saved summaries:', error);
        setSavedError('Unable to load saved summaries.');
      } finally {
        setSavedLoading(false);
      }
    };

    fetchSavedSummaries();
  }, []);

  const focusTopics = useMemo(() => {
    const topicCounts = savedSummaries.reduce((acc, item) => {
      const category = item?.article?.category || 'other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const palette = [
      'bg-sky-100 text-sky-700',
      'bg-amber-100 text-amber-700',
      'bg-emerald-100 text-emerald-700',
      'bg-lime-100 text-lime-700',
      'bg-rose-100 text-rose-700'
    ];

    return Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, count], index) => ({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        count,
        tone: palette[index % palette.length]
      }));
  }, [savedSummaries]);

  const recentSaved = savedSummaries.slice(0, 3);
  const latestSavedAt = savedSummaries[0]?.savedAt || savedSummaries[0]?.createdAt || null;
  const latestSavedLabel = latestSavedAt
    ? new Date(latestSavedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'No saves yet';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 border border-slate-200 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                <LayoutDashboard className="h-4 w-4 text-blue-600" />
                Reader Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight">
                Welcome {user?.name?.split(' ')[0] || 'reader'}.
              </h1>
              <p className="text-lg text-slate-600 mt-3">{todayLabel} · Your feed is ready.</p>
            </div>

            <div className="bg-white/90 border border-slate-200 rounded-2xl p-5 shadow-lg w-full lg:w-[360px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Weekly goal</p>
                  <p className="text-2xl font-semibold text-slate-900">{articlesRead} / 25 articles</p>
                </div>
                <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                  {goalPercent}%
                </div>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400" style={{ width: `${goalPercent}%` }} />
              </div>
              <p className="text-sm text-slate-500 mt-3">Keep a steady pace to stay on track.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Summaries generated</p>
                <p className="text-2xl font-semibold text-slate-900">{summariesGenerated}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Estimated time saved: {timeSavedLabel}.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Days active</p>
                <p className="text-2xl font-semibold text-slate-900">{daysActive}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Consistency beats volume. Keep the streak.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Articles read</p>
                <p className="text-2xl font-semibold text-slate-900">{articlesRead}</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">Your strongest topics rise to the top.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Quick actions</h2>
                <p className="text-slate-500">Jump to what matters in one click.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600 font-semibold">
                Personalize feed
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group border border-slate-200 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-50">
                      <action.icon className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{action.title}</p>
                      <p className="text-sm text-slate-500 mt-1">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Signal settings</h2>
                <p className="text-slate-500">Fine-tune what gets through.</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </div>

            <div className="space-y-4">
              {toggles.map((item) => (
                <div key={item.key} className="flex items-center justify-between border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updatePreference(item.key, !preferences[item.key])}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      preferences[item.key] ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                    type="button"
                    aria-pressed={preferences[item.key]}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        preferences[item.key] ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Focus topics</h3>
            <p className="text-slate-500 text-sm mb-5">Based on your saved summaries.</p>
            {savedLoading ? (
              <p className="text-sm text-slate-500">Loading topics...</p>
            ) : savedError ? (
              <p className="text-sm text-rose-600">{savedError}</p>
            ) : focusTopics.length === 0 ? (
              <p className="text-sm text-slate-500">Save a few summaries to see focus topics.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {focusTopics.map((topic) => (
                  <span key={topic.label} className={`px-3 py-1 rounded-full text-xs font-semibold ${topic.tone}`}>
                    {topic.label} · {topic.count}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Recent saves</p>
              <div className="mt-3 space-y-3">
                {savedLoading ? (
                  <p className="text-sm text-slate-500">Loading saved summaries...</p>
                ) : recentSaved.length > 0 ? (
                  recentSaved.map((item) => (
                    <div key={item._id} className="border border-slate-200 rounded-xl px-3 py-2">
                      <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {item?.article?.title || 'Saved summary'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item?.article?.source?.name || 'Source unavailable'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No saved summaries yet.</p>
                )}
              </div>
            </div>
            <Link to="/categories" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm mt-6">
              Edit topics
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Momentum</h3>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Reading streak</p>
                  <span className="text-sm font-semibold text-slate-900">{Math.min(daysActive, 14)} days</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                    style={{ width: `${Math.min(100, daysActive * 7)}%` }}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Quiet time saved</p>
                  <span className="text-sm font-semibold text-slate-900">{timeSavedLabel}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">Summaries keep your feed tight and focused.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg">
            <h3 className="text-xl font-semibold">Ready for the next dive?</h3>
            <p className="text-blue-100 text-sm mt-3">Open the feed for the latest AI-summarized headlines.</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2 rounded-xl mt-5 transition"
            >
              Open feed
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="mt-6 flex items-center gap-3 text-blue-100 text-xs">
              <Sparkles className="h-4 w-4" />
              Last save: {latestSavedLabel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderDashboard;
