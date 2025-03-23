'use client'

import Modal from "./modal";
import { useEffect, useState } from "react";
import constants from "../../../constants";
import Dictionary from "@/localization/dictionaries/dictionary";
import ConsentForm from "./consent-form";

interface ConsentModalParams {
    dictionary: Dictionary["privacy-preferences"]
}

export default function ConsentModal({ dictionary }: ConsentModalParams) {
    const [shouldModalShow, setShouldModalShow] = useState(false);
    
    useEffect(() => {
        if (localStorage.getItem(constants.privacyPreferencesKey) === null) {
            setShouldModalShow(true);
        }
    }, []);

    function onSubmit() {
        setShouldModalShow(false);
    }

    return <>
        {
            shouldModalShow &&
            <Modal className="max-w-[50%] max-h-[75%] p-2 overflow-y-auto">
                <ConsentForm dictionary={dictionary} onSubmit={onSubmit}/>
            </Modal>
        }
    </>
}