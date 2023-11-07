"use client"
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Card, CardBody, CardHeader, CardFooter, Divider, Input} from '@nextui-org/react'
import { getAllShots, getShot } from '@/lib/db/shots'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import { PocketBaseInit } from '@/lib/db/pocketbaseinit'
import { useForm, FieldValues } from 'react-hook-form'
import { ShotSub } from '@/components/shot/ShotSub'

export default function GetShot({params} : { params: {id:string}}) {
    const queryClient = useQueryClient()
    console.log(params.id);
    
    // const {data, isLoading, isError} =  useQuery({ queryFn: () => getShot(params.id), queryKey: ["shot", params.id]})
    // const methods = useForm({
    //     mode: "onBlur",
    //     defaultValues: {
    //         shotName: data?.shotName,
    //         shotDetail: data?.shotDetail
    //     }
    // })

    // console.log(data);
    // const {handleSubmit, register} = methods
    
    // async function updateField(update: FieldValues) {
    //     const pb = await PocketBaseInit()
    //     console.log(update);

    //     const record = await pb.collection('shots').update(params.id, update);
    //     console.log("Updated --> " + JSON.stringify(record));

    //     // return record
    // }

    // if (isLoading) {
    //     return (
    //         <p className='text-xl font-bold tracking-tight'>
    //             Loading...
    //         </p>
    //     )
    // }

    // if (isError) {
    //     return (
    //         <p className='text-xl font-bold tracking-tight'>
    //             Error...
    //         </p>
    //     )
    // }

    return (
        <div className='flex flex-col w-3/4 content-start'>
            <ShotSub shotID={params.id}/>
            {/* <Card className=' content-center' radius='none'>
                <CardHeader>
                    <form onBlur={handleSubmit(updateField)}>
                        <Input
                            radius='none'
                            variant='bordered'
                            defaultValue={data?.shotName}
                            {...register("shotName")}
                        />
                        <Input
                            radius='none'
                            variant='bordered'
                            defaultValue={data?.shotDetail}
                            {...register("shotDetail")}
                        />
                    </form>
                        <p className='text-2xl font-bold'>
                            {data?.shotName}
                        </p>
                </CardHeader>
                <Divider/>
                <CardBody>
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

                </CardBody>
            </Card> */}
        </div>
    )
}