'use client'

import Modal from "./modal";
import { useEffect, useState } from "react";
import constants from "../../../constants";
import { updateLocalStorage } from "../utils/local-storage-utils";
import Translation from "./translation";
import Dictionary from "@/localization/dictionaries/dictionary";

interface ConsentFormParams {
    dictionary: Dictionary["privacy-preferences"]
}

export default function ConsentForm({ dictionary }: ConsentFormParams) {
    const [shouldModalShow, setShouldModalShow] = useState(false);
    const [useLocationData, setUseLocationData] = useState(false);
    
    useEffect(() => {
        if (localStorage.getItem(constants.privacyPreferencesKey) === null) {
            setShouldModalShow(true);
        }
    }, []);

    function onAllowAllClicked() {
        setUseLocationData(true);
    }

    function onAllowOnlyNessisaryClicked() {
        setUseLocationData(false);
    }

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        updateLocalStorage(constants.privacyPreferencesKey, JSON.stringify({
            use_location_data: useLocationData
        }));
        setShouldModalShow(false);
    }

    return <>
        {
            shouldModalShow &&
            <Modal className="max-w-[50%] max-h-[75%] p-2 overflow-y-auto">
                <form onSubmit={onSubmit}>
                    <h1 className="text-2xl border-b mb-1"><Translation text={dictionary["title"]}/></h1>
                    <p className="text-justify"><Translation text={dictionary["intro"]}/></p>
                    <h2 className="text-xl mt-4 mb-1"><Translation text={dictionary["required-storage"]}/></h2>
                    <p className="text-justify"><Translation text={dictionary["required-storage-body"]}/></p>
                    <ul className="list-disc">
                        <li className="ml-6"><Translation text={dictionary["required-storage-list-1"]}/></li>
                    </ul>
                    <h2 className="text-xl mt-4 mb-1"><Translation text={dictionary["location-data"]}/></h2>
                    <label><input type="checkbox" checked={useLocationData} onChange={e => setUseLocationData(e.target.checked)}/> <Translation text={dictionary["opt-in"]}/></label>
                    <p className="text-justify"><Translation text={dictionary["location-data-body"]}/></p>
                    <div className="border-t mt-4 w-full flex flex-row justify-around">
                        <button className="m-2 p-2 border rounded-sm" type="button" onClick={onAllowAllClicked}><Translation text={dictionary["allow-all"]}/></button>
                        <button className="m-2 p-2 border rounded-sm" type="button" onClick={onAllowOnlyNessisaryClicked}><Translation text={dictionary["allow-nessisary-only"]}/></button>
                        <button className="m-2 p-2 border rounded-sm" type="submit"><Translation text={dictionary["confirm"]}/></button>
                    </div>
                </form>
            </Modal>
        }
    </>
}