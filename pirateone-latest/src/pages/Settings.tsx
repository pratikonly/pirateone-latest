import { useState, useEffect } from 'react';
import { Bell, Eye, EyeOff, Trash2, User, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/pirateIdentity';
import { usePirateIdentity } from '@/contexts/PirateIdentityContext';

const Settings = () => {
  const { toast } = useToast();
  
  // Pirate Identity from shared context
  const { identity, isRegenerating, regenerateIdentity } = usePirateIdentity();
  
  // Notification settings
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(true);
  
  // Playback settings
  const [autoplay, setAutoplay] = useState(true);
  const [defaultQuality, setDefaultQuality] = useState('auto');
  
  // Privacy settings
  const [saveWatchHistory, setSaveWatchHistory] = useState(true);

  useEffect(() => {
    // Load saved settings
    const savedWelcome = localStorage.getItem('pirateone_welcome_shown');
    setShowWelcomeNotification(!savedWelcome);
    
    const savedAutoplay = localStorage.getItem('pirateone_autoplay');
    if (savedAutoplay !== null) setAutoplay(savedAutoplay === 'true');
    
    const savedQuality = localStorage.getItem('pirateone_quality');
    if (savedQuality) setDefaultQuality(savedQuality);
    
    const savedHistory = localStorage.getItem('pirateone_save_history');
    if (savedHistory !== null) setSaveWatchHistory(savedHistory === 'true');
  }, []);

  const handleRegenerateIdentity = async () => {
    try {
      await regenerateIdentity();
      toast({ title: 'New identity assigned!', description: `You are now ${identity?.name}` });
    } catch (error) {
      console.error('Failed to regenerate identity:', error);
      toast({ title: 'Failed to get new identity', variant: 'destructive' });
    }
  };

  const handleResetWelcomeNotification = () => {
    localStorage.removeItem('pirateone_welcome_shown');
    setShowWelcomeNotification(true);
    toast({ title: 'Welcome notification reset', description: 'You will see the welcome notification on next visit' });
  };

  const handleAutoplayChange = (enabled: boolean) => {
    setAutoplay(enabled);
    localStorage.setItem('pirateone_autoplay', String(enabled));
    toast({ title: 'Autoplay updated' });
  };

  const handleQualityChange = (quality: string) => {
    setDefaultQuality(quality);
    localStorage.setItem('pirateone_quality', quality);
    toast({ title: 'Default quality updated' });
  };

  const handleHistoryChange = (enabled: boolean) => {
    setSaveWatchHistory(enabled);
    localStorage.setItem('pirateone_save_history', String(enabled));
    toast({ title: enabled ? 'Watch history enabled' : 'Watch history disabled' });
  };

  const handleClearWatchlist = () => {
    localStorage.removeItem('pirateone_watchlist');
    toast({ title: 'Watchlist cleared', description: 'Your watchlist has been cleared' });
  };

  const handleClearAllData = () => {
    const keysToKeep = ['supabase.auth.token'];
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (!keysToKeep.some(k => key.includes(k))) {
        localStorage.removeItem(key);
      }
    });
    toast({ title: 'All data cleared', description: 'All local data has been cleared (except login)' });
  };

  return (
    <div className="p-4 lg:p-8 pt-20 max-w-2xl">
      <h1 className="font-display text-3xl lg:text-4xl mb-8">Settings</h1>
      
      <div className="space-y-6">

        {/* Pirate Identity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Pirate Identity
            </CardTitle>
            <CardDescription>Your guest identity on PirateOne</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/50">
                {identity?.imagePath ? (
                  <AvatarImage 
                    src={identity.imagePath} 
                    alt={identity.name}
                    className="object-cover"
                  />
                ) : null}
                <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                  {identity ? getInitials(identity.name) : 'GP'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground text-lg">
                  {identity?.name || 'Guest Pirate'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {identity?.role || 'Pirate'}
                </p>
                {identity?.bounty && (
                  <p className="text-sm text-primary font-medium mt-1">
                    💰 {identity.bounty}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerateIdentity}
              disabled={isRegenerating}
              className="w-full"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Getting new identity...' : 'Get New Pirate Identity'}
            </Button>
          </CardContent>
        </Card>

        {/* Playback */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Playback
            </CardTitle>
            <CardDescription>Configure video playback settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autoplay next episode</Label>
                <p className="text-xs text-muted-foreground">Automatically play the next episode</p>
              </div>
              <Switch
                checked={autoplay}
                onCheckedChange={handleAutoplayChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Default Quality</Label>
              <Select value={defaultQuality} onValueChange={handleQualityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="1080p">1080p</SelectItem>
                  <SelectItem value="720p">720p</SelectItem>
                  <SelectItem value="480p">480p</SelectItem>
                  <SelectItem value="360p">360p</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Welcome notification</Label>
                <p className="text-xs text-muted-foreground">
                  {showWelcomeNotification ? 'Will show on next visit' : 'Already dismissed'}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetWelcomeNotification}
                disabled={showWelcomeNotification}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-primary" />
              Privacy
            </CardTitle>
            <CardDescription>Manage your data and privacy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Save watch history</Label>
                <p className="text-xs text-muted-foreground">Remember what you watch</p>
              </div>
              <Switch
                checked={saveWatchHistory}
                onCheckedChange={handleHistoryChange}
              />
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleClearWatchlist}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Watchlist
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleClearAllData}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Local Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
