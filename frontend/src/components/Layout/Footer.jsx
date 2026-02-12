const Footer = ({ variant = 'app' }) => {
  const wrapperClass = variant === 'marketing'
    ? 'bg-white/70 backdrop-blur border-t border-slate-200'
    : 'bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700';

  return (
    <footer className={`${wrapperClass} text-slate-600 mt-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4">ECHO AI</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Stay informed with AI-powered news summaries</p>
          </div>
          <div>
            <h4 className="text-slate-900 font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-500">
            &copy; 2024 ECHO AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
