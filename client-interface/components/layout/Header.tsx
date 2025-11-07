'use client';

import { Bell, MessageSquare, Menu, Clock, Plus } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [notifications] = useState(3);

  return (
    <header className='h-16 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 fixed top-0 right-0 left-60 z-10'>
      <div className='h-full flex items-center justify-between px-6'>
        {/* Left Section */}
        <div className='flex items-center gap-4'>
          <button
            onClick={onMenuClick}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors lg:hidden'
            aria-label='Toggle menu'
          >
            <Menu className='h-5 w-5 text-gray-600 dark:text-gray-300' />
          </button>
          
          <h1 className='text-xl font-semibold text-gray-800 dark:text-white'>
            Home
          </h1>
        </div>

        {/* Right Section */}
        <div className='flex items-center gap-3'>
          {/* Add Button */}
          <button className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm'>
            <Plus className='h-4 w-4' />
            <span className='hidden sm:inline'>1,650</span>
          </button>

          {/* Clock/Timer */}
          <button className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'>
            <Clock className='h-5 w-5 text-gray-600 dark:text-gray-300' />
          </button>

          {/* Notifications */}
          <button className='relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'>
            <Bell className='h-5 w-5 text-gray-600 dark:text-gray-300' />
            {notifications > 0 && (
              <span className='absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center'>
                {notifications}
              </span>
            )}
          </button>

          {/* Messages */}
          <button className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'>
            <MessageSquare className='h-5 w-5 text-gray-600 dark:text-gray-300' />
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar */}
          <button className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-500 transition-all'>
            <span className='text-white text-sm font-semibold'>U</span>
          </button>
        </div>
      </div>
    </header>
  );
}
