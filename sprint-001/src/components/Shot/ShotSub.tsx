"use client";
import React, {useCallback, useEffect, useState} from "react";
import { isEqual } from "lodash";
import { useForm, SubmitHandler, useFieldArray, FormProvider, useFormContext, FieldValues, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { DevTool } from "@hookform/devtools";
import { useEffectOnce } from 'usehooks-ts'
import {RadioGroup, Radio} from "@nextui-org/react";
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
import {Button, ButtonGroup} from '@nextui-org/react'
import { ScrollShadow } from "@nextui-org/react";
import { gateTypes, defaultRequirement, operatorTypes, defaultDecision, defaultNarration, defaultShot, inventoryItems, infectionItems, accessItems, ANDRequirement, reqItem, requirementCategories } from "@/lib/validations/shots";
import { InputBuild } from "./InputBuild";
import {Tabs, Tab} from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createShot, getSequenceFromID, getSceneFromID, getShot, createNarration, updateNarration, deleteNarrationByID, getItems, getInfections } from "@/lib/db/shots";
import { Textarea } from "@nextui-org/react";
import { PocketBaseInit } from "@/lib/db/pocketbaseinit";

export function ShotSub ({shotID}:{shotID:string}) {
    const queryClient = useQueryClient()
    const {data, isLoading, isError, refetch, isRefetching, isFetching} =  useQuery({
        queryFn: () => getShot(shotID), queryKey: ["shot", shotID], notifyOnChangeProps: "all"
    })
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
        control
    })

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
        // console.log(narrToDel.slice(1));

        const serverNarr = data?.expand.possibleNarrations

        let newNarrArr: any[] = []
        let serverNarrToDel: any[] = []
        let serverNarrToUpdate: any[] = []
        const narrToUpdate = update.expand.possibleNarrations

        narrToUpdate.map((newNarr:any, newNarridx:number) => {
            if (newNarr.dbID === "new") {
                newNarrArr.push(newNarr)
                delete newNarr.dbID
            } else {
                let stringified = JSON.parse(JSON.stringify(newNarr).replaceAll('"dbID"', '"id"'))
                serverNarrToUpdate.push(stringified)
            }
        })

        serverNarr.forEach((serverNarrItem:any, serverNarrIdx:number) => {
            const test = narrToUpdate.find((x:any) => x.dbID === serverNarrItem.dbID)
            if (test) {

            } else {
                serverNarrToDel.push(serverNarrItem.dbID)
            }
        })

        console.log("newNarrArr", newNarrArr);
        console.log("serverNarrToDel", serverNarrToDel);
        console.log("serverNarrToUpdate", serverNarrToUpdate);

        newNarrArr.forEach((n:any) => {
            addNarration({narrData: n})
        })

        serverNarrToUpdate.forEach((n:any) => {
            updateNarr({narrID: n.id, newData: n})
        })

        const narrID = data?.expand?.possibleNarrations[0].id
        const narrUpdateData = update.expand.possibleNarrations[0]
        const narrServerArr = data?.expand?.possibleNarrations
        const narrLocalArr = update.expand.possibleNarrations

        // console.log(narrLocalArr);

        let updatedNarrArr:any = []
        updatedNarrArr = [...narrLocalArr]

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
                                                    // e.preventDefault()
                                                    posNarrAppend({
                                                        "dbID" : "new",
                                                        ...defaultNarration
                                                    })

                                                    setSelectedNarrTab(posNarrFields.length)
                                                }}
                                                color="primary" 
                                                variant="flat" radius="none" size={"sm"}>+ Narration</Button>
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
                                                                    <Button type="button" color="primary" onClick={() =>setSelectedNarrTab(posNarrIdx)}
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
                                                            <div key={posNarrField.id} className={`flex flex-col w-full ${selectedNarrTab === posNarrIdx ? "" : "hidden"}`}>
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
                                                                <Button
                                                                    color="secondary"
                                                                    radius="none"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                    posNarrRemove(posNarrIdx)
                                                                    // const acquiredData = getValues(`expand.possibleNarrations`)
                                                                    // setValue(`expand.possibleNarrations`, [...acquiredData.slice(0, posNarrIdx), ...acquiredData.slice(posNarrIdx + 1)])
                                                                }}>
                                                                    Delete
                                                                </Button>
                                                                <RequirementGates
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
                        </Tabs>
                    </ScrollShadow>
                    </CardBody>
                    <Divider/>
                    <CardFooter className=" bg-slate-50">
                        <Button className="mr-4" radius="none" color="primary" size="lg" type="submit" variant="solid">Submit Changes</Button>
                        <p className=" text-xs ">Sequence #{sequenceData?.sequenceNum} - Scene #{sceneData?.sceneNum}</p>
                        <p className=" text-xs ">{isFetching && "Is Fetching"}</p>
                        <p className=" text-xs ">{JSON.stringify(narrToDel, null, 1)}</p>
                        <p className=" text-xs ">{isRefetching && "Is Re-Fetching"}</p>
                    </CardFooter>
                </Card>
                </form>
                </FormProvider>
                <div>
                    {
                        isSubmitting && <p>Is Submitting</p>
                    }
                    {
                        isSubmitSuccessful && <p>Is Submit Successful</p>
                    }
                    {
                        isSubmitted && <p>Is Submitted</p>
                    }
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

