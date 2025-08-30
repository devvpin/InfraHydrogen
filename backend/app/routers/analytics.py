from fastapi import APIRouter
from ..db import supabase

router = APIRouter(prefix="/api", tags=["analytics"])

@router.get("/analytics")
def analytics():
    # Minimal example metrics; customize as needed
    assets = supabase.table("infrastructure_assets").select("id").execute().data or []
    renew  = supabase.table("renewable_sources").select("id").execute().data or []
    demand = supabase.table("demand_centers").select("id").execute().data or []
    return {
        "counts": {
            "assets": len(assets),
            "renewables": len(renew),
            "demand_centers": len(demand),
        }
    }
