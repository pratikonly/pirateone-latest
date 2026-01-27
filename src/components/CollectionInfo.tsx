import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import { getCollectionDetails, getImageUrl, CollectionDetails, Movie } from '@/lib/tmdb';

interface CollectionInfoProps {
  collectionId: number;
  currentMovieId: number;
}

const CollectionInfo = ({ collectionId, currentMovieId }: CollectionInfoProps) => {
  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const data = await getCollectionDetails(collectionId);
        data.parts.sort((a, b) => {
          const dateA = a.release_date || '';
          const dateB = b.release_date || '';
          return dateA.localeCompare(dateB);
        });
        setCollection(data);
      } catch (error) {
        console.error('Failed to fetch collection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  if (isLoading) {
    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 border border-border/50 animate-pulse">
        <div className="h-6 w-48 bg-muted rounded mb-4" />
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-36 bg-muted rounded-lg flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  if (!collection || collection.parts.length <= 1) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm rounded-lg p-4 border border-border overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <Film className="w-4 h-4 text-primary flex-shrink-0" />
        <h3 className="font-display text-sm truncate">
          Part of <span className="text-primary">{collection.name}</span>
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {collection.parts.map((movie: Movie) => {
          const isCurrentMovie = movie.id === currentMovieId;
          const posterUrl = getImageUrl(movie.poster_path, 'w200');

          return (
            <button
              key={movie.id}
              onClick={() => !isCurrentMovie && navigate(`/watch/movie/${movie.id}`)}
              disabled={isCurrentMovie}
              className={`flex-shrink-0 group transition-all ${
                isCurrentMovie ? 'cursor-default' : 'hover:scale-105'
              }`}
            >
              <div className={`relative w-full rounded overflow-hidden border-2 ${
                isCurrentMovie ? 'border-primary ring-1 ring-primary/30' : 'border-transparent hover:border-primary/50'
              }`}>
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title || 'Movie poster'}
                    className="w-full aspect-[2/3] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-muted flex items-center justify-center">
                    <Film className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                {isCurrentMovie && (
                  <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                    <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                      Playing
                    </span>
                  </div>
                )}
              </div>
              <p className={`mt-1 text-[10px] font-medium truncate text-center ${
                isCurrentMovie ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {movie.title}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionInfo;