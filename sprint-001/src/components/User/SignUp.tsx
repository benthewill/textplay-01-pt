"use client";

import {PocketBaseInit} from '@/lib/db/pocketbaseinit'
import PocketBase from 'pocketbase'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { InputBuild } from '../shot/InputBuild'
import { Form } from '../ui/form'
import { Button } from '../ui/button'
import { Input } from '../ui/input';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setCookie } from 'cookies-next';
import { CurrentUser } from './CurrentUser';
import { LogInUser, createUser } from '@/state/user';


export function SignUp (props:any) {
    const methods = useForm(
        {
            mode: "onChange",
            defaultValues: {
                username: "",
                password: "",
                passwordConfirm: ""
            }
        }
    )
    const {register, control, handleSubmit, reset: resetForm} = methods
    const formWatch = useWatch({control})
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [useModel, setModel] = useState("")
    const [useUsername, setUsername] = useState("")
    const [useToken, setToken] = useState("")
    const router = useRouter()

    // const pb = await PocketBaseInit()
    const pb = new PocketBase('https://textplay-pt.pockethost.io/')

    async function signup({username, password, passwordConfirm}:any) {
        setLoading(true)
        try {
            await createUser(username, password, passwordConfirm)
            setLoggedIn(pb.authStore.isValid)
            router.push('/')
        } catch (e) {
            setModel("Failed to authenticate")
        }

        setLoading(false)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Create an Account
                </CardTitle>
                <CardDescription>
                    Please enter your credentials.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...methods}>
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(signup)}>
                            <div className='my-2'>
                                <InputBuild
                                    fieldName="username"
                                    inputType="text"
                                    fieldLabel="Username"
                                    fieldDescription="Please enter your username"
                                    {...control}
                                />
                            </div>
                            <div className='my-2'>
                                <InputBuild
                                    fieldName="password"
                                    inputType="password"
                                    fieldLabel="Password"
                                    fieldDescription="Please enter your password"
                                    {...control}
                                />
                            </div>
                            <div className='my-2'>
                                <InputBuild
                                    fieldName="passwordConfirm"
                                    inputType="password"
                                    fieldLabel="Password Confirm"
                                    fieldDescription="Please re-enter your password"
                                    {...control}
                                />
                            </div>
                            <div className='flex flex-row py-4'>
                                <Button type="submit" disabled={isLoading} className='mr-10'>
                                    Sign Up
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </Form>
            </CardContent>
            <CardFooter>
                <div className='flex flex-col'>
                    <pre className='mt-2'>{JSON.stringify(formWatch, null, 3)}</pre>
                    <p>{ useModel }</p>
                </div>
            </CardFooter>
        </Card>
    )
}