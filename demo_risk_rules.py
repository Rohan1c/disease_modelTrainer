# demo_risk_rules.py
from risk_rules import compute_daily_risks_from_owm
from datetime import datetime, timedelta
import requests

# ----------------------------
# Interactive city input
# ----------------------------
cities_input = input("Enter city or cities (comma-separated, e.g., Lucknow,Delhi,Mumbai): ")
cities = [c.strip() for c in cities_input.split(",") if c.strip()]

if not cities:
    print("No valid city entered. Exiting.")
    exit(1)

# ----------------------------
# Interactive number of forecast days
# ----------------------------
days_input = input("Enter number of forecast days (e.g., 2): ")
try:
    forecast_days = int(days_input)
    if forecast_days < 1:
        raise ValueError
except ValueError:
    print("Invalid number of days. Using default of 2 days.")
    forecast_days = 2

# ----------------------------
# OpenWeatherMap API key (optional)
# ----------------------------
OWM_KEY = "7531e05e70ad90e7feff4c631293cc67"  # replace with your key, or leave empty to use sample data

# ----------------------------
# Sample forecast for testing (3-hourly)
# ----------------------------
sample_forecast = [
    {"dt_txt":"2025-09-04 00:00:00","main":{"temp":30,"humidity":85},"wind":{"speed":2},"rain":{"3h":0.0}},
    {"dt_txt":"2025-09-04 03:00:00","main":{"temp":31,"humidity":88},"wind":{"speed":2.5},"rain":{"3h":1.0}},
    {"dt_txt":"2025-09-04 06:00:00","main":{"temp":32,"humidity":90},"wind":{"speed":3},"rain":{"3h":0.0}},
    {"dt_txt":"2025-09-05 00:00:00","main":{"temp":29,"humidity":80},"wind":{"speed":1.5},"rain":{"3h":0.0}},
    {"dt_txt":"2025-09-05 03:00:00","main":{"temp":28,"humidity":82},"wind":{"speed":2},"rain":{"3h":0.5}},
]

# ----------------------------
# Main loop per city
# ----------------------------
today = datetime.today().date()

for city in cities:
    print(f"\n=== City: {city} ===")

    if OWM_KEY:
        # Fetch real forecast
        try:
            url = f"http://api.openweathermap.org/data/2.5/forecast?q={city}&appid={OWM_KEY}&units=metric"
            resp = requests.get(url)
            resp.raise_for_status()
            forecast_data = resp.json().get("list", [])
            if not forecast_data:
                print("No forecast data found, using sample forecast.")
                forecast_data = sample_forecast
        except Exception as e:
            print(f"Error fetching forecast for {city}: {e}")
            forecast_data = sample_forecast
    else:
        forecast_data = sample_forecast
        print("No API key provided. Using sample forecast data.")

    daily_risk = compute_daily_risks_from_owm(forecast_data)

    for day_info in daily_risk["per_day"][:forecast_days]:
        date = day_info["date"]
        risks = day_info["risks"]
        print(f"\nDate: {date}")
        for disease, v in risks.items():
            print(f"  {disease}: risk_score={v['risk_score']:.1f} | band={v['risk_band']} | daily_index={v['daily_index']:.1f} | cum_index={v['cumulative_index']:.1f}")
