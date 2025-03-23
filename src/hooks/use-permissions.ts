import constants from "@/constants";
import { useEffect, useState } from "react";

export default function usePermissions(permissionKey: string) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    function updatePermission(e: CustomEvent) {
        const detail = JSON.parse(e.detail);
        setHasPermission(detail[permissionKey]);
    }

    useEffect(() => {
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
        return () => window.removeEventListener(constants.localStorageUpdatedEventName, updatePermission as EventListener);
    }, [permissionKey, updatePermission]);

    return hasPermission;
}