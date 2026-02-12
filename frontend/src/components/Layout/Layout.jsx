import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen news-surface transition-colors duration-200 text-slate-900">
      <Navbar />
      <main className="w-full">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
