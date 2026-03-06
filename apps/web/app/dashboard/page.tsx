'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Building2, Rocket, TrendingUp, Users, DollarSign, ThumbsUp, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  ycBatch?: string;
  totalFunding?: number;
}

interface Launch {
  id: string;
  platform: string;
  postUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  performanceTier?: string;
  publishedAt?: string;
}

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [companiesRes, launchesRes] = await Promise.all([
      apiClient.get<Company[]>('/companies?limit=10'),
      apiClient.get<Launch[]>('/launches?limit=10'),
    ]);

    if (companiesRes.success && companiesRes.data) {
      setCompanies(companiesRes.data);
    }
    if (launchesRes.success && launchesRes.data) {
      setLaunches(launchesRes.data);
    }
    setLoading(false);
  }

  async function handleSyncYC() {
    setSyncing(true);
    try {
      const res = await apiClient.post<{ synced: number; errors: number; message?: string }>('/sync/yc', {});
      if (res.success) {
        const message = res.data?.message || `Successfully synced ${res.data?.synced || 0} companies!`;
        alert(message);
        await loadData();
      } else {
        const errorMsg = res.error || 'Failed to sync YC companies. Please try again.';
        alert(`Error: ${errorMsg}`);
        console.error('Sync error:', res);
      }
    } catch (error) {
      alert('Unexpected error during sync. Check console for details.');
      console.error('Sync exception:', error);
    } finally {
      setSyncing(false);
    }
  }

  async function handleSeedData() {
    setSeeding(true);
    try {
      const res = await apiClient.post<{ launches: number; message?: string }>('/seed/sample-data', {});
      if (res.success) {
        const message = res.data?.message || `Successfully created ${res.data?.launches || 0} sample launches!`;
        alert(message);
        await loadData();
      } else {
        const errorMsg = res.error || 'Failed to seed sample data. Please try again.';
        alert(`Error: ${errorMsg}`);
        console.error('Seed error:', res);
      }
    } catch (error) {
      alert('Unexpected error during seeding. Check console for details.');
      console.error('Seed exception:', error);
    } finally {
      setSeeding(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Startup Tracker
            </Link>
            <nav className="flex gap-6">
              <Link
                href="/dashboard"
                className="text-blue-600 font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/launches"
                className="text-gray-700 hover:text-blue-600"
              >
                Launches
              </Link>
              <Link
                href="/companies"
                className="text-gray-700 hover:text-blue-600"
              >
                Companies
              </Link>
              <Link
                href="/analytics"
                className="text-gray-700 hover:text-blue-600"
              >
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track startup launches and fundraising activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 font-medium">Companies</span>
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-white">{companies.length}</div>
            <div className="text-blue-100 text-sm mt-1">YC & More</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 font-medium">Launches</span>
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-white">{launches.length}</div>
            <div className="text-green-100 text-sm mt-1">X & LinkedIn</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 font-medium">Avg Likes</span>
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-white">
              {launches.length > 0
                ? Math.round(
                    launches.reduce((sum, l) => sum + l.likesCount, 0) /
                      launches.length
                  ).toLocaleString()
                : 0}
            </div>
            <div className="text-purple-100 text-sm mt-1">Per Launch</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-100 font-medium">High Performers</span>
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-4xl font-bold text-white">
              {launches.filter((l) => l.performanceTier === 'high').length}
            </div>
            <div className="text-orange-100 text-sm mt-1">Top Tier</div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <div>
            <button
              onClick={handleSyncYC}
              disabled={syncing}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
            >
              {syncing ? '⏳ Syncing... (10-30 seconds)' : '🔄 Sync YC Companies'}
            </button>
            {syncing && (
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we sync 550+ companies from YCombinator...
              </p>
            )}
          </div>
          <div>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {seeding ? 'Generating...' : 'Generate Sample Launches'}
            </button>
            {seeding && (
              <p className="mt-2 text-sm text-gray-600">
                Creating sample launches with realistic engagement data...
              </p>
            )}
          </div>
        </div>

        {/* Recent Companies */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Companies
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    YC Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Raised
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Website
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {company.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {company.industry || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {company.ycBatch || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {company.totalFunding ? (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-700">
                            ${(company.totalFunding / 1000000).toFixed(1)}M
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          Visit
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Launches */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Launches
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {launches.map((launch) => (
                  <tr key={launch.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {launch.platform === 'twitter' ? (
                          <>
                            <Twitter className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-gray-700">X (Twitter)</span>
                          </>
                        ) : (
                          <>
                            <Linkedin className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-pink-500" />
                        <span className="font-semibold text-gray-900">{launch.likesCount.toLocaleString()}</span>
                        <span className="text-xs text-gray-500">likes</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {launch.commentsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {launch.sharesCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          launch.performanceTier === 'high'
                            ? 'bg-green-100 text-green-800'
                            : launch.performanceTier === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {launch.performanceTier || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href={launch.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
