import { promises as fs } from 'fs';

export default async function PrivacyPolicy() {
    const text = await fs.readFile(process.cwd() + '/src/app/privacy-policy/policy.html', 'utf8');
    return <div className="policy" dangerouslySetInnerHTML={{ __html: text }}/>
}