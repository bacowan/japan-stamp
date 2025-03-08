import { promises as fs } from 'fs';
import path from 'path';

export default async function PrivacyPolicy() {
    const text = await fs.readFile(path.join(process.cwd(), 'public', 'privacy-policy.html'), 'utf8');
    return <div className="policy" dangerouslySetInnerHTML={{ __html: text }}/>
}