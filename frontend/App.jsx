import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ToastProvider } from "./src/context/ToastContext";
import { ThemeProvider } from "./src/context/ThemeContext";

import Layout from "./src/components/Layout/Layout";
import Login from "./src/components/Auth/Login";
import Register from "./src/components/Auth/Register";
import NewsFeed from "./src/components/News/NewsFeed";
import ArticleDetail from "./src/components/News/ArticleDetail";
import SavedSummaries from "./src/components/Summary/SavedSummaries";
import ToastContainer from "./src/components/UI/ToastContainer";
import About from "./src/components/Pages/About";
import Landing from "./src/components/Pages/Landing";
import Categories from "./src/components/Pages/Categories";
import Search from "./src/components/Pages/Search";
import Profile from "./src/components/Pages/Profile";
import Trending from "./src/components/Pages/Trending";


function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
 
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <NewsFeed />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/article/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ArticleDetail />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/saved"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SavedSummaries />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/trending"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Trending />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Categories />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Search />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <Layout>
                    <About />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>

          <ToastContainer />
        </Router>
      </AuthProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default App;
