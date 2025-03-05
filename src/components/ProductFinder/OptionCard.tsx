
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface OptionCardProps {
  id: string;
  text: string;
  imageUrl?: string;
  isSelected: boolean;
  onClick: () => void;
}

const OptionCard: React.FC<OptionCardProps> = ({
  id,
  text,
  imageUrl,
  isSelected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'option-card group h-full',
        isSelected && 'selected'
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={text}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fade-in">
              <span className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md animate-scale-in">
                <Check className="h-5 w-5 text-primary" />
              </span>
            </div>
          )}
        </div>
      ) : null}
      
      <div className={cn(
        "p-4 flex items-center justify-between",
        !imageUrl && "h-full"
      )}>
        <span className="font-medium">{text}</span>
        {isSelected && !imageUrl && (
          <Check className="h-5 w-5 text-primary animate-scale-in" />
        )}
      </div>
    </div>
  );
};

export default OptionCard;
