import { useEffect, useState, useRef, useCallback } from 'react';
import { searchMultiPaginated, getBackdropUrl, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { useSetBackdropUrl } from '@/contexts/BackdropContext';
import DisclaimerFooter from '@/components/DisclaimerFooter';
import { Loader2 } from 'lucide-react';

const ANIME_QUERIES = ['anime', 'one piece', 'naruto', 'demon slayer', 'attack on titan', 'jujutsu kaisen'];

const Anime = () => {
  const [animeList, setAnimeList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentIndexRef = useRef(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef<Set<number>>(new Set());
  const setBackdropUrl = useSetBackdropUrl();

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const searches = await Promise.all(
          ANIME_QUERIES.map(query => searchMultiPaginated(query, 1))
        );
        
        const allResults = searches.flatMap(s => s.results);
        const uniqueResults: Movie[] = [];
        
        allResults.forEach(item => {
          if (!seenIdsRef.current.has(item.id)) {
            seenIdsRef.current.add(item.id);
            uniqueResults.push(item);
          }
        });
        
        setAnimeList(uniqueResults);
      } catch (error) {
        console.error('Failed to fetch anime:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnime();
  }, []);

  // Auto-rotate backdrop from anime list (using ref to prevent re-renders)
  useEffect(() => {
    if (animeList.length === 0) return;
    
    const updateBackdrop = () => {
      const anime = animeList[currentIndexRef.current];
      if (anime?.backdrop_path) {
        setBackdropUrl(getBackdropUrl(anime.backdrop_path, 'original'));
      }
      currentIndexRef.current = (currentIndexRef.current + 1) % Math.min(animeList.length, 10);
    };
    
    updateBackdrop();
    const interval = setInterval(updateBackdrop, 8000);

    return () => clearInterval(interval);
  }, [animeList.length, setBackdropUrl]);
  
  // Cleanup backdrop on unmount only
  useEffect(() => {
    return () => setBackdropUrl(null);
  }, [setBackdropUrl]);

  // Load more anime
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const searches = await Promise.all(
        ANIME_QUERIES.map(query => searchMultiPaginated(query, nextPage))
      );
      
      const allResults = searches.flatMap(s => s.results);
      const uniqueResults: Movie[] = [];
      
      allResults.forEach(item => {
        if (!seenIdsRef.current.has(item.id)) {
          seenIdsRef.current.add(item.id);
          uniqueResults.push(item);
        }
      });
      
      if (uniqueResults.length === 0) {
        setHasMore(false);
      } else {
        setAnimeList(prev => [...prev, ...uniqueResults]);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Failed to load more anime:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, currentPage]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = observerRef.current;
    if (currentRef) observer.observe(currentRef);
    
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, isLoadingMore, loadMore]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 lg:gap-1.5">
      {[...Array(18)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="aspect-[2/3] bg-muted rounded-lg animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3 bg-muted rounded animate-pulse" />
            <div className="h-2.5 w-12 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 lg:p-6 pt-20">
      <h1 className="font-display text-3xl lg:text-4xl mb-6">Anime</h1>
      
      <p className="text-muted-foreground text-sm mb-6">
        Popular anime series and movies
      </p>
      
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 lg:gap-1.5">
            {animeList.map((item, index) => (
              <MovieCard key={`${item.id}-${index}`} movie={item} index={index} />
            ))}
          </div>
          <div ref={observerRef} className="py-8 flex justify-center">
            {isLoadingMore && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
            {!hasMore && animeList.length > 0 && (
              <p className="text-muted-foreground text-sm">No more content to load</p>
            )}
          </div>
        </>
      )}
      <DisclaimerFooter />
    </div>
  );
};

export default Anime;
