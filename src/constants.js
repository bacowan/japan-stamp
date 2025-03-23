const constants = {
    privacyPreferencesKey: "privacy-preferences",
    localStorageUpdatedEventName: "local-storage-updated",
    excludedCountries: new Set([
        "AT", "BT", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE"
    ]) // all the EU countries
}

export default constants;