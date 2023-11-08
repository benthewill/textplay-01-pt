"use client";
import React, {useCallback, useEffect, useState} from "react";
import { useForm, SubmitHandler, useFieldArray, FormProvider, useFormContext, FieldValues, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import { useEffectOnce } from 'usehooks-ts'
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
import { createShot, getSequenceFromID, getSceneFromID, getShot, createNarration, updateNarration, deleteNarrationByID } from "@/lib/db/shots";
import { Textarea } from "@nextui-org/react";
import { PocketBaseInit } from "@/lib/db/pocketbaseinit";

export function ShotSub ({shotID}:{shotID:string}) {
    const queryClient = useQueryClient()
    const {data, isLoading, isError, refetch, isRefetching, isFetching} =  useQuery({ queryFn: () => getShot(shotID), queryKey: ["shot", shotID], notifyOnChangeProps: "all"})

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

    useEffect(() => {
        data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                posNarrUpdate(index, field[key])
            })
        })
    }, [data, posNarrUpdate])

    // useEffect(() => {
    //     refetch()
    //     reset(async () =>  await queryClient.getQueryData(['shot', shotID]))
    //     data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
    //         Object.keys(field).forEach((key) => {
    //             posNarrUpdate(index, field[key])
    //         })
    //     })
    // },[data?.expand?.possibleNarrations, posNarrUpdate, queryClient, refetch, reset, shotID])
    
    const {
        fields:posDecFields,
        append:posDecAppend,
        prepend:posDecPrepend,
        remove:posDecRemove,
        swap:posDecSwap,
        insert:posDecInsert,
        move: posDecMove} = useFieldArray({
        control,
        name: `expand.possibleDecisions`
    })

    const formWatch = useWatch({
        control,
        defaultValue: getValues('expand.possibleNarrations'),
        name: `expand.possibleNarrations`})

    const [selectedNarrTab, setSelectedNarrTab] = useState(0)
    const [selectedDecTab, setSelectedDecTab] = useState('dec0')
    const [narrToDel, setNarrToDel] = useState([''])


    const {mutate:addBlankNarration, data: blankNarrData} = useMutation({
        mutationFn: () => createNarration({}, shotID),
        mutationKey: ["blank narration for", shotID],
        onSuccess: async () => {
            queryClient.invalidateQueries({queryKey: ["shot", shotID]})
        }
    })

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
        mutationFn: ({narrID}:any) => {
            return deleteNarrationByID(narrID)
        }
    })

    async function removeNarrField (idx:any) {
        const narrId = getValues(`expand.possibleNarrations[${idx}].id`)
        const narrIdWatch = watch(`expand.possibleNarrations[${idx}].id`)
        console.log(narrId);
        console.log(narrIdWatch);
        setNarrToDel(old => [...old, narrId])
    }

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

    const Mutate = async (update:FieldValues) => {
        const pb = await PocketBaseInit()
        console.log(update);
        console.log(narrToDel.slice(1));

        let slicedNarrToDel = narrToDel.slice(1)

        if (slicedNarrToDel.length > 0) {
            slicedNarrToDel.forEach((item) => {
                deleteNarr({narrID: item})
            })
        }

        const narrID = data?.expand?.possibleNarrations[0].id
        const narrUpdateData = update.expand.possibleNarrations[0]
        const narrServerArr = data?.expand?.possibleNarrations
        const narrLocalArr = update.expand.possibleNarrations

        console.log(narrLocalArr);

        let updatedNarrArr:any = []
        updatedNarrArr = [...narrLocalArr]

        for (let i = 0; i < updatedNarrArr.length; i++) {
            if (updatedNarrArr[i].id === "new") {
                addNarration({narrData: updatedNarrArr[i]})
            } else if (typeof updatedNarrArr[i].id === "undefined") {
            } else {
                updateNarr({narrID: updatedNarrArr[i].id, newData: updatedNarrArr[i]})
            }
        }

        // refetching?.data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
        //     Object.keys(field).forEach((key) => {
        //         posNarrUpdate(index, field[key])
        //     })
        // })


        repopulate()
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

    if (data) {
        return (
            <div className="flex flex-col max-w-[80vw] min-w-[50vw]">
                <FormProvider {...methods}>
                <form onSubmit={handleSubmit(Mutate)}>
                <Card className=" rounded-none shadow-sm border-2">
                    <CardHeader>
                        <div  className="flex flex-col">
                            <div>
                            </div>
                            <div>
                                <Input
                                    radius='none'
                                    variant='underlined'
                                    defaultValue={data.shotName}
                                    label="Shot Name"
                                    {...register("shotName")}
                                />
                            </div>
                        </div>
                        
                    </CardHeader>
                    <Divider/>
                    <CardBody>
                    <ScrollShadow size={20} className="h-[50vh]">
                        <Textarea
                            maxRows={6}
                            minRows={6}
                            variant="bordered"
                            radius="none"
                            label="Shot Detail"
                            defaultValue={data.shotDetail}
                            {...register("shotDetail")}
                        />
                        <Tabs defaultSelectedKey="possibleNarrations" radius="none" fullWidth className="   mt-4 border-t-2 border-x-2 " classNames={{
                                tabList: "bg-white"
                        }}>
                            <Tab key="possibleNarrations" title="Narrations" className="p-0 z-50">
                                <Card className="rounded-none z-0 shadow-none border-2">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Narration Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    posNarrAppend({
                                                        "id" : "new",
                                                        ...defaultNarration
                                                    })

                                                    setSelectedNarrTab("narr" + posNarrFields.length)

                                                    async function blankNarr2 () {
                                                        const data = await createNarration({}, shotID)
                                                        const res = await data
                                                        posNarrAppend({
                                                            "id": "",
                                                            ...defaultNarration
                                                        })
                                                        res ?
                                                        posNarrUpdate(posNarrFields.length, {
                                                            "id": res.newNarrRecord.id,
                                                        }) : ""
                                                        await repopulate()
                                                    }
                                                    blankNarr2()
                                                }}
                                                variant="bordered" radius="none" size={"sm"}>+ Narration</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <div className="py-4 flex flex-row">
                                                <div className="flex flex-col pr-5">
                                                    {
                                                        posNarrFields.map((posNarrField:any,posNarrIdx:any) => {

                                                            return(
                                                                <div key={posNarrField.id}>
                                                                    <Button type="button" onClick={() =>setSelectedNarrTab(posNarrIdx)}
                                                                        variant={selectedNarrTab === posNarrIdx ? "bordered" : "flat"}
                                                                        radius="none" className=" font-mono"
                                                                    >
                                                                        Variant # {posNarrIdx + 1}
                                                                    </Button>
                                                                </div>
                                                            )
                                                        })
                                                    }

                                                </div>
                                                {posNarrFields.map(
                                                    (posNarrField:any, posNarrIdx:any) => {
                                                        return (
                                                            <div key={posNarrField.id} className={`flex ${selectedNarrTab === posNarrIdx ? "" : "hidden"}`}>
                                                                <Input
                                                                className="hidden"
                                                                defaultValue={data.expand?.possibleNarrations[posNarrIdx]?.dbID}
                                                                {...register(`expand.possibleNarrations[${posNarrIdx}].dbID`)}/>
                                                                <Textarea
                                                                    onFocus={() => console.log("touched")}
                                                                    onFocusCapture={() => console.log("touched")}
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
                                                    }
                                                )}
                                            </div>
                                            {/* <Tabs
                                                selectedKey={selectedNarrTab}
                                                onSelectionChange={(e:any) => {
                                                    // let idx = Number(e.substring(4))
                                                    // setFocus(`expand.possibleNarrations.${idx}.narrationContent`)
                                                    // console.log(watch(`expand.possibleNarrations[${idx}].id`));
                                                    // console.log(getValues(`expand.possibleNarrations[${idx}].id`));

                                                    // setValue(`expand.possibleNarrations.${idx}.id`, data.expand?.possibleNarrations[idx].id, {shouldTouch:true})
                                                    return setSelectedNarrTab(e)}
                                                }
                                                variant="light"
                                                radius="none"
                                                classNames={{
                                                    base: "flex flex-row min-h-full h-full pr-5",
                                                    tab: "flex flex-col h-full",
                                                    tabList: "flex flex-col ",
                                                    tabContent: "h-full",
                                                    panel: "py-0"
                                            }}>
                                            {
                                                posNarrFields.map((posNarrField:any, posNarrIdx:number) => {
                                                    return (
                                                        <Tab key={posNarrField.id} className="w-full h-full px-4" title={"Variant #" + String(posNarrIdx + 1)}>
                                                            <div className=" h-full min-h-full">
                                                                <Input
                                                                className="hidden"
                                                                defaultValue={data.expand?.possibleNarrations[posNarrIdx]?.dbID}
                                                                onFocus={() => console.log("Focused")}
                                                                {...register(`expand.possibleNarrations[${posNarrIdx}].dbID`)}/>
                                                                <Textarea
                                                                    onFocus={() => console.log("touched")}
                                                                    onFocusCapture={() => console.log("touched")}
                                                                    maxRows={6}
                                                                    minRows={6}
                                                                    variant="bordered"
                                                                    radius="none"
                                                                    label="Narration Content"
                                                                    defaultValue={data.expand?.possibleNarrations[posNarrIdx]?.narrationContent}
                                                                    {...register(`expand.possibleNarrations[${posNarrIdx}].narrationContent`)}
                                                                />
                                                                <Button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        // const acquiredData = getValues(`expand.possibleNarrations`)
                                                                        // setValue(`expand.possibleNarrations`, [...acquiredData.slice(0, posNarrIdx), ...acquiredData.slice(posNarrIdx + 1)])


                                                                        // setFocus(`expand.possibleNarrations.${posNarrIdx}`, {shouldSelect: true})
                                                                        // console.log(posNarrIdx);
                                                                        // // removeNarrField(posNarrIdx)
                                                                        // // let narrId = formWatch.expand.possibleNarrations[posNarrIdx].id
                                                                        // let narrId = getValues(`expand.possibleNarrations[${posNarrIdx}].id`)
                                                                        // setNarrToDel(old => [...old, narrId])
                                                                        // console.log(watch(`expand.possibleNarrations[${posNarrIdx}].id`));
                                                                        // console.log(getValues(`expand.possibleNarrations[${posNarrIdx}].id`));
                                                                        // console.log("Initial length --> ",posNarrFields.length);
                                                                        // console.log("Length Afterwards --> ",posNarrFields.length);
                                                                        // setSelectedNarrTab(posNarrField.id)
                                                                        // console.log(posNarrIdx);
                                                                        // console.log(posNarrIdx);
                                                                        posNarrRemove(posNarrIdx)
                                                                        }
                                                                    }
                                                                    size="sm">
                                                                        Delete #{posNarrIdx}
                                                                </Button>
                                                            </div>
                                                        </Tab>
                                                    )
                                                })
                                            }
                                            </Tabs> */}
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                </Card>
                            </Tab>

                        </Tabs>
                        {/* Completed
                        <FormProvider {...methods}>
                        <form onBlur={handleSubmit(Mutate)}>
                            <InputBuild
                                fieldName={"shotName"}
                                inputType={"text"}
                                fieldLabel="Shot Name"
                                {...control}
                            />
                            <Divider className="mt-4"/>
    
                            <NextTabs defaultSelectedKey="possibleNarrations" radius="none" fullWidth className="  mt-4 border-t-2 border-x-2 " classNames={{
                                tabList: "bg-white"
                            }}>
                                <NextTab key="possibleNarrations" title="Narrations" className="p-0 z-50">
                                    <Card className="rounded-none z-0 shadow-none border-2">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Narration Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    let selectedIdx = Number(selectedNarrTab.substring(4)) + 1
                                                    setSelectedNarrTab("narr" + selectedIdx)
                                                    return posNarrAppend(defaultNarration)
                                                }}
                                                variant="bordered" radius="none" size={"sm"}>+ Narration</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <NextTabs
                                                selectedKey={selectedNarrTab}
                                                onSelectionChange={(e:any) => setSelectedNarrTab(e)}
                                                variant="light"
                                                radius="none"
                                                classNames={{
                                                    base: "flex flex-row min-h-full h-full pr-5",
                                                    tab: "flex flex-col h-full",
                                                    tabList: "flex flex-col ",
                                                    tabContent: "h-full",
                                                    panel: "py-0"
                                            }}>
                                            {
                                                posNarrFields.map((posNarrField, posNarrIdx) => {
                                                    return (
                                                        <NextTab key={"narr" + posNarrIdx} className="w-full h-full px-4" title={"Variant #" + String(posNarrIdx + 1)}>
                                                            <div className=" h-full min-h-full">
                                                                <InputBuild
                                                                    fieldName={`possibleNarrations.${posNarrIdx}.narrationContent`}
                                                                    fieldLabel="Narration Content"
                                                                    fieldDescription="This is where narration lives"
                                                                    inputType="long-text"
                                                                    {...control}
                                                                />
                                                                <RequirementGates
                                                                    reqType={"possibleNarrations"}
                                                                    parentIdx={posNarrIdx}
                                                                    watcher={formWatch}
                                                                    {...control}
                                                                />
                                                            </div>
                                                            
                                                        </NextTab>
                                                    )
                                                })
                                            }
                                            </NextTabs>
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                    </Card>
                                </NextTab>
                                <NextTab key="possibleDecisions" title="Decisions" className="p-0 z-50">
                                <Card className="rounded-none z-0 shadow-none border-2">
                                        <CardHeader className="flex flex-row justify-between items-end">
                                            <div>
                                                Decisions Variants
                                            </div>
                                            <div>
                                                <Button
                                                type="button"
                                                onClick={(e) => {
                                                    let selectedIdx = Number(selectedDecTab.substring(3)) + 1
                                                    setSelectedDecTab("dec" + selectedIdx)
                                                    return posDecAppend(defaultDecision)
                                                }}
                                                variant="bordered" radius="none" size={"sm"}>+ Decision</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <NextTabs
                                                selectedKey={selectedDecTab}
                                                onSelectionChange={(e:any) => setSelectedDecTab(e)}
                                                variant="light"
                                                radius="none"
                                                classNames={{
                                                    base: "flex flex-row min-h-full h-full pr-5",
                                                    tab: "flex flex-col h-full",
                                                    tabList: "flex flex-col ",
                                                    tabContent: "h-full",
                                                    panel: "py-0"
                                            }}>
                                            {
                                                posDecFields.map((posDecField, posDecIdx) => {
                                                    return (
                                                        <NextTab key={"dec" + posDecIdx} className="w-full h-full px-4" title={"Variant #" + String(posDecIdx + 1)}>
                                                            <div className=" h-full min-h-full">
                                                                <InputBuild
                                                                    fieldName={`possibleDecisions.${posDecIdx}.decisionContent`}
                                                                    fieldLabel="Decision Content"
                                                                    fieldDescription="This is where the decision lives"
                                                                    inputType="text"
                                                                    {...control}
                                                                />
                                                                <RequirementGates
                                                                    reqType={"possibleDecisions"}
                                                                    parentIdx={posDecIdx}
                                                                    watcher={formWatch}
                                                                    {...control}
                                                                />
                                                            </div>
                                                            
                                                        </NextTab>
                                                    )
                                                })
                                            }
                                            </NextTabs>
                                        </CardBody>
                                        <CardFooter>
                                            <p>Double check the contents, big man.</p>
                                        </CardFooter>
                                    </Card>
                                </NextTab>
                            </NextTabs>
    
    
    
                            <div className="my-4">
                                <Button variant="bordered" size="lg" type="submit" radius="none">
                                    <p className="font-semibold text-xl">Submit</p>
                                </Button>
                            </div>
                        </form>
                        </FormProvider> */}
                    </ScrollShadow> 
                    </CardBody>
                    <Divider/>
                    <CardFooter className=" bg-slate-50">
                        <Button className="mr-4" radius="none" type="submit" variant="solid">Submit Changes</Button>
                        
                        <p className=" text-xs ">Sequence #{sequenceData?.sequenceNum} - Scene #{sceneData?.sceneNum}</p>
                        <p className=" text-xs ">{isFetching && "Is Fetching"}</p>
                        <p className=" text-xs ">{JSON.stringify(narrToDel, null, 1)}</p>
                        <p className=" text-xs ">{isRefetching && "Is Re-Fetching"}</p>
                    </CardFooter>
                </Card>
                </form>
                </FormProvider>
                        {
                            isSubmitting && <p>Is Submitting</p>
                        }
                        {
                            isSubmitSuccessful && <p>Is Submit Successful</p>
                        }
                        {
                            isSubmitted && <p>Is Submitted</p>
                        }
                <div>
                    <DevTool control={control}/>
                </div>
                <div className="flex flex-row max-w-[20vw]">
                    {
                        data &&
                        <pre className=" text-xs  border-r-2 pr-4">{JSON.stringify(data, null, 1)}</pre>
                    }
                    {
                        data &&
                        <pre className=" text-xs pr-2 pl-4">{JSON.stringify(formWatch, null, 2)}</pre>
                    }
                </div>
            </div>
        )
    }

}

function RequirementGates ({reqType, parentIdx, control, watcher}:any) {
    // const {register} = useFormContext()
    const {
        fields: reqGateFields,
        append: reqGateAppend,
        prepend: reqGatePrepend,
        remove: reqGateRemove,
        swap: reqGateSwap,
        insert: reqGateInsert,
        move:  reqGateMove} = useFieldArray({
        control,
        name: `${reqType}[${parentIdx}].requirements`
    })
    return (
        <div className="py-2">
            <div className="flex flex-row justify-between items-end ">
                <div className="pl-10">
                    <h3 className=" font-semibold">Requirements</h3>
                </div>
                <div>
                    <Button type="button" onClick={() => reqGateAppend(defaultRequirement)} variant={"light"} size={"sm"}>+ ITEM</Button>
                    <Button type="button" onClick={() => reqGateAppend(ANDRequirement)} variant={"light"} size={"sm"}>+ AND</Button>
                </div>
            </div>
            <div>
            </div>
            {
                reqGateFields.map((reqGateField:any, reqGateIdx) => {
                    if (reqGateField.gate === "item") {
                        return (
                            <div key={reqGateField.id} className="mt-2 -mb-1 -ml-2 w-full">
                                <div className="w-full flex flex-row">
                                    <div className=" w-1/12 align-middle">
                                        <p className=" text-transparent">
                                            ITEM
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <RequirementItem
                                            reqType={reqType}
                                            grandParentIdx={parentIdx}
                                            watcher={watcher}
                                            gateIdx={reqGateIdx}
                                            gate="item"
                                            {...control}
                                        />
                                    </div>
                                </div>

                            </div>
                        )
                    } else {
                        return (
                            <div key={reqGateField.id} className="my-10 -ml-2  flex flex-row w-full">
                                <div className="w-full flex flex-row">
                                    <div className=" w-1/12 align-middle self-center pb-10">
                                        <p className=" font-bold text-md -rotate-90">
                                            AND
                                        </p>
                                    </div>
                                    <div className="w-full">
                                        <RequirementItem
                                            reqType={reqType}
                                            grandParentIdx={parentIdx}
                                            watcher={watcher}
                                            gateIdx={reqGateIdx}
                                            gate="and"
                                            {...control}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}

function RequirementItem ({reqType, grandParentIdx, gateIdx, watcher, control, gate}:any) {
    const [useVal, setVal] = useState("")
    const {register} = useFormContext()
    const {
        fields: reqItemFields,
        append: reqItemAppend,
        prepend: reqItemPrepend,
        remove: reqItemRemove,
        swap: reqItemSwap,
        insert: reqItemInsert,
        move:  reqItemMove} = useFieldArray({
            control,
            name: `${reqType}[${grandParentIdx}].requirements[${gateIdx}].reqData`
    })
    return (
        <div>
            {
                reqItemFields.map((reqItemField:any, reqItemIdx) => {
                    let selected  = watcher[reqType][grandParentIdx]?.requirements[gateIdx]?.reqData[reqItemIdx]?.category
                    console.log(selected);
                        return (
                            <div key={reqItemField.id} className="flex flex-row w-full gap-1">
                                <div className="w-1/4">
                                    <InputBuild
                                        fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.category`}
                                        fieldLabel="Type"
                                        inputType="select"
                                        noLabel
                                        options={requirementCategories}
                                        register={register}
                                        {...control}
                                    />
                                </div>
                                {
                                    selected === "inventory" &&
                                    <div className="w-1/4">
                                        <InputBuild
                                            fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.item`}
                                            fieldLabel="Item"
                                            inputType="select"
                                            noLabel
                                            options={inventoryItems}
                                            register={register}
                                            {...control}
                                        />
                                    </div>
                                }
                                {
                                    selected === "infection" &&
                                    <div className="w-1/4">
                                        <InputBuild
                                            fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.item`}
                                            fieldLabel="Item"
                                            inputType="select"
                                            noLabel
                                            options={infectionItems}
                                            register={register}
                                            {...control}
                                        />
                                    </div>
                                }
                                {
                                    selected === "access" &&
                                    <div className="w-1/4">
                                        <InputBuild
                                            fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.item`}
                                            fieldLabel="Item"
                                            inputType="select"
                                            noLabel
                                            options={accessItems}
                                            register={register}
                                            {...control}
                                        />
                                    </div>
                                }
                                                                {
                                    selected === "" &&
                                    <div className="w-1/4">
                                        <InputBuild
                                            fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.item`}
                                            fieldLabel="Item"
                                            inputType="select"
                                            noLabel
                                            options={inventoryItems}
                                            register={register}
                                            {...control}
                                        />
                                    </div>
                                }

                                <div className=" w-1/4">
                                    <InputBuild
                                        fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.operator`}
                                        fieldLabel="Operator"
                                        inputType="select"
                                        noLabel
                                        register={register}
                                        options={operatorTypes}
                                        {...control}
                                    />
                                </div>
                                <div className=" w-1/5">
                                    <InputBuild
                                        fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.amount`}
                                        fieldLabel="Amount"
                                        noLabel
                                        inputType="number"
                                        // fieldPlaceholder="Enter Amt."
                                        // defaultValue="3"
                                        {...control}
                                    />
                                </div>
                            </div>
                        )
                })
            }
            {
                gate === "and" &&
                <Button type="button" onClick={() => reqItemAppend(reqItem)} variant={"outline"} size={"sm"}>+ Item</Button>
            }
        </div>
    )
}