import PocketBase from 'pocketbase';

export async function PocketBaseInit() {
    const url = 'https://textplay-pt.pockethost.io/'
    const pb = await new PocketBase(url)

    return pb
}