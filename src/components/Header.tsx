import { Button } from './ui/button';
import { Menu, Settings, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { getInitials } from '@/lib/pirateIdentity';
import { usePirateIdentity } from '@/contexts/PirateIdentityContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { identity, isLoading, isRegenerating, regenerateIdentity } = usePirateIdentity();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    setUserDropdownOpen(false);
    navigate('/settings');
  };

  const handleRegenerateIdentity = async () => {
    try {
      await regenerateIdentity();
    } catch (error) {
      console.error('Failed to regenerate identity:', error);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 h-14 z-40 flex items-center justify-between px-4 lg:px-6">
      {/* Mobile menu button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden h-9 w-9"
        onClick={onMenuToggle}
      >
        <Menu className="w-5 h-5" />
      </Button>
      
      {/* Empty spacer for desktop to push content right */}
      <div className="hidden lg:block flex-1" />

      {/* Empty spacer for mobile */}
      <div className="lg:hidden flex-1" />

      {/* Right side - User icon with dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="rounded-full border-2 border-primary/50 hover:border-primary transition-colors overflow-hidden"
          >
            <Avatar className="w-9 h-9">
              {identity?.imagePath ? (
                <AvatarImage 
                  src={identity.imagePath} 
                  alt={identity.name}
                  className="object-cover"
                />
              ) : null}
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {isLoading ? '...' : identity ? getInitials(identity.name) : 'GP'}
              </AvatarFallback>
            </Avatar>
          </button>
          
          {userDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 py-2">
              {/* Identity Info */}
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    {identity?.imagePath ? (
                      <AvatarImage 
                        src={identity.imagePath} 
                        alt={identity.name}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                      {identity ? getInitials(identity.name) : 'GP'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {identity?.name || 'Guest Pirate'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {identity?.role || 'Pirate'}
                    </p>
                  </div>
                </div>
                {identity?.bounty && (
                  <p className="text-xs text-primary mt-2 font-medium">
                    💰 {identity.bounty}
                  </p>
                )}
              </div>

              {/* Data storage info */}
              <div className="px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                  <span>Data stored locally</span>
                </div>
              </div>

              {/* Get New Identity */}
              <button
                onClick={handleRegenerateIdentity}
                disabled={isRegenerating}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Getting new identity...' : 'Get New Identity'}</span>
              </button>

              {/* Settings option */}
              <button
                onClick={handleSettingsClick}
                className="w-full px-3 py-2 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
