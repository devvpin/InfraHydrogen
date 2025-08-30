# Backend (FastAPI + Supabase)

This is a conversion of the original TypeScript/Express backend to Python FastAPI using Supabase as the database.

## Quickstart

1. Create a Supabase project and **create tables**:
   - `infrastructure_assets` (id uuid default uuid_generate_v4(), name text, type text, region text, lat float8, lng float8, capacity float8, metadata jsonb, created_at timestamptz default now())
   - `renewable_sources` (id uuid, name text, source_type text, lat float8, lng float8, output_mw float8, region text, metadata jsonb, created_at timestamptz default now())
   - `demand_centers` (id uuid, name text, lat float8, lng float8, demand_mw float8, region text, metadata jsonb, created_at timestamptz default now())

   Adjust columns as needed to match your data model.

2. Create a Storage bucket named `uploads` (public) for file uploads.

3. Copy `.env.example` to `.env` and set values:
   ```env
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

4. Install dependencies and run:
   ```bash
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

## Routes

- `GET /health`
- Assets CRUD under `/api/assets`
- Renewables CRUD under `/api/renewables`
- Demand centers CRUD under `/api/demand-centers`
- Geospatial helpers:
  - `POST /api/proximity-analysis` { lat, lng, radius }
  - `POST /api/routing` { start_lat, start_lng, end_lat, end_lng }
  - `POST /api/clustering`
  - `POST /api/visualization`
- Files: `POST /api/files/upload` (stores in Supabase Storage `uploads` bucket)
- Analytics: `GET /api/analytics`

## Notes

- Advanced ML/analytics from the original server (if any) are left as TODOs here to keep the migration focused. You can extend the routers using the Supabase client (`app/db.py`).
- CORS is enabled for all origins to simplify local dev.
