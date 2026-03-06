import Link from 'next/link';
import { ArrowRight, BarChart3, Rocket, Users, TrendingUp, DollarSign, MessageSquare, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Startup Tracker
            </div>
            <nav className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/launches"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Launches
              </Link>
              <Link
                href="/companies"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Companies
              </Link>
              <Link
                href="/analytics"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            Track 550+ YCombinator Companies
          </div>
          <h1 className="text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Startup Launch Tracker
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Track startup launches from X and LinkedIn, analyze fundraising data,
            and discover emerging companies with AI-powered insights
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/launches"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all font-semibold text-lg shadow-sm"
            >
              View Launches
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-blue-200">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <Rocket className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Track Launches</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor startup launches from X and LinkedIn with real-time
              engagement metrics including likes, comments, and shares
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-green-200">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Fundraising Data</h3>
            <p className="text-gray-600 leading-relaxed">
              Access comprehensive funding information from YCombinator including
              total raised amounts and batch information
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-md">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">Contact Enrichment</h3>
            <p className="text-gray-600 leading-relaxed">
              Discover enriched contact information including email, phone,
              LinkedIn, and X profiles for founders
            </p>
          </div>
        </div>

        {/* Secondary Features */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI-Powered DM Drafts</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Automatically generate personalized outreach messages for launches
              with low performance to help boost engagement
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Performance Analytics</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Visualize performance distribution, platform usage, and industry trends
              with interactive charts and insights
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Built with Next.js, TypeScript, and Clean Architecture</p>
        </div>
      </footer>
    </main>
  );
}
