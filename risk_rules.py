# risk_rules.py
"""
Weather-only disease/pest risk rules using OpenWeather fields.
Inputs assumed from OWM 5-day/3-hour forecast:
  item["main"]["temp"]        # °C
  item["main"]["humidity"]    # % RH
  item.get("rain", {}).get("3h", 0.0)  # mm over 3h
  item["wind"]["speed"]       # m/s
  item["dt_txt"]              # "YYYY-MM-DD HH:MM:SS" (local for city)

Returns per-day:
  - raw daily indices per disease
  - cumulative indices across forecast window
  - normalized 0–100 risk_score per disease
  - categorical bands: low/medium/high (thresholds noted)
"""

from __future__ import annotations
from typing import Dict, List, Any, Tuple
from collections import defaultdict
import math

# ---------------------------
# Helpers
# ---------------------------

def _hours_per_bucket(_: Dict[str, Any]) -> float:
    """OWM 'forecast' data are 3-hourly; weight = 3 hours per bucket."""
    return 3.0

def _safe_get(d, path, default=None):
    cur = d
    for key in path:
        if isinstance(cur, dict) and key in cur:
            cur = cur[key]
        else:
            return default
    return cur

def _group_by_day(forecast_list: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    by_day = defaultdict(list)
    for item in forecast_list:
        dt_txt = _safe_get(item, ["dt_txt"], None)
        if not dt_txt:
            # Some clients might pass already-grouped rows with 'date'
            dt_txt = _safe_get(item, ["date"], None)
        day = dt_txt.split(" ")[0] if dt_txt and " " in dt_txt else dt_txt
        if day:
            by_day[day].append(item)
    return dict(sorted(by_day.items()))

def _minmax_scale(vals: List[float]) -> List[float]:
    finite = [v for v in vals if math.isfinite(v)]
    if not finite:
        return [0.0]*len(vals)
    vmin, vmax = min(finite), max(finite)
    if abs(vmax - vmin) < 1e-9:
        return [0.0]*len(vals)
    return [ (v - vmin)/(vmax - vmin)*100.0 for v in vals ]

# ---------------------------
# Disease/Pest indices
# ---------------------------

# 1) LATE BLIGHT (Phytophthora infestans) — DSV logic
#    Blight-favorable hours: 18–24 °C AND RH >= 90%.
#    Map daily favorable hours → DSV points (0..4), then accumulate across days.
def _daily_late_blight_dsv(day_rows: List[Dict[str, Any]]) -> int:
    hours = 0.0
    for r in day_rows:
        t = float(_safe_get(r, ["main","temp"], float("nan")))
        rh = float(_safe_get(r, ["main","humidity"], float("nan")))
        if math.isnan(t) or math.isnan(rh):
            continue
        if 18.0 <= t <= 24.0 and rh >= 90.0:
            hours += _hours_per_bucket(r)  # 3 hours per bucket
    # DSV mapping (per Penn State/Wisconsin style bins)
    if hours >= 16: return 4
    if hours >= 12: return 3
    if hours >=  8: return 2
    if hours >=  4: return 1
    return 0

# 2) EARLY BLIGHT (Alternaria solani) — P-day (thermal response proxy)
#    Hourly triangular response: 0 outside 10–35 °C, peak at 27 °C.
def _pday_hour_response(temp_c: float) -> float:
    if temp_c < 10.0 or temp_c > 35.0:
        return 0.0
    if temp_c <= 27.0:
        return (temp_c - 10.0) / (27.0 - 10.0)  # 0..1 rising
    return (35.0 - temp_c) / (35.0 - 27.0)      # 1..0 falling

def _daily_early_blight_pdays(day_rows: List[Dict[str, Any]]) -> float:
    units = 0.0
    for r in day_rows:
        t = float(_safe_get(r, ["main","temp"], float("nan")))
        if math.isnan(t):
            continue
        resp = _pday_hour_response(t)
        units += resp * _hours_per_bucket(r)
    return units

# 3) BACTERIAL diseases (leaf-wetness proxy)
#    Wet hours: RH >= 90% OR rain > 0 → map to 0..3 daily points, accumulate.
def _daily_bacteria_points(day_rows: List[Dict[str, Any]]) -> int:
    wet = 0.0
    for r in day_rows:
        rh = float(_safe_get(r, ["main","humidity"], float("nan")))
        rain = float(_safe_get(r, ["rain","3h"], 0.0) or 0.0)
        if (not math.isnan(rh) and rh >= 90.0) or rain > 0.0:
            wet += _hours_per_bucket(r)
    if wet >= 16: return 3
    if wet >= 12: return 2
    if wet >=  8: return 1
    return 0

# 4) VIRUS pressure (vector/aphid activity proxy)
#    Warmer temps (15–30 °C) & gentle wind (1–5 m/s) favor aphid flight;
#    heavy rain suppresses. Heuristic but weather-only.
def _temp_vector_factor(t: float) -> float:
    # triangular 15..25..30 °C (0→1→0)
    if t < 15.0 or t > 30.0: return 0.0
    if t <= 25.0: return (t - 15.0) / (25.0 - 15.0)
    return (30.0 - t) / (30.0 - 25.0)

def _wind_vector_factor(w: float) -> float:
    # 0 at <0.5 or >8 m/s; peak near 3 m/s, decent 1–5 m/s (normalize 0..1)
    if w < 0.5 or w > 8.0: return 0.0
    # simple bell-ish: peak ~3 m/s
    peak = 3.0
    return max(0.0, 1.0 - abs(w - peak)/ (peak))  # crude triangular

def _rain_suppress_factor(rain_mm: float) -> float:
    # light drizzle ok, heavy rain suppresses flight
    if rain_mm >= 2.0: return 0.5
    return 1.0

def _daily_virus_vector_index(day_rows: List[Dict[str, Any]]) -> float:
    score = 0.0
    for r in day_rows:
        t = float(_safe_get(r, ["main","temp"], float("nan")))
        w = float(_safe_get(r, ["wind","speed"], float("nan")))
        rain = float(_safe_get(r, ["rain","3h"], 0.0) or 0.0)
        if math.isnan(t) or math.isnan(w):
            continue
        s = _temp_vector_factor(t) * _wind_vector_factor(w) * _rain_suppress_factor(rain)
        score += s * _hours_per_bucket(r)
    return score

# 5) PESTS (e.g., insects) — GDD (base 12 °C) + rain boost
def _daily_pest_index(day_rows: List[Dict[str, Any]]) -> float:
    # Use time-weighted mean temp (approximate daily)
    total_h, sum_t = 0.0, 0.0
    rain_sum = 0.0
    for r in day_rows:
        hrs = _hours_per_bucket(r)
        t = float(_safe_get(r, ["main","temp"], float("nan")))
        if math.isnan(t): 
            continue
        sum_t += t * hrs
        total_h += hrs
        rain_sum += float(_safe_get(r, ["rain","3h"], 0.0) or 0.0)
    if total_h == 0.0:
        return 0.0
    avg_t = sum_t / total_h
    gdd = max(0.0, avg_t - 12.0)  # base 12 °C
    return gdd + (1.0 if rain_sum >= 5.0 else 0.0)

# ---------------------------
# Orchestrator over forecast days
# ---------------------------

DEFAULT_DISEASES = ["Late blight", "Early blight", "Bacteria", "Virus", "Pests"]

def compute_daily_risks_from_owm(
    owm_forecast_list: List[Dict[str, Any]],
    diseases: List[str] = None
) -> Dict[str, Any]:
    """
    Input: list of 3h OWM forecast items. Output risk per day per disease.
    - No ML labels required here; you can filter later using your image model result.
    """
    diseases = diseases or DEFAULT_DISEASES
    by_day = _group_by_day(owm_forecast_list)

    days = list(by_day.keys())
    # raw daily indices
    raw = {disease: [] for disease in diseases}

    for day in days:
        rows = by_day[day]
        if "Late blight" in diseases:
            raw["Late blight"].append(_daily_late_blight_dsv(rows))
        if "Early blight" in diseases:
            raw["Early blight"].append(_daily_early_blight_pdays(rows))
        if "Bacteria" in diseases:
            raw["Bacteria"].append(_daily_bacteria_points(rows))
        if "Virus" in diseases:
            raw["Virus"].append(_daily_virus_vector_index(rows))
        if "Pests" in diseases:
            raw["Pests"].append(_daily_pest_index(rows))

    # cumulative per disease across forecast window
    cum = {}
    for dis in diseases:
        s = 0.0
        cum_vals = []
        for v in raw[dis]:
            s += float(v)
            cum_vals.append(s)
        cum[dis] = cum_vals

    # normalized 0–100 risk per disease across the window
    risk = {dis: _minmax_scale(cum[dis]) for dis in diseases}

    # category bands (transparent defaults; tune regionally)
    bands = {}
    for dis in diseases:
        bands[dis] = []
        for i, r in enumerate(risk[dis]):
            if r < 33: band = "low"
            elif r < 66: band = "medium"
            else: band = "high"
            bands[dis].append(band)

    # pack day-wise results
    out = []
    for i, day in enumerate(days):
        per_dis = {}
        for dis in diseases:
            per_dis[dis] = {
                "daily_index": raw[dis][i],
                "cumulative_index": cum[dis][i],
                "risk_score": risk[dis][i],      # 0..100
                "risk_band": bands[dis][i]
            }
        out.append({"date": day, "risks": per_dis})

    return {
        "days": days,
        "per_day": out,
        "diseases": diseases,
        "explain": {
            "late_blight_rule": "DSV from hours with 18–24°C & RH≥90% mapped to 0..4/day, accumulated",
            "early_blight_rule": "P-days from triangular temp response 10–35°C (peak 27°C), accumulated",
            "bacteria_rule": "Wet hours (RH≥90% or rain>0) mapped to 0..3/day, accumulated",
            "virus_rule": "Vector flight proxy from temp(15–30°C)×wind(1–5 m/s peak ~3)×rain suppression",
            "pests_rule": "GDD base 12°C from daily mean temp +1 if rain ≥5 mm, accumulated",
            "normalization": "Per-disease cumulative series min-max scaled to 0..100 over the forecast window",
        }
    }
