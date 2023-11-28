"use client";
import { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
// import { Input } from "../ui/input"
import {Input} from '@nextui-org/react'
import { Controller } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "@nextui-org/react";

export function InputBuild ({fieldName, register, fieldLabel, noLabel = false, defaultValue, inputType, options, fieldPlaceholder, fieldDescription, control, ...rest} :any) {
    const [selectedState, setSelectedState] = useState(defaultValue)
    const handler = (handler:any) => {
        // setSelectedState(handler.value)

        return handler.onChange
    }

    switch(inputType){
        case("text"):
        case("number"):
        case("password"): {
            return (
                <div className="py-1">
                    <FormField
                        name={fieldName}
                        key={fieldName}
                        control={control}
                        render={
                        ({field}:any) => {
                            return (
                            <FormItem>
                                <FormControl>
                                <Input
                                    radius="none"
                                    variant="bordered"
                                    type={inputType}
                                    name={fieldName}
                                    label={fieldLabel}
                                    key={fieldName}
                                    placeholder={fieldPlaceholder}
                                    defaultValue={defaultValue}
                                    id={fieldName}
                                {...field} />
                                </FormControl>
                                {/* <FormDescription>
                                    {fieldDescription}
                                </FormDescription> */}
                            </FormItem>
                            )
                        }
                        }
                        {...rest}
                    />
                </div>
            )
        }
        case("select"): {
            return (
                <div className="py-1 h-full">
                    <select
                        className="border-2 appearance-none border-red-950 text-gray-900 text-sm hover:border-slate-400  outline-transparent focus:ring-blue-500 focus:border-blue-500 block w-full p-3 h-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 divide-y divide-slate-200"
                        defaultValue={defaultValue}
                        {...register(fieldName)}
                        >
                            <option value="">
                                {fieldLabel}
                            </option>
                        {
                            options.map((option:any) => {
                                return (
                                        <option
                                        key={option.value}
                                        value={option.value}
                                        id={option.id}>
                                            {option.label}
                                        </option>
                                )
                            })
                        }
                    </select>
                </div>
            )
        }
        case("long-text"): {
            return (
                <div className="py-1">
                    <FormField
                        name={fieldName}
                        key={fieldName}
                        control={control}
                        render={
                        ({field}:any) => {
                            return (
                            <FormItem>
                                <FormControl>
                                <Textarea
                                    radius="none"
                                    maxRows={6}
                                    minRows={6}
                                    variant="bordered"
                                    name={fieldName}
                                    label={fieldLabel}
                                    key={fieldName}
                                    placeholder={fieldPlaceholder}
                                    defaultValue={defaultValue}
                                    id={fieldName}
                                {...field} />

                                </FormControl>
                                {/* <FormDescription>
                                    {fieldDescription}
                                </FormDescription> */}
                            </FormItem>
                            )
                        }
                        }
                        {...rest}
                    />
                </div>
            )
        }
    }
}

// <FormField
                    //     name={fieldName}
                    //     control={control}
                    //     render={
                    //     ({field}:any) => {
                    //         return (
                    //         <FormItem>
                    //             {
                    //                 !noLabel ?
                    //                 <FormLabel>{fieldLabel}</FormLabel> :
                    //                 <></>
                    //             }
                    //             <select
                    //                 name={fieldName}
                    //                 onChange={field.onChange}
                    //                 defaultValue={defaultValue}
                    //                 >
                    //                 {
                    //                     options.map((option:any) => {
                    //                         return (
                    //                             <option 
                    //                             key={option.value} 
                    //                             value={option.value} 
                    //                             id={option.id}>
                    //                                 {option.label}
                    //                             </option>
                    //                         )
                    //                     })
                    //                 }
                    //             </select>
                    //                 <Select
                    //                     onValueChange={field.onChange}
                    //                     // defaultValue={defaultValue}
                    //                     >
                    //                     <FormControl>
                    //                         <SelectTrigger>
                    //                             <SelectValue/>
                    //                         </SelectTrigger>
                    //                     </FormControl>
                    //                     <SelectContent>
                    //                         <SelectGroup>
                    //                             <SelectLabel>{fieldLabel}</SelectLabel>
                    //                         {
                    //                             options.map(
                    //                                 (option:any, optionIdx:any) => {
                    //                                 return (
                    //                                         <SelectItem
                    //                                             id={option.id}
                    //                                             key={option.value}
                    //                                             value={option.value}>
                    //                                                 {option.label}
                    //                                         </SelectItem>
                    //                                 )
                    //                             })
                    //                         }
                    //                         </SelectGroup>
                    //                     </SelectContent>
                    //                 </Select> 

                    //             <FormDescription>
                    //                 {fieldDescription}
                    //             </FormDescription>
                    //             <FormMessage />
                    //         </FormItem>
                    //         )
                    //     }
                    //     }
                    //     {...rest}
                    // />