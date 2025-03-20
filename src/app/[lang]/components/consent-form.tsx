'use client'

import { SupportedLocale } from "@/localization/localization";
import Modal from "./modal";
import { useEffect, useState } from "react";
import localizeHref from "../utils/localize-href";
import Link from "next/link";
import constants from "../../../constants";
import { updateLocalStorage } from "../utils/local-storage-utils";

interface ConsentFormParams {
    locale: SupportedLocale
}

export default function ConsentForm({ locale }: ConsentFormParams) {
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
                    <h1 className="text-2xl border-b mb-1">Privacy Preferences</h1>
                    <p className="text-justify">ekistamp.com is committed to protecting your privacy and ensuring a safe online experience. You can turn of various privacy related settings here, or at the Privacy Preferences page linked at the bottom of the screen. By using this website you also agree to our <Link href={localizeHref(locale, "/privacy-policy")} prefetch={false}>full privacy policy</Link>.</p>
                    <h2 className="text-xl mt-4 mb-1">Required Storage</h2>
                    <p className="text-justify">ekistamp.net uses local storage on your computer for the following basic functionality of the website which cannot be opted out of:</p>
                    <ul className="list-disc">
                        <li className="ml-6">Which of these settings you have opted into or out of.</li>
                    </ul>
                    <h2 className="text-xl mt-4 mb-1">Location Data</h2>
                    <label><input type="checkbox" checked={useLocationData} onChange={e => setUseLocationData(e.target.checked)}/> Opt In</label>
                    <p className="text-justify">ekistamp.net uses your location data to show you stamps which are close to your location and set default locations on maps. Your location is shared with us in order to get stamps relevant to you, but we do not store your location long term.</p>
                    <div className="border-t mt-4 w-full flex flex-row justify-around">
                        <button className="m-2 p-2 border rounded-sm" type="button" onClick={onAllowAllClicked}>Allow All</button>
                        <button className="m-2 p-2 border rounded-sm" type="button" onClick={onAllowOnlyNessisaryClicked}>Allow Nessisary Only</button>
                        <button className="m-2 p-2 border rounded-sm" type="submit">Confirm</button>
                    </div>
                </form>
            </Modal>
        }
    </>
}