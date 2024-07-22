"use client";

import { useEffect } from "react";

export default function LangMetaHandler({lang}: {lang: string}) {
    useEffect(() => {
        document.documentElement.setAttribute("lang", lang);
      }, [lang]);
    return null;
}