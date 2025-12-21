const monthNames: Record<number, string> = {
	1: 'Jan.',
	2: 'Feb.',
	3: 'March',
	4: 'April',
	5: 'May',
	6: 'June',
	7: 'July',
	8: 'Aug.',
	9: 'Sept.',
	10: 'Oct.',
	11: 'Nov.',
	12: 'Dec.',
};

export function formatDate(month: number, day: number): string {
	return `${monthNames[month]} ${day}`;
}

