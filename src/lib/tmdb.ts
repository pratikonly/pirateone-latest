const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Episode {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  still_path: string | null;
  runtime?: number;
  air_date?: string;
}

export interface SeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: Episode[];
  overview: string;
  poster_path: string | null;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  genres: { id: number; name: string }[];
  tagline?: string;
  status: string;
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  credits?: Credits;
  seasons?: { id: number; name: string; season_number: number; episode_count: number; poster_path: string | null }[];
  belongs_to_collection?: Collection | null;
}

export interface Logo {
  file_path: string;
  iso_639_1: string | null;
  width: number;
  height: number;
}

export interface ImagesResponse {
  logos: Logo[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface VideosResponse {
  results: Video[];
}

export interface TMDBReview {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  url: string;
}

export interface ReviewsResponse {
  results: TMDBReview[];
  total_results: number;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface CollectionDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// Fetch from Vercel API proxy (when deployed) or Supabase edge function (local dev)
const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const response = await fetch('/api/tmdb-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, params }),
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  return response.json();
};

export const getTrending = async (mediaType: 'movie' | 'tv' | 'all' = 'all', timeWindow: 'day' | 'week' = 'week') => {
  const data = await fetchTMDB<{ results: Movie[] }>(`/trending/${mediaType}/${timeWindow}`);
  return data.results;
};

export const getPopularMovies = async (page = 1) => {
  const data = await fetchTMDB<{ results: Movie[]; total_pages: number }>('/movie/popular', { page: String(page) });
  return { results: data.results.map(m => ({ ...m, media_type: 'movie' as const })), totalPages: data.total_pages };
};

export const getTopRatedMovies = async (page = 1) => {
  const data = await fetchTMDB<{ results: Movie[]; total_pages: number }>('/movie/top_rated', { page: String(page) });
  return { results: data.results.map(m => ({ ...m, media_type: 'movie' as const })), totalPages: data.total_pages };
};

export const getNowPlayingMovies = async (page = 1) => {
  const data = await fetchTMDB<{ results: Movie[]; total_pages: number }>('/movie/now_playing', { page: String(page) });
  return { results: data.results.map(m => ({ ...m, media_type: 'movie' as const })), totalPages: data.total_pages };
};

export const getPopularTV = async (page = 1) => {
  const data = await fetchTMDB<{ results: Movie[]; total_pages: number }>('/tv/popular', { page: String(page) });
  return { results: data.results.map(m => ({ ...m, media_type: 'tv' as const })), totalPages: data.total_pages };
};

export const getTopRatedTV = async (page = 1) => {
  const data = await fetchTMDB<{ results: Movie[]; total_pages: number }>('/tv/top_rated', { page: String(page) });
  return { results: data.results.map(m => ({ ...m, media_type: 'tv' as const })), totalPages: data.total_pages };
};

export const searchMultiPaginated = async (query: string, page = 1) => {
  const data = await fetchTMDB<{ results: Movie[]; total_pages: number }>('/search/multi', { query, page: String(page) });
  return { 
    results: data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv'),
    totalPages: data.total_pages 
  };
};

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  return fetchTMDB<MovieDetails>(`/movie/${id}`, { append_to_response: 'credits' });
};

export const getTVDetails = async (id: number): Promise<MovieDetails> => {
  return fetchTMDB<MovieDetails>(`/tv/${id}`, { append_to_response: 'credits' });
};

export const getSeasonDetails = async (tvId: number, seasonNumber: number): Promise<SeasonDetails> => {
  return fetchTMDB<SeasonDetails>(`/tv/${tvId}/season/${seasonNumber}`);
};

export const searchMulti = async (query: string) => {
  const data = await fetchTMDB<{ results: Movie[] }>('/search/multi', { query });
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
};

export const searchMovies = async (query: string) => {
  const data = await fetchTMDB<{ results: Movie[] }>('/search/movie', { query });
  return data.results.map(m => ({ ...m, media_type: 'movie' as const }));
};

export const searchTV = async (query: string) => {
  const data = await fetchTMDB<{ results: Movie[] }>('/search/tv', { query });
  return data.results.map(m => ({ ...m, media_type: 'tv' as const }));
};

export const getMovieRecommendations = async (id: number) => {
  const data = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/recommendations`);
  return data.results.map(m => ({ ...m, media_type: 'movie' as const }));
};

export const getTVRecommendations = async (id: number) => {
  const data = await fetchTMDB<{ results: Movie[] }>(`/tv/${id}/recommendations`);
  return data.results.map(m => ({ ...m, media_type: 'tv' as const }));
};

export const getSimilarMovies = async (id: number) => {
  const data = await fetchTMDB<{ results: Movie[] }>(`/movie/${id}/similar`);
  return data.results.map(m => ({ ...m, media_type: 'movie' as const }));
};

export const getSimilarTV = async (id: number) => {
  const data = await fetchTMDB<{ results: Movie[] }>(`/tv/${id}/similar`);
  return data.results.map(m => ({ ...m, media_type: 'tv' as const }));
};

export const getMovieImages = async (id: number): Promise<ImagesResponse> => {
  return fetchTMDB<ImagesResponse>(`/movie/${id}/images`, { include_image_language: 'en,null' });
};

export const getTVImages = async (id: number): Promise<ImagesResponse> => {
  return fetchTMDB<ImagesResponse>(`/tv/${id}/images`, { include_image_language: 'en,null' });
};

export const getLogoUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'original' = 'w500') => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getMovieVideos = async (id: number): Promise<VideosResponse> => {
  return fetchTMDB<VideosResponse>(`/movie/${id}/videos`);
};

export const getTVVideos = async (id: number): Promise<VideosResponse> => {
  return fetchTMDB<VideosResponse>(`/tv/${id}/videos`);
};

export const getMovieReviews = async (id: number): Promise<ReviewsResponse> => {
  return fetchTMDB<ReviewsResponse>(`/movie/${id}/reviews`);
};

export const getTVReviews = async (id: number): Promise<ReviewsResponse> => {
  return fetchTMDB<ReviewsResponse>(`/tv/${id}/reviews`);
};

export const getCollectionDetails = async (id: number): Promise<CollectionDetails> => {
  return fetchTMDB<CollectionDetails>(`/collection/${id}`);
};

export const getYouTubeEmbedUrl = (key: string) => {
  return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`;
};

export type ServerType = 'videasy' | 'server2' | 'server3';

export const getPlayerUrl = (
  id: number,
  type: 'movie' | 'tv' | 'anime',
  server: ServerType = 'videasy',
  season?: number,
  episode?: number,
  isDub: boolean = false
) => {
  const accent = 'FD105E';

  // Server 2: autoembed.cc
  if (server === 'server2') {
    if (type === 'movie') {
      return `https://player.autoembed.cc/embed/movie/${id}`;
    }
    // TV or anime
    return `https://player.autoembed.cc/embed/tv/${id}/${season || 1}/${episode || 1}`;
  }

  // Server 3: vidsrc-embed.ru (vidsrcme.ru)
  if (server === 'server3') {
    if (type === 'movie') {
      return `https://vidsrc-embed.ru/embed/movie/${id}`;
    }
    // TV or anime - format: /tv/{id}/{season}-{episode}
    return `https://vidsrc-embed.ru/embed/tv/${id}/${season || 1}-${episode || 1}`;
  }

  // Primary: Videasy
  if (type === 'movie') {
    const qs = new URLSearchParams({ overlay: 'true', color: accent });
    return `https://player.videasy.net/movie/${id}?${qs.toString()}`;
  }

  if (type === 'anime') {
    const qs = new URLSearchParams({ color: accent });
    if (isDub) qs.set('dub', 'true');
    const ep = episode ? `/${episode}` : '';
    const url = `https://player.videasy.net/anime/${id}${ep}`;
    const q = qs.toString();
    return q ? `${url}?${q}` : url;
  }

  // TV shows
  const qs = new URLSearchParams({
    overlay: 'true',
    nextEpisode: 'true',
    autoplayNextEpisode: 'true',
    episodeSelector: 'true',
    color: accent,
  });
  return `https://player.videasy.net/tv/${id}/${season || 1}/${episode || 1}?${qs.toString()}`;
};

// Keep backward compatibility
export const getVideasyUrl = (
  id: number,
  type: 'movie' | 'tv' | 'anime',
  season?: number,
  episode?: number,
  isDub: boolean = false
) => getPlayerUrl(id, type, 'videasy', season, episode, isDub);
