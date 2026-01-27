import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getBackdropUrl, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSetBackdropUrl } from '@/contexts/BackdropContext';
import DisclaimerFooter from '@/components/DisclaimerFooter';
import { Loader2 } from 'lucide-react';

const Movies = () => {
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  // Pagination state
  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [nowPlayingPage, setNowPlayingPage] = useState(1);
  const [hasMorePopular, setHasMorePopular] = useState(true);
  const [hasMoreTopRated, setHasMoreTopRated] = useState(true);
  const [hasMoreNowPlaying, setHasMoreNowPlaying] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const currentIndexRef = useRef(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const setBackdropUrl = useSetBackdropUrl();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, topRated, playing] = await Promise.all([
          getPopularMovies(1),
          getTopRatedMovies(1),
          getNowPlayingMovies(1),
        ]);
        setPopularMovies(popular.results);
        setTopRatedMovies(topRated.results);
        setNowPlaying(playing.results);
        setHasMorePopular(1 < popular.totalPages);
        setHasMoreTopRated(1 < topRated.totalPages);
        setHasMoreNowPlaying(1 < playing.totalPages);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Auto-rotate backdrop from popular movies (no React state updates)
  useEffect(() => {
    if (popularMovies.length === 0) return;

    const updateBackdrop = () => {
      const movie = popularMovies[currentIndexRef.current];
      if (movie?.backdrop_path) {
        setBackdropUrl(getBackdropUrl(movie.backdrop_path, 'original'));
      }
      currentIndexRef.current = (currentIndexRef.current + 1) % Math.min(popularMovies.length, 10);
    };

    updateBackdrop();
    const interval = setInterval(updateBackdrop, 8000);

    return () => clearInterval(interval);
  }, [popularMovies.length, setBackdropUrl]);

  // Cleanup backdrop on unmount only
  useEffect(() => {
    return () => setBackdropUrl(null);
  }, [setBackdropUrl]);

  const loadMorePopular = useCallback(async () => {
    if (isLoadingMore || !hasMorePopular) return;
    setIsLoadingMore(true);
    try {
      const nextPage = popularPage + 1;
      const data = await getPopularMovies(nextPage);
      if (data.results.length === 0) {
        setHasMorePopular(false);
        return;
      }
      setPopularMovies((prev) => [...prev, ...data.results]);
      setPopularPage(nextPage);
      if (nextPage >= data.totalPages) setHasMorePopular(false);
    } catch (error) {
      console.error('Failed to load more popular movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMorePopular, isLoadingMore, popularPage]);

  const loadMoreNowPlaying = useCallback(async () => {
    if (isLoadingMore || !hasMoreNowPlaying) return;
    setIsLoadingMore(true);
    try {
      const nextPage = nowPlayingPage + 1;
      const data = await getNowPlayingMovies(nextPage);
      if (data.results.length === 0) {
        setHasMoreNowPlaying(false);
        return;
      }
      setNowPlaying((prev) => [...prev, ...data.results]);
      setNowPlayingPage(nextPage);
      if (nextPage >= data.totalPages) setHasMoreNowPlaying(false);
    } catch (error) {
      console.error('Failed to load more now playing movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMoreNowPlaying, isLoadingMore, nowPlayingPage]);

  const loadMoreTopRated = useCallback(async () => {
    if (isLoadingMore || !hasMoreTopRated) return;
    setIsLoadingMore(true);
    try {
      const nextPage = topRatedPage + 1;
      const data = await getTopRatedMovies(nextPage);
      if (data.results.length === 0) {
        setHasMoreTopRated(false);
        return;
      }
      setTopRatedMovies((prev) => [...prev, ...data.results]);
      setTopRatedPage(nextPage);
      if (nextPage >= data.totalPages) setHasMoreTopRated(false);
    } catch (error) {
      console.error('Failed to load more top rated movies:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMoreTopRated, isLoadingMore, topRatedPage]);

  // Single sentinel (outside TabsContent) so IntersectionObserver always watches the visible bottom.
  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (isLoadingMore) return;

        if (activeTab === 'popular' && hasMorePopular) loadMorePopular();
        if (activeTab === 'now-playing' && hasMoreNowPlaying) loadMoreNowPlaying();
        if (activeTab === 'top-rated' && hasMoreTopRated) loadMoreTopRated();
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeTab, hasMoreNowPlaying, hasMorePopular, hasMoreTopRated, isLoadingMore, loadMoreNowPlaying, loadMorePopular, loadMoreTopRated]);

  const MovieGrid = ({ movies }: { movies: Movie[] }) => (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 lg:gap-1.5">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
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

  const { activeMovies, activeHasMore } = useMemo(() => {
    if (activeTab === 'now-playing') return { activeMovies: nowPlaying, activeHasMore: hasMoreNowPlaying };
    if (activeTab === 'top-rated') return { activeMovies: topRatedMovies, activeHasMore: hasMoreTopRated };
    return { activeMovies: popularMovies, activeHasMore: hasMorePopular };
  }, [activeTab, hasMoreNowPlaying, hasMorePopular, hasMoreTopRated, nowPlaying, popularMovies, topRatedMovies]);

  return (
    <div className="p-4 lg:p-6 pt-20">
      <h1 className="font-display text-3xl lg:text-4xl mb-6">Movies</h1>

      <Tabs defaultValue="popular" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-muted/50">
          <TabsTrigger value="popular" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Popular
          </TabsTrigger>
          <TabsTrigger value="now-playing" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Now Playing
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Top Rated
          </TabsTrigger>
        </TabsList>

        <TabsContent value="popular">
          {isLoading ? <LoadingSkeleton /> : <MovieGrid movies={popularMovies} />}
        </TabsContent>

        <TabsContent value="now-playing">
          {isLoading ? <LoadingSkeleton /> : <MovieGrid movies={nowPlaying} />}
        </TabsContent>

        <TabsContent value="top-rated">
          {isLoading ? <LoadingSkeleton /> : <MovieGrid movies={topRatedMovies} />}
        </TabsContent>
      </Tabs>

      {!isLoading && (
        <div ref={observerRef} className="py-8 flex justify-center">
          {isLoadingMore && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
          {!isLoadingMore && !activeHasMore && activeMovies.length > 0 && (
            <p className="text-muted-foreground text-sm">No more content to load</p>
          )}
        </div>
      )}
      <DisclaimerFooter />
    </div>
  );
};

export default Movies;
