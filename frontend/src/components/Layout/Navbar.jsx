import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Menu, X, User, LogOut, Newspaper, Bookmark, Search, Home, TrendingUp, Layers, Info, FileUp } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-blue-600 shadow-lg sticky top-0 z-50 backdrop-blur-xl bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/login"} 
              className="flex items-center space-x-2 hover:opacity-90 transition-all duration-300 group"
            >
              <div className="bg-white rounded-xl p-2 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <Newspaper className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-white hidden sm:inline bg-clip-text">ECHO AI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>News Feed</span>
                </Link>
                <Link
                  to="/trending"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Trending</span>
                </Link>
                <Link
                  to="/categories"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <Layers className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Categories</span>
                </Link>
                <Link
                  to="/search"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Search</span>
                </Link>
                <Link
                  to="/upload"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <FileUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Upload</span>
                </Link>
                <Link
                  to="/saved"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <Bookmark className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Saved</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center space-x-1 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group"
                >
                  <Info className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>About</span>
                </Link>

                {/* User Dropdown */}
                <div className="relative group ml-4">
                  <button className="flex items-center space-x-2 text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group">
                    <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center group-hover:bg-white/40 transition-all">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="max-w-xs truncate">{user?.name?.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                    className="text-white hover:bg-white/25 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                    className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200 border border-white/40 hover:border-white/60"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-white/25 p-2 rounded-lg transition-all duration-200"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-700 to-blue-800 border-t border-blue-600 animate-fadeInUp">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <Home className="h-5 w-5" />
                  <span>News Feed</span>
                </Link>
                <Link
                  to="/trending"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <TrendingUp className="h-5 w-5" />
                  <span>Trending</span>
                </Link>
                <Link
                  to="/categories"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <Layers className="h-5 w-5" />
                  <span>Categories</span>
                </Link>
                <Link
                  to="/search"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <Search className="h-5 w-5" />
                  <span>Search</span>
                </Link>
                <Link
                  to="/upload"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <FileUp className="h-5 w-5" />
                  <span>Upload</span>
                </Link>
                <Link
                  to="/saved"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <Bookmark className="h-5 w-5" />
                  <span>Saved</span>
                </Link>
                <Link
                  to="/about"
                  onClick={closeMenu}
                  className="flex items-center space-x-2 text-white hover:bg-blue-600 block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200"
                >
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
                <div className="border-t border-blue-600 my-2 pt-2">
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center px-3 py-2 text-white hover:bg-blue-600 rounded-xl transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-blue-100">View Profile</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-2 text-white hover:bg-red-600 rounded-xl text-base font-medium transition-all duration-200"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-xl text-base font-medium text-white hover:bg-blue-600 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block px-3 py-2 rounded-xl text-base font-medium bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
