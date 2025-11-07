'use client';

import { useState } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  TrendingUp,
  Menu
} from 'lucide-react';

export default function Home() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Revenue',
      value: '$45,678',
      change: '+23%',
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Analytics',
      value: '12,456',
      change: '+8%',
      icon: BarChart3,
      color: 'bg-purple-500',
    },
    {
      title: 'Growth',
      value: '89%',
      change: '+5%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  return (
    <>
      <div className='space-y-6'>
        {/* Welcome Section */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Welcome to Pathment
            </h1>
            <p className='text-gray-600 dark:text-gray-400 mt-1'>
              Here is what is happening with your application today.
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
          >
            <Menu className='h-5 w-5' />
            <span>Open Drawer</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat) => (
            <div
              key={stat.title}
              className='bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className='h-6 w-6 text-white' />
                </div>
                <span className='text-sm font-medium text-green-600 dark:text-green-400'>
                  {stat.change}
                </span>
              </div>
              <h3 className='text-gray-600 dark:text-gray-400 text-sm mb-1'>
                {stat.title}
              </h3>
              <p className='text-2xl font-bold text-gray-900 dark:text-white'>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Recent Activity */}
          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Recent Activity
            </h2>
            <div className='space-y-4'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
                >
                  <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white font-semibold'>{i}</span>
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      Activity {i}
                    </p>
                    <p className='text-xs text-gray-600 dark:text-gray-400'>
                      Just now
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-slate-700'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              Quick Actions
            </h2>
            <div className='grid grid-cols-2 gap-4'>
              {['Create', 'Upload', 'Share', 'Export'].map((action) => (
                <button
                  key={action}
                  className='p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all text-gray-700 dark:text-gray-300 font-medium'
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className='bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-8 text-white shadow-lg'>
          <h2 className='text-2xl font-bold mb-2'>
            Beautiful Layout with Dark Mode 
          </h2>
          <p className='text-blue-100 mb-4'>
            This layout features a collapsible sidebar, dynamic header with theme toggle,
            and a responsive design that works perfectly in both light and dark modes.
          </p>
          <button className='px-6 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors'>
            Learn More
          </button>
        </div>
      </div>

      {/* Drawer Component */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title='Navigation Menu'
      >
        <div className='space-y-4'>
          <div>
            <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
              Example Content
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              This drawer can be opened from anywhere in your application.
              You can put any content here!
            </p>
          </div>
          <div className='space-y-2'>
            {['Option 1', 'Option 2', 'Option 3'].map((option) => (
              <button
                key={option}
                className='w-full p-3 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-300'
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}
