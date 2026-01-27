import { useState, useEffect, useRef } from 'react';
import { Search as SearchIcon, Film, Tv, Loader2 } from 'lucide-react';
import { searchMulti, getBackdropUrl, getTrending, Movie } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSetBackdropUrl } from '@/contexts/BackdropContext';
import DisclaimerFooter from '@/components/DisclaimerFooter';
import { useDebounce } from '@/hooks/useDebounce';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const currentIndexRef = useRef(0);
  const setBackdropUrl = useSetBackdropUrl();
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const debouncedQuery = useDebounce(query.trim(), 300);

  // Fetch trending for backdrop when no search results
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrending('all', 'week');
        setTrendingMovies(data);
      } catch (error) {
        console.error('Failed to fetch trending:', error);
      }
    };
    fetchTrending();
  }, []);

  // Auto-search when debounced query changes
  useEffect(() => {
    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Clear results if query is too short
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const performSearch = async () => {
      setIsLoading(true);
      currentIndexRef.current = 0; // Reset backdrop index
      
      try {
        const data = await searchMulti(debouncedQuery);
        if (!abortController.signal.aborted) {
          setResults(data);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error('Search failed:', error);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      abortController.abort();
    };
  }, [debouncedQuery]);

  // Auto-rotate backdrop
  useEffect(() => {
    const movies = results.length > 0 ? results : trendingMovies;
    if (movies.length === 0) return;

    const updateBackdrop = () => {
      const movie = movies[currentIndexRef.current % movies.length];
      if (movie?.backdrop_path) {
        setBackdropUrl(getBackdropUrl(movie.backdrop_path, 'original'));
      }
    };

    updateBackdrop();

    const interval = setInterval(() => {
      currentIndexRef.current = (currentIndexRef.current + 1) % Math.min(movies.length, 10);
      updateBackdrop();
    }, 8000);

    return () => {
      clearInterval(interval);
      setBackdropUrl(null);
    };
  }, [results, trendingMovies, setBackdropUrl]);

  const movies = results.filter(r => r.media_type === 'movie');
  const tvShows = results.filter(r => r.media_type === 'tv');
  const hasQuery = query.trim().length > 0;
  const isQueryTooShort = query.trim().length > 0 && query.trim().length < 2;

  const MovieGrid = ({ items }: { items: Movie[] }) => (
    <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-1 lg:gap-1.5">
      {items.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col p-4 lg:p-8 pt-20">
      <h1 className="font-display text-3xl lg:text-4xl mb-6 lg:mb-8">Search</h1>
      
      {/* Search Input */}
      <div className="mb-6 lg:mb-8 max-w-2xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 lg:pl-12 pr-10 lg:pr-12 h-12 lg:h-14 text-base lg:text-lg bg-muted border-border focus:border-primary"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 w-4 lg:w-5 h-4 lg:h-5 text-muted-foreground animate-spin" />
          )}
        </div>
        {isQueryTooShort && (
          <p className="text-muted-foreground text-sm mt-2">Type at least 2 characters to search...</p>
        )}
      </div>

      {/* Results */}
      <div className="flex-1">
      {debouncedQuery.length >= 2 && (
        <>
          {results.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No results found for "{debouncedQuery}"</p>
              <p className="text-muted-foreground mt-2">Try a different search term</p>
            </div>
          ) : results.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-8 bg-muted/50">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  All ({results.length})
                </TabsTrigger>
                <TabsTrigger value="movies" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Film className="w-4 h-4 mr-2" />
                  Movies ({movies.length})
                </TabsTrigger>
                <TabsTrigger value="tv" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Tv className="w-4 h-4 mr-2" />
                  TV Shows ({tvShows.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <MovieGrid items={results} />
              </TabsContent>
              
              <TabsContent value="movies">
                <MovieGrid items={movies} />
              </TabsContent>
              
              <TabsContent value="tv">
                <MovieGrid items={tvShows} />
              </TabsContent>
            </Tabs>
          ) : null}
        </>
      )}

      {/* Initial State */}
      {!hasQuery && (
        <div className="text-center py-12 lg:py-16">
          <SearchIcon className="w-12 lg:w-16 h-12 lg:h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-base lg:text-lg">Search for your favorite movies and TV shows</p>
        </div>
      )}
      </div>
      <DisclaimerFooter />
    </div>
  );
};

export default Search;
