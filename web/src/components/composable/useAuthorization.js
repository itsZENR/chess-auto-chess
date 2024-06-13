import {getAccessToken} from "@/api/authCookie";
import {getAuth} from "@/api";

export function useAuthorization() {

    const authorization = async () => {
        const token = getAccessToken();
        if (!token) {
            await getAuth()
        }
    }

    return {authorization}
}