import { supportedLocales } from '@/localization/localization';
import { promises as fs } from 'fs';
import path from 'path';

interface AboutPageParams {
    params: Promise<{ id: string, lang: 'en-US' | 'ja' }>
}

export default async function About({ params }: AboutPageParams) {
    const resolvedParams = await params;
    const aboutFileName = `about-${resolvedParams.lang}.html`;
    const aboutFilePath = path.join(process.cwd(), 'public', aboutFileName);

    let text: string;
    try {
        text = await fs.readFile(aboutFilePath, 'utf8');
    }
    catch {
        const defaultAboutFileName = `about-${supportedLocales[0]}.html`;
        const defaultAboutFilePath = path.join(process.cwd(), 'public', defaultAboutFileName);
        text = await fs.readFile(defaultAboutFilePath, 'utf8');
    }
    
    return <div className="about" dangerouslySetInnerHTML={{ __html: text }}/>
}