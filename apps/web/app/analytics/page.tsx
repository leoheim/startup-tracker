'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Launch {
  id: string;
  platform: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  performanceTier?: string;
}

interface Company {
  id: string;
  industry?: string;
  ycBatch?: string;
}

export default function AnalyticsPage() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [launchesRes, companiesRes] = await Promise.all([
      apiClient.get<Launch[]>('/launches?limit=100'),
      apiClient.get<Company[]>('/companies?limit=100'),
    ]);

    if (launchesRes.success && launchesRes.data) {
      setLaunches(launchesRes.data);
    }
    if (companiesRes.success && companiesRes.data) {
      setCompanies(companiesRes.data);
    }
    setLoading(false);
  }

  // Performance distribution
  const performanceData = [
    {
      name: 'High',
      value: launches.filter((l) => l.performanceTier === 'high').length,
      color: '#10b981',
    },
    {
      name: 'Medium',
      value: launches.filter((l) => l.performanceTier === 'medium').length,
      color: '#f59e0b',
    },
    {
      name: 'Low',
      value: launches.filter((l) => l.performanceTier === 'low').length,
      color: '#ef4444',
    },
  ];

  // Platform distribution
  const platformData = [
    {
      name: 'Twitter',
      launches: launches.filter((l) => l.platform === 'twitter').length,
    },
    {
      name: 'LinkedIn',
      launches: launches.filter((l) => l.platform === 'linkedin').length,
    },
  ];

  // Top industries
  const industryCount = companies.reduce((acc, company) => {
    if (company.industry) {
      acc[company.industry] = (acc[company.industry] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topIndustries = Object.entries(industryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  // Engagement metrics
  const totalLikes = launches.reduce((sum, l) => sum + l.likesCount, 0);
  const totalComments = launches.reduce((sum, l) => sum + l.commentsCount, 0);
  const totalShares = launches.reduce((sum, l) => sum + l.sharesCount, 0);
  const avgLikes = launches.length > 0 ? Math.round(totalLikes / launches.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading analytics...</div>
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
              <Link href="/launches" className="text-gray-700 hover:text-blue-600">
                Launches
              </Link>
              <Link href="/companies" className="text-gray-700 hover:text-blue-600">
                Companies
              </Link>
              <Link href="/analytics" className="text-blue-600 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">
            Insights and trends from {launches.length} launches and {companies.length}{' '}
            companies
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Launches</span>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{launches.length}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Avg Likes</span>
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{avgLikes}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Comments</span>
              <PieChart className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {totalComments.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Shares</span>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {totalShares.toLocaleString()}
            </div>
          </div>
        </div>

        {launches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 mb-4">
              <BarChart3 className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No data to analyze yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add some launches to see analytics and insights
            </p>
            <Link
              href="/launches"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Launches
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* Platform Distribution */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Launches by Platform
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="launches" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Industries */}
            {topIndustries.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top 10 Industries
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topIndustries} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
