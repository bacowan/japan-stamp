import TranslatableText, { TranslatableTextItem } from "@/localization/dictionaries/translatable-text";
import Link from "next/link";

interface TranslationNodeParams {
    text: TranslatableTextItem
}

function TranslationNode({ text }: TranslationNodeParams) {
    if (typeof text === "string") {
        return <>{text}</>
    }
    else if (text.type === "text") {
        return <>{text.value}</>
    }
    else if (text.type === "link") {
        return <Link href={text.href} prefetch={false}>{text.value}</Link>
    }
}

interface TranslationParams {
    text: TranslatableText
}

export default function Translation({ text }: TranslationParams) {
    if (Array.isArray(text)) {
        return text.map((t, i) => <TranslationNode key={i} text={t}/>);
    }
    else {
        return <TranslationNode text={text as TranslatableTextItem}/>
    }
}