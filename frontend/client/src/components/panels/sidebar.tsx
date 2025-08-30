import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMap } from '@/hooks/use-map';
import { useInfrastructureAssets, useMLAnalysis } from '@/hooks/use-infrastructure';
import { Search, MapPin, Brain, BarChart3, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onMLAnalysis: () => void;
  onProximityAnalysis: () => void;
  onDemandAnalysis: () => void;
}

export function Sidebar({ onMLAnalysis, onProximityAnalysis, onDemandAnalysis }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { layerState, toggleLayer, filterState, updateFilter } = useMap();
  const { data: assets = [] } = useInfrastructureAssets();
  const mlAnalysis = useMLAnalysis();

  const layerCounts = {
    hydrogenPlants: assets.filter(a => a.type === 'hydrogen-plant').length,
    storageFacilities: assets.filter(a => a.type === 'storage-facility').length,
    pipelines: assets.filter(a => a.type === 'pipeline').length,
    distributionHubs: assets.filter(a => a.type === 'distribution-hub').length,
    renewableSources: 47, // This would come from renewable sources query
    demandCenters: 32, // This would come from demand centers query
  };

  const handleMLAnalysis = () => {
    mlAnalysis.mutate({
      criteria: {
        proximityWeight: 0.3,
        demandWeight: 0.25,
        regulatoryWeight: 0.2,
        costWeight: 0.25,
      },
      maxResults: 10,
    });
    onMLAnalysis();
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col" data-testid="sidebar">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <MapPin className="text-primary-foreground text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">H2 Infrastructure</h1>
            <p className="text-sm text-muted-foreground">Mapping Platform</p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search infrastructure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="search-input"
          />
        </div>
      </div>
      
      {/* Layer Controls */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Infrastructure Layers</h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer" data-testid="layer-hydrogen-plants">
              <Checkbox
                checked={layerState.hydrogenPlants}
                onCheckedChange={() => toggleLayer('hydrogenPlants')}
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-foreground">Hydrogen Plants</span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{layerCounts.hydrogenPlants}</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer" data-testid="layer-storage-facilities">
              <Checkbox
                checked={layerState.storageFacilities}
                onCheckedChange={() => toggleLayer('storageFacilities')}
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-foreground">Storage Facilities</span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{layerCounts.storageFacilities}</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer" data-testid="layer-pipelines">
              <Checkbox
                checked={layerState.pipelines}
                onCheckedChange={() => toggleLayer('pipelines')}
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-sm text-foreground">Pipelines</span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{layerCounts.pipelines}</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer" data-testid="layer-distribution-hubs">
              <Checkbox
                checked={layerState.distributionHubs}
                onCheckedChange={() => toggleLayer('distributionHubs')}
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                <span className="text-sm text-foreground">Distribution Hubs</span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{layerCounts.distributionHubs}</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer" data-testid="layer-renewable-sources">
              <Checkbox
                checked={layerState.renewableSources}
                onCheckedChange={() => toggleLayer('renewableSources')}
              />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                <span className="text-sm text-foreground">Renewable Sources</span>
              </div>
              <span className="ml-auto text-xs text-muted-foreground">{layerCounts.renewableSources}</span>
            </label>
          </div>
        </div>
        
        {/* Analysis Tools */}
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Analysis Tools</h3>
          
          <div className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={onProximityAnalysis}
              data-testid="button-proximity-analysis"
            >
              <Target className="mr-2 h-4 w-4" />
              Proximity Analysis
            </Button>
            
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={onDemandAnalysis}
              data-testid="button-demand-analysis"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Demand Centers
            </Button>
            
            <Button
              variant="default"
              className="w-full justify-start"
              onClick={handleMLAnalysis}
              disabled={mlAnalysis.isPending}
              data-testid="button-ml-analysis"
            >
              <Brain className="mr-2 h-4 w-4" />
              {mlAnalysis.isPending ? 'Running...' : 'ML Site Selection'}
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Filters</h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Capacity Range (MW)</label>
              <div className="flex space-x-2 mt-1">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filterState.capacityRange.min || ''}
                  onChange={(e) => updateFilter({
                    capacityRange: {
                      ...filterState.capacityRange,
                      min: e.target.value ? parseFloat(e.target.value) : null
                    }
                  })}
                  className="text-xs"
                  data-testid="input-capacity-min"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filterState.capacityRange.max || ''}
                  onChange={(e) => updateFilter({
                    capacityRange: {
                      ...filterState.capacityRange,
                      max: e.target.value ? parseFloat(e.target.value) : null
                    }
                  })}
                  className="text-xs"
                  data-testid="input-capacity-max"
                />
              </div>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground">Status</label>
              <Select
                value={filterState.status[0] || 'all'}
                onValueChange={(value) => updateFilter({
                  status: value === 'all' ? [] : [value]
                })}
              >
                <SelectTrigger className="mt-1 text-xs" data-testid="select-status">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="under-construction">Under Construction</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-muted-foreground">Region</label>
              <Select
                value={filterState.regions[0] || 'all'}
                onValueChange={(value) => updateFilter({
                  regions: value === 'all' ? [] : [value]
                })}
              >
                <SelectTrigger className="mt-1 text-xs" data-testid="select-region">
                  <SelectValue placeholder="All Regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
