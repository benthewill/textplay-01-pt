"use client";

import { PocketBaseInit} from '@/lib/db/pocketbaseinit';
import PocketBase from 'pocketbase'
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { GetUser, LogOutUser } from '@/state/user';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Separator } from '../ui/separator';

export function CurrentUser() {
    const router = useRouter()
    const [useIsClient, setIsClient] = useState(false)
    const [useModel, setModel] = useState("")

    async function getUserModel ()  {
        const userModel = await GetUser()
        const username = userModel?.username
        setModel(username)
    }

    useEffect(() => {
        getUserModel()
    },[useModel])

    return (
        <div className='pl-1 pt-3 pb-8' >
            {useModel
                ?
                <div className='flex flex-row items-end'>
                    <p className=" text-xl mr-10">
                        Welcome, {useModel}!
                    </p>
                    <Button size={"sm"} variant={"outline"} onClick={() => {
                        LogOutUser()
                        setModel("")
                        router.push('/')
                        }}>Log Out</Button>
                </div>
                :
                <Button>
                    <Link href="/auth/login">Log-in</Link>
                </Button>
            }
        </div>
    )
}
