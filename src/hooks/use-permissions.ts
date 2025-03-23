import isPermittedCountry from "@/app/[lang]/utils/is-permitted-country";
import constants from "@/constants";
import { useEffect, useState } from "react";

export default function usePermissions(permissionKey: string) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        function updatePermission(e: CustomEvent) {
            const detail = JSON.parse(e.detail);
            setHasPermission(detail[permissionKey]);
        }

        (async function() {
            if (!await isPermittedCountry()) {
                setHasPermission(false);
                return;
            }

            const privacyPreferences = localStorage.getItem(constants.privacyPreferencesKey);
            if (privacyPreferences) {
                const json = JSON.parse(privacyPreferences);
                if (json[permissionKey] === true) {
                    setHasPermission(true);
                }
                else {
                    setHasPermission(false);
                }
            }
    
            window.addEventListener(constants.localStorageUpdatedEventName, updatePermission as EventListener);
        })();

        return () => window.removeEventListener(constants.localStorageUpdatedEventName, updatePermission as EventListener);
    }, [permissionKey]);

    return hasPermission;
}