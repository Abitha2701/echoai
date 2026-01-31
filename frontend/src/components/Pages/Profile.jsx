import { useState, useMemo } from 'react';
import { User, Mail, Calendar, BookOpen, Sparkles, Settings, LogOut, Bell, Moon, Sun, Zap, Eye, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { usePreferences } from '../../context/PreferencesContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const { preferences, updatePreference } = usePreferences();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
    navigate('/login');
  };

  const handlePreferenceChange = (key, value) => {
    updatePreference(key, value);
    addToast('Preference updated', 'success');
  };

  const stats = useMemo(() => {
    const statsData = user?.stats || {};
    const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
    const derivedDays = createdAt ? Math.max(1, Math.ceil((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))) : 1;

    return [
      {
        icon: BookOpen,
        label: 'Articles Read',
        value: statsData.articlesRead ?? statsData.savedArticles ?? 0,
        color: 'blue'
      },
      {
        icon: Sparkles,
        label: 'Summaries Generated',
        value: statsData.summariesGenerated ?? statsData.savedArticles ?? 0,
        color: 'purple'
      },
      {
        icon: Calendar,
        label: 'Days Active',
        value: statsData.daysActive ?? derivedDays,
        color: 'green'
      }
    ];
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-sky-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8 transition-colors duration-200">
          <div className="bg-gradient-to-r from-sky-600 to-indigo-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full w-32 h-32 flex items-center justify-center">
                  <User className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user?.name || 'User'}</h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className={`bg-${stat.color}-100 dark:bg-${stat.color}-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors duration-200">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                className={`flex-1 px-6 py-4 font-medium transition-colors ${
                  activeTab === 'preferences'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Preferences
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'profile' ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                  <input
                    type="text"
                    value={new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-900"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Appearance Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Appearance
                  </h3>
                  
                  {/* Theme Toggle */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? (
                          <Moon className="h-6 w-6 text-purple-600" />
                        ) : (
                          <Sun className="h-6 w-6 text-yellow-600" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">Theme Mode</p>
                          <p className="text-sm text-gray-600">Currently using {theme} mode</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          toggleTheme();
                          addToast(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'success');
                        }}
                        className={`relative inline-flex items-center h-8 w-16 rounded-full transition-colors ${
                          theme === 'dark' ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-6 h-6 transform rounded-full bg-white shadow-lg transition-transform ${
                            theme === 'dark' ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {theme === 'dark' 
                        ? 'Dark mode reduces eye strain in low-light environments' 
                        : 'Light mode provides better readability in bright conditions'}
                    </p>
                  </div>

                  {/* Reading Mode */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                    <label className="block mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reading Mode</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['compact', 'comfortable', 'spacious'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handlePreferenceChange('readingMode', mode)}
                          className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            preferences.readingMode === mode
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          }`}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Show Images</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Display article thumbnails</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('showImages', !preferences.showImages)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.showImages ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.showImages ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Compact View</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Show more articles per page</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('compactView', !preferences.compactView)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.compactView ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.compactView ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.emailNotifications ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Daily Digest</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get a summary of top stories daily</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('dailyDigest', !preferences.dailyDigest)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.dailyDigest ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.dailyDigest ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Breaking News Alerts</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about urgent news</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('breakingNews', !preferences.breakingNews)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.breakingNews ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.breakingNews ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Preferences */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Content
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto-generate Summaries</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Automatically create AI summaries</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('autoGenerateSummaries', !preferences.autoGenerateSummaries)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.autoGenerateSummaries ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.autoGenerateSummaries ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto-play Videos</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Play video content automatically</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('autoPlayVideos', !preferences.autoPlayVideos)}
                        className={`relative inline-flex items-center h-7 w-14 rounded-full transition-colors ${
                          preferences.autoPlayVideos ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform ${
                            preferences.autoPlayVideos ? 'translate-x-8' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                      <label className="block mb-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Articles Per Page</span>
                      </label>
                      <select
                        value={preferences.articlesPerPage}
                        onChange={(e) => handlePreferenceChange('articlesPerPage', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value={10}>10 articles</option>
                        <option value={20}>20 articles</option>
                        <option value={30}>30 articles</option>
                        <option value={50}>50 articles</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Language & Region */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Language & Region
                  </h3>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <label className="block mb-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Language</span>
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="zh">Chinese</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
