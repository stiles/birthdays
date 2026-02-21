/**
 * Generate print-ready PDF graphic
 * Run with: node scripts/generate-print-graphic.js --month 9 --day 22
 *
 * Outputs to static/prints/{month}-{day}.pdf
 * Outputs a personalized news graphics format with:
 * - Personalized headline based on birthday rarity
 * - Stats about the selected date
 * - Legend
 * - Heatmap visualization with highlighted date
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import puppeteer from 'puppeteer';

// Parse CLI args: --month N --day N
const args = process.argv.slice(2);
function getArg(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? parseInt(args[i + 1], 10) : null;
}
const argMonth = getArg('month');
const argDay = getArg('day');
if (!argMonth || !argDay || isNaN(argMonth) || isNaN(argDay)) {
  console.error('Usage: node scripts/generate-print-graphic.js --month <1-12> --day <1-31>');
  process.exit(1);
}

// Load birthday data
const birthdayData = JSON.parse(
  readFileSync(new URL('../src/lib/data/birthdays.json', import.meta.url), 'utf-8')
);

// Load famous birthdays
const famousBirthdays = JSON.parse(
  readFileSync(new URL('../src/lib/data/famous-birthdays.json', import.meta.url), 'utf-8')
);

// Configuration
const config = {
  width: 960,        // 10 inches at 96 DPI (landscape)
  height: 768,       // 8 inches at 96 DPI (landscape)
  cellSize: 26,      // Optimized for 10" width
  padding: 50,
  labelOffset: 38,
  highlightDate: { month: argMonth, day: argDay }
};

// Month names for formatting
const monthNames = {
  1: 'Jan.', 2: 'Feb.', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
  7: 'July', 8: 'Aug.', 9: 'Sept.', 10: 'Oct.', 11: 'Nov.', 12: 'Dec.'
};

const monthNamesFull = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June',
  7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
};

function formatDate(month, day) {
  return `${monthNames[month]} ${day}`;
}

// Get rarity label based on rank
function getRarityInfo(rank) {
  if (rank <= 15) {
    return { label: 'quite common', color: '#49006a' };
  } else if (rank <= 50) {
    return { label: 'common', color: '#7a0177' };
  } else if (rank <= 120) {
    return { label: 'fairly common', color: '#ae017e' };
  } else if (rank <= 245) {
    return { label: 'about average', color: '#dd3497' };
  } else if (rank <= 310) {
    return { label: 'uncommon', color: '#f768a1' };
  } else if (rank <= 350) {
    return { label: 'rare', color: '#fa9fb5' };
  } else {
    return { label: 'quite rare', color: '#fcc5c0' };
  }
}

// Get famous people for a date
function getFamousPeople(month, day) {
  const key = `${month}-${day}`;
  const people = famousBirthdays[key] || [];
  return people.slice(0, 3).map(p => p.name);
}

// RdPu color scale
const colorThresholds = [9000, 10500, 10750, 11000, 11250, 11500, 11750, 12000];
const colorRange = [
  '#fff7f3', '#fde0dd', '#fcc5c0', '#fa9fb5',
  '#f768a1', '#dd3497', '#ae017e', '#7a0177', '#49006a'
];

function getColor(value) {
  for (let i = 0; i < colorThresholds.length; i++) {
    if (value < colorThresholds[i]) return colorRange[i];
  }
  return colorRange[colorRange.length - 1];
}

function getDataForDate(month, day) {
  return birthdayData.find(d => d.month === month && d.day === day);
}

// Generate heatmap SVG
function generateHeatmap() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const { cellSize, labelOffset, highlightDate } = config;
  
  const chartWidth = cellSize * 31;
  const chartHeight = cellSize * 12;
  const svgWidth = chartWidth + labelOffset + 10;
  const svgHeight = chartHeight + 30;

  let cells = '';
  let highlight = '';
  
  // Day labels
  days.forEach((day, i) => {
    cells += `<text x="${labelOffset + i * cellSize + cellSize / 2}" y="12" text-anchor="middle" class="axis-label">${day}</text>`;
  });

  // Month labels and cells
  months.forEach((month, monthIndex) => {
    // Month label
    cells += `<text x="${labelOffset - 6}" y="${20 + monthIndex * cellSize + cellSize / 2 + 4}" text-anchor="end" class="axis-label">${month}</text>`;
    
    // Day cells
    days.forEach(day => {
      const dateData = getDataForDate(monthIndex + 1, day);
      if (dateData) {
        const x = labelOffset + (day - 1) * cellSize;
        const y = 20 + monthIndex * cellSize;
        cells += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${getColor(dateData.value)}" stroke="#ffffff" stroke-width="1"/>`;
        
        // Add highlight for selected date
        if (highlightDate && highlightDate.month === monthIndex + 1 && highlightDate.day === day) {
          highlight = `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="none" stroke="#e6ff00" stroke-width="3"/>`;
        }
      }
    });
  });

  return `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
    <style>
      .axis-label { font: 11px system-ui, -apple-system, sans-serif; fill: #555; }
    </style>
    ${cells}
    ${highlight}
  </svg>`;
}

// Generate legend SVG
function generateLegend() {
  const swatchWidth = 55;
  const swatchHeight = 16;
  const totalWidth = swatchWidth * colorRange.length;
  const radius = 4;
  
  let swatches = colorRange.map((color, i) => {
    return `<rect x="${i * swatchWidth}" y="22" width="${swatchWidth}" height="${swatchHeight}" fill="${color}"/>`;
  }).join('');

  return `<svg width="${totalWidth}" height="58" viewBox="0 0 ${totalWidth} 58" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="legendClip">
        <rect x="0" y="22" width="${totalWidth}" height="${swatchHeight}" rx="${radius}" ry="${radius}"/>
      </clipPath>
    </defs>
    <style>
      .legend-label { font: 500 14px system-ui, -apple-system, sans-serif; fill: #1a1614; }
      .legend-caption { font: 12px system-ui, -apple-system, sans-serif; fill: #555; }
    </style>
    <text x="0" y="14" class="legend-label">Least common</text>
    <text x="${totalWidth}" y="14" text-anchor="end" class="legend-label">Most common</text>
    <g clip-path="url(#legendClip)">
      ${swatches}
    </g>
    <text x="${totalWidth / 2}" y="54" text-anchor="middle" class="legend-caption">Average daily U.S. births, 1994–2014</text>
  </svg>`;
}

// Generate full HTML document
function generateHTML() {
  const heatmap = generateHeatmap();
  const legend = generateLegend();
  const { highlightDate } = config;

  // Get personalized data if a date is highlighted
  let headline = 'How common is your birthday?';
  let subhead = 'This heatmap shows the relative frequency of birthdays across all 366 days of the year, based on 21 years of U.S. birth records. Darker colors indicate more births on that date.';
  let rarityColor = '#f768a1';

  if (highlightDate) {
    const dateData = getDataForDate(highlightDate.month, highlightDate.day);
    if (dateData) {
      const rarity = getRarityInfo(dateData.rank);
      const famous = getFamousPeople(highlightDate.month, highlightDate.day);
      rarityColor = rarity.color;
      
      headline = `Your birthday is <span class="rarity">${rarity.label}</span>`;
      
      const famousText = famous.length > 0 
        ? ` You share it with ${famous.length === 1 
            ? famous[0] 
            : famous.slice(0, -1).join(', ') + ' and ' + famous[famous.length - 1]}.`
        : '';
      
      subhead = `<strong>${formatDate(highlightDate.month, highlightDate.day)}</strong> ranks <strong>${dateData.rankLabel}</strong> out of 366 days, with an average of <strong>${dateData.value.toLocaleString()}</strong> births per day.${famousText} Based on U.S. birth records from 1994–2014.`;
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,700&display=swap');
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #ffffff;
      color: #1a1614;
      padding: ${config.padding}px;
      width: ${config.width}px;
    }
    
    .graphic {
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-height: ${config.height - config.padding * 2}px;
    }
    
    h1 {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 42px;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 8px;
    }
    
    .rarity {
      color: ${rarityColor};
    }
    
    .subhead {
      font-size: 17px;
      color: #555;
      line-height: 1.5;
      max-width: 720px;
    }
    
    .subhead strong {
      color: #1a1614;
    }
    
    .legend-container {
      display: flex;
      justify-content: center;
      margin: 8px 0;
    }
    
    .heatmap-container {
      display: flex;
      justify-content: center;
    }
    
    footer {
      margin-top: auto;
    }
    
    .source {
      font-size: 10px;
      color: #888;
      margin-bottom: 2px;
    }
    
    .credit {
      font-size: 10px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="graphic">
    <header>
      <h1>${headline}</h1>
      <p class="subhead">${subhead}</p>
    </header>
    
    <div class="legend-container">
      ${legend}
    </div>
    
    <div class="heatmap-container">
      ${heatmap}
    </div>
    
    <footer>
      <p class="source">Source: CDC National Center for Health Statistics, Social Security Administration</p>
      <p class="credit">Graphic: Matt Stiles / birthdayrank.com</p>
    </footer>
  </div>
</body>
</html>`;
}

async function generatePDF() {
  const { month, day } = config.highlightDate;

  if (!getDataForDate(month, day)) {
    console.error(`No data found for ${month}/${day} — skipping.`);
    process.exit(1);
  }

  mkdirSync('static/prints', { recursive: true });
  const outPath = `static/prints/${month}-${day}.pdf`;

  const html = generateHTML();

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: config.width, height: config.height });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // 10 × 8 inch PDF, vector quality
  await page.pdf({
    path: outPath,
    width: '10in',
    height: '8in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log(`Generated ${outPath}`);

  await browser.close();
}

generatePDF().catch(console.error);
