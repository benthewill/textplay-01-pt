"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getAllShots, getShot } from '@/lib/db/shots'
import {useQuery, useQueryClient} from '@tanstack/react-query'

export default function GetShot({params} : { params: {id:string}}) {
    const queryClient = useQueryClient()
    const {data, isLoading, isError} =  useQuery({ queryFn: () => getShot(params.id), queryKey: ["shot", params.id]})

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
        <div className='flex flex-col w-full content-start'>
            <Card className=' content-center'>
                <CardHeader>
                    <CardTitle>
                        <p className='text-2xl font-bold'>
                            {data?.shotName}
                        </p>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {
                        data?.expand?.possibleNarrations.map((narration:any, narrIdx:any) => {
                            return (
                                <div key={narration.id}>
                                    <div dangerouslySetInnerHTML={{ __html: narration.narrationContent }}>

                                    </div>
                                </div>
                            )
                        })
                    }
                </CardContent>
            </Card>
        </div>
    )
}