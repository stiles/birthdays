# Birthday Rank

An interactive visualization showing the relative frequency of birthdays in the United States. Built with SvelteKit and D3.

**Live site:** [birthdayrank.com](https://birthdayrank.com)

## Features

- Interactive heatmap showing birth frequency by calendar day
- Select your birthday to see how it ranks (1st to 366th)
- Conversational descriptions of rarity (quite common to quite rare)
- Downloadable share images for social media
- Responsive design with light/dark mode support
- Shareable URLs via hash (e.g., `#9-9` for September 9th)

## Data source

Birth data comes from [FiveThirtyEight](https://github.com/fivethirtyeight/data/tree/master/births), combining:
- CDC National Center for Health Statistics (1994-2003)
- Social Security Administration (2000-2014)

The data pipeline uses CDC data for 1994-1999 and SSA data for 2000-2014 to calculate daily averages.

## Development

```bash
npm install
npm run dev
```

## Refreshing the data

The data processing is handled by Python scripts in the `data/` directory:

```bash
# Install Python dependencies
pip install -r requirements.txt

# Fetch raw data from FiveThirtyEight
python data/fetch_data.py

# Process and generate birthdays.json
python data/process_data.py
```

This will update `src/lib/data/birthdays.json` with the latest processed data.

## Building for production

```bash
npm run build
npm run preview
```

## Deployment

This project is configured for static hosting on Vercel.

The static adapter outputs to the `build/` directory.
