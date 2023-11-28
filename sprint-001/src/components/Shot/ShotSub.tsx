"use client";
import React, { useCallback, useEffect, useState} from "react";
import { isEqual, cloneDeep } from "lodash";
import { useForm, SubmitHandler, useFieldArray, FormProvider, useFormContext, FieldValues, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import { useEffectOnce } from 'usehooks-ts'
import { RadioGroup, Radio} from "@nextui-org/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider,
    Input,
    Select,
    SelectItem
} from '@nextui-org/react'
// import { Button } from "../ui/button";
import { Button, ButtonGroup} from '@nextui-org/react'
import { ScrollShadow } from "@nextui-org/react";
import { gateTypes, defaultRequirement, operatorTypes, defaultDecision, defaultNarration, defaultShot, inventoryItems, infectionItems, accessItems, ANDRequirement, reqItem, requirementCategories } from "@/lib/validations/shots";
import { InputBuild } from "./InputBuild";
import { Tabs, Tab } from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShot, updateShot, getSequenceFromID, getSceneFromID, getShot, createNarration, updateNarration, deleteNarration, getItems, getInfections, createDecision, deleteDecision, updateDecision } from "@/lib/db/shots";
import { Textarea } from "@nextui-org/react";
import { PocketBaseInit } from "@/lib/db/pocketbaseinit";

export function ShotSub ({shotID}:{shotID:string}) {
    // console.log(shotID);
    const queryClient = useQueryClient()
    const {data, isLoading, isError, refetch, isRefetching, isFetching} =  useQuery({
        queryFn: () => getShot(shotID), queryKey: ["shot", shotID],
        refetchOnWindowFocus: false,
        enabled: shotID !== ''
    })

    // console.log(data);

    const copiedData = {...data}

    const {data:itemsData} = useQuery({
        queryFn: () => getItems(), queryKey: ["getItems"]
    })
    const {data:infectionsData} = useQuery({
        queryFn: () => getInfections(), queryKey: ["getInfections"]
    })

    const methods = useForm({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: data
    })

    const fetchedSequenceID = data?.sequenceID
    const fetchedSceneID = data?.sceneID

    const {data:sequenceData} = useQuery({queryFn: () => getSequenceFromID(fetchedSequenceID), queryKey: ["sequence for", fetchedSequenceID], enabled: !!fetchedSequenceID})

    const {data:sceneData} = useQuery({queryFn: () => getSceneFromID(fetchedSceneID), queryKey: ["scene for", fetchedSceneID], enabled: !!fetchedSceneID})

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        control,
        reset,
        resetField,
        setValue,
        setFocus,
        formState: {
            isValid,
            isSubmitting,
            isSubmitted,
            isSubmitSuccessful
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

    const {
        fields:posDecFields,
        append:posDecAppend,
        prepend:posDecPrepend,
        remove:posDecRemove,
        swap:posDecSwap,
        insert:posDecInsert,
        move: posDecMove,
        update: posDecUpdate} = useFieldArray({
        control,
        name: `expand.possibleDecisions`
    })

    useEffect(() => {
        refetch()
    }, [refetch, shotID])

    useEffect(() => {
        data?.expand?.possibleNarrations?.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                posNarrUpdate(index, field[key])
            })
        })
        data?.expand?.possibleDecisions?.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                posDecUpdate(index, field[key])
            })
        })
    }, [data, posDecUpdate, posNarrUpdate])

    // useEffect(() => {
    //     refetch()
    //     reset(async () =>  await queryClient.getQueryData(['shot', shotID]))
    //     data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
    //         Object.keys(field).forEach((key) => {
    //             posNarrUpdate(index, field[key])
    //         })
    //     })
    // },[data?.expand?.possibleNarrations, posNarrUpdate, queryClient, refetch, reset, shotID])


    const formWatch = useWatch({
        control
    })

    const [selectedNarrTab, setSelectedNarrTab] = useState(0)
    const [selectedDecTab, setSelectedDecTab] = useState(0)
    const [selectedTab, setSelectedTab] = useState('possibleNarrations')

    const {mutate: addNarration} = useMutation({
        mutationFn: ({narrData}:any) => {
            return createNarration(narrData, shotID)},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["shot", shotID]})
        }
    })

    const {mutate:updateNarr} = useMutation({
        mutationFn: ({narrID, newData}:any) =>  {
            return updateNarration(narrID, newData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["shot", shotID]})
        }
    })

    const {mutate:deleteNarr} = useMutation({
        mutationFn: ({narrData}:any) => {
            return deleteNarration(narrData)
        }
    })

    const {mutate: addDecision} = useMutation({
        mutationFn: ({decData}:any) => {
            return createDecision(decData, shotID)},
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["shot", shotID]})
        }
    })

    const {mutate:updateDec} = useMutation({
        mutationFn: ({decID, newData}:any) =>  {
            return updateDecision(decID, newData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["shot", shotID]})
        }
    })

    const {mutate:deleteDec} = useMutation({
        mutationFn: ({decData}:any) => {
            return deleteDecision(decData)
        }
    })

    const {mutate:mutateShot} = useMutation({
        mutationFn: ({newShotData}:any) => {
            return updateShot(shotID, newShotData)
        }
    })

    // useEffect(() => {
    //     // setFocus(`expand.possibleNarrations[0].narrationContent`)
    //     // posNarrFields.forEach((item, idx) => {
    //     //     setFocus(`expand.possibleNarrations[${idx}].narrationContent`)
    //     console.log("test Effect");
    //     posNarrFields.forEach((item, idx) => {
    //         return setValue(`expand.possibleNarrations[${idx}].narrationContent`, data?.expand?.possibleNarrations[idx].narrationContent)
    //     })
    //     // })
    // },[data?.expand?.possibleNarrations, posNarrFields, setValue])

    async function repopulate() {
        console.log("Repopulate called");
        queryClient.invalidateQueries({queryKey: ["shot", shotID]})
        reset(async () =>  await queryClient.getQueryData(['shot', shotID]))
        console.log("Reset");
        data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                posNarrUpdate(index, field[key])
            })
        })
    }

    const [serverNarrToDelPush, setserverNarrToDelPush] = useState([''])
    const [serverDecToDelPush, setserverDecToDelPush] = useState([''])

    const Mutate = async (update:FieldValues) => {
        const pb = await PocketBaseInit()
        console.log(update);

        const serverNarr = data?.expand?.possibleNarrations
        const serverDec = data?.expand?.possibleDecisions

        let newNarrArr: any[] = []
        let serverNarrToDel: any[] = [...serverNarrToDelPush]
        serverNarrToDel.shift()
        let serverNarrToUpdate: any[] = []
        const narrToUpdate = update.expand.possibleNarrations

        let newDecArr: any[] = []
        let serverDecToDel: any[] = [...serverDecToDelPush]
        serverDecToDel.shift()
        let serverDecToUpdate: any[] = []
        const decToUpdate = update.expand.possibleDecisions


        narrToUpdate.map((newNarr:any, newNarridx:number) => {
            if (newNarr.dbID === "new") {
                newNarrArr.push(newNarr)
                delete newNarr.dbID
            } else {
                let stringified = JSON.parse(JSON.stringify(newNarr).replaceAll('"dbID"', '"id"'))
                serverNarrToUpdate.push(stringified)
            }
        })

        newNarrArr.forEach((n:any) => {
            addNarration({narrData: n})
        })

        serverNarrToUpdate.forEach((n:any) => {
            updateNarr({narrID: n.id, newData: n})
        })

        serverNarrToDel.forEach((n:any) => {
            let stringified = JSON.parse(JSON.stringify(n).replaceAll("dbID", "id"))
            deleteNarr({narrData: stringified})
        })
        decToUpdate.map((newDec:any, newDecidx:number) => {
            if (newDec.dbID === "new") {
                newDecArr.push(newDec)
                delete newDec.dbID
            } else {
                let stringified = JSON.parse(JSON.stringify(newDec).replaceAll('"dbID"', '"id"'))
                serverDecToUpdate.push(stringified)
            }
        })

        newDecArr.forEach((n:any) => {
            addDecision({decData: n})
        })

        serverDecToUpdate.forEach((n:any) => {
            updateDec({decID: n.id, newData: n})
        })

        serverDecToDel.forEach((n:any) => {
            let stringified = JSON.parse(JSON.stringify(n).replaceAll("dbID", "id"))
            deleteDec({decData: stringified})
        })

        // const narrID = data?.expand?.possibleNarrations[0].id
        // const narrUpdateData = update.expand.possibleNarrations[0]
        // const narrServerArr = data?.expand?.possibleNarrations
        // const narrLocalArr = update.expand.possibleNarrations

        // console.log(narrLocalArr);

        // let updatedNarrArr:any = []
        // updatedNarrArr = [...narrLocalArr]

        // for (let i = 0; i < updatedNarrArr.length; i++) {
        //     if (updatedNarrArr[i].id === "new") {
        //         addNarration({narrData: updatedNarrArr[i]})
        //     } else if (typeof updatedNarrArr[i].id === "undefined") {
        //     } else {
        //         updateNarr({narrID: updatedNarrArr[i].id, newData: updatedNarrArr[i]})
        //     }
        // }

        // refetching?.data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
        //     Object.keys(field).forEach((key) => {
        //         posNarrUpdate(index, field[key])
        //     })
        // })

        const shotUpdateData = {...update}
        delete shotUpdateData.expand
        // delete shotUpdateData.possibleNarrations
        // delete shotUpdateData.possibleDecisions
        // delete shotUpdateData.dbID
        // delete shotUpdateData.updated
        // delete shotUpdateData.created
        // delete shotUpdateData.sequenceID
        // delete shotUpdateData.sceneID
        // delete shotUpdateData.collectionID
        // delete shotUpdateData.collectionName

        if (data?.shotName !== shotUpdateData.shotName || data?.shotDetail !== shotUpdateData.shotDetail) {
            // console.log(shotUpdateData);
            mutateShot({newShotData: shotUpdateData})
        }



        // repopulate()
        // refetch()


        // console.log("narrUpdateData -->", narrUpdateData);
        // console.log(data?.expand?.possibleNarrations.length);
        // console.log(update.possibleNarrations.length);

        // const record = await pb.collection('shots').update(shotID, update);

        // console.log(data);
        // console.log(JSON.stringify(data));

        // createShot(data)
        // const {data:returned, mutate} = useMutation({
        //     mutationFn: createShot
        // })
        // mutate(data)
    }

    if (data && shotID !== '') {
        return (
            <div className="flex flex-col">
                <FormProvider {...methods}>
                <form onSubmit={handleSubmit(Mutate)} id={`${shotID}-input`}>
                <Card radius="sm" className=" bg-zinc-900 p-2">
                    <CardHeader>
                        <div  className="flex flex-row justify-between items-center w-full">
                            <div>
                                <Input
                                    radius='none'
                                    variant='underlined'
                                    defaultValue={copiedData.shotName}
                                    label="Shot Name"
                                    labelPlacement="outside"
                                    className=" text-3xl"
                                    {...register("shotName")}
                                />
                            </div>
                            <div>
                                <Button className="mr-4" radius="sm" type="submit" variant="solid">Submit Changes</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <ScrollShadow size={20} className="h-[50vh]">
                    <CardBody>
                        <Textarea
                            maxRows={6}
                            minRows={6}
                            variant="bordered"
                            radius="sm"
                            label="Shot Detail"
                            defaultValue={copiedData.shotDetail}
                            {...register("shotDetail")}
                        />
                        {/* <Tabs defaultSelectedKey="possibleNarrations" radius="sm" fullWidth className="   mt-4 " 
                        >
                            <Tab key="possibleNarrations" title="Narrations" className="p-0">
                                <Card className="rounded-none shadow-none bg-zinc-900">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Narration Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    // e.preventDefault()
                                                    posNarrAppend({
                                                        "dbID" : "new",
                                                        ...defaultNarration
                                                    })

                                                    setSelectedNarrTab(posNarrFields.length)
                                                }}
                                                color="primary" 
                                                variant="flat" radius="sm" size={"sm"}>+ Narration</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <div className="py-4 flex flex-row w-full">
                                                <div className="flex flex-col items-center pr-5">
                                                    {
                                                        posNarrFields.map((posNarrField:any,posNarrIdx:any) => {

                                                            return(
                                                                <div key={posNarrField.id}>
                                                                    <Button type="button" onClick={() =>setSelectedNarrTab(posNarrIdx)}
                                                                        variant={selectedNarrTab === posNarrIdx ? "bordered" : "flat"}
                                                                        size="sm" className=" font-mono text-xs -p-1"
                                                                    >
                                                                        #{posNarrIdx + 1}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                                {posNarrFields.map(
                                                    (posNarrField:any, posNarrIdx:any) => {
                                                        return (
                                                            <div key={posNarrField.id} className={`flex flex-col w-full ${selectedNarrTab === posNarrIdx ? "" : "hidden"}`}>
                                                                <Input
                                                                className="hidden"
                                                                defaultValue={copiedData.expand?.possibleNarrations[posNarrIdx]?.dbID}
                                                                {...register(`expand.possibleNarrations[${posNarrIdx}].dbID`)}/>
                                                                <Textarea
                                                                    maxRows={6}
                                                                    minRows={6}
                                                                    variant="bordered"
                                                                    radius="sm"
                                                                    label="Narration Content"
                                                                    defaultValue={copiedData.expand?.possibleNarrations[posNarrIdx]?.narrationContent}
                                                                    {...register(`expand.possibleNarrations[${posNarrIdx}].narrationContent`)}
                                                                />
                                                                <Button
                                                                    color="secondary"
                                                                    radius="sm"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setserverNarrToDelPush(old => [...old, copiedData.expand?.possibleNarrations[posNarrIdx]])
                                                                        posNarrRemove(posNarrIdx)
                                                                        copiedData.expand.possibleNarrations.splice(posNarrIdx,1)
                                                                    // setValue(`expand.possibleNarrations`, [...acquiredData.slice(0, posNarrIdx), ...acquiredData.slice(posNarrIdx + 1)])
                                                                }}>
                                                                    Delete
                                                                </Button>
                                                                <RequirementGates
                                                                    key={shotID}
                                                                    reqType="possibleNarrations"
                                                                    parentIdx={posNarrIdx}
                                                                    control={control}
                                                                    watcher={formWatch}
                                                                    shotID={shotID}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                </Card>
                            </Tab>
                            <Tab key="possibleDecisions" title="Decisions" className="p-0 ">
                                <Card className="rounded-none shadow-none bg-zinc-900">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Decision Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    // e.preventDefault()
                                                    posDecAppend({
                                                        "dbID" : "new",
                                                        ...defaultDecision
                                                    })

                                                    setSelectedDecTab(posDecFields.length)
                                                }}
                                                color="primary"
                                                variant="flat" radius="sm" size={"sm"}>+ Decision</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <div className="py-4 flex flex-row w-full">
                                                <div className="flex flex-col items-center pr-5">
                                                    {
                                                        posDecFields.map((posDecField:any,posDecIdx:any) => {

                                                            return(
                                                                <div key={posDecField.id}>
                                                                    <Button type="button" onClick={() =>setSelectedDecTab(posDecIdx)}
                                                                        variant={selectedDecTab === posDecIdx ? "bordered" : "flat"}
                                                                        size="sm" className=" font-mono text-xs -p-1"
                                                                    >
                                                                        #{posDecIdx + 1}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                                {posDecFields.map(
                                                    (posDecField:any, posDecIdx:any) => {
                                                        return (
                                                            <div key={posDecField.id} className={`flex flex-col w-full ${selectedDecTab === posDecIdx ? "" : "hidden"}`}>
                                                                <Input
                                                                className="hidden"
                                                                defaultValue={copiedData.expand?.possibleDecisions?.[posDecIdx]?.dbID}
                                                                {...register(`expand.possibleDecisions[${posDecIdx}].dbID`)}/>
                                                                <Textarea
                                                                    maxRows={6}
                                                                    minRows={6}
                                                                    variant="bordered"
                                                                    radius="sm"
                                                                    label="Decision Content"
                                                                    defaultValue={copiedData.expand?.possibleDecisions?.[posDecIdx]?.decisionContent}
                                                                    {...register(`expand.possibleDecisions[${posDecIdx}].decisionContent`)}
                                                                />
                                                                <Button
                                                                    color="secondary"
                                                                    radius="sm"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setserverDecToDelPush(old => [...old, copiedData.expand?.possibleDecisions?.[posDecIdx]])
                                                                        posDecRemove(posDecIdx)
                                                                        copiedData.expand.possibleDecisions.splice(posDecIdx,1)
                                                                    // setValue(`expand.possibleDecisions`, [...acquiredData.slice(0, posDecIdx), ...acquiredData.slice(posDecIdx + 1)])
                                                                }}>
                                                                    Delete
                                                                </Button>
                                                                <RequirementGates
                                                                    reqType="possibleDecisions"
                                                                    parentIdx={posDecIdx}
                                                                    control={control}
                                                                    watcher={formWatch}
                                                                    shotID={shotID}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                </Card>
                            </Tab>
                        </Tabs> */}
                        <div className="w-full flex flex-row justify-between">
                            <Button className={`w-full mt-4 ${selectedTab === 'possibleNarrations' ? 'bg-zinc-500' : 'bg-zinc-700'}`} radius="none" onClick={() => setSelectedTab('possibleNarrations')}>Narrations</Button>
                            <Button className={`w-full mt-4 ${selectedTab === 'possibleDecisions' ? ' bg-zinc-500' : 'bg-zinc-700'}`} radius="none" onClick={() => setSelectedTab('possibleDecisions')}>Decisions</Button>
                        </div>
                        <div className=" w-full ">
                            <div title="Narrations" className={`${selectedTab === 'possibleNarrations' ? '' : 'hidden'}`}>
                                <Card className="rounded-none shadow-none bg-zinc-900">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Narration Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    // e.preventDefault()
                                                    posNarrAppend({
                                                        "dbID" : "new",
                                                        ...defaultNarration
                                                    })

                                                    setSelectedNarrTab(posNarrFields.length)
                                                }}
                                                color="primary" 
                                                variant="flat" radius="sm" size={"sm"}>+ Narration</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <div className="py-4 flex flex-row w-full">
                                                <div className="flex flex-col items-center pr-5">
                                                    {
                                                        posNarrFields.map((posNarrField:any,posNarrIdx:any) => {

                                                            return(
                                                                <div key={posNarrField.id}>
                                                                    <Button type="button" onClick={() =>setSelectedNarrTab(posNarrIdx)}
                                                                        variant={selectedNarrTab === posNarrIdx ? "bordered" : "flat"}
                                                                        size="sm" className=" font-mono text-xs -p-1"
                                                                    >
                                                                        #{posNarrIdx + 1}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                                {posNarrFields.map(
                                                    (posNarrField:any, posNarrIdx:any) => {
                                                        return (
                                                            <div key={posNarrField.id} className={`flex flex-col w-full ${selectedNarrTab === posNarrIdx ? "" : "hidden"}`}>
                                                                <Input
                                                                className="hidden"
                                                                defaultValue={copiedData.expand?.possibleNarrations[posNarrIdx]?.dbID}
                                                                {...register(`expand.possibleNarrations[${posNarrIdx}].dbID`)}/>
                                                                <Textarea
                                                                    maxRows={6}
                                                                    minRows={6}
                                                                    variant="bordered"
                                                                    radius="sm"
                                                                    label="Narration Content"
                                                                    defaultValue={copiedData.expand?.possibleNarrations[posNarrIdx]?.narrationContent}
                                                                    {...register(`expand.possibleNarrations[${posNarrIdx}].narrationContent`)}
                                                                />
                                                                <Button
                                                                    color="secondary"
                                                                    radius="sm"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setserverNarrToDelPush(old => [...old, copiedData.expand?.possibleNarrations[posNarrIdx]])
                                                                        posNarrRemove(posNarrIdx)
                                                                        copiedData.expand.possibleNarrations.splice(posNarrIdx,1)
                                                                    // setValue(`expand.possibleNarrations`, [...acquiredData.slice(0, posNarrIdx), ...acquiredData.slice(posNarrIdx + 1)])
                                                                }}>
                                                                    Delete
                                                                </Button>
                                                                <RequirementGates
                                                                    key={shotID}
                                                                    reqType="possibleNarrations"
                                                                    parentIdx={posNarrIdx}
                                                                    control={control}
                                                                    watcher={formWatch}
                                                                    shotID={shotID}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                </Card>
                            </div>
                            <div title="Decisions" className={`p-0 ${selectedTab === 'possibleDecisions' ? '' : 'hidden'}`}>
                                <Card className="rounded-none shadow-none bg-zinc-900">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Decision Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    // e.preventDefault()
                                                    posDecAppend({
                                                        "dbID" : "new",
                                                        ...defaultDecision
                                                    })

                                                    setSelectedDecTab(posDecFields.length)
                                                }}
                                                color="primary"
                                                variant="flat" radius="sm" size={"sm"}>+ Decision</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <div className="py-4 flex flex-row w-full">
                                                <div className="flex flex-col items-center pr-5">
                                                    {
                                                        posDecFields.map((posDecField:any,posDecIdx:any) => {

                                                            return(
                                                                <div key={posDecField.id}>
                                                                    <Button type="button" onClick={() =>setSelectedDecTab(posDecIdx)}
                                                                        variant={selectedDecTab === posDecIdx ? "bordered" : "flat"}
                                                                        size="sm" className=" font-mono text-xs -p-1"
                                                                    >
                                                                        #{posDecIdx + 1}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                                {posDecFields.map(
                                                    (posDecField:any, posDecIdx:any) => {
                                                        return (
                                                            <div key={posDecField.id} className={`flex flex-col w-full ${selectedDecTab === posDecIdx ? "" : "hidden"}`}>
                                                                <Input
                                                                className="hidden"
                                                                defaultValue={copiedData.expand?.possibleDecisions?.[posDecIdx]?.dbID}
                                                                {...register(`expand.possibleDecisions[${posDecIdx}].dbID`)}/>
                                                                <Textarea
                                                                    maxRows={6}
                                                                    minRows={6}
                                                                    variant="bordered"
                                                                    radius="sm"
                                                                    label="Decision Content"
                                                                    defaultValue={copiedData.expand?.possibleDecisions?.[posDecIdx]?.decisionContent}
                                                                    {...register(`expand.possibleDecisions[${posDecIdx}].decisionContent`)}
                                                                />
                                                                <Button
                                                                    color="secondary"
                                                                    radius="sm"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setserverDecToDelPush(old => [...old, copiedData.expand?.possibleDecisions?.[posDecIdx]])
                                                                        posDecRemove(posDecIdx)
                                                                        copiedData.expand.possibleDecisions.splice(posDecIdx,1)
                                                                    // setValue(`expand.possibleDecisions`, [...acquiredData.slice(0, posDecIdx), ...acquiredData.slice(posDecIdx + 1)])
                                                                }}>
                                                                    Delete
                                                                </Button>
                                                                <RequirementGates
                                                                    reqType="possibleDecisions"
                                                                    parentIdx={posDecIdx}
                                                                    control={control}
                                                                    watcher={formWatch}
                                                                    shotID={shotID}
                                                                />
                                                            </div>
                                                        )
                                                    }
                                                )}
                                            </div>
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </CardBody>
                    </ScrollShadow>
                </Card>
                </form>
                </FormProvider>
                {/* <div>
                    {
                        isSubmitting && <p>Is Submitting</p>
                    }
                    {
                        isSubmitSuccessful && <p>Is Submit Successful</p>
                    }
                    {
                        isSubmitted && <p>Is Submitted</p>
                    }
                    <p>{JSON.stringify(serverNarrToDelPush)}</p>
                </div> */}
                {/* <div className="flex flex-row max-w-[20vw]">
                    {
                        data &&
                        <pre className=" text-xs  border-r-2 pr-4">{JSON.stringify(data, null, 1)}</pre>
                    }
                    {
                        copiedData &&
                        <pre className=" text-xs  border-r-2 pr-2 pl-2">{JSON.stringify(copiedData, null, 1)}</pre>
                    }
                    {
                        copiedData &&
                        <pre className=" text-xs pr-2 pl-4">{JSON.stringify(formWatch, null, 2)}</pre>
                    }
                </div> */}
            </div>
        )
    } else if (isFetching) {
        return (
            <div className="flex flex-col align-middle justify-center h-full bg-gradient-to-br from-zinc-800 to-zinc-950">
                <p className=' font-mono text-2xl text-center font-semibold text-slate-600'>Fetching Data...</p>
            </div>
            
        )
    }
    else if (isLoading) {
        return (
            <div className="flex flex-col align-middle justify-center h-full bg-gradient-to-br from-zinc-800 to-zinc-950">
                <p className=' font-mono text-2xl text-center font-semibold text-slate-600'>Is Loading...</p>
            </div>
            
        )
    }
    else {
        return (
            <div className="flex flex-col align-middle justify-center h-full bg-gradient-to-br from-zinc-800 to-zinc-950">
                <p className=' font-mono text-2xl text-center font-semibold text-slate-600'>No Shot Selected</p>
            </div>
        )
    }

}

