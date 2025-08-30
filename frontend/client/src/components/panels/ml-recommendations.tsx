import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMLRecommendations } from '@/hooks/use-infrastructure';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MLRecommendationsProps {
  isVisible: boolean;
  onClose: () => void;
  onViewSiteDetails: (recommendation: any) => void;
  className?: string;
}

export function MLRecommendations({ isVisible, onClose, onViewSiteDetails, className }: MLRecommendationsProps) {
  const { data: recommendations = [], isLoading } = useMLRecommendations(80); // Show recommendations with >80% match

  if (!isVisible) return null;

  const getMatchScoreBadgeVariant = (score: number) => {
    if (score >= 95) return 'default'; // primary color
    if (score >= 85) return 'secondary';
    return 'outline';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount * 1000000); // Convert from millions
  };

  return (
    <div 
      className={cn(
        "absolute top-4 left-4 w-80 p-4 bg-card/90 backdrop-blur-lg border border-border rounded-lg",
        className
      )}
      data-testid="ml-recommendations-panel"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">ML Site Recommendations</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          data-testid="button-close-ml-panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 bg-secondary rounded-md animate-pulse">
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No ML recommendations available.</p>
          <p className="text-xs text-muted-foreground mt-1">Run ML analysis to generate site recommendations.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recommendations.map((recommendation) => {
            const coords = recommendation.coordinates as { lat: number; lng: number };
            
            return (
              <div
                key={recommendation.id}
                className="p-3 bg-secondary rounded-md hover:bg-secondary/80 transition-colors cursor-pointer"
                onClick={() => onViewSiteDetails(recommendation)}
                data-testid={`recommendation-${recommendation.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {recommendation.siteName}
                  </span>
                  <Badge variant={getMatchScoreBadgeVariant(recommendation.matchScore)}>
                    {Math.round(recommendation.matchScore)}% Match
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {recommendation.reasoning}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Est. Cost: {formatCurrency(recommendation.estimatedCost)}
                  </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSiteDetails(recommendation);
                    }}
                    data-testid={`button-view-details-${recommendation.id}`}
                  >
                    View Details
                  </Button>
                </div>
                
                {/* Score breakdown */}
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Proximity:</span>
                    <span className="text-foreground">{Math.round(recommendation.proximityScore || 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Demand:</span>
                    <span className="text-foreground">{Math.round(recommendation.demandScore || 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regulatory:</span>
                    <span className="text-foreground">{Math.round(recommendation.regulatoryScore || 0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost:</span>
                    <span className="text-foreground">{Math.round(recommendation.costScore || 0)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <Button
        className="w-full mt-4"
        variant="default"
        data-testid="button-run-advanced-analysis"
      >
        Run Advanced Analysis
      </Button>
    </div>
  );
}
