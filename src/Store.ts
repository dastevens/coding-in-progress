import Item from "./Item";
import Config from "./Config";

export function getCodingHistory(): Item[] {
    let codingHistoryJson = localStorage.getItem(storageKey) || '[]';
    return JSON.parse(codingHistoryJson);
}
  
export function setCodingHistory(codingHistory: Item[]) {
    localStorage.setItem(storageKey, JSON.stringify(codingHistory));
}

export function addItem(event: string) {
    let codingHistory = getCodingHistory();
    let item = {event: event, timestamp: Date.now()};
    if (codingHistory.length === 0 || codingHistory[0].event !== event) {
        let updatedHistory = [item].concat(codingHistory);
        setCodingHistory(updatedHistory);
    }
}

const inTheZone = 15 * 60 * 1000;
const storageKey = "coding";
const workingDay = 7 * 60 * 60 * 1000;
const workingWeek = 5 * workingDay;
const defaultConfig: Config = {
    inTheZone,
    workingDay,
    workingWeek,
}

export function resetConfig(): Config {
    setConfig(defaultConfig);
    return defaultConfig;
}

export function getConfig(): Config {
    let configJson = localStorage.getItem("config") || JSON.stringify(defaultConfig);
    return JSON.parse(configJson);
}

export function setConfig(config: Config) {
    localStorage.setItem("config", JSON.stringify(config));
}