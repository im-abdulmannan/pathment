# Pathment Application - Layout Guide

##  Completed Features

### 1. **Side Navigation Bar**
- Fixed sidebar on the left (240px width)
- Collapsible navigation items with icons
- Search functionality
- User profile at the bottom
- 'Refer a Friend' section
- Settings menu
- Dark/Light theme support

### 2. **Top Header/Navbar**
- Fixed header with dynamic content
- User actions (notifications, messages, timer)
- Theme toggle button (Dark/Light mode)
- Responsive design
- User avatar

### 3. **Drawer Component**
- Opens from the left side
- Backdrop overlay
- Smooth animations
- Customizable content
- Close on backdrop click
- Example usage in home page

### 4. **Footer**
- Beautiful grid layout
- Quick links section
- Legal links
- Social media icons
- Theme-aware styling
- Responsive design

### 5. **Theme System**
- Dark and Light mode support
- System preference detection
- Persistent theme selection
- Smooth transitions
- Custom scrollbar styling

##  Theme Usage

Toggle between dark and light mode using the sun/moon icon in the header.

The theme is managed by 
ext-themes and persists across page reloads.

##  Project Structure

\\\
client-interface/
 app/
    layout.tsx          # Root layout with sidebar, header, footer
    page.tsx            # Home page with stats and drawer demo
    globals.css         # Global styles with theme variables
 components/
    layout/
       Sidebar.tsx     # Left navigation sidebar
       Header.tsx      # Top header with actions
       Footer.tsx      # Footer component
    ui/
       ThemeToggle.tsx # Theme switcher button
       Drawer.tsx      # Slide-in drawer component
    theme-provider.tsx  # Theme provider wrapper
 lib/
    utils/
       cn.ts           # Class name utility
    config/
        site.ts         # Site configuration
 features/               # Feature-based modules
\\\

##  Development

\\\ash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\\\

##  Key Features

1. **Responsive Design**: Works on all screen sizes
2. **Dark Mode**: Full dark mode support
3. **Modern UI**: Clean and professional design
4. **Icons**: Lucide React icons throughout
5. **TypeScript**: Full type safety
6. **Feature-based**: Modular architecture

##  Customization

### Changing Colors
Edit \pp/globals.css\ to modify theme colors:

\\\css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

.dark {
  --background: #0f172a;
  --foreground: #f1f5f9;
}
\\\

### Adding Navigation Items
Edit \components/layout/Sidebar.tsx\:

\\\	ypescript
const navItems: NavItem[] = [
  { title: 'Your Page', href: '/your-page', icon: YourIcon },
  // Add more items...
];
\\\

### Using the Drawer
\\\	ypescript
import { Drawer } from '@/components/ui/Drawer';

const [isOpen, setIsOpen] = useState(false);

<Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} title='Menu'>
  {/* Your content */}
</Drawer>
\\\

##  Live Preview

Visit: http://localhost:3000

##  Dependencies

- **next**: 16.0.1 (Latest stable)
- **react**: 19.2.0
- **next-themes**: Theme management
- **lucide-react**: Icon library
- **clsx & tailwind-merge**: Utility functions
- **tailwindcss**: 4.0 (Latest)

##  What's Next?

You can now:
1. Add more pages to the application
2. Create feature modules in the \eatures/\ directory
3. Build reusable UI components in \components/ui/\
4. Connect to a backend API
5. Add authentication
6. Implement routing for different sections

The layout is fully functional and ready for feature development!
