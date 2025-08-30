import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InteractiveMap } from '@/components/map/interactive-map';
import { Sidebar } from '@/components/panels/sidebar';
import { DataPanel } from '@/components/panels/data-panel';
import { MLRecommendations } from '@/components/panels/ml-recommendations';
import { AssetDetails } from '@/components/panels/asset-details';
import { useMap } from '@/hooks/use-map';
import { Download, Share, MapPin } from 'lucide-react';
import type { InfrastructureAsset } from '@shared/schema';

export default function Home() {
  const { currentCoordinates } = useMap();
  const [selectedAsset, setSelectedAsset] = useState<InfrastructureAsset | null>(null);
  const [showMLPanel, setShowMLPanel] = useState(false);
  const [showAssetPanel, setShowAssetPanel] = useState(false);

  const handleAssetSelect = (asset: InfrastructureAsset | null) => {
    setSelectedAsset(asset);
    setShowAssetPanel(!!asset);
  };

  const handleMLAnalysis = () => {
    setShowMLPanel(true);
  };

  const handleProximityAnalysis = () => {
    // TODO: Implement proximity analysis
    console.log('Proximity analysis triggered');
  };

  const handleDemandAnalysis = () => {
    // TODO: Implement demand analysis
    console.log('Demand analysis triggered');
  };

  const handleExportData = () => {
    // TODO: Implement data export
    console.log('Export data triggered');
  };

  const handleShareMap = () => {
    // TODO: Implement map sharing
    console.log('Share map triggered');
  };

  const handleMLRecommendationDetails = (recommendation: any) => {
    // TODO: Navigate to recommendation details or show in modal
    console.log('View recommendation details:', recommendation);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        onMLAnalysis={handleMLAnalysis}
        onProximityAnalysis={handleProximityAnalysis}
        onDemandAnalysis={handleDemandAnalysis}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Infrastructure Overview</h2>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>United States</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportData}
              data-testid="button-export"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleShareMap}
              data-testid="button-share"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="flex-1 relative">
          <InteractiveMap
            selectedAsset={selectedAsset}
            onAssetSelect={handleAssetSelect}
            className="w-full h-full"
          />
          
          {/* Map Overlays */}
          <MLRecommendations
            isVisible={showMLPanel}
            onClose={() => setShowMLPanel(false)}
            onViewSiteDetails={handleMLRecommendationDetails}
          />
          
          <AssetDetails
            asset={selectedAsset}
            onClose={() => {
              setSelectedAsset(null);
              setShowAssetPanel(false);
            }}
          />
          
          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => {/* TODO: Implement zoom in */}}
              data-testid="button-zoom-in"
            >
              +
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => {/* TODO: Implement zoom out */}}
              data-testid="button-zoom-out"
            >
              -
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => {/* TODO: Implement center map */}}
              data-testid="button-center-map"
            >
              ⊕
            </Button>
          </div>
          
          {/* Scale Bar */}
          <div className="absolute bottom-4 left-4 bg-card border border-border rounded px-3 py-2">
            <div className="flex items-center space-x-2 text-xs text-foreground">
              <div className="w-16 h-1 bg-foreground"></div>
              <span>200 km</span>
            </div>
          </div>
          
          {/* Coordinate Display */}
          <div className="absolute bottom-4 right-4 bg-card border border-border rounded px-3 py-2 text-xs text-foreground">
            <span data-testid="current-coordinates">
              {currentCoordinates.lat.toFixed(4)}° N, {Math.abs(currentCoordinates.lng).toFixed(4)}° W
            </span>
          </div>
        </div>
      </div>
      
      <DataPanel />
    </div>
  );
}
