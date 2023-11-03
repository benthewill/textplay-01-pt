"use client";
import React, {useEffect, useState} from "react";
import { useForm, SubmitHandler, useFieldArray, FormProvider, useFormContext, FieldValues, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { gateTypes, defaultRequirement, operatorTypes, defaultDecision, defaultNarration, defaultShot, logicRequirement, requirementTypes } from "@/lib/validations/shots";
import { InputBuild } from "./InputBuild";
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export function ShotInput () {
    const methods = useForm({
        mode: "onChange",
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

    const onSubmit = async (data:FieldValues) => {
        console.log(data);
    }

    return (
        <div className="flex flex-row">
            <div className="flex-none font-mono text-xs font-extralight">
                <JsonView data={formWatch} shouldExpandNode={allExpanded}/>
            </div>
            <div className="grow">
                <Card>
                <CardHeader>
                    <CardTitle>
                            Create a new shot
                    </CardTitle>
                    <CardDescription>Insert Details here</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...methods}>
                    <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <InputBuild
                            fieldName={"shotNum"}
                            inputType={"text"}
                            nolabel
                            {...control}
                        />
                        {/* NARRATION  */}
                        <Tabs defaultValue="possibleNarrations">
                            <TabsList className=" grid w-full grid-cols-2">
                                <TabsTrigger value="possibleNarrations">Narrations</TabsTrigger>
                                <TabsTrigger value="possibleDecisions">Decisions</TabsTrigger>
                            </TabsList>
                            <TabsContent value="possibleNarrations">
                                <Card>
                                    <CardHeader className="flex flex-row justify-between items-end">
                                        <div>
                                            <CardTitle>Narration Variants</CardTitle>
                                            <CardDescription>All Possible Narrations</CardDescription>
                                        </div>
                                        <div>
                                            <Button onClick={() => posNarrAppend(defaultNarration)} variant={"outline"} size={"sm"}>+ Narration</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                    <Tabs defaultValue="0" className="flex flex-row w-full h-min-96">
                                    <TabsList className="flex flex-col flex-initial w-1/8 h-full justify-start items-stretch ">
                                        {
                                            posNarrFields.map((posNarrField, posNarrIdx) => {
                                                return (
                                                    <div key={posNarrField.id}>
                                                        <TabsTrigger value={String(posNarrIdx)}>Nar #{posNarrIdx + 1}</TabsTrigger>
                                                    </div>
                                                )
                                            })
                                        }
                                        </TabsList>
                                        {
                                            posNarrFields.map((posNarrField, posNarrIdx) => {
                                                return (
                                                    <TabsContent key={posNarrField.id} className="w-full px-6" value={String(posNarrIdx)}>
                                                        <InputBuild
                                                            fieldName={`possibleNarrations.${posNarrIdx}.narrationContent`}
                                                            fieldLabel="Narration Content"
                                                            fieldDescription="This is where narration lives"
                                                            inputType="text"
                                                            {...control}
                                                        />
                                                        <div className="p-3 border-x-2 mt-2">
                                                            <RequirementGates
                                                                reqType={"possibleNarrations"}
                                                                parentIdx={posNarrIdx}
                                                                {...control}
                                                            />
                                                        </div>
                                                    </TabsContent>
                                                )
                                            })
                                        }
                                    </Tabs>
                                    </CardContent>
                                    <CardFooter>
                                        <p>Double check the contents, big man.</p>
                                    </CardFooter>

                                </Card>
                            </TabsContent>
                            <TabsContent value="possibleDecisions">
                            </TabsContent>
                        </Tabs>
                        <div className="my-4">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                    </FormProvider>
                    </Form>
                </CardContent>
                <CardFooter className=" bg-slate-50 p-10 border-t-4">
                    {/* <pre className=" text-xs">{JSON.stringify(formWatch, null, 2)}</pre> */}
                </CardFooter>
                </Card>

            </div>
        </div>
    )
}

function RequirementGates ({reqType, parentIdx, control}:any) {
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
        <div>
            <div className="flex flex-row justify-between items-end">
                <div>
                    <h3 className=" font-semibold">Requirements</h3>
                    <p className=" font-light text-sm">This is where we put the requirements</p>
                </div>
                <Button onClick={() => reqGateAppend(defaultRequirement)} variant={"outline"} size={"sm"}>+ Gate</Button>
            </div>
            <div>
            </div>
            {
                reqGateFields.map((reqGateField, reqGateIdx) => {
                    return (
                        <div key={reqGateField.id} className="mt-2 -mb-1">
                            <RequirementItem
                                reqType={reqType}
                                grandParentIdx={parentIdx}
                                gateIdx={reqGateIdx}
                                {...control}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}

function RequirementItem ({reqType, grandParentIdx, gateIdx, control}:any) {
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
    console.log(reqType);
    console.log(grandParentIdx);
    console.log(gateIdx);
    console.log(reqItemFields);
    return (
        <div>
            {
                reqItemFields.map((reqItemField, reqItemIdx) => {
                    return (
                        <div key={reqItemField.id} className="flex flex-row w-full gap-1">
                            <div className=" w-1/3">
                                <InputBuild
                                    fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.type`}
                                    fieldLabel="Type"
                                    inputType="select"
                                    noLabel
                                    options={requirementTypes}
                                    {...control}
                                />    
                            </div>
                            <div>
                                <InputBuild
                                    fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.operator`}
                                    fieldLabel="Operator"
                                    defaultValue="="
                                    inputType="select"
                                    noLabel
                                    options={operatorTypes}
                                    {...control}
                                />
                            </div>
                            <div className=" w-1/6">
                                <InputBuild
                                    fieldName={`${reqType}.${grandParentIdx}.requirements.${gateIdx}.reqData.${reqItemIdx}.amount`}
                                    fieldLabel="Amount"
                                    noLabel
                                    inputType="text"
                                    {...control}
                                />
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}