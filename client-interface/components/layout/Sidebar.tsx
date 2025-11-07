'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Network, 
  Radio, 
  Lightbulb, 
  Wallet, 
  ShoppingBag, 
  Gift, 
  Settings, 
  MessageSquare, 
  User, 
  Activity,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Networks', href: '/networks', icon: Network },
  {
    title: 'Uplink',
    href: '/uplink',
    icon: Radio,
    children: [
      { title: 'Overview', href: '/uplink/overview', icon: Activity },
      { title: 'Settings', href: '/uplink/settings', icon: Settings },
    ],
  },
  {
    title: 'Perceptron',
    href: '/perceptron',
    icon: Lightbulb,
    children: [
      { title: 'Dashboard', href: '/perceptron/dashboard', icon: Activity },
      { title: 'Projects', href: '/perceptron/projects', icon: Lightbulb },
    ],
  },
  { title: 'Bank', href: '/bank', icon: Wallet },
  { title: 'Shop', href: '/shop', icon: ShoppingBag },
];

const bottomNavItems: NavItem[] = [
  {
    title: 'Trade Settings',
    href: '/settings/trade',
    icon: Settings,
  },
  {
    title: 'Inbox Settings',
    href: '/settings/inbox',
    icon: MessageSquare,
  },
  {
    title: 'Profile Settings',
    href: '/settings/profile',
    icon: User,
  },
  {
    title: 'Status Settings',
    href: '/settings/status',
    icon: Activity,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => pathname === href;

  return (
    <aside className='w-60 h-screen bg-slate-700 dark:bg-slate-900 text-white flex flex-col fixed left-0 top-0'>
      {/* Logo */}
      <div className='p-4 flex items-center gap-2'>
        <div className='w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center'>
          <Radio className='h-5 w-5' />
        </div>
        <span className='text-xl font-bold'>PATHMENT</span>
      </div>

      {/* Search */}
      <div className='px-4 pb-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search'
            className='w-full bg-slate-600 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className='flex-1 overflow-y-auto px-2'>
        {navItems.map((item) => (
          <div key={item.title}>
            {item.children ? (
              <>
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                    'hover:bg-slate-600 dark:hover:bg-slate-800'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <item.icon className='h-5 w-5' />
                    <span>{item.title}</span>
                  </div>
                  {expandedItems.includes(item.title) ? (
                    <ChevronDown className='h-4 w-4' />
                  ) : (
                    <ChevronRight className='h-4 w-4' />
                  )}
                </button>
                {expandedItems.includes(item.title) && (
                  <div className='ml-4 mt-1 space-y-1'>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                          isActive(child.href)
                            ? 'bg-slate-600 dark:bg-slate-800'
                            : 'hover:bg-slate-600 dark:hover:bg-slate-800'
                        )}
                      >
                        <child.icon className='h-4 w-4' />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm',
                  isActive(item.href)
                    ? 'bg-slate-600 dark:bg-slate-800'
                    : 'hover:bg-slate-600 dark:hover:bg-slate-800'
                )}
              >
                <item.icon className='h-5 w-5' />
                <span>{item.title}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Refer a Friend */}
      <div className='px-4 py-4 border-t border-slate-600 dark:border-slate-800'>
        <div className='bg-slate-600 dark:bg-slate-800 rounded-lg p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <Gift className='h-5 w-5' />
            <h3 className='font-semibold text-sm'>Refer a Friend</h3>
          </div>
          <p className='text-xs text-gray-300 mb-3'>
            Invite friends and earn free SimSims for each successful signup!
          </p>
          <button className='w-full bg-white text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors'>
            Invite
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className='px-2 py-4 border-t border-slate-600 dark:border-slate-800'>
        {bottomNavItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          return (
            <div key={item.title}>
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className='w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-slate-600 dark:hover:bg-slate-800 transition-colors text-sm'
                  >
                    <div className='flex items-center gap-3'>
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </div>
                    {expandedItems.includes(item.title) ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
                    )}
                  </button>
                  {expandedItems.includes(item.title) && item.children && (
                    <div className='ml-4 mt-1 space-y-1'>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                            isActive(child.href)
                              ? 'bg-slate-600 dark:bg-slate-800'
                              : 'hover:bg-slate-600 dark:hover:bg-slate-800'
                          )}
                        >
                          <child.icon className='h-4 w-4' />
                          <span>{child.title}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                    isActive(item.href)
                      ? 'bg-slate-600 dark:bg-slate-800'
                      : 'hover:bg-slate-600 dark:hover:bg-slate-800'
                  )}
                >
                  <div className='flex items-center gap-3'>
                    <item.icon className='h-4 w-4' />
                    <span>{item.title}</span>
                  </div>
                  <ChevronRight className='h-4 w-4' />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className='px-4 py-3 border-t border-slate-600 dark:border-slate-800'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center'>
            <User className='h-4 w-4' />
          </div>
          <span className='text-sm font-medium'>username</span>
        </div>
      </div>
    </aside>
  );
}
