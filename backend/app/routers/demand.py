from fastapi import APIRouter
from ..db import supabase
from ..models import DemandCenterCreate

router = APIRouter(prefix="/api/demand-centers", tags=["demand"])

TABLE = "demand_centers"

@router.get("")
def list_centers():
    return (supabase.table(TABLE).select("*").execute().data) or []

@router.post("", status_code=201)
def create_center(payload: DemandCenterCreate):
    res = supabase.table(TABLE).insert(payload.dict()).execute()
    return {"inserted": len(res.data or [])}
