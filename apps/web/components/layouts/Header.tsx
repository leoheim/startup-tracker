'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Startup Tracker
          </Link>
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className={`${
                isActive('/dashboard')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/launches"
              className={`${
                isActive('/launches') || pathname.startsWith('/launches/')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Launches
            </Link>
            <Link
              href="/companies"
              className={`${
                isActive('/companies')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Companies
            </Link>
            <Link
              href="/analytics"
              className={`${
                isActive('/analytics')
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Analytics
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
