import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "../ui/select"

export function InputBuild ({fieldName, fieldLabel, noLabel = false, defaultValue, inputType, options, fieldDescription, control, ...rest} :any) {

    switch(inputType){
        case("text"):
        case("number"):
        case("password"): {
            return (
                <FormField
                    name={fieldName}
                    key={fieldName}
                    control={control}
                    render={
                    ({field}:any) => {
                        return (
                        <FormItem>
                            {
                                !noLabel ?
                                <FormLabel
                                htmlFor={fieldName}
                                >{fieldLabel}</FormLabel> :
                                <></>
                            }
                            <FormControl>
                            <Input
                                type={inputType} 
                                name={fieldName}
                                key={fieldName}
                                id={fieldName}
                            {...field} />
                            </FormControl>
                            <FormDescription>
                                {fieldDescription}
                            </FormDescription>
                        </FormItem>
                        )
                    }
                    }
                    {...rest}
                />
            )
        }
        case("select"): {
            return (
                <FormField
                    name={fieldName}
                    control={control}
                    render={
                    ({field}:any) => {
                        return (
                        <FormItem>
                            {
                                !noLabel ?
                                <FormLabel>{fieldLabel}</FormLabel> :
                                <></>
                            }
                            <select
                                name={fieldName}
                                onChange={field.onChange} 
                                defaultValue={defaultValue}
                                >
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
                                {/* <Select
                                    onValueChange={field.onChange}
                                    // defaultValue={defaultValue}
                                    >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{fieldLabel}</SelectLabel>
                                        {
                                            options.map((option:any, optionIdx:any) => {
                                                return (
                                                        <SelectItem
                                                            id={option.id}
                                                            key={option.value}
                                                            value={option.value}>
                                                                {option.label}
                                                        </SelectItem>
                                                )
                                            })
                                        }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select> */}

                            <FormDescription>
                                {fieldDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    }
                    {...rest}
                />
            )
        }
    }
}