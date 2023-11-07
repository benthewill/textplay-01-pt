"use client";
import React, {useEffect, useState} from "react";
import { useForm, SubmitHandler, useFieldArray, FormProvider, useFormContext, FieldValues, useWatch, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Divider
} from '@nextui-org/react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { cva } from "class-variance-authority";
// import { Button } from "../ui/button";
import {Button, ButtonGroup} from '@nextui-org/react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ScrollShadow } from "@nextui-org/react";
import { gateTypes, defaultRequirement, operatorTypes, defaultDecision, defaultNarration, defaultShot, inventoryItems, infectionItems, accessItems, ANDRequirement, reqItem, requirementCategories } from "@/lib/validations/shots";
import { InputBuild } from "./InputBuild";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Tabs as NextTabs, Tab as NextTab} from '@nextui-org/react'
import { useMutation } from "@tanstack/react-query";
import { createShot } from "@/lib/db/shots";
import { Textarea } from "@nextui-org/react";

export function ShotInput () {
    const methods = useForm({
        mode: "onSubmit",
        defaultValues: defaultShot
    })

    const {
        register,
        handleSubmit,
        getValues,
        watch,
        control,
        reset
    } = methods

    const {
        fields:posNarrFields,
        append:posNarrAppend,
        prepend:posNarrPrepend,
        remove:posNarrRemove,
        swap:posNarrSwap,
        insert:posNarrInsert,
        move: posNarrMove} = useFieldArray({
        control,
        name: "possibleNarrations"
    })

    const {
        fields:posDecFields,
        append:posDecAppend,
        prepend:posDecPrepend,
        remove:posDecRemove,
        swap:posDecSwap,
        insert:posDecInsert,
        move: posDecMove} = useFieldArray({
        control,
        name: "possibleDecisions"
    })

    const formWatch = useWatch({control})

    const [selectedNarrTab, setSelectedNarrTab] = useState('narr0')
    const [selectedDecTab, setSelectedDecTab] = useState('dec0')

    const Mutate = async (data:FieldValues) => {
        // console.log(data);
        // console.log(JSON.stringify(data));

        createShot(data)
        // const {data:returned, mutate} = useMutation({
        //     mutationFn: createShot
        // })
        // mutate(data)
    }

    return (
        <div className="flex flex-row">
            <Card className=" rounded-none shadow-sm border-2">
                <CardHeader>
                    New Shot
                </CardHeader>
                <Divider/>
                <CardBody>
                <ScrollShadow size={20} className="h-[50vh]">

                    <Form {...methods}>
                    <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(Mutate)}>
                        <InputBuild
                            fieldName={"shotName"}
                            inputType="text"
                            fieldLabel="Shot Name"
                            {...control}
                        />
                        <div className="flex flex-row w-full gap-2">
                            <div className=" w-full">
                                <InputBuild
                                    fieldName={"sceneID"}
                                    inputType="number"
                                    fieldLabel="Scene Number"
                                    {...control}
                                />
                            </div>
                            <div className=" w-full">
                                <InputBuild
                                    fieldName={"sequenceID"}
                                    inputType="number"
                                    fieldLabel="Sequence Number"
                                    {...control}
                                />
                            </div>
                        </div>
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
                    </FormProvider>
                    </Form>
                </ScrollShadow> 
                </CardBody>
                <Divider/>
                <CardFooter className=" bg-slate-50">
                    {/* <pre className=" text-xs">{JSON.stringify(formWatch, null, 2)}</pre> */}
                </CardFooter>
            </Card>
        </div>
    )
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
                <Button type="button" onClick={() => reqItemAppend(reqItem)} variant={"bordered"} size={"sm"}>+ Item</Button>
            }
        </div>
    )
}

// Regular Tabs 
// <Tabs defaultValue="possibleNarrations">
//     <TabsList className=" grid w-full grid-cols-2">
//         <TabsTrigger type="button" value="possibleNarrations">Narrations</TabsTrigger>
//         <TabsTrigger type="button" value="possibleDecisions">Decisions</TabsTrigger>
//     </TabsList>
//     <TabsContent value="possibleNarrations">
//         <Card className="rounded-none">
//             <CardHeader className="flex flex-row justify-between items-end">
//                 <div>
//                     Narration Variants
//                 </div>
//                 <div>
//                     <Button
//                     type="button"
//                     onClick={() => posNarrAppend(defaultNarration)} variant={"outline"} size={"sm"}>+ Narration</Button>
//                 </div>
//             </CardHeader>
//             <CardBody>
//             <Tabs defaultValue="0" className="flex flex-row w-full h-min-96">
//             <TabsList className="flex flex-col flex-initial w-1/8 h-full justify-start items-stretch ">
//                 {
//                     posNarrFields.map((posNarrField, posNarrIdx) => {
//                         return (
//                             <div key={posNarrField.id}>
//                                 <TabsTrigger value={String(posNarrIdx)}>Nar #{posNarrIdx + 1}</TabsTrigger>
//                             </div>
//                         )
//                     })
//                 }
//                 </TabsList>
//                 {
//                     posNarrFields.map((posNarrField, posNarrIdx) => {
//                         return (
//                             <TabsContent key={posNarrField.id} className="w-full px-6" value={String(posNarrIdx)}>
//                                 <InputBuild
//                                     fieldName={`possibleNarrations.${posNarrIdx}.narrationContent`}
//                                     fieldLabel="Narration Content"
//                                     fieldDescription="This is where narration lives"
//                                     inputType="text"
//                                     {...control}
//                                 />
//                                 <div className="p-3 border-x-2 mt-2">
//                                     <RequirementGates
//                                         reqType={"possibleNarrations"}
//                                         parentIdx={posNarrIdx}
//                                         {...control}
//                                     />
//                                 </div>
//                             </TabsContent>
//                         )
//                     })
//                 }
//             </Tabs>
//             </CardBody>
//             <CardFooter>
//                 <p>Double check the contents, big man.</p>
//             </CardFooter>

//         </Card>
//     </TabsContent>
//     <TabsContent value="possibleDecisions">
//     </TabsContent>
// </Tabs>

// Inner Tabs
// Tabs defaultValue="0" className="flex flex-row w-full h-min-96">
//     <TabsList className="flex flex-col flex-initial w-1/8 h-full justify-start items-stretch ">
//         {
//             posNarrFields.map((posNarrField, posNarrIdx) => {
//                 return (
//                     <div key={posNarrField.id}>
//                         <TabsTrigger value={String(posNarrIdx)}>Nar #{posNarrIdx + 1}</TabsTrigger>
//                     </div>
//                 )
//             })
//         }
//         </TabsList>
//         {
//             posNarrFields.map((posNarrField, posNarrIdx) => {
//                 return (
//                     <TabsContent key={posNarrField.id} className="w-full px-6" value={String(posNarrIdx)}>
//                         <InputBuild
//                             fieldName={`possibleNarrations.${posNarrIdx}.narrationContent`}
//                             fieldLabel="Narration Content"
//                             fieldDescription="This is where narration lives"
//                             inputType="text"
//                             {...control}
//                         />
//                         <div className="p-3 border-x-2 mt-2">
//                             <RequirementGates
//                                 reqType={"possibleNarrations"}
//                                 parentIdx={posNarrIdx}
//                                 {...control}
//                             />
//                         </div>
//                     </TabsContent>
//                 )
//             })
//         }
//     </Tabs>