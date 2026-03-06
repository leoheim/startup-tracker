'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

export default function NewLaunchPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyId: '',
    platform: 'twitter' as 'twitter' | 'linkedin',
    postUrl: '',
    postId: '',
    content: '',
    authorHandle: '',
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    viewsCount: 0,
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    const res = await apiClient.get<Company[]>('/companies?limit=100');
    if (res.success && res.data) {
      setCompanies(res.data);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await apiClient.post('/launches', formData);

    if (res.success) {
      router.push('/launches');
    } else {
      setError(res.error || 'Failed to create launch');
      setLoading(false);
    }
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
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/launches"
              className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Launches
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Launch</h1>
          <p className="text-gray-600">
            Manually add a launch post from X/Twitter or LinkedIn
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Company */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company *
            </label>
            <select
              required
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {companies.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">
                No companies found.{' '}
                <Link href="/dashboard" className="text-blue-600 hover:underline">
                  Sync YC companies first
                </Link>
              </p>
            )}
          </div>

          {/* Platform */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="twitter"
                  checked={formData.platform === 'twitter'}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value as any })
                  }
                  className="mr-2"
                />
                <span className="text-sm">X (Twitter)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="linkedin"
                  checked={formData.platform === 'linkedin'}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value as any })
                  }
                  className="mr-2"
                />
                <span className="text-sm">LinkedIn</span>
              </label>
            </div>
          </div>

          {/* Post URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post URL *
            </label>
            <input
              type="url"
              required
              placeholder="https://x.com/username/status/123456789"
              value={formData.postUrl}
              onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Author Handle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Handle
            </label>
            <input
              type="text"
              placeholder="@username"
              value={formData.authorHandle}
              onChange={(e) =>
                setFormData({ ...formData, authorHandle: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content (optional)
            </label>
            <textarea
              rows={4}
              placeholder="Paste the post content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Engagement Metrics */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Engagement Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Likes</label>
                <input
                  type="number"
                  min="0"
                  value={formData.likesCount}
                  onChange={(e) =>
                    setFormData({ ...formData, likesCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Comments</label>
                <input
                  type="number"
                  min="0"
                  value={formData.commentsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commentsCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Shares</label>
                <input
                  type="number"
                  min="0"
                  value={formData.sharesCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sharesCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Views</label>
                <input
                  type="number"
                  min="0"
                  value={formData.viewsCount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      viewsCount: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Engagement score and performance tier will be calculated automatically
            </p>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || companies.length === 0}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? (
                'Creating...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Launch
                </>
              )}
            </button>
            <Link
              href="/launches"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
