'use client'

import { useEffect, useState } from "react";
import constants from "../../../constants";
import { updateLocalStorage } from "../utils/local-storage-utils";
import Translation from "./translation";
import Dictionary from "@/localization/dictionaries/dictionary";
import { AiOutlineLoading } from "react-icons/ai";

interface PermissionsFlags {
    locationData: boolean
}

interface ConsentFormParams {
    dictionary: Dictionary["privacy-preferences"],
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
    isPermittedCountry: boolean
}

export default function ConsentForm({ dictionary, onSubmit, isPermittedCountry }: ConsentFormParams) {
    const [permissions, setPermissions] = useState<PermissionsFlags | null>(null);

    useEffect(() => {
        const privacyPreferences = localStorage.getItem(constants.privacyPreferencesKey);
        if (privacyPreferences) {
            const json = JSON.parse(privacyPreferences);
            setPermissions({
                locationData: json["use_location_data"] === true
            });
        }
    }, []);

    function setPermission(permission: keyof PermissionsFlags, value: boolean) {
        setPermissions(p => ({
            ...p,
            [permission]: isPermittedCountry && value
        }));
    }

    function onAllowAllClicked() {
        setPermissions({
            locationData: true
        });
    }

    function onAllowOnlyNessisaryClicked() {
        setPermissions({
            locationData: false
        });
    }

    function onSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (permissions !== null) {
            updateLocalStorage(constants.privacyPreferencesKey, JSON.stringify({
                use_location_data: permissions.locationData
            }));
            onSubmit(e);
        }
    }

    const greyOutClass = isPermittedCountry ? "" : "opacity-[0.5]";

    return <>
        {
            permissions === null ?
                <div className="w-full h-full flex justify-center items-center">
                    <AiOutlineLoading className="animate-spin"/>
                </div> :
                <form onSubmit={onSubmitHandler}>
                    <h1 className="text-2xl border-b mb-1"><Translation text={dictionary["title"]}/></h1>
                    <p className="text-justify"><Translation text={dictionary["intro"]}/></p>
                    <h2 className="text-xl mt-4 mb-1"><Translation text={dictionary["required-storage"]}/></h2>
                    <p className="text-justify"><Translation text={dictionary["required-storage-body"]}/></p>
                    <ul className="list-disc">
                        <li className="ml-6"><Translation text={dictionary["required-storage-list-1"]}/></li>
                    </ul>
                    <h2 className="text-xl mt-4 mb-1"><Translation text={dictionary["location-data"]}/></h2>
                    <label className={greyOutClass}><input type="checkbox" checked={permissions.locationData} onChange={e => setPermission("locationData", e.target.checked)}/> <Translation text={dictionary["opt-in"]}/></label>
                    <p className="text-justify"><Translation text={dictionary["location-data-body"]}/></p>
                    <div className="border-t mt-4 w-full flex flex-row justify-around">
                        <button className={`m-2 p-2 border rounded-sm ${greyOutClass}`} type="button" onClick={onAllowAllClicked} disabled={!isPermittedCountry}><Translation text={dictionary["allow-all"]}/></button>
                        <button className={`m-2 p-2 border rounded-sm ${greyOutClass}`} type="button" onClick={onAllowOnlyNessisaryClicked} disabled={!isPermittedCountry}><Translation text={dictionary["allow-nessisary-only"]}/></button>
                        <button className={`m-2 p-2 border rounded-sm ${greyOutClass}`} type="submit" disabled={!isPermittedCountry}><Translation text={dictionary["confirm"]}/></button>
                    </div>
                </form>
        }
    </>
}