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
import { createShot, getSequenceFromID, getSceneFromID, getShot, createNarration, updateNarration } from "@/lib/db/shots";
import { Textarea } from "@nextui-org/react";
import { PocketBaseInit } from "@/lib/db/pocketbaseinit";

export function ShotSub ({shotID}:{shotID:string}) {
    const queryClient = useQueryClient()
    const {data, isLoading, isError, refetch} =  useQuery({ queryFn: () => getShot(shotID), queryKey: ["shot", shotID], notifyOnChangeProps: "all"})

    const methods = useForm({
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: async () =>  await queryClient.getQueryData(['shot', shotID])
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
        formState: {
            isValid
        },
        getFieldState
    } = methods

    const formWatch = useWatch({control})

    const [selectedNarrTab, setSelectedNarrTab] = useState('narr0')
    const [selectedDecTab, setSelectedDecTab] = useState('dec0')

    const {mutate:addBlankNarration} = useMutation({
        mutationFn: () => createNarration({}, shotID),
        mutationKey: ["blank narration for", shotID],
        onSuccess: async () => {
        }
    })
    const {mutate:updateNarr} = useMutation({mutationFn: ({narrID, newData}:any) =>  {
        return updateNarration(narrID, newData)
        }
    })

    const Mutate = async (update:FieldValues) => {
        const pb = await PocketBaseInit()
        console.log(update);
        console.log(data);

        
        
        const narrID = data?.expand?.possibleNarrations[0].id
        const narrUpdateData = update.expand.possibleNarrations[0]
        const narrServerArr = data?.expand?.possibleNarrations
        const narrLocalArr = update.expand.possibleNarrations
        narrLocalArr.forEach((i:any) => console.log(typeof i))
        console.log(narrLocalArr);

        let updatedNarrArr:any = []

        console.log("test");
        console.log("2");

        narrLocalArr.map(async (item:any, idx:number) => {
            if (typeof item === "string") {
            } else{
                const x = await updateNarration(narrServerArr[idx].id, item)
                return x
            }
        })

        updatedNarrArr = [...narrLocalArr]

        console.log(narrLocalArr);
        console.log(updatedNarrArr);


        // refetching?.data?.expand?.possibleNarrations.forEach((field: { [key: string]: any }, index: number) => {
        //     Object.keys(field).forEach((key) => {
        //         posNarrUpdate(index, field[key])
        //     })
        // })



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
                <form onBlur={handleSubmit(Mutate)}>
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
                                                    // let selectedIdx = Number(selectedNarrTab.substring(4)) + 1
                                                    // setSelectedNarrTab("narr" + selectedIdx)
                                                    addBlankNarration()
                                                }}
                                                variant="bordered" radius="none" size={"sm"}>+ Narration</Button>
                                            </div>
                                        </CardHeader>
                                        <Divider/>
                                        <CardBody className="flex flex-row min-h-[200px]self-stretch">
                                            <Tabs
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
                                            </Tabs>
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
                        <p className=" text-xs ">Sequence #{sequenceData?.sequenceNum} - Scene #{sceneData?.sceneNum}</p>
                    </CardFooter>
                </Card>
                </form>
                </FormProvider>
                <p className="text-lg font-bold">{JSON.stringify(getFieldState("expand.possibleNarrations[0]"))}</p>
                <div className="flex flex-row max-w-[20vw]">
                    {
                        data &&
                        <pre className=" text-xs  border-r-2 pr-4">{JSON.stringify(data, null, 1)}</pre>
                    }
                    {
                        data &&
                        <pre className=" text-xs  border-r-2 pr-4">{JSON.stringify(watch(), null, 1)}</pre>
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