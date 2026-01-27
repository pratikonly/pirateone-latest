import { useState, useEffect, useRef } from 'react';
import { Trash2, List, HardDrive } from 'lucide-react';
import { Movie, getBackdropUrl } from '@/lib/tmdb';
import { getWatchlist, removeFromWatchlist, clearWatchlist } from '@/lib/watchlist';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { useSetBackdropUrl } from '@/contexts/BackdropContext';
import { toast } from 'sonner';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const currentIndexRef = useRef(0);
  const setBackdropUrl = useSetBackdropUrl();

  // Load watchlist from localStorage
  const loadWatchlist = () => {
    setWatchlist(getWatchlist());
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  // Auto-rotate backdrop from watchlist items
  useEffect(() => {
    if (watchlist.length === 0) {
      setBackdropUrl(null);
      return;
    }

    const updateBackdrop = () => {
      const movie = watchlist[currentIndexRef.current % watchlist.length];
      if (movie?.backdrop_path) {
        setBackdropUrl(getBackdropUrl(movie.backdrop_path, 'original'));
      }
    };

    updateBackdrop();

    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % watchlist.length;
      updateBackdrop();
    }, 8000);

    return () => {
      clearInterval(interval);
      setBackdropUrl(null);
    };
  }, [watchlist, setBackdropUrl]);

  const handleRemove = (id: number, mediaType: 'movie' | 'tv') => {
    removeFromWatchlist(id, mediaType);
    loadWatchlist();
  };

  const handleClearAll = () => {
    clearWatchlist();
    setWatchlist([]);
    toast.success('Watchlist cleared');
  };

  if (watchlist.length === 0) {
    return (
      <div className="p-8 pt-20">
        <h1 className="font-display text-4xl mb-8">My Watchlist</h1>
        <div className="text-center py-16">
          <List className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Your watchlist is empty</p>
          <p className="text-muted-foreground mt-2">Add movies and shows to watch later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-4xl">My Watchlist</h1>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <HardDrive className="w-4 h-4" />
            Saved locally
          </span>
        </div>
        <Button variant="destructive" onClick={handleClearAll}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchlist.map((movie, index) => (
          <div key={`${movie.id}-${movie.media_type}`} className="relative group">
            <MovieCard movie={movie} index={index} />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(movie.id, movie.media_type || 'movie');
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
