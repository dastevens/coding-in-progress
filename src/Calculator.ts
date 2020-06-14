import Item from './Item';

export function totalCoding(items: Item[], start: number, end: number, startAfter: number = 0) {
    start = start - startAfter;
    let codingHistory = [{event:'Stop', timestamp: end}].concat(items);
    let totalCoding = 0;
    for (let i = 1; i < codingHistory.length; i++) {
        let item = codingHistory[i - 1];
        let last = codingHistory[i];
        let from = Math.min(end, Math.max(start, last.timestamp));
        let to = Math.min(end, Math.max(start, item.timestamp));
        let duration = to - from;
        if (last.event === 'Start' && duration >= startAfter) {
            totalCoding += duration - startAfter;
        }
    }
    return totalCoding;
}

export function today(): number {
    let midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    return midnight.getTime();
}

export function addDays(now: number, days: number): number {
    return now + days * 24 * 60 * 60 * 1000;
}

export function forDay(items: Item[], now: number, startAfter: number = 0): number {
    let midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return totalCoding(items, midnight.getTime(), now, startAfter);
}
