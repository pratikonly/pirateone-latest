import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import pirateOneLogo from '@/assets/pirateone-logo.png';
import pratikLogo from '@/assets/pratik-logo.png';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navItems = [
    { label: 'Home', path: '/', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    )},
    { label: 'Search', path: '/search', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    )},
    { label: 'Movies', path: '/movies', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
        <line x1="7" y1="2" x2="7" y2="22"/>
        <line x1="17" y1="2" x2="17" y2="22"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="2" y1="7" x2="7" y2="7"/>
        <line x1="2" y1="17" x2="7" y2="17"/>
        <line x1="17" y1="17" x2="22" y2="17"/>
        <line x1="17" y1="7" x2="22" y2="7"/>
      </svg>
    )},
    { label: 'Web Series', path: '/series', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
        <polyline points="17 2 12 7 7 2"/>
      </svg>
    )},
    { label: 'Anime', path: '/anime', icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 32 32">
        <path d="M25 5.55c0 .28-.14.54-.372.69l-2.033 1.34q-.28.184-.595.29V12h.695c.502 0 .984.2 1.335.55c.482.48 1.125.73 1.778.73c.482 0 .964-.14 1.396-.42c.151-.1.302-.14.462-.14c.432 0 .834.35.834.84c0 .28-.14.54-.372.69l-2.009 1.33c-.335.22-.717.36-1.119.405v4.184c.203.093.39.221.55.381c.48.48 1.12.73 1.77.73c.48 0 .96-.14 1.39-.42a.8.8 0 0 1 .46-.14c.42 0 .83.35.83.84c0 .28-.14.54-.37.69l-2 1.33q-.296.194-.63.302V30h-8v-3.99c0-.56-.45-1.01-1.01-1.01h-3.98c-.56 0-1.01.45-1.01 1.01V30H5v-6.12a2.6 2.6 0 0 1-.63-.3l-2-1.33a.82.82 0 0 1-.37-.69c0-.49.4-.84.84-.84c.15 0 .31.05.46.14c.42.28.91.42 1.39.42c.65 0 1.29-.25 1.77-.73c.157-.157.34-.284.54-.376v-4.19a2.6 2.6 0 0 1-1.12-.404l-2.008-1.33a.82.82 0 0 1-.372-.69c0-.49.402-.84.844-.84c.15 0 .311.05.462.14a2.535 2.535 0 0 0 3.174-.31c.351-.35.833-.55 1.336-.55H10V7.873a2.7 2.7 0 0 1-.615-.293L7.372 6.24A.82.82 0 0 1 7 5.55c0-.49.402-.83.845-.83c.151 0 .312.04.453.14c.433.28.916.42 1.398.42c.866 0 1.721-.44 2.204-1.28l.815-1.43c.201-.35.573-.57.986-.57h4.679c.422 0 .815.24 1.006.61L20.1 4a2.53 2.53 0 0 0 2.203 1.28c.483 0 .966-.14 1.4-.42c.14-.1.3-.14.462-.14a.83.83 0 0 1 .835.83M12.43 11h1.14c.24 0 .44-.19.43-.43V9.43c0-.24-.19-.43-.43-.43h-1.14c-.24 0-.43.19-.43.43v1.14c0 .24.19.43.43.43m-3 8h1.14c.24 0 .44-.19.43-.43v-1.14c0-.24-.19-.43-.43-.43H9.43c-.24 0-.43.19-.43.43v1.14c0 .24.19.43.43.43m.83 9c.41 0 .75-.33.75-.75v-1.5c0-.41-.34-.75-.75-.75h-2.5c-.41 0-.75.34-.75.75v1.5c0 .41.34.75.75.75zm6.31-9c.24 0 .44-.19.43-.43v-1.14c0-.24-.19-.43-.43-.43h-1.14c-.24 0-.43.19-.43.43v1.14c0 .24.19.43.43.43zm3-8c.24 0 .44-.19.43-.43V9.43c0-.24-.19-.43-.43-.43h-1.14c-.24 0-.43.19-.43.43v1.14c0 .24.19.43.43.43zm1.86 8h1.14c.24 0 .44-.19.43-.43v-1.14c0-.24-.19-.43-.43-.43h-1.14c-.24 0-.43.19-.43.43v1.14c0 .24.19.43.43.43m2.83 9c.41 0 .75-.33.75-.75v-1.5c0-.41-.34-.75-.75-.75h-2.5c-.41 0-.75.34-.75.75v1.5c0 .41.34.75.75.75z"/>
      </svg>
    )},
  ];

  const bottomItems = [
    { label: 'Watchlist', path: '/watchlist', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    )},
    { label: 'Help', path: '/help', icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )},
  ];

  const handleNavClick = () => {
    onClose();
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-64 lg:w-60 bg-sidebar/5 backdrop-blur-sm border-r border-border flex flex-col z-50",
      "transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      {/* Logo Section */}
      <div className="p-4 lg:p-5 border-b border-sidebar-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            {/* New Logo Image - Larger to fit sidebar */}
            <img 
              src={pirateOneLogo} 
              alt="PirateOne" 
              className="h-auto w-full max-w-[180px] object-contain invert dark:invert-0"
            />
            
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Made by Pratik button - centered with border */}
          <a
            href="https://xpratik.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-transparent hover:bg-muted/50 transition-colors mx-auto"
          >
            <span className="text-[10px] text-muted-foreground">Made by Pratik</span>
            <img 
              src={pratikLogo} 
              alt="Pratik" 
              className="w-4 h-4 rounded-full object-cover"
            />
          </a>
        </div>
        
        {/* Hidden old logo section - preserved for future use */}
        {/* 
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-pink-600 flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-primary-foreground -rotate-45" viewBox="0 0 32 32" fill="currentColor">
              <path d="M30.592,15.564..."/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-pirate text-xl lg:text-2xl text-foreground tracking-wide leading-none">PIRATEONE</h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">Made by Pratik</p>
          </div>
        </div>
        */}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
              'hover:bg-sidebar-accent',
              isActive(item.path)
                ? 'bg-primary/15 text-primary border-l-2 border-primary'
                : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
            )}
          >
            <span className={cn(
              'transition-colors',
              isActive(item.path) ? 'text-primary' : 'text-sidebar-foreground group-hover:text-primary'
            )}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
              'hover:bg-sidebar-accent',
              isActive(item.path)
                ? 'bg-primary/15 text-primary border-l-2 border-primary'
                : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
            )}
          >
            <span className={cn(
              'transition-colors',
              isActive(item.path) ? 'text-primary' : 'text-sidebar-foreground group-hover:text-primary'
            )}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
