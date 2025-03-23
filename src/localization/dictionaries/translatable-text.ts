import { Url } from "next/dist/shared/lib/router/router";
import { JSX } from "react";

export type TranslatableTextItem = 
    string |
    { type: "text", value: string } |
    { type: "link", value: string, href: Url };

type TranslatableText = Readonly<TranslatableTextItem | TranslatableTextItem[]>;

export default TranslatableText;