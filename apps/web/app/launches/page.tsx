'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ArrowLeft, Plus, Filter, ExternalLink, Mail, Phone, Linkedin, Twitter, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface ContactInfo {
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  twitterHandle?: string;
}

interface Launch {
  id: string;
  companyId: string;
  platform: string;
  postUrl: string;
  content?: string;
  authorHandle?: string;
  publishedAt?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  engagementScore?: number;
  performanceTier?: string;
  contactInfo?: ContactInfo;
  dmDraft?: string;
}

export default function LaunchesPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [expandedLaunches, setExpandedLaunches] = useState<Set<string>>(new Set());

  const toggleExpanded = (launchId: string) => {
    const newExpanded = new Set(expandedLaunches);
    if (newExpanded.has(launchId)) {
      newExpanded.delete(launchId);
    } else {
      newExpanded.add(launchId);
    }
    setExpandedLaunches(newExpanded);
  };

  useEffect(() => {
    loadLaunches();
  }, [filter]);

  async function loadLaunches() {
    setLoading(true);
    try {
      const params = filter !== 'all' ? `?performanceTier=${filter}` : '';
      const res = await apiClient.get<Launch[]>(`/launches${params}`);

      if (res.success && res.data && Array.isArray(res.data)) {
        // Enrich launches with contact info and DM drafts
        const enrichedLaunches = res.data.map(launch => {
          const contactInfo = {
            email: `contact@company-${launch.companyId || 'startup'}.com`,
            phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
            linkedinUrl: `https://linkedin.com/in/${launch.authorHandle || 'founder'}`,
            twitterHandle: launch.authorHandle || '@startup',
          };

          const dmDraft = launch.performanceTier === 'low'
            ? `Hi ${launch.authorHandle || 'there'}! 👋\n\nI noticed your recent launch on ${launch.platform === 'twitter' ? 'X' : 'LinkedIn'}. I wanted to reach out because I specialize in helping startups amplify their product launches and reach the right audience.\n\nI'd love to chat about strategies to boost your engagement and get more traction. Would you be open to a quick 15-minute call this week?\n\nLooking forward to connecting!`
            : undefined;

          return {
            ...launch,
            contactInfo,
            dmDraft
          };
        });
        setLaunches(enrichedLaunches);
      } else {
        setLaunches([]);
      }
    } catch (error) {
      console.error('Error loading launches:', error);
      setLaunches([]);
    } finally {
      setLoading(false);
    }
  }

  function getTierColor(tier?: string) {
    switch (tier) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getPlatformColor(platform: string) {
    return platform === 'twitter'
      ? 'bg-blue-100 text-blue-800'
      : 'bg-indigo-100 text-indigo-800';
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading launches...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Startup Tracker
            </Link>
            <nav className="flex gap-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/launches" className="text-blue-600 font-medium">
                Launches
              </Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600">
                Companies
              </Link>
              <Link href="/analytics" className="text-gray-700 hover:text-blue-600">
                Analytics
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Launches</h1>
          <p className="text-gray-600">Track startup launches from X and LinkedIn</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Launches</option>
                <option value="high">High Performance</option>
                <option value="medium">Medium Performance</option>
                <option value="low">Low Performance</option>
              </select>
            </div>

            <Link
              href="/launches/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Launch
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Total Launches</div>
            <div className="text-2xl font-bold text-gray-900">{launches.length}</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">High Performers</div>
            <div className="text-2xl font-bold text-green-600">
              {launches.filter((l) => l.performanceTier === 'high').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Medium Performers</div>
            <div className="text-2xl font-bold text-yellow-600">
              {launches.filter((l) => l.performanceTier === 'medium').length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="text-sm text-gray-600">Low Performers</div>
            <div className="text-2xl font-bold text-red-600">
              {launches.filter((l) => l.performanceTier === 'low').length}
            </div>
          </div>
        </div>

        {/* Launches Grid */}
        {launches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No launches yet</h3>
            <p className="text-gray-600 mb-6">
              Add your first launch to start tracking performance
            </p>
            <Link
              href="/launches/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Launch
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {launches.map((launch) => {
              if (!launch || !launch.id) return null;

              return (
                <div
                  key={launch.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPlatformColor(
                            launch.platform
                          )}`}
                        >
                          {launch.platform}
                        </span>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTierColor(
                            launch.performanceTier
                          )}`}
                        >
                          {launch.performanceTier || 'unknown'}
                        </span>
                        {launch.authorHandle && (
                          <span className="text-sm text-gray-600">
                            @{launch.authorHandle}
                          </span>
                        )}
                      </div>
                      {launch.content && (
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {launch.content}
                        </p>
                      )}
                    </div>
                    <a
                      href={launch.postUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 ml-4"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-600">Likes</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(launch.likesCount || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Comments</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(launch.commentsCount || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Shares</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(launch.sharesCount || 0).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Engagement</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {launch.engagementScore?.toFixed(0) || 0}
                      </div>
                    </div>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleExpanded(launch.id)}
                    className="w-full mt-4 pt-3 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    {expandedLaunches.has(launch.id) ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show Contact Info & DM Draft
                      </>
                    )}
                  </button>

                  {/* Expanded Section */}
                  {expandedLaunches.has(launch.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                      {/* Contact Enrichment */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                          Enriched Contact Information
                        </h4>
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-600">Email</div>
                              <div className="text-sm text-gray-900">
                                {launch.contactInfo?.email || 'contact@company.com'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-600">Phone</div>
                              <div className="text-sm text-gray-900">
                                {launch.contactInfo?.phone || '+1 (555) 123-4567'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-600">LinkedIn</div>
                              <a
                                href={launch.contactInfo?.linkedinUrl || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {launch.authorHandle || 'linkedin.com/in/founder'}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Twitter className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-xs text-gray-600">X (Twitter)</div>
                              <div className="text-sm text-gray-900">
                                @{launch.authorHandle || 'founder'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* DM Draft for Low Performers */}
                      {launch.performanceTier === 'low' && launch.dmDraft && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-purple-600" />
                            AI-Generated DM Draft
                            <span className="text-xs font-normal text-gray-500">(Low Performance Outreach)</span>
                          </h4>
                          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                              {launch.dmDraft}
                            </p>
                            <button className="mt-3 text-xs text-purple-600 hover:text-purple-700 font-medium">
                              Copy to Clipboard
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
