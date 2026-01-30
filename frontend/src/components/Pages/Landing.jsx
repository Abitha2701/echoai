import { Link } from 'react-router-dom';
import {
  Newspaper,
  Sparkles,
  Zap,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
  Globe2
} from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Summaries',
      description: 'Instant, faithful synopses with sources preserved.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Fresh headlines and summaries delivered in seconds.'
    },
    {
      icon: TrendingUp,
      title: 'Signal Over Noise',
      description: 'Smart ranking to surface what actually matters.'
    },
    {
      icon: Shield,
      title: 'Trusted & Secure',
      description: 'Curated sources with privacy-first design.'
    }
  ];

  const howItWorks = [
    {
      title: 'Choose your focus',
      body: 'Pick categories and regions you care about most.'
    },
    {
      title: 'We scan & summarize',
      body: 'Our AI condenses every article into skimmable briefs.'
    },
    {
      title: 'Stay in the loop',
      body: 'Read, save, and share the essentials in minutes.'
    }
  ];

  const collections = ['Global Briefing', 'Tech Pulse', 'Business & Markets', 'Climate Watch', 'Health & Science', 'Policy & Governance'];

  const highlights = [
    {
      icon: Clock,
      title: 'Morning briefing',
      description: 'Start with a 60-second digest that surfaces what changed overnight.'
    },
    {
      icon: Shield,
      title: 'Noise filter',
      description: 'Human-vetted sources plus AI ranking keep spam and clickbait away.'
    },
    {
      icon: Globe2,
      title: 'Global lens',
      description: 'Follow stories across regions to compare perspectives in one view.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden text-slate-900 dark:text-white">
      {/* Soft background accents */}
      <div className="pointer-events-none absolute top-[-6rem] left-[-4rem] w-[30rem] h-[30rem] bg-blue-200 blur-3xl rounded-full opacity-30"></div>
      <div className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] w-[32rem] h-[32rem] bg-blue-200 blur-3xl rounded-full opacity-30"></div>
      <div className="pointer-events-none absolute top-[35%] left-1/2 -translate-x-1/2 w-[18rem] h-[18rem] bg-blue-200 blur-3xl rounded-full opacity-20"></div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur border border-slate-200 shadow-sm px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="bg-sky-100 p-2.5 rounded-xl">
              <Newspaper className="h-7 w-7 text-sky-600" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">ECHO AI</span>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="text-slate-700 hover:text-sky-700 font-medium px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-[1px]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 lg:pt-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-sky-200">
              <Sparkles className="h-4 w-4" />
              AI-Powered News Intelligence
            </div>

            <h1 className="text-5xl md:text-6xl font-bold leading-tight text-slate-900 dark:text-white mb-6">
              Stay informed with
              <span className="block text-blue-600 dark:text-blue-400">
                effortless clarity.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              Transform the way you read news. ECHO AI distills every story into a concise brief so you can follow the world in minutes—not hours.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-7 py-3 rounded-xl font-semibold text-lg shadow-md focus:ring-2 focus:ring-blue-300 transition-all hover:-translate-y-[2px]"
              >
                Start Reading Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold hover:border-blue-200 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              >
                <Clock className="h-5 w-5" />
                Sign In
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                No mock user counts
              </span>
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                Curated sources
              </span>
              <span className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-sm">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                Save & revisit quickly
              </span>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[{
                title: 'Follow what matters',
                body: 'Build a clean feed by category, region, and language.'
              }, {
                title: 'Summaries plus sources',
                body: 'Skim the brief, open the original, and keep context aligned.'
              }, {
                title: 'Share-ready digests',
                body: 'Export key points for your team in one click.'
              }].map((card) => (
                <div key={card.title} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">{card.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{card.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-sky-200 rounded-3xl blur-2xl"></div>
            <div className="absolute -bottom-10 -right-4 w-24 h-24 bg-indigo-200 rounded-3xl blur-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 text-sky-700 p-3 rounded-2xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Live Brief</p>
                    <p className="font-semibold text-slate-900">Global Headlines</p>
                  </div>
                </div>
                <span className="text-xs text-slate-500">auto-updates</span>
              </div>
              <div className="grid gap-3">
                {["Markets steady as policy outlook cools.", "Breakthrough in fusion milestone announced.", "New climate pact gains global traction.", "Tech leaders convene on AI safety roadmap."]
                  .map((headline, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-sky-500"></div>
                      <p className="text-slate-700 text-sm leading-relaxed">{headline}</p>
                    </div>
                  ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Globe2 className="h-4 w-4 text-sky-600" />
                  Real-time from trusted sources
                </div>
                <Link to="/register" className="text-sky-700 font-semibold text-sm hover:text-indigo-600">
                  View feed
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Why choose ECHO AI?</h2>
          <p className="text-slate-600 text-lg">A focused reading experience with signal-first design.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="bg-sky-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reader highlights */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-8 md:p-10">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
            <div>
              <p className="text-sm font-semibold text-sky-700">Built for fast clarity</p>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900">Everything you need at a glance</h3>
            </div>
            <span className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-sm">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Light, focused layout
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {highlights.map((item) => (
              <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="bg-sky-100 text-sky-700 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-md p-8 md:p-10">
          <div className="flex items-center gap-2 text-sky-700 font-semibold mb-2">
            <LayoutGrid className="h-5 w-5" />
            Workflow
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">From headline to clarity in three steps</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {howItWorks.map((step, idx) => (
              <div key={step.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <div className="text-sm font-semibold text-sky-700 mb-2">Step {idx + 1}</div>
                <h4 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold mb-3">
          <BookOpen className="h-5 w-5" />
          Curated collections
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Pick a lane, or browse everything</h3>
        <div className="flex flex-wrap gap-3">
          {collections.map((item) => (
            <span key={item} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:border-blue-200 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-blue-600 dark:bg-blue-700 rounded-3xl p-10 text-white shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Ready to read smarter?</h2>
          <p className="text-white/90 text-lg mb-6 max-w-3xl">
            Start with a free account and get concise briefs, curated sources, and effortless clarity across every topic you follow.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Create Free Account
              <CheckCircle2 className="h-5 w-5" />
            </Link>
            <p className="text-white/80 text-sm">No credit card required</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-slate-200 bg-white/70 backdrop-blur py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-sm">
            © 2024 ECHO AI. All rights reserved. | Designed for clarity and speed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
