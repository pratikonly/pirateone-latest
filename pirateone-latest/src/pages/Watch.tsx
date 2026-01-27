import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Check, Star, Calendar, Clock, Users, Film, Server } from 'lucide-react';
import { z } from 'zod';
import { getMovieDetails, getTVDetails, getSeasonDetails, getMovieImages, getTVImages, getLogoUrl, MovieDetails, SeasonDetails, getImageUrl, getBackdropUrl, ServerType } from '@/lib/tmdb';
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '@/lib/watchlist';
import { saveWatchHistory } from '@/lib/watchHistory';
import VideoPlayer from '@/components/VideoPlayer';
import RecommendedContent from '@/components/RecommendedContent';
import CollectionInfo from '@/components/CollectionInfo';
import TMDBReviews from '@/components/TMDBReviews';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSetBackdropUrl } from '@/contexts/BackdropContext';
const watchParamsSchema = z.object({
  type: z.enum(['movie', 'tv']),
  id: z.coerce.number().int().positive(),
});

const Watch = () => {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const navigate = useNavigate();
  const setBackdropUrl = useSetBackdropUrl();
  const parsed = useMemo(() => watchParamsSchema.safeParse({ type, id }), [type, id]);
  const mediaType = parsed.success ? parsed.data.type : 'movie';
  const movieId = parsed.success ? parsed.data.id : 0;

  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<ServerType>('videasy');

  useEffect(() => {
    const fetchDetails = async () => {
      if (!movieId) {
        setIsLoading(false);
        return;
      }
      try {
        const data = mediaType === 'movie' 
          ? await getMovieDetails(movieId)
          : await getTVDetails(movieId);
        setDetails(data);
        
        // Set backdrop for global background
        if (data.backdrop_path) {
          setBackdropUrl(getBackdropUrl(data.backdrop_path, 'original'));
        }
        
        // Fetch logo
        try {
          const images = mediaType === 'movie' 
            ? await getMovieImages(movieId)
            : await getTVImages(movieId);
          if (images.logos && images.logos.length > 0) {
            // Prefer English logo, fallback to first available
            const englishLogo = images.logos.find(l => l.iso_639_1 === 'en') || images.logos[0];
            setLogoUrl(getLogoUrl(englishLogo.file_path, 'w500'));
          }
        } catch (e) {
          console.error('Failed to fetch logo:', e);
        }
        setInWatchlist(isInWatchlist(movieId, mediaType));
        
        // Save to local watch history
        const title = data.title || data.name || 'Unknown';
        saveWatchHistory({
          mediaId: movieId,
          mediaType,
          mediaTitle: title,
          posterPath: data.poster_path || null,
          season: mediaType === 'tv' ? season : undefined,
          episode: mediaType === 'tv' ? episode : undefined
        });
      } catch (error) {
        console.error('Failed to fetch details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    
    // Clear backdrop when leaving the page
    return () => {
      setBackdropUrl(null);
    };
  }, [movieId, mediaType, setBackdropUrl]);

  // Fetch season details for TV shows
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (mediaType !== 'tv' || !movieId) return;
      try {
        const data = await getSeasonDetails(movieId, season);
        setSeasonDetails(data);
      } catch (error) {
        console.error('Failed to fetch season details:', error);
      }
    };

    fetchSeasonDetails();
  }, [movieId, mediaType, season]);

  const handleWatchlistToggle = () => {
    if (!details) return;
    
    if (inWatchlist) {
      removeFromWatchlist(movieId, mediaType);
      setInWatchlist(false);
    } else {
      addToWatchlist({
        id: movieId,
        title: details.title,
        name: details.name,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        overview: details.overview,
        vote_average: details.vote_average,
        release_date: details.release_date,
        first_air_date: details.first_air_date,
        media_type: mediaType,
      });
      setInWatchlist(true);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="aspect-video bg-muted rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full max-w-2xl bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Content not found</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  const title = details.title || details.name || 'Untitled';
  const year = (details.release_date || details.first_air_date)?.split('-')[0] || '';
  const rating = details.vote_average?.toFixed(1) || 'N/A';
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const seasons = details.number_of_seasons || 0;
  const backdropUrl = getBackdropUrl(details.backdrop_path, 'original');
  const posterUrl = getImageUrl(details.poster_path, 'w500');
  const cast = details.credits?.cast?.slice(0, 10) || [];
  const director = details.credits?.crew?.find(c => c.job === 'Director');

  return (
    <div className="min-h-screen">
      <div className="p-4 md:p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
            {/* Left Column - Video Player */}
            <div className="space-y-4">
              {/* Season/Episode Selector for TV - Above Player */}
              {mediaType === 'tv' && seasons > 0 && (
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Season:</span>
                      <Select value={String(season)} onValueChange={(v) => { setSeason(parseInt(v)); setEpisode(1); }}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {details.seasons?.filter(s => s.season_number > 0).map((s) => (
                            <SelectItem key={s.season_number} value={String(s.season_number)}>
                              Season {s.season_number}
                            </SelectItem>
                          )) || [...Array(seasons)].map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              Season {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {seasonDetails?.episodes?.length || 0} Episodes
                    </div>
                  </div>
                  
                  {/* Episode List */}
                  <ScrollArea className="h-32">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {seasonDetails?.episodes?.map((ep) => (
                        <button
                          key={ep.id}
                          onClick={() => setEpisode(ep.episode_number)}
                          className={cn(
                            "p-2 rounded-md text-left transition-colors text-sm",
                            episode === ep.episode_number
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          <div className="font-medium">Ep {ep.episode_number}</div>
                          <div className="text-xs truncate opacity-70">{ep.name}</div>
                        </button>
                      )) || [...Array(20)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setEpisode(i + 1)}
                          className={cn(
                            "p-2 rounded-md text-left transition-colors text-sm",
                            episode === i + 1
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          <div className="font-medium">Episode {i + 1}</div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Video Player - Centered and Reduced Size */}
              <div className="w-full max-w-4xl mx-auto">
                <VideoPlayer
                  id={movieId}
                  type={mediaType}
                  title={title}
                  season={mediaType === 'tv' ? season : undefined}
                  episode={mediaType === 'tv' ? episode : undefined}
                  server={selectedServer}
                />
              </div>

              {/* Title and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <h1 className="font-display text-2xl md:text-3xl">{title}</h1>
                <div className="flex items-center gap-2">
                  <Button
                    variant={inWatchlist ? 'default' : 'secondary'}
                    onClick={handleWatchlistToggle}
                    size="sm"
                    className={cn(inWatchlist && 'bg-primary hover:bg-primary/90')}
                  >
                    {inWatchlist ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        In Watchlist
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to List
                      </>
                    )}
                  </Button>
                  
                  {/* Server Switcher */}
                  <Select value={selectedServer} onValueChange={(v) => setSelectedServer(v as ServerType)}>
                    <SelectTrigger className="w-36">
                      <Server className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="videasy">Primary</SelectItem>
                      <SelectItem value="server2">Server 2</SelectItem>
                      <SelectItem value="server3">Server 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{rating}</span>
                </div>
                {year && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </div>
                )}
                {runtime && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{runtime}</span>
                  </div>
                )}
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium uppercase">
                  {mediaType === 'tv' ? 'TV Series' : 'Movie'}
                </span>
              </div>

              {/* Overview */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                {details.overview || 'No overview available.'}
              </p>

              {/* Collection Info - Right below description (for movies only) */}
              {mediaType === 'movie' && details.belongs_to_collection && (
                <div className="mt-4">
                  <CollectionInfo 
                    collectionId={details.belongs_to_collection.id} 
                    currentMovieId={movieId} 
                  />
                </div>
              )}
            </div>

            {/* Right Sidebar - Movie Info */}
            <div className="space-y-4">
              {/* Title Logo */}
              <div className="p-4 flex items-center justify-center min-h-[80px]">
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt={title} 
                    className="max-h-16 max-w-full object-contain animate-fade-in"
                  />
                ) : (
                  <h2 className="font-display text-xl font-bold text-foreground text-center animate-fade-in">{title}</h2>
                )}
              </div>

              {/* Poster with Info Row */}
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-3 border border-border/50">
                <div className="flex gap-3">
                  {/* Small Poster */}
                  {posterUrl && (
                    <div className="flex-shrink-0 w-20 rounded-md overflow-hidden border border-border/50">
                      <img 
                        src={posterUrl} 
                        alt={title} 
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {/* Rating and Quick Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-400/20 px-2 py-1 rounded">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                    
                    {year && (
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span>{year}</span>
                      </div>
                    )}
                    
                    {runtime && (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span>{runtime}</span>
                      </div>
                    )}

                    <span className="inline-block bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-medium uppercase">
                      {mediaType === 'tv' ? 'TV Series' : 'Movie'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 space-y-4">
                <h3 className="font-display text-lg">Details</h3>
                
                <div className="space-y-3 text-sm">
                  {details.tagline && (
                    <div>
                      <span className="text-muted-foreground">Tagline</span>
                      <p className="italic">"{details.tagline}"</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="text-muted-foreground">Release Date</span>
                    <p>{details.release_date || details.first_air_date || 'Unknown'}</p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">Status</span>
                    <p>{details.status}</p>
                  </div>

                  {mediaType === 'tv' && (
                    <>
                      <div>
                        <span className="text-muted-foreground">Seasons</span>
                        <p>{details.number_of_seasons}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Episodes</span>
                        <p>{details.number_of_episodes}</p>
                      </div>
                    </>
                  )}

                  {/* Genres */}
                  {details.genres && details.genres.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Genres</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {details.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-2 py-0.5 bg-muted rounded-full text-xs"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cast Card */}
              {cast.length > 0 && (
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="font-display text-lg">Cast</h3>
                  </div>

                  {director && (
                    <div className="mb-3 pb-3 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <Film className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Director</span>
                      </div>
                      <p className="text-sm font-medium">{director.name}</p>
                    </div>
                  )}
                  
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {cast.map((member) => (
                        <div key={member.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-muted flex-shrink-0">
                            {member.profile_path ? (
                              <img 
                                src={getImageUrl(member.profile_path, 'w200') || ''} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                                {member.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {/* Production Companies */}
              {details.production_companies && details.production_companies.length > 0 && (
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                  <h3 className="font-display text-sm mb-2 text-muted-foreground">Production</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.production_companies.slice(0, 3).map((company) => (
                      <span key={company.id} className="text-xs bg-muted px-2 py-1 rounded">
                        {company.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Content - Full Width */}
          <div className="mt-12">
            <RecommendedContent mediaId={movieId} mediaType={mediaType} />
          </div>

          {/* TMDB Community Reviews - Full Width */}
          <div className="mt-12 mb-12">
            <TMDBReviews mediaId={movieId} mediaType={mediaType} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;