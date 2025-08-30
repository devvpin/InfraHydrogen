from fastapi import APIRouter, HTTPException
from ..db import supabase
from ..models import RenewableSourceCreate

router = APIRouter(prefix="/api/renewables", tags=["renewables"])

TABLE = "renewable_sources"

@router.get("")
def list_sources():
    res = supabase.table(TABLE).select("*").execute()
    return res.data or []

@router.post("", status_code=201)
def create_source(payload: RenewableSourceCreate):
    res = supabase.table(TABLE).insert(payload.dict()).execute()
    return {"inserted": len(res.data or [])}
