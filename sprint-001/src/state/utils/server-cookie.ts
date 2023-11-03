import { cookies } from "next/headers";
// import { middleware } from "@/middleware";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";

export async function getNextjsCookie(request_cookie?: RequestCookie) {
    // console.log("middleware request cookie  === ",request_cookie)
    try {
        if (request_cookie) {
            const cookie = encodeNextPBCookie(request_cookie)
            return cookie
        }
        const next_cookie = await cookies().get('pb_auth')
        const cookie = encodeNextPBCookie(next_cookie)
        return cookie
    } catch (error:any) {
        console.log("issue getting next-cookie  === ",error)
        return ""
    }
}

export function encodeCookie(cookie: { [key: string]: string }): string {
    let encodedCookie = "";
    for (const [key, value] of Object.entries(cookie)) {
        encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(value)}; `;
    }
    return encodedCookie.trimEnd();
}

export function encodeNextPBCookie(next_cookie: RequestCookie | undefined) {
    if (!next_cookie) {
    return "";
    }

    const cookie = { pb_auth: next_cookie.value };
    let encodedCookie = "";
    for (const [key, value] of Object.entries(cookie)) {
        encodedCookie += `${encodeURIComponent(key)}=${encodeURIComponent(value)}; `;
    }

    return encodedCookie.trimEnd();
}
