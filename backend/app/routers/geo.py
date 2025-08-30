from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from ..db import supabase
from ..models import ProximityQuery, RoutingRequest, ClusteringRequest
from ..utils import within_radius

router = APIRouter(prefix="/api", tags=["geo"])

@router.post("/proximity-analysis")
def proximity(payload: ProximityQuery):
    # Collect all points from assets + renewables + demand
    assets = supabase.table("infrastructure_assets").select("id,name,lat,lng,type").execute().data or []
    renew  = supabase.table("renewable_sources").select("id,name,lat,lng,source_type").execute().data or []
    demand = supabase.table("demand_centers").select("id,name,lat,lng").execute().data or []
    points = []
    for a in assets:
        points.append({"kind":"asset", **a})
    for r in renew:
        points.append({"kind":"renewable", **r})
    for d in demand:
        points.append({"kind":"demand", **d})
    result = within_radius((payload.lat, payload.lng), points, payload.radius)
    return {"center": {"lat": payload.lat, "lng": payload.lng}, "radius_km": payload.radius, "results": result}

@router.post("/routing")
def routing(req: RoutingRequest):
    # Placeholder route response; integrate real service if needed
    return {
        "route": [
            {"lat": req.start_lat, "lng": req.start_lng},
            {"lat": (req.start_lat + req.end_lat)/2, "lng": (req.start_lng + req.end_lng)/2},
            {"lat": req.end_lat, "lng": req.end_lng}
        ],
        "avoid_hazards": bool(req.avoid_hazards),
        "distance_km_estimate": None
    }

@router.post("/clustering")
def clustering(req: ClusteringRequest):
    # Placeholder; in production use scikit-learn KMeans
    return {"k": req.k, "clusters": [], "note": "Implement KMeans if needed"}

@router.post("/visualization")
def visualization(config: dict):
    return {"status": "ok", "config": config}
