from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class InfrastructureAssetCreate(BaseModel):
    name: str
    type: str
    region: Optional[str] = None
    lat: float
    lng: float
    capacity: Optional[float] = None
    metadata: Optional[dict] = None

class InfrastructureAsset(InfrastructureAssetCreate):
    id: str
    created_at: Optional[datetime] = None

class RenewableSourceCreate(BaseModel):
    name: str
    source_type: str
    lat: float
    lng: float
    output_mw: Optional[float] = None
    region: Optional[str] = None
    metadata: Optional[dict] = None

class RenewableSource(RenewableSourceCreate):
    id: str
    created_at: Optional[datetime] = None

class DemandCenterCreate(BaseModel):
    name: str
    lat: float
    lng: float
    demand_mw: Optional[float] = None
    region: Optional[str] = None
    metadata: Optional[dict] = None

class DemandCenter(DemandCenterCreate):
    id: str
    created_at: Optional[datetime] = None

class ProximityQuery(BaseModel):
    lat: float
    lng: float
    radius: float = Field(ge=1, le=500)

class RoutingRequest(BaseModel):
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    avoid_hazards: Optional[bool] = False

class ClusteringRequest(BaseModel):
    k: int = Field(ge=1, le=50)
    points: list[tuple[float, float]]

class VisualizationRequest(BaseModel):
    theme: Optional[str] = None
    layer: Optional[str] = None
    filters: Optional[dict] = None
