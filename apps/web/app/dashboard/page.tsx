'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Building2, Rocket, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  ycBatch?: string;
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
    const res = await apiClient.post('/sync/yc', {});
    if (res.success) {
      alert('YC companies synced successfully!');
      loadData();
    } else {
      alert('Failed to sync YC companies');
    }
    setSyncing(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
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
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Companies</span>
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{companies.length}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Launches</span>
              <Rocket className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{launches.length}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Avg Engagement</span>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {launches.length > 0
                ? Math.round(
                    launches.reduce((sum, l) => sum + l.likesCount, 0) /
                      launches.length
                  )
                : 0}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">High Performers</span>
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {launches.filter((l) => l.performanceTier === 'high').length}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <button
            onClick={handleSyncYC}
            disabled={syncing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? 'Syncing...' : 'Sync YC Companies'}
          </button>
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
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {launch.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {launch.likesCount}
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
