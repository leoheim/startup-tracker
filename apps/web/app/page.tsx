import Link from 'next/link';
import { ArrowRight, BarChart3, Rocket, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Startup Launch Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track startup launches from X and LinkedIn, analyze fundraising data,
            and discover emerging companies
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Launches</h3>
            <p className="text-gray-600">
              Monitor startup launches from X and LinkedIn with real-time
              engagement metrics
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fundraising Data</h3>
            <p className="text-gray-600">
              Access comprehensive funding information from Crunchbase and
              YCombinator
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Contact Enrichment</h3>
            <p className="text-gray-600">
              Discover contact information for founders and key team members
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
