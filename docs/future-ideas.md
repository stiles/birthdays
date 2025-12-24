# Future ideas

Feature ideas and follow-up analyses collected from Reddit feedback and brainstorming.

## Quick wins

### Add probability to results
Show the probability of being born on a given day (not just rank). Math: `avg births on day / total avg births`. More intuitive for some users.

### Better famous birthdays data
Current dataset (NYT article counts) skews toward political/news figures. Look for alternatives:
- Wikipedia "born on this day" data
- Wikidata SPARQL query
- IMDb birthdays
- A dataset that balances news, entertainment, sports, culture

## Deeper analyses

### 9/11 effect
Compare Sept 11 births before/after 2001. Dataset spans 1994-2014, so we have 7 years pre and 13 years post. Hypothesis: Sept 11 went from "normal September day" to "avoided like a holiday" after 2001.

### Year-over-year trends
How has a specific birthday's popularity changed from 1994 to 2014? Are patterns shifting? This requires breaking out the raw data by year.

### Day-of-week effects
Births plummet on weekends due to scheduled C-sections and induced labor. Could visualize this pattern explicitly.

### Conception heatmap (with caveats)
Reddit asked for this. Problematic because low holiday births ≠ low conceptions; it's about delivery scheduling. But could be interesting if framed carefully with disclaimers.

## Data updates

### Extend to 2015-2024
CDC NCHS public-use natality files are available. See `docs/data-update-plan.md` for details. Would require downloading ~10GB of raw files and processing.

## UX improvements

### Shareable comparison URLs
The compare feature generates a URL with both birthdays. Could make this more prominent for social sharing.

### Embed widget
Let other sites embed a mini version of the heatmap or a "check your birthday" widget.

---

*Last updated: December 2024*
*Source: Reddit r/dataisbeautiful feedback + brainstorming*

