import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Monitor, Globe, ArrowLeft } from 'lucide-react';

const NOTIFICATION_KEY = 'pirateone_welcome_shown';
const NOTIFICATION_VERSION = '1'; // Increment to show notification again after updates

const WelcomeNotification = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if notification was already shown for this version
    const shownVersion = localStorage.getItem(NOTIFICATION_KEY);
    
    // Show notification if never shown or if version changed
    if (shownVersion !== NOTIFICATION_VERSION) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(NOTIFICATION_KEY, NOTIFICATION_VERSION);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Important Notice
          </DialogTitle>
          <DialogDescription className="text-base">
            Please read these instructions for the best experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Grid layout: stacked on mobile, inline on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Instruction 0 - Local Storage */}
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm md:mt-2">Your Data is Stored Locally</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Your watchlist, watch history, and preferences are saved <span className="text-foreground font-medium">locally on your device</span>. No account needed – your data stays private and secure in your browser.
              </p>
            </div>

            {/* Instruction 1 - Ad Redirect */}
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <ArrowLeft className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm md:mt-2">Ad Redirects</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                While watching movies, series, or anime, clicking on the video player may sometimes redirect you to a new tab due to ads. Simply <span className="text-foreground font-medium">click back</span> to continue watching.
              </p>
            </div>

            {/* Instruction 2 - VPN */}
            <div className="flex flex-col gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-center gap-3 md:flex-col md:items-start">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-medium text-sm md:mt-2">Content Not Loading?</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                If nothing is showing on the website or content fails to load, try using a <span className="text-foreground font-medium">VPN</span>. This will definitely help resolve the issue.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Got it, let's watch!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeNotification;