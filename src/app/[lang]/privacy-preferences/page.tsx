import { SupportedLocale } from "@/localization/localization";
import PrivacyPreferencesRender from "./page-render";
import { getDictionary } from "@/localization/dictionaries";

interface PrivacyPreferencesParams {
    params: Promise<{ lang: SupportedLocale }>
}

export default async function PrivacyPreferences({ params }: PrivacyPreferencesParams)  {
    const resolvedParams = await params;
    const dictionary = await getDictionary(resolvedParams.lang);

    return <PrivacyPreferencesRender dictionary={dictionary["privacy-preferences"]}/>
}