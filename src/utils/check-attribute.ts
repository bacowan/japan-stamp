function checkAttributeRecursion(obj: any, objChainName: string, ...attributeNames: string[]) {
    if (attributeNames.length < 1) {
        return;
    }
    else if (attributeNames[0] === '') {
        if (!Array.isArray(obj)) {
            throw `${objChainName} is not an array`;
        }
        else {
            for (let o in obj) {
                checkAttributeRecursion(o, objChainName + "[]", ...attributeNames.slice(1));
            }
        }
    }
    else {
        if (!(attributeNames[0] in obj)) {
            throw `missing ${objChainName + attributeNames[0]}`;
        }
        else {
            checkAttributeRecursion(obj[attributeNames[0]], objChainName + attributeNames[0], ...attributeNames.slice(1));
        }
    }
}

export default function checkAttribute(obj: any, ...attributeNames: string[]) {
    checkAttributeRecursion(obj, "", ...attributeNames);
}