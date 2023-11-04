import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export function InputBuild ({fieldName, fieldLabel, noLabel = false, defaultValue, inputType, options, fieldDescription, control, ...rest} :any) {

    switch(inputType){
        case("text"): {
            return (
                <FormField
                    {...rest}
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
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormDescription>
                                {fieldDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    }
                />
            )
        }
        case("number"): {
            return (
                <FormField
                    {...rest}
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
                            <FormControl>
                            <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                                {fieldDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    }
                />
            )
        }
        case("password"): {
            return (
                <FormField
                    {...rest}
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
                            <FormControl>
                            <Input type="password" {...field} />
                            </FormControl>
                            <FormDescription>
                                {fieldDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    }
                />
            )
        }
        case("select"): {
            return (
                <FormField
                    {...rest}
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
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={defaultValue}
                                    >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={fieldLabel}/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            options.map((option:any, optionIdx:any) => {
                                                return (
                                                    <div key={option}>
                                                        <SelectItem
                                                        value={option}>
                                                            <p className="capitalize">
                                                                {option}
                                                            </p>
                                                        </SelectItem>
                                                    </div>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormDescription>
                                {fieldDescription}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                        )
                    }
                    }
                />
            )
        }
    }
}