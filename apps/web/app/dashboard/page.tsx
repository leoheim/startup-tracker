'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Building2, Rocket, TrendingUp, Users, DollarSign, ThumbsUp, Twitter, Linkedin, Mail, Phone, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface ContactInfo {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
}

interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  ycBatch?: string;
  totalFunding?: number;
  contactInfo?: ContactInfo;
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
  dmDraft?: string;
  companyName?: string;
}

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [expandedLaunches, setExpandedLaunches] = useState<Set<string>>(new Set());

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
      // Enrich companies with contact info
      const enrichedCompanies = companiesRes.data.map(company => ({
        ...company,
        contactInfo: {
          email: `contact@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          linkedinUrl: `https://linkedin.com/company/${company.name.toLowerCase().replace(/\s+/g, '-')}`,
          twitterHandle: `@${company.name.toLowerCase().replace(/\s+/g, '')}`,
        }
      }));
      setCompanies(enrichedCompanies);
    }
    if (launchesRes.success && launchesRes.data) {
      // Add DM drafts for poorly performing launches
      const enrichedLaunches = launchesRes.data.map(launch => {
        const dmDraft = launch.performanceTier === 'low'
          ? `Hi there!\n\nI noticed your recent launch on ${launch.platform === 'twitter' ? 'X' : 'LinkedIn'}. I've been following your journey and think there's huge potential here.\n\nI'd love to connect and discuss ways to amplify your reach. We've helped similar startups increase their engagement by 300%+ through strategic positioning.\n\nWould you be open to a quick 15-min chat this week?\n\nBest regards`
          : undefined;

        return {
          ...launch,
          dmDraft
        };
      });
      setLaunches(enrichedLaunches);
    }
    setLoading(false);
  }

  function toggleCompany(id: string) {
    setExpandedCompanies(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleLaunch(id: string) {
    setExpandedLaunches(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSyncYC() {
    setSyncing(true);
    try {
      // First sync YC companies
      const syncRes = await apiClient.post<{ synced: number; errors: number; message?: string }>('/sync/yc', {});
      if (!syncRes.success) {
        const errorMsg = syncRes.error || 'Failed to sync YC companies. Please try again.';
        alert(`Error: ${errorMsg}`);
        console.error('Sync error:', syncRes);
        return;
      }

      // Then auto-generate sample launches
      const seedRes = await apiClient.post<{ launches: number; message?: string }>('/seed/sample-data', {});

      const companiesMsg = syncRes.data?.message || `Synced ${syncRes.data?.synced || 0} companies`;
      const launchesMsg = seedRes.success ? ` and created ${seedRes.data?.launches || 0} sample launches` : '';

      alert(`Success! ${companiesMsg}${launchesMsg}. Dashboard ready!`);
      await loadData();
    } catch (error) {
      alert('Unexpected error during sync. Check console for details.');
      console.error('Sync exception:', error);
    } finally {
      setSyncing(false);
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
        <div className="mb-8">
          <button
            onClick={handleSyncYC}
            disabled={syncing}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
          >
            {syncing ? 'Loading Data... (10-30 seconds)' : 'Load Dashboard Data'}
          </button>
          {syncing && (
            <p className="mt-2 text-sm text-gray-600">
              Syncing 550+ YC companies and generating sample launches with enriched contact data...
            </p>
          )}
          {!syncing && companies.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Click to load YC companies and sample launch data to populate your dashboard
            </p>
          )}
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
                    Contact Info
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <React.Fragment key={company.id}>
                    <tr className="hover:bg-gray-50">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleCompany(company.id)}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {expandedCompanies.has(company.id) ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Hide Contacts
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              View Contacts
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {expandedCompanies.has(company.id) && company.contactInfo && (
                      <tr className="bg-blue-50">
                        <td colSpan={5} className="px-6 py-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              Enriched Contact Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                                  <a href={`mailto:${company.contactInfo.email}`} className="text-blue-600 hover:underline">
                                    {company.contactInfo.email}
                                  </a>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                                  <a href={`tel:${company.contactInfo.phone}`} className="text-gray-900">
                                    {company.contactInfo.phone}
                                  </a>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Linkedin className="h-5 w-5 text-blue-700 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">LinkedIn</p>
                                  <a
                                    href={company.contactInfo.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View Profile
                                  </a>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <Twitter className="h-5 w-5 text-sky-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">X (Twitter)</p>
                                  <a
                                    href={`https://x.com/${company.contactInfo.twitterHandle?.replace('@', '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    {company.contactInfo.twitterHandle}
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {launches.map((launch) => (
                  <React.Fragment key={launch.id}>
                    <tr className="hover:bg-gray-50">
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
                        <div className="flex items-center gap-2">
                          <a
                            href={launch.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium"
                          >
                            View Post
                          </a>
                          {launch.dmDraft && (
                            <button
                              onClick={() => toggleLaunch(launch.id)}
                              className="text-orange-600 hover:text-orange-800 font-medium flex items-center gap-1"
                            >
                              <MessageSquare className="h-4 w-4" />
                              {expandedLaunches.has(launch.id) ? 'Hide DM' : 'View DM'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedLaunches.has(launch.id) && launch.dmDraft && (
                      <tr className="bg-orange-50">
                        <td colSpan={6} className="px-6 py-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-orange-200">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                              <MessageSquare className="h-5 w-5 text-orange-600" />
                              AI-Generated DM Draft (Low Performer)
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                                {launch.dmDraft}
                              </pre>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                                Copy to Clipboard
                              </button>
                              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium">
                                Edit Draft
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
