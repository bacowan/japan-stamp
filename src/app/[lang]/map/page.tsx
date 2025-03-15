import MapPageRender from "./pageRender"

interface MapPageParams {
    params: Promise<{ id: string, lang: 'en-US' | 'ja' }>
}

export default async function MapPage({ params }: MapPageParams) {
    return <MapPageRender/>
}