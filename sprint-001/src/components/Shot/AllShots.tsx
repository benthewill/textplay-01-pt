"use client";

import { getAllShots } from '@/lib/db/shots'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import Link from 'next/link';
import { Button } from '../ui/button';

export async function getStaticProps() {
    const shots = await getAllShots()
    return {props: {shots}}
}

export default function AllShots(props?:any) {
    const queryClient = useQueryClient()
    const {data, isError, isLoading} =  useQuery({ queryFn:getAllShots, queryKey: ["allShots"], initialData: props.shots})

    if (isLoading) {
        return (
            <p className='text-xl font-bold tracking-tight'>
                Loading...
            </p>
        )
    }

    if (isError) {
        return (
            <p className='text-xl font-bold tracking-tight'>
                Error...
            </p>
        )
    }

    return (
        <div>
            {data.map((shot:any, idx:any) => {
                return (
                    <div key={shot.id}>
                        <Link href={`/shots/${shot.id}`}>
                            <Button variant={"outline"}>
                                <p>
                                    {shot.sequenceNum} - {shot.sceneNum} - {shot.shotNum} &nbsp;
                                </p>
                                <p className=" text-lg">
                                    {shot.shotName}
                                </p>
                            </Button>
                        </Link>
                    </div>
                )
            })}
        </div>
    )
}