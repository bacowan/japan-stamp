import TranslatableText from "./translatable-text"

export default interface Dictionary {
    "common": {
        "loading": TranslatableText,
        "en-US": TranslatableText,
        "jp": TranslatableText
    },
    "navbar": {
        "log-out": TranslatableText,
        "log-in": TranslatableText,
        "map": TranslatableText,
        "list": TranslatableText,
        "add-stamp": TranslatableText,
        "about": TranslatableText
    },
    "footer": {
        "about": TranslatableText,
        "privacy-policy": TranslatableText,
        "github": TranslatableText,
        "privacy-preferences": TranslatableText
    },
    "stamp-list": {
        "near-you-header": TranslatableText,
        "sort-by": TranslatableText,
        "date-added-sort": TranslatableText,
        "nearby-sort": TranslatableText
    },
    "stamp-page": {
        "stamp-preview": TranslatableText,
        "map": TranslatableText,
        "details": TranslatableText
    },
    "privacy-preferences": {
        "title": TranslatableText,
        "intro": TranslatableText,
        "required-storage": TranslatableText,
        "required-storage-body": TranslatableText,
        "required-storage-list-1": TranslatableText,
        "location-data": TranslatableText,
        "location-data-body": TranslatableText,
        "opt-in": TranslatableText,
        "allow-all": TranslatableText,
        "allow-nessisary-only": TranslatableText,
        "confirm": TranslatableText
    }
}