from typing import List, Tuple, Dict, Any
from geopy.distance import geodesic

def within_radius(center: Tuple[float, float], points: List[Dict[str, Any]], radius_km: float):
    out = []
    for p in points:
        d = geodesic(center, (p.get("lat"), p.get("lng"))).km
        if d <= radius_km:
            q = dict(p)
            q["distance_km"] = d
            out.append(q)
    return sorted(out, key=lambda x: x["distance_km"])
