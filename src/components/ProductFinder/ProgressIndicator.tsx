
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="flex items-center justify-center py-4 bg-background/50 backdrop-blur-sm border-b">
      <div className="flex items-center">
        {Array.from({ length: steps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={cn(
                  "h-0.5 w-8 md:w-16", 
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
            <div 
              className={cn(
                "step-indicator", 
                index === currentStep && "active",
                index < currentStep && "completed"
              )}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
