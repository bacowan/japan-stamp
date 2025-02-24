export default interface Stamp {
    _id: string,
    name: string,
    description: string,
    location: [number, number],
    image_url: string,
    image_alt: string
}