import { siteConfig } from '@/lib/config/site';
import { Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className='border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 mt-auto'>
      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Brand Section */}
          <div className='col-span-1 md:col-span-2'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
              {siteConfig.name}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
              {siteConfig.description}
            </p>
            <div className='flex gap-4'>
              <a
                href={siteConfig.links.github}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'
                aria-label='GitHub'
              >
                <Github className='h-5 w-5 text-gray-600 dark:text-gray-400' />
              </a>
              <a
                href={siteConfig.links.twitter}
                target='_blank'
                rel='noopener noreferrer'
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'
                aria-label='Twitter'
              >
                <Twitter className='h-5 w-5 text-gray-600 dark:text-gray-400' />
              </a>
              <a
                href='mailto:info@pathment.com'
                className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors'
                aria-label='Email'
              >
                <Mail className='h-5 w-5 text-gray-600 dark:text-gray-400' />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-3'>
              Quick Links
            </h4>
            <ul className='space-y-2'>
              <li>
                <a href='/' className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                  Home
                </a>
              </li>
              <li>
                <a href='/about' className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                  About
                </a>
              </li>
              <li>
                <a href='/contact' className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-3'>
              Legal
            </h4>
            <ul className='space-y-2'>
              <li>
                <a href='/privacy' className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href='/terms' className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href='/cookies' className='text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'>
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-slate-700'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
               {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-500'>
              Built with Next.js 16, TypeScript & Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