function RequirementGates ({reqType, parentIdx, control, watcher, mainData, shotID}:any) {
    const {register, getValues} = useFormContext()
    const queryClient = useQueryClient()
    const data : any = queryClient.getQueryData(["shot", shotID])
    const copiedData = {...data}
    const requirementData = copiedData.expand?.[reqType]?.[parentIdx]?.expand?.requirements
    // console.log(requirementData[0]);
    // console.log(defaultRequirement);
    const {
        fields: reqGateFields,
        append: reqGateAppend,
        prepend: reqGatePrepend,
        remove: reqGateRemove,
        swap: reqGateSwap,
        insert: reqGateInsert,
        move:  reqGateMove,
        update: reqGateUpdate} = useFieldArray({
        control,
        name: `expand.${reqType}[${parentIdx}].expand.requirements`
    })
    useEffect(() => {
        copiedData.expand?.[reqType]?.[parentIdx]?.expand?.requirements?.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                reqGateUpdate(index, field[key])
            })
        })
    }, [copiedData.expand, parentIdx, reqGateUpdate, reqType])

    return (
        <div className="py-4">
            <div className="flex flex-row justify-between items-end ">
                <div className="mb-4">
                    <h3 className=" font-semibold pl-8">Requirements</h3>
                </div>
                <div>
                    <Button color="primary" type="button" onClick={() => reqGateAppend({
                        "dbID" : "new",
                        ...defaultRequirement
                        })} variant={"light"} size={"sm"}>+ ITEM</Button>
                    <Button color="primary" type="button" onClick={() => reqGateAppend({
                        "dbId" : "new",
                        ...ANDRequirement
                        })} variant={"light"} size={"sm"}>+ AND</Button>
                </div>
            </div>
            {
                reqGateFields.map((reqGateField:any, reqGateIdx) => {

                    let chosenGate = getValues(`expand.${reqType}.[${parentIdx}].expand.requirements.[${reqGateIdx}].gate`)
                    return (
                        <div key={reqGateField.id}>
                            <div className={`${chosenGate === "item" ? "" : 'hidden'}`}>
                                <div className="flex flex-row w-full">
                                    <Input
                                        className="hidden"
                                        defaultValue={requirementData?.[reqGateIdx]?.gate || "item"}
                                        {...register(`expand.${reqType}.[${parentIdx}].expand.requirements.[${reqGateIdx}].gate`)}
                                    />
                                    <Input
                                        className="hidden"
                                        defaultValue={requirementData?.[reqGateIdx]?.dbID || "new"}
                                        {...register(`expand.${reqType}.[${parentIdx}].expand.requirements.[${reqGateIdx}].dbID`)}
                                    />
                                    <div className=" w-1/12 -mr-4 align-middle self-center">
                                        <p className="-ml-4 font-bold text-xs -rotate-90 invisible">
                                            ITEM
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <RequirementItem
                                            reqType={reqType}
                                            grandParentIdx={parentIdx}
                                            gateIdx={reqGateIdx}
                                            watcher={watcher}
                                            control={control}
                                            gate={"item"}
                                            shotID={shotID}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={`${chosenGate === "and" ? "" : 'hidden'}`}>
                                <div className="flex flex-row w-full my-8">
                                    <Input
                                        className="hidden"
                                        defaultValue={requirementData?.[reqGateIdx]?.gate || "and"}
                                        {...register(`expand.${reqType}.[${parentIdx}].expand.requirements.[${reqGateIdx}].gate`)}
                                    />
                                    <Input
                                        className="hidden"
                                        defaultValue={requirementData?.[reqGateIdx]?.dbID || "new"}
                                        {...register(`expand.${reqType}.[${parentIdx}].expand.requirements.[${reqGateIdx}].dbID`)}
                                    />
                                    <div className=" w-1/12 -mr-4 align-middle self-center pb-10">
                                        <p className="-ml-4 text-xs font-bold -rotate-90">
                                            AND
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <RequirementItem
                                            reqType={reqType}
                                            grandParentIdx={parentIdx}
                                            gateIdx={reqGateIdx}
                                            watcher={watcher}
                                            control={control}
                                            gate={"and"}
                                            shotID={shotID}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                })
            }
        </div>
    )
}

function RequirementItem ({reqType, grandParentIdx, gateIdx, watcher, control, gate, shotID}:any) {
    const [useVal, setVal] = useState("")
    const queryClient = useQueryClient()
    const data : any = queryClient.getQueryData(["shot", shotID])
    const copiedData = {...data}
    const reqItemData = copiedData.expand?.[reqType]?.[grandParentIdx]?.expand?.requirements?.[gateIdx]?.expand?.requirementItems
    const {register, getValues, setValue} = useFormContext()
    const {
        fields: reqItemFields,
        append: reqItemAppend,
        prepend: reqItemPrepend,
        remove: reqItemRemove,
        swap: reqItemSwap,
        insert: reqItemInsert,
        move:  reqItemMove,
        update: reqItemUpdate} = useFieldArray({
            control,
            name: `expand.${reqType}[${grandParentIdx}].expand.requirements[${gateIdx}].expand.requirementItems`
    })
    useEffect(() => {
        copiedData.expand?.[reqType]?.[grandParentIdx]?.expand?.requirements?.[gateIdx]?.expand?.requirementItems?.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                reqItemUpdate(index, field[key])
            })
        })
    }, [copiedData.expand, gateIdx, grandParentIdx, reqItemUpdate, reqType])

    if (copiedData) {
            return (
                <div className="flex flex-col w-full">
                    {
                        reqItemFields.map((reqItemField:any, reqItemIdx) => {
                            let selected = watcher?.expand?.[reqType]?.[grandParentIdx]?.expand?.requirements[gateIdx]?.expand?.requirementItems?.[reqItemIdx]?.category

                            let options:any[] = []
                            if (selected === "inventory") {
                                options = inventoryItems
                            } else if (selected === "access") {
                                options = accessItems
                            } else {
                                options = infectionItems
                            }
                            return (
                                <div key={reqItemField.id} className="flex flex-row w-full">
                                    <Input
                                        className="hidden"
                                        defaultValue={reqItemData?.[reqItemIdx]?.dbID || "new"}
                                        {...register(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].dbID`)}
                                    />
                                    <RequirementItemSelect
                                        reqType={reqType}
                                        grandParentIdx={grandParentIdx}
                                        gateIdx={gateIdx}
                                        watcher={watcher}
                                        control={control}
                                        gate={gate}
                                        shotID={shotID}
                                        reqItemIdx={reqItemIdx}
                                    />

                                </div>
                            )
                        })
                    }
                    {
                        gate === "and" &&
                        <Button type="button" onClick={() => {
                            reqItemAppend({
                                "dbID" : "new",
                                reqItem
                            })
                        }}
                            variant={"bordered"} size={"sm"}>+ Item</Button>
                    }
                </div>
            )
    }
}

function RequirementItemSelect ({reqType, grandParentIdx, gateIdx, watcher, control, gate, shotID, reqItemIdx}:any) {
    const queryClient = useQueryClient()
    const {register, setValue, getValues} = useFormContext()

    const data : any = queryClient.getQueryData(["shot", shotID])
    const copiedData = {...data}
    const itemsData : any = queryClient.getQueryData(["getItems"])
    const infectionsData : any = queryClient.getQueryData(["getInfections"])

    const reqItemData = copiedData.expand?.[reqType]?.[grandParentIdx]?.expand?.requirements?.[gateIdx]?.expand?.requirementItems?.[reqItemIdx]

    const [useOptions, setOptions]:any[] = useState([])
    const [useSelected, setSelected] = useState('inventory')


    const [useInventory, setInventory] = useState(reqItemData?.itemRequired || itemsData[1].dbID)
    const [useInfection, setInfection] = useState(reqItemData?.infectionRequired || 'placeholderData')

    // console.log(reqItemData.infectionRequired === '');
    // console.log(getValues(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}]`));
    useEffectOnce(()=> {
        if (reqItemData?.itemRequired !== "placeholderData") {
            setOptions(itemsData)
            setSelected("inventory")
        } else {
            setOptions(infectionsData)
            setSelected("infection")
        }
    })

    return (
        <div className="flex flex-row w-full">
            <Select
                radius="none"
                label="Category"
                size="sm"
                selectedKeys={[useSelected]}
                className="w-2/3"
                id={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].category`}
                onSelectionChange={(e:any) => {
                    if (e.anchorKey === "infection" && useSelected !== "infection") {
                        setInfection(infectionsData[1].dbID)
                        setValue(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].infectionRequired`, infectionsData[1].dbID)
                        setValue(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].itemRequired`, itemsData[0].dbID)
                        setSelected(e.anchorKey)

                    } else if (e.anchorKey === "infection" && useSelected === "infection") {

                    }
                    else if (e.anchorKey === "inventory" && useSelected !== "inventory") {
                        setInventory(itemsData[1].dbID)
                        setValue(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].infectionRequired`, infectionsData[0].dbID)
                        setValue(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].itemRequired`, itemsData[1].dbID)
                        setSelected(e.anchorKey)

                    } else {

                    }
            }}>
                <SelectItem key="infection" value="infection" id={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].category` + `infection`}>Infection</SelectItem>
                <SelectItem key="inventory" value="inventory" id={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].category` + `inventory`}>Inventory</SelectItem>
            </Select>
            <div className={`${useSelected === "inventory"? "" : "hidden"} w-full`}>
                <Controller
                    render={({field} :any) => {
                        return (
                            <Select
                                radius="none"
                                size="sm"
                                selectedKeys={[useInventory]}
                                defaultSelectedKeys={[useInventory]}
                                id={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].itemRequired`}
                                name={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].itemRequired`}
                                onSelectionChange={(e:any) => {
                                    return setInventory(e.anchorKey)
                                }}
                                label="Inventory"
                                {...field}
                            >
                                {
                                    itemsData?.map((item:any) => {
                                        if (item.dbID === "placeholderData") {
                                            return (
                                            <SelectItem className="hidden" key={item.dbID} value={item.dbID} >
                                                {item.itemName}
                                            </SelectItem>)
                                        }
                                        return (
                                            <SelectItem key={item.dbID} value={item.dbID} >
                                                {item.itemName}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }}
                    defaultValue={useInventory}
                    name={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].itemRequired`}
                />
            </div>
            <div className={`${useSelected === "infection"? "" : "hidden"} w-full`}>
                <Controller
                    render={({field} :any) => {
                        return (
                            <Select
                                radius="none"
                                size="sm"
                                id={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].infectionRequired`}
                                selectedKeys={[useInfection]}
                                defaultSelectedKeys={[useInfection]}
                                onSelectionChange={(e:any) => {
                                    return setInfection(e.anchorKey)
                                }}
                                label="Infection"
                                {...field}
                            >
                                {
                                    infectionsData?.map((item:any) => {
                                        if (item.dbID === "placeholderData") {
                                            return (
                                            <SelectItem className="hidden" key={item.dbID} value={item.dbID} >
                                                {item.infectionName}
                                            </SelectItem>)
                                        }
                                        return (
                                            <SelectItem key={item.dbID} value={item.dbID} id={`${reqType}-${item.dbID}`}>
                                                {item.infectionName}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }}
                    defaultValue={useInfection}
                    name={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].infectionRequired`}
                />
            </div>
            <div className='w-2/5'>
                <Controller
                    render={({field} :any) => {
                        return (
                            <Select
                                // selectedKeys={[useInfection]}
                                radius="none"
                                size="sm"
                                defaultSelectedKeys={[reqItemData?.operator || '=']}
                                aria-label="Operand"
                                {...field}
                            >
                                {
                                    operatorTypes.map((item:any) => {
                                        return (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </Select>
                        )
                    }}
                    defaultValue={reqItemData?.operator || '='}
                    name={`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].operator`}
                />
            </div>
            <div className='w-1/3'>
                <Input
                    radius="none"
                    size="sm"
                    aria-label="amount"
                    defaultValue={reqItemData?.amount || 0}
                    {...register(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].amount`)}
                />
            </div>

        </div>
    )

}
