import { useEffect, useState } from 'react';
import { 
  getTrending, 
  getPopularMovies, 
  getTopRatedMovies, 
  getNowPlayingMovies,
  getPopularTV,
  getTopRatedTV,
  searchMulti,
  Movie 
} from '@/lib/tmdb';
import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import DisclaimerFooter from '@/components/DisclaimerFooter';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [popularTV, setPopularTV] = useState<Movie[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<Movie[]>([]);
  const [anime, setAnime] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          trendingData,
          popularMoviesData,
          topRatedMoviesData,
          nowPlayingData,
          popularTVData,
          topRatedTVData,
          animeSearches,
        ] = await Promise.all([
          getTrending('all', 'week'),
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies(),
          getPopularTV(),
          getTopRatedTV(),
          Promise.all([
            searchMulti('demon slayer'),
            searchMulti('jujutsu kaisen'),
            searchMulti('one piece anime'),
            searchMulti('attack on titan'),
          ]),
        ]);

        // Combine and dedupe anime results
        const allAnime = animeSearches.flat();
        const uniqueAnime = allAnime.filter((item, index, self) => 
          index === self.findIndex(t => t.id === item.id)
        );

        setTrending(trendingData);
        setPopularMovies(popularMoviesData.results);
        setTopRatedMovies(topRatedMoviesData.results);
        setNowPlaying(nowPlayingData.results);
        setPopularTV(popularTVData.results);
        setTopRatedTV(topRatedTVData.results);
        setAnime(uniqueAnime.slice(0, 20));
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        toast({
          title: 'Error loading content',
          description: 'Please check your TMDb API key in settings.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="pb-6">
      <HeroBanner movies={trending} />
      
      <div className="px-4 lg:px-6 space-y-2">
        <MovieRow 
          title="Trending Now" 
          movies={trending} 
          isLoading={isLoading} 
        />
        <MovieRow 
          title="Now Playing" 
          movies={nowPlaying} 
          isLoading={isLoading} 
        />
        <MovieRow 
          title="Top Rated Movies" 
          movies={topRatedMovies} 
          isLoading={isLoading} 
        />
        <MovieRow 
          title="Popular TV Shows" 
          movies={popularTV} 
          isLoading={isLoading} 
        />
        <MovieRow 
          title="Top Rated TV Shows" 
          movies={topRatedTV} 
          isLoading={isLoading} 
        />
        <MovieRow 
          title="Anime" 
          movies={anime} 
          isLoading={isLoading} 
        />
        <MovieRow 
          title="Popular Movies" 
          movies={popularMovies} 
          isLoading={isLoading} 
        />
      </div>
      <DisclaimerFooter />
    </div>
  );
};

export default Index;