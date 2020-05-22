import Item from "./Item";

export function getCodingHistory(storageKey: string): Item[] {
    let codingHistoryJson = localStorage.getItem(storageKey) || '[]';
    return JSON.parse(codingHistoryJson);
}
  
export function setCodingHistory(storageKey: string, codingHistory: Item[]) {
    localStorage.setItem(storageKey, JSON.stringify(codingHistory));
}

export function addItem(storageKey: string, event: string) {
    let codingHistory = getCodingHistory(storageKey);
    let item = {event: event, timestamp: Date.now()};
    if (codingHistory.length === 0 || codingHistory[0].event !== event) {
        let updatedHistory = [item].concat(codingHistory);
        setCodingHistory(storageKey, updatedHistory);
    }
}
