interface LangText {
    english?: string,
    japanese?: string
}

interface Stamp {
    name: LangText,
    location: {
        coordinates: number[]
        type: "Point"
    },
    description: LangText,
    "image-path": string
}