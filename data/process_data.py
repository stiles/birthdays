#!/usr/bin/env python3
"""
Process raw birth data into aggregated daily averages with rankings.

Combines CDC (1994-2003) and SSA (2000-2014) data, taking:
- CDC data for 1994-1999 (exclusive to CDC)
- SSA data for 2000-2014 (more complete for recent years)

Output: JSON file with daily birth averages ranked 1-366.
"""

import json
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

RAW_DIR = Path(__file__).parent / "raw"
OUTPUT_FILE = Path(__file__).parent.parent / "src" / "lib" / "data" / "birthdays.json"


def ordinal(n: int) -> str:
    """Return ordinal string for a number (1st, 2nd, 3rd, etc.)."""
    if 11 <= (n % 100) <= 13:
        suffix = "th"
    else:
        suffix = {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suffix}"


def estimate_conception_date(month: int, day: int) -> str:
    """
    Estimate conception date (approximately 266 days before birth).
    Returns formatted string like "12/17".
    """
    # Use a non-leap year for calculation
    try:
        birth = date(2001, month, day)
    except ValueError:
        # Feb 29
        birth = date(2000, month, day)

    conception = birth - timedelta(days=266)
    return f"{conception.month}/{conception.day}"


def load_and_combine_data() -> pd.DataFrame:
    """Load both data sources and combine them intelligently."""
    cdc_file = RAW_DIR / "US_births_1994-2003_CDC_NCHS.csv"
    ssa_file = RAW_DIR / "US_births_2000-2014_SSA.csv"

    if not cdc_file.exists() or not ssa_file.exists():
        raise FileNotFoundError(
            "Raw data files not found. Run fetch_data.py first."
        )

    cdc = pd.read_csv(cdc_file)
    ssa = pd.read_csv(ssa_file)

    # Use CDC for 1994-1999, SSA for 2000-2014
    cdc_subset = cdc[cdc["year"] < 2000]
    ssa_subset = ssa[ssa["year"] >= 2000]

    combined = pd.concat([cdc_subset, ssa_subset], ignore_index=True)
    print(f"Combined data: {len(combined)} records")
    print(f"  CDC 1994-1999: {len(cdc_subset)} records")
    print(f"  SSA 2000-2014: {len(ssa_subset)} records")
    print(f"  Year range: {combined['year'].min()}-{combined['year'].max()}")

    return combined


def aggregate_by_day(df: pd.DataFrame) -> pd.DataFrame:
    """Calculate average births per calendar day."""
    daily = df.groupby(["month", "date_of_month"]).agg(
        total_births=("births", "sum"),
        year_count=("year", "nunique"),
    ).reset_index()

    daily["avg_births"] = (daily["total_births"] / daily["year_count"]).round(0).astype(int)
    daily = daily.rename(columns={"date_of_month": "day"})

    return daily[["month", "day", "avg_births"]]


def add_rankings(df: pd.DataFrame) -> pd.DataFrame:
    """Add rank column (1 = most births, 366 = fewest)."""
    df = df.copy()
    df["rank"] = df["avg_births"].rank(method="min", ascending=False).astype(int)
    df = df.sort_values("rank")
    return df


def format_output(df: pd.DataFrame) -> list[dict]:
    """Format data for JSON output."""
    month_names = [
        "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    records = []
    for _, row in df.iterrows():
        month = int(row["month"])
        day = int(row["day"])
        avg = int(row["avg_births"])
        rank = int(row["rank"])

        records.append({
            "month": month,
            "day": day,
            "monthLabel": month_names[month],
            "value": avg,
            "rank": rank,
            "rankLabel": ordinal(rank),
            "birthdate": f"{month}/{day}",
            "conceptionDate": estimate_conception_date(month, day),
        })

    # Sort by month then day for consistent output
    records.sort(key=lambda x: (x["month"], x["day"]))
    return records


def main() -> None:
    """Process raw data and output JSON."""
    print("Loading raw data...")
    combined = load_and_combine_data()

    print("\nAggregating by calendar day...")
    daily = aggregate_by_day(combined)
    print(f"  {len(daily)} unique days")

    print("\nAdding rankings...")
    ranked = add_rankings(daily)

    print("\nFormatting output...")
    records = format_output(ranked)

    # Ensure output directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w") as f:
        json.dump(records, f, indent=2)

    print(f"\nSaved to {OUTPUT_FILE}")
    print(f"  {len(records)} days with birth data")

    # Show some stats
    by_rank = sorted(records, key=lambda x: x["rank"])
    print("\nTop 5 most common birthdays:")
    for r in by_rank[:5]:
        print(f"  {r['rankLabel']}: {r['birthdate']} ({r['value']:,} avg births)")

    print("\nBottom 5 (least common):")
    for r in by_rank[-5:]:
        print(f"  {r['rankLabel']}: {r['birthdate']} ({r['value']:,} avg births)")


if __name__ == "__main__":
    main()

