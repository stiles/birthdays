# Plan: Update birth data to include 2015-2024

## Overview

The current dataset covers 1994-2014. This plan outlines how to extend it through 2024 using CDC NCHS public-use natality files.

## Data source

**CDC NCHS Vital Statistics Online Data Portal**  
https://www.cdc.gov/nchs/data_access/vitalstatsonline.htm

Public-use birth data files are available for each year. Files contain individual birth records with date fields.

## Files needed

Download natality files for 2015-2023 (2024 may still be provisional):
- `Nat2015us.zip` through `Nat2023us.zip`
- Each file is ~500MB-1GB compressed
- Contains ~3.6-4 million birth records per year

## File format

Fixed-width text files. Key fields from the documentation:
- **DOB_MM** (positions vary by year): Month of birth (1-12)
- **DOB_WK** or similar: Day of week
- **Birth date** fields vary by revision year

Check the User's Guide PDF for each year to find exact field positions.

## Processing approach

```python
# Pseudocode for processing

import pandas as pd
from collections import defaultdict

# Field positions change by year - check documentation
FIELD_SPECS = {
    2015: {'month': (13, 14), 'day': (23, 24)},  # Example - verify!
    # ... etc
}

def process_year(year):
    """Count births by month/day for a single year."""
    counts = defaultdict(int)
    
    with open(f'Nat{year}us.txt', 'r') as f:
        for line in f:
            month = int(line[FIELD_SPECS[year]['month'][0]:FIELD_SPECS[year]['month'][1]])
            day = int(line[FIELD_SPECS[year]['day'][0]:FIELD_SPECS[year]['day'][1]])
            counts[(month, day)] += 1
    
    return counts

# Process all years, aggregate, compute averages
```

## Integration steps

1. Download files (manual, due to size)
2. Create `data/fetch_cdc_births.py` script
3. Process each year, output intermediate CSVs
4. Aggregate across years, compute daily averages
5. Merge with existing 1994-2014 data or replace entirely
6. Update `data/process_data.py` to handle new date range
7. Regenerate `src/lib/data/birthdays.json`
8. Update UI copy to reflect new date range

## Considerations

- **Storage**: Raw files are large (~10GB total). Don't commit to repo.
- **Processing time**: Expect 5-10 minutes per year file
- **Date range**: Could either:
  - Extend to 1994-2023 (30 years)
  - Or use only 2000-2023 for consistency with SSA overlap
- **Leap year**: Feb 29 needs special handling (fewer data points)

## Estimated effort

- 2-3 hours for script development and testing
- 1-2 hours for downloading files (bandwidth dependent)
- 30 min for integration and testing

## Resources

- Birth data files: https://www.cdc.gov/nchs/data_access/vitalstatsonline.htm
- User guides (field layouts): Same page, PDF downloads
- Original FiveThirtyEight analysis: https://github.com/fivethirtyeight/data/tree/master/births

## Priority

Low - current data tells the same story. Patterns are stable over decades.