function RequirementGates ({reqType, parentIdx, control, watcher, mainData, shotID}:any) {
    const {register, getValues} = useFormContext()
    const queryClient = useQueryClient()
    const data : any = queryClient.getQueryData(["shot", shotID])
    const requirementData = data.expand[reqType][parentIdx]?.expand?.requirements
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
        data.expand[reqType][parentIdx]?.expand?.requirements.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                reqGateUpdate(index, field[key])
            })
        })
    }, [data.expand, parentIdx, reqGateUpdate, reqType])

    return (
        <div className="py-2">
            <div className="flex flex-row justify-between items-end ">
                <div className="mb-4">
                    <h3 className=" font-semibold">Requirements</h3>
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
                                    <div className=" w-1/12 -mr-2 align-middle self-center">
                                        <p className=" font-bold text-md -rotate-90">
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
                                    <div className=" w-1/12 -mr-2 align-middle self-center pb-10">
                                        <p className=" font-bold text-md -rotate-90">
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
    const reqItemData = data.expand[reqType][grandParentIdx]?.expand?.requirements[gateIdx]?.expand?.requirementItems
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
        data.expand[reqType][grandParentIdx]?.expand?.requirements[gateIdx]?.expand?.requirementItems.forEach((field: { [key: string]: any }, index: number) => {
            Object.keys(field).forEach((key) => {
                reqItemUpdate(index, field[key])
            })
        })
    }, [data.expand, gateIdx, grandParentIdx, reqItemUpdate, reqType])

    if (data) {
            return (
                <div className="flex flex-col w-full">
                    {
                        reqItemFields.map((reqItemField:any, reqItemIdx) => {
                            let selected = watcher.expand[reqType][grandParentIdx]?.expand?.requirements[gateIdx]?.expand?.requirementItems?.[reqItemIdx]?.category

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
                            console.log(reqItemFields.length);
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
    const itemsData : any = queryClient.getQueryData(["getItems"])
    const infectionsData : any = queryClient.getQueryData(["getInfections"])

    const reqItemData = data.expand[reqType][grandParentIdx]?.expand?.requirements[gateIdx]?.expand?.requirementItems[reqItemIdx]

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
                selectedKeys={[useSelected]}
                className="w-2/3"
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
                <SelectItem key="infection" value="infection">Infection</SelectItem>
                <SelectItem key="inventory" value="inventory">Inventory</SelectItem>
            </Select>
            <div className={`${useSelected === "inventory"? "" : "hidden"} w-full`}>
                <Controller
                    render={({field} :any) => {
                        return (
                            <Select
                                radius="none"
                                selectedKeys={[useInventory]}
                                defaultSelectedKeys={[useInventory]}
                                onSelectionChange={(e:any) => {
                                    return setInventory(e.anchorKey)
                                }}
                                label="Inventory"
                                {...field}
                            >
                                {
                                    itemsData.map((item:any) => {
                                        if (item.dbID === "placeholderData") {
                                            return (
                                            <SelectItem className="hidden" key={item.dbID} value={item.dbID}>
                                                {item.itemName}
                                            </SelectItem>)
                                        }
                                        return (
                                            <SelectItem key={item.dbID} value={item.dbID}>
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
                                            <SelectItem className="hidden" key={item.dbID} value={item.dbID}>
                                                {item.infectionName}
                                            </SelectItem>)
                                        }
                                        return (
                                            <SelectItem key={item.dbID} value={item.dbID}>
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
            <div className='w-2/3'>
                <Controller
                    render={({field} :any) => {
                        return (
                            <Select
                                // selectedKeys={[useInfection]}
                                radius="none"
                                defaultSelectedKeys={[reqItemData?.operator || '=']}
                                label="Operand"
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
                    type="number"
                    defaultValue={reqItemData?.amount || 0}
                    {...register(`expand.${reqType}.[${grandParentIdx}].expand.requirements.[${gateIdx}].expand.requirementItems.[${reqItemIdx}].amount`)}
                />
            </div>

        </div>
    )

}
