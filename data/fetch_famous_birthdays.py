"""
Fetch famous birthdays from a pre-baked dataset.
Processes the data and saves notable births for all 366 days to a JSON file.
"""

import requests
import json
import os
import re

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'lib', 'data')
OUTPUT_FILE = os.path.join(OUTPUT_DIR, 'famous-birthdays.json')
RAW_DIR = os.path.join(os.path.dirname(__file__), 'raw')

# Public dataset of famous birthdays
DATA_URL = "https://raw.githubusercontent.com/richard512/Little-Big-Data/master/famous-birthdates.csv"

MAX_PEOPLE_PER_DAY = 8


def parse_line(line):
    """Parse a space-separated line with quoted fields."""
    pattern = r'"([^"]+)"|(\S+)'
    matches = re.findall(pattern, line)
    return [m[0] if m[0] else m[1] for m in matches]


def format_name(name_str):
    """Convert 'Last, First' to 'First Last'."""
    name = name_str.strip().strip('"')
    if ', ' in name:
        parts = name.split(', ', 1)
        return f"{parts[1]} {parts[0]}"
    return name


def main():
    """Fetch and process famous birthdays dataset."""
    print("Fetching famous birthdays dataset...")
    print(f"Source: {DATA_URL}")
    print()
    
    # Download raw data
    response = requests.get(DATA_URL)
    response.raise_for_status()
    lines = response.text.strip().split('\n')
    
    print(f"Downloaded {len(lines)} lines")
    
    # Data rows have: row_num, name, lastname, firstname, articleNum, birthDate, birthMonth, birthDay, zodiac
    # Position:       0        1     2         3          4           5          6           7         8
    
    valid_records = []
    for line in lines[1:]:  # Skip header
        if not line.strip():
            continue
        values = parse_line(line)
        if len(values) < 8:
            continue
        
        try:
            # Adjust for row number in first position
            name = values[1]  # "Aaron, Hank"
            article_num_str = values[4]  # articleNum
            birth_date = values[5]  # birthDate
            month = int(values[6])  # birthMonth
            day = int(values[7])  # birthDay
            
            if not (1 <= month <= 12 and 1 <= day <= 31):
                continue
            
            # Parse article count
            article_num = 0
            try:
                article_num = int(article_num_str)
            except (ValueError, TypeError):
                pass
            
            # Extract year from birthDate
            year = None
            if birth_date and len(birth_date) >= 4 and birth_date != 'NA':
                try:
                    y = int(birth_date[:4])
                    if 1000 < y < 2100:
                        year = y
                except ValueError:
                    pass
            
            valid_records.append({
                'name': format_name(name),
                'month': month,
                'day': day,
                'year': year,
                'popularity': article_num
            })
        except (ValueError, TypeError, IndexError):
            continue
    
    print(f"Parsed {len(valid_records)} people with valid dates")
    print()
    
    # Sort by popularity (articleNum = number of NYT articles, higher = more notable)
    valid_records.sort(key=lambda x: x['popularity'], reverse=True)
    
    # Group by date
    all_birthdays = {}
    total_people = 0
    
    for month in range(1, 13):
        for day in range(1, 32):
            day_people = [r for r in valid_records 
                         if r['month'] == month and r['day'] == day]
            
            if not day_people:
                continue
            
            # Take top N
            top_people = day_people[:MAX_PEOPLE_PER_DAY]
            
            people = []
            for p in top_people:
                person = {'name': p['name']}
                if p['year']:
                    person['year'] = p['year']
                people.append(person)
            
            key = f"{month}-{day}"
            all_birthdays[key] = people
            total_people += len(people)
    
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Save to JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_birthdays, f, indent=2, ensure_ascii=False)
    
    # Save raw data for archival
    os.makedirs(RAW_DIR, exist_ok=True)
    raw_file = os.path.join(RAW_DIR, 'famous-birthdates.txt')
    with open(raw_file, 'w', encoding='utf-8') as f:
        f.write(response.text)
    print(f"Archived raw data to {raw_file}")
    
    print(f"Saved {total_people} famous people across {len(all_birthdays)} days")
    print(f"Output: {OUTPUT_FILE}")
    
    # Show some examples
    print()
    print("Sample entries:")
    for key in ['1-17', '7-4', '8-4', '12-25']:
        if key in all_birthdays:
            entries = all_birthdays[key][:3]
            names = [f"{p['name']} ({p.get('year', '?')})" for p in entries]
            print(f"  {key}: {', '.join(names)}")


if __name__ == '__main__':
    main()
