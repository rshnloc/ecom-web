import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
  showText?: boolean;
  reviewCount?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 14,
  showText = false,
  reviewCount,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < rating;
          return (
            <Star
              key={i}
              size={size}
              className={`${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : half
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          );
        })}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-slate-400 font-normal ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};
