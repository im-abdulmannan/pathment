'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export function Drawer({ isOpen, onClose, children, title }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black/50 z-40 transition-opacity'
        onClick={onClose}
      />

      {/* Drawer */}
      <div className='fixed left-0 top-0 h-full w-80 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-700'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white'>
            {title || 'Menu'}
          </h2>
          <button
            onClick={onClose}
            className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'
            aria-label='Close drawer'
          >
            <X className='h-5 w-5 text-gray-600 dark:text-gray-300' />
          </button>
        </div>

        {/* Content */}
        <div className='p-4'>{children}</div>
      </div>
    </>
  );
}
