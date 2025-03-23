'use client'

import Dictionary from "@/localization/dictionaries/dictionary";
import ConsentForm from "../components/consent-form";
import { toast, ToastContainer } from "react-toastify";

interface PrivacyPreferencesRenderParams {
    dictionary: Dictionary["privacy-preferences"]
}

export default function PrivacyPreferencesRender({ dictionary }: PrivacyPreferencesRenderParams) {
    function onSubmit() {
        toast("Preferences saved");
    }

    return <div className="m-4">
        <ConsentForm dictionary={dictionary} onSubmit={onSubmit}/>
        <ToastContainer
            position="bottom-center"
            hideProgressBar={true}/>
    </div>
}