import { Url } from "next/dist/shared/lib/router/router";

export type TranslatableTextItem = Readonly<
    string |
    { type: "text", value: string } |
    { type: "link", value: string, href: Url }>;

type TranslatableText = Readonly<TranslatableTextItem | TranslatableTextItem[]>;

export default TranslatableText;