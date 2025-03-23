import constants from "@/constants";

export function updateLocalStorage(key: string, value: string) {
    localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent(constants.localStorageUpdatedEventName, {
        detail: value
    }))
}