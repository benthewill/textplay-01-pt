import { PocketBaseInit, PocketBaseInit as pb } from "@/lib/db/pocketbaseinit";
// import { PBUserRecord, TUserSignUpFormFields } from "./types";

export async function GetUser() {
    const pb = await PocketBaseInit()
    try {
        pb.authStore.loadFromCookie(document.cookie, 'auth')
        return pb.authStore.model;
    } catch (error) {
        throw error;
    }
}

export async function LogOutUser () {
    const pb = await PocketBaseInit()
    try {
        pb.authStore.clear()
        document.cookie = pb.authStore.exportToCookie({httpOnly: false}, "auth")
    } catch (error) {
        throw error
    }
}

export async function LogInUser(username: string, password:string) {
    const pb = await PocketBaseInit()

        const authData = await pb.collection("users").authWithPassword(username, password)
        if (pb.authStore.isValid) {
            document.cookie = pb.authStore.exportToCookie({httpOnly: false}, "auth")
            return authData
        } else {
            return "Data is invalid"
        }
}

export async function createUser(username:string, password:string, passwordConfirm:string) {
    const pb = await PocketBaseInit()
    
    try {
        await pb.collection("users").create({
            username: username,
            password: password,
            passwordConfirm: passwordConfirm
        });
        const logged_in_user = await LogInUser(username, password);
        return logged_in_user;
    } catch (error) {
        throw error;
    }
}

