import { Result } from "./Result";
import { auth } from "./firebase-init-server";


export default async function validateUser(headers: Headers): Promise<Result<string>> {
    const authHeader = headers.get("Authorization");
    if (authHeader === null) {
        return {
            type: "failure",
            message: "Authorization header is required"
        }
    }
    
    try {
        const decodedToken = await auth.verifyIdToken(authHeader);
        return {
            type: "success",
            value: decodedToken.uid
        }
    }
    catch (e) {
        return {
            type: "failure",
            message: "Failed to authenticate: " + e
        }
    }
}