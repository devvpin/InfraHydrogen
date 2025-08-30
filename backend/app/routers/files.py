from fastapi import APIRouter, UploadFile, File
from ..db import supabase
import base64

router = APIRouter(prefix="/api/files", tags=["files"])

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()
    # Store in Supabase storage bucket named 'uploads'
    bucket = supabase.storage.from_("uploads")
    path = file.filename
    bucket.upload(path, content, {"contentType": file.content_type})
    public_url = bucket.get_public_url(path)
    return {"path": path, "url": public_url.get("publicUrl") if isinstance(public_url, dict) else public_url}
