'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  TrendingUpIcon,
  BellIcon,
  Cog6ToothIcon,
  HomeIcon,
  DocumentTextIcon,
  PhotoIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics: DashboardMetric[] = [
    {
      id: '1',
      title: 'Total Users',
      value: '24,563',
      change: '+12.5%',
      changeType: 'positive',
      icon: <UserGroupIcon className="w-8 h-8" />
    },
    {
      id: '2',
      title: 'Revenue',
      value: '$127,890',
      change: '+8.2%',
      changeType: 'positive',
      icon: <CurrencyDollarIcon className="w-8 h-8" />
    },
    {
      id: '3',
      title: 'Active Sessions',
      value: '2,847',
      change: '-3.1%',
      changeType: 'negative',
      icon: <ChartBarIcon className="w-8 h-8" />
    }
  ];

  const recentActivities: ActivityItem[] = [
    {
      id: '1',
      title: 'New user registered',
      description: 'John Doe joined the platform',
      time: '2 minutes ago',
      type: 'success'
    },
    {
      id: '2',
      title: 'Payment processed',
      description: 'Order #12345 completed successfully',
      time: '15 minutes ago',
      type: 'info'
    },
    {
      id: '3',
      title: 'System maintenance',
      description: 'Scheduled maintenance in 2 hours',
      time: '1 hour ago',
      type: 'warning'
    }
  ];

  const sidebarNavItems = [
    { icon: <HomeIcon className="w-5 h-5" />, label: 'Dashboard', href: '/', active: true },
    { icon: <DocumentTextIcon className="w-5 h-5" />, label: 'Articles', href: '/blog', active: false },
    { icon: <PhotoIcon className="w-5 h-5" />, label: 'Media', href: '/media', active: false },
    { icon: <UserGroupIcon className="w-5 h-5" />, label: 'Users', href: '/users', active: false },
    { icon: <ChartBarIcon className="w-5 h-5" />, label: 'Analytics', href: '/analytics', active: false },
    { icon: <Cog6ToothIcon className="w-5 h-5" />, label: 'Settings', href: '/settings', active: false },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${isVisible ? 'animate-slide-up' : ''}`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Game Vision
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Dashboard
          </p>
        </div>

        <nav className="sidebar-nav">
          {sidebarNavItems.map((item, index) => (
            <li key={item.href} className="sidebar-nav-item">
              <a 
                href={item.href}
                className={`sidebar-nav-link ${item.active ? 'active' : ''} ${isVisible ? 'animate-fade-in-delayed' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </a>
            </li>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="p-8">
          {/* Header */}
          <header className={`mb-8 ${isVisible ? 'animate-fade-in-delayed' : ''}`} style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Welcome back!
                </h1>
                <p className="mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                  Here's what's happening with your platform today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <button className="relative p-2 rounded-lg micro-bounce" style={{ backgroundColor: 'var(--color-surface)' }}>
                  <BellIcon className="w-6 h-6" style={{ color: 'var(--color-text-secondary)' }} />
                  <span className="absolute top-0 right-0 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-accent)' }}></span>
                </button>
                <button className="btn-primary micro-bounce">
                  View Reports
                </button>
              </div>
            </div>
          </header>

          {/* Metrics Cards */}
          <div className={`dashboard-grid dashboard-grid-3 ${isVisible ? 'reveal-on-scroll' : ''}`}>
            {metrics.map((metric, index) => (
              <div 
                key={metric.id} 
                className={`card-metric micro-bounce ${isVisible ? 'animate-fade-in-delayed' : ''}`}
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="flex items-center justify-center mb-4" style={{ color: 'var(--color-accent)' }}>
                  {metric.icon}
                </div>
                <div className="metric-value">{metric.value}</div>
                <div className="metric-label">{metric.title}</div>
                <div className={`text-sm mt-2 font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  <TrendingUpIcon className="w-4 h-4 inline mr-1" />
                  {metric.change} from last month
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className={`card ${isVisible ? 'animate-fade-in-delayed' : ''}`} style={{ animationDelay: '0.8s' }}>
                {children}
              </div>
            </div>

            {/* Right Sidebar - Recent Activities */}
            <div className={`card ${isVisible ? 'animate-fade-in-delayed' : ''}`} style={{ animationDelay: '1s' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    className={`border-l-4 pl-4 py-2 ${isVisible ? 'animate-fade-in-delayed' : ''}`}
                    style={{ 
                      borderLeftColor: 
                        activity.type === 'success' ? '#10b981' :
                        activity.type === 'warning' ? '#f59e0b' :
                        'var(--color-accent)',
                      animationDelay: `${1.2 + index * 0.1}s`
                    }}
                  >
                    <h4 className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>
                      {activity.title}
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {activity.description}
                    </p>
                    <div className="flex items-center mt-1">
                      <ClockIcon className="w-3 h-3 mr-1" style={{ color: 'var(--color-text-muted)' }} />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="btn-accent w-full micro-bounce">
                  View All Activities
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}