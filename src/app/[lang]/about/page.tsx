import { promises as fs } from 'fs';
import path from 'path';

interface AboutPageParams {
    params: Promise<{ id: string, lang: 'en-US' | 'ja' }>
}

export default async function About() {
    const text = await fs.readFile(path.join(process.cwd(), 'public', 'about-en-US.html'), 'utf8');
    return <div className="about" dangerouslySetInnerHTML={{ __html: text }}/>
}