import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PreferencesContext = createContext(null);

const defaultPreferences = {
  emailNotifications: true,
  dailyDigest: true,
  breakingNews: false,
  autoGenerateSummaries: true,
  readingMode: 'comfortable',
  articlesPerPage: 20,
  autoPlayVideos: false,
  showImages: true,
  compactView: false,
  language: 'en'
};

const loadPreferences = () => {
  try {
    const saved = localStorage.getItem('userPreferences');
    if (!saved) return defaultPreferences;
    const parsed = JSON.parse(saved);
    return { ...defaultPreferences, ...parsed };
  } catch {
    return defaultPreferences;
  }
};

export const PreferencesProvider = ({ children }) => {
  const [preferences, setPreferences] = useState(loadPreferences);

  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'userPreferences' && event.newValue) {
        try {
          const nextPrefs = JSON.parse(event.newValue);
          setPreferences((prev) => ({ ...prev, ...nextPrefs }));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const value = useMemo(() => ({
    preferences,
    setPreferences,
    updatePreference
  }), [preferences]);

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return context;
};

export default PreferencesContext;
