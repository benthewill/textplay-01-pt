"use client";
import React, {useEffect, useState} from "react";
import { useForm, SubmitHandler, useFieldArray, FormProvider, useFormContext, FieldValues, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Input
} from '@nextui-org/react'
// import { Button } from "../ui/button";
import {Button, ButtonGroup} from '@nextui-org/react'
import { ScrollShadow } from "@nextui-org/react";
import { gateTypes, defaultRequirement, operatorTypes, defaultDecision, defaultNarration, defaultShot, inventoryItems, infectionItems, accessItems, ANDRequirement, reqItem, requirementCategories } from "@/lib/validations/shots";
import { InputBuild } from "./InputBuild";
import {Tabs, Tab} from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShot, getSequenceFromID, getSceneFromID, getShot, createNarration, updateNarration, updateShot, getNarrationByID } from "@/lib/db/shots";
import { Textarea } from "@nextui-org/react";
import { PocketBaseInit } from "@/lib/db/pocketbaseinit";

const prepData = {
    "collectionId": "cbb8vxutnwak9lv",
    "collectionName": "shots",
    "created": "2023-11-03 12:53:09.992Z",
    "expand": {
     "possibleNarrations": [
      {
       "collectionId": "djlszdve7vo1ntg",
       "collectionName": "narration",
       "created": "2023-11-07 05:27:26.193Z",
       "narrId": "8bubcarkaxeryt4",
       "narrationContent": "Pretty Thang",
       "requirements": [],
       "shotID": "70n5b5s0tvgj4fo",
       "updated": "2023-11-08 08:12:55.611Z"
      },
      {
       "collectionId": "djlszdve7vo1ntg",
       "collectionName": "narration",
       "created": "2023-11-08 06:39:37.790Z",
       "narrId": "02ewykupv8mhe5z",
       "narrationContent": "kamehameha",
       "requirements": [],
       "shotID": "70n5b5s0tvgj4fo",
       "updated": "2023-11-08 08:12:55.601Z"
      },
      {
       "collectionId": "djlszdve7vo1ntg",
       "collectionName": "narration",
       "created": "2023-11-08 06:41:51.232Z",
       "narrId": "afoprxas4qkhmcb",
       "narrationContent": " sadasdad",
       "requirements": [],
       "shotID": "70n5b5s0tvgj4fo",
       "updated": "2023-11-08 08:02:09.477Z"
      }
     ]
    },
    "id": "70n5b5s0tvgj4fo",
    "possibleDecisions": [],
    "possibleNarrations": [
     "8bubcarkaxeryt4",
     "02ewykupv8mhe5z",
     "afoprxas4qkhmcb"
    ],
    "sceneID": "o3kafqorvlk7qj0",
    "sequenceID": "1f8ymj4x3xacnoi",
    "shotDetail": " For reals yo this will change ",
    "shotName": "kamehameha times 10",
    "shotNum": 1,
    "updated": "2023-11-08 07:49:25.446Z"
   }
export function ShotSub2 ({shotID}:{shotID:string}) {
    const queryClient = useQueryClient()
    const {data, isLoading, isError, refetch, isRefetching, isFetching} =  useQuery({ queryFn: () => getShot(shotID), queryKey: ["shot", shotID], notifyOnChangeProps: "all"})
    const methods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: data
    })

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        control,
        reset,
        resetField,
        formState: {
            isValid
        },
        getFieldState
    } = methods

    const {
        fields:posNarrFields,
        append:posNarrAppend,
        prepend:posNarrPrepend,
        remove:posNarrRemove,
        swap:posNarrSwap,
        insert:posNarrInsert,
        move: posNarrMove,
        update: posNarrUpdate,
    } = useFieldArray({
        control,
        name: `expand.possibleNarrations`
    })

    useEffect(() => {
        data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                posNarrUpdate(index, field[key])
            })
        })
    }, [data, posNarrUpdate])

    async function Mutate (update:any) {

    }

    if (data) {
        console.log(Array.isArray(data.expand.possibleNarrations));
        return (
            <div>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(Mutate)}>
                    <Input
                        radius='none'
                        variant='underlined'
                        defaultValue={data.shotName}
                        label="Shot Name"
                        {...register("shotName")}
                    />
                    {
                        posNarrFields.map((posNarrField:any, posNarrIdx:any) => {
                            return (
                                <div key={posNarrField.id}>
                                    <Input
                                    className="hidden"
                                    defaultValue={data.expand?.possibleNarrations[posNarrIdx]?.dbID}
                                    {...register(`expand.possibleNarrations[${posNarrIdx}].dbID`)}/>
                                    <Textarea
                                        maxRows={6}
                                        minRows={6}
                                        variant="bordered"
                                        radius="none"
                                        label="Narration Content"
                                        defaultValue={data.expand?.possibleNarrations[posNarrIdx]?.narrationContent}
                                        {...register(`expand.possibleNarrations[${posNarrIdx}].narrationContent`)}
                                    />
                                    <Button onClick={() => {
                                        posNarrRemove(posNarrIdx)
                                        // const acquiredData = getValues(`expand.possibleNarrations`)
                                        // setValue(`expand.possibleNarrations`, [...acquiredData.slice(0, posNarrIdx), ...acquiredData.slice(posNarrIdx + 1)])
                                    }}>
                                        Delete
                                    </Button>
                                </div>
                            )
                        })
                    }
                </form>
            </FormProvider>
            <pre>
                {JSON.stringify(data?.expand.possibleNarrations, null, 2)}
            </pre>
            </div>
    
            
        )
    
    }

    
}