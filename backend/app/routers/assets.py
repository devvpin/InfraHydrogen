from fastapi import APIRouter, HTTPException
from typing import List
from ..db import supabase
from ..models import InfrastructureAsset, InfrastructureAssetCreate

router = APIRouter(prefix="/api/assets", tags=["assets"])

TABLE = "infrastructure_assets"

@router.get("", response_model=list[dict])
def list_assets():
    res = supabase.table(TABLE).select("*").execute()
    return res.data or []

@router.get("/{asset_id}")
def get_asset(asset_id: str):
    res = supabase.table(TABLE).select("*").eq("id", asset_id).single().execute()
    if not res.data:
        raise HTTPException(404, "Asset not found")
    return res.data

@router.post("", status_code=201)
def create_asset(payload: InfrastructureAssetCreate):
    res = supabase.table(TABLE).insert(payload.dict()).execute()
    return {"inserted": len(res.data or [])}

@router.put("/{asset_id}")
def update_asset(asset_id: str, payload: InfrastructureAssetCreate):
    res = supabase.table(TABLE).update(payload.dict()).eq("id", asset_id).execute()
    return {"updated": len(res.data or [])}

@router.delete("/{asset_id}")
def delete_asset(asset_id: str):
    res = supabase.table(TABLE).delete().eq("id", asset_id).execute()
    return {"deleted": len(res.data or [])}
