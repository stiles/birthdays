#!/usr/bin/env python3
"""
Fetch raw birth data from FiveThirtyEight's GitHub repository.

Data sources:
- US_births_1994-2003_CDC_NCHS.csv: CDC National Center for Health Statistics
- US_births_2000-2014_SSA.csv: Social Security Administration

Source: https://github.com/fivethirtyeight/data/tree/master/births
"""

import os
import requests
from pathlib import Path

RAW_DIR = Path(__file__).parent / "raw"
BASE_URL = "https://raw.githubusercontent.com/fivethirtyeight/data/master/births"

FILES = [
    "US_births_1994-2003_CDC_NCHS.csv",
    "US_births_2000-2014_SSA.csv",
]


def fetch_file(filename: str) -> None:
    """Download a single file from FiveThirtyEight."""
    url = f"{BASE_URL}/{filename}"
    dest = RAW_DIR / filename

    print(f"Fetching {filename}...")
    response = requests.get(url, timeout=30)
    response.raise_for_status()

    dest.write_text(response.text)
    print(f"  Saved to {dest}")


def main() -> None:
    """Fetch all raw data files."""
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    for filename in FILES:
        fetch_file(filename)

    print("\nDone! Raw data saved to data/raw/")


if __name__ == "__main__":
    main()

