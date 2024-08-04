import { getTranslations } from "@/utils/translation/translate";
import AddStampPageClient from "./page-client";

export default async function AddStampPage({ params }: { params: { lang: string } }) {
    return <AddStampPageClient
        translations={(await getTranslations(params.lang))["common"]}
        lang={params.lang}/>
}