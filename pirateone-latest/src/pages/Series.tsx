import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { getPopularTV, getTopRatedTV, getBackdropUrl, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSetBackdropUrl } from '@/contexts/BackdropContext';
import DisclaimerFooter from '@/components/DisclaimerFooter';
import { Loader2 } from 'lucide-react';

const Series = () => {
  const [popularTV, setPopularTV] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  // Pagination state
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [hasMorePopular, setHasMorePopular] = useState(true);
  const [hasMoreTopRated, setHasMoreTopRated] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentIndexRef = useRef(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const setBackdropUrl = useSetBackdropUrl();

  useEffect(() => {
    const fetchTV = async () => {
      try {
        const [popular, topRated] = await Promise.all([
          getPopularTV(1),
          getTopRatedTV(1),
        ]);
        setPopularTV(popular.results);
        setTopRatedTV(topRated.results);
        setHasMorePopular(1 < popular.totalPages);
        setHasMoreTopRated(1 < topRated.totalPages);
      } catch (error) {
        console.error('Failed to fetch TV shows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTV();
  }, []);

  // Auto-rotate backdrop from popular TV shows (no React state updates)
  useEffect(() => {
    if (popularTV.length === 0) return;

    const updateBackdrop = () => {
      const show = popularTV[currentIndexRef.current];
      if (show?.backdrop_path) {
        setBackdropUrl(getBackdropUrl(show.backdrop_path, 'original'));
      }
      currentIndexRef.current = (currentIndexRef.current + 1) % Math.min(popularTV.length, 10);
    };

    updateBackdrop();
    const interval = setInterval(updateBackdrop, 8000);

    return () => clearInterval(interval);
  }, [popularTV.length, setBackdropUrl]);

  // Cleanup backdrop on unmount only
  useEffect(() => {
    return () => setBackdropUrl(null);
  }, [setBackdropUrl]);

  const loadMorePopular = useCallback(async () => {
    if (isLoadingMore || !hasMorePopular) return;
    setIsLoadingMore(true);
    try {
      const nextPage = popularPage + 1;
      const data = await getPopularTV(nextPage);
      if (data.results.length === 0) {
        setHasMorePopular(false);
        return;
      }
      setPopularTV((prev) => [...prev, ...data.results]);
      setPopularPage(nextPage);
      if (nextPage >= data.totalPages) setHasMorePopular(false);
    } catch (error) {
      console.error('Failed to load more popular TV:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMorePopular, isLoadingMore, popularPage]);

  const loadMoreTopRated = useCallback(async () => {
    if (isLoadingMore || !hasMoreTopRated) return;
    setIsLoadingMore(true);
    try {
      const nextPage = topRatedPage + 1;
      const data = await getTopRatedTV(nextPage);
      if (data.results.length === 0) {
        setHasMoreTopRated(false);
        return;
      }
      setTopRatedTV((prev) => [...prev, ...data.results]);
      setTopRatedPage(nextPage);
      if (nextPage >= data.totalPages) setHasMoreTopRated(false);
    } catch (error) {
      console.error('Failed to load more top rated TV:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMoreTopRated, isLoadingMore, topRatedPage]);

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (isLoadingMore) return;

        if (activeTab === 'popular' && hasMorePopular) loadMorePopular();
        if (activeTab === 'top-rated' && hasMoreTopRated) loadMoreTopRated();
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeTab, hasMorePopular, hasMoreTopRated, isLoadingMore, loadMorePopular, loadMoreTopRated]);

  const MovieGrid = ({ movies }: { movies: Movie[] }) => (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 lg:gap-1.5">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={{ ...movie, media_type: 'tv' }} index={index} />
      ))}
    </div>
  );

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

  const { activeShows, activeHasMore } = useMemo(() => {
    if (activeTab === 'top-rated') return { activeShows: topRatedTV, activeHasMore: hasMoreTopRated };
    return { activeShows: popularTV, activeHasMore: hasMorePopular };
  }, [activeTab, hasMorePopular, hasMoreTopRated, popularTV, topRatedTV]);

  return (
    <div className="p-4 lg:p-6 pt-20">
      <h1 className="font-display text-3xl lg:text-4xl mb-6">Web Series</h1>

      <Tabs defaultValue="popular" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="popular" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Popular
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Top Rated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="popular">
          {isLoading ? <LoadingSkeleton /> : <MovieGrid movies={popularTV} />}
        </TabsContent>

        <TabsContent value="top-rated">
          {isLoading ? <LoadingSkeleton /> : <MovieGrid movies={topRatedTV} />}
        </TabsContent>
      </Tabs>

      {!isLoading && (
        <div ref={observerRef} className="py-8 flex justify-center">
          {isLoadingMore && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
          {!isLoadingMore && !activeHasMore && activeShows.length > 0 && (
            <p className="text-muted-foreground text-sm">No more content to load</p>
          )}
        </div>
      )}
      <DisclaimerFooter />
    </div>
  );
};

export default Series;
