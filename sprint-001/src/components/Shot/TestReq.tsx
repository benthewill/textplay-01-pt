"use client";

import { PocketBaseInit } from "@/lib/db/pocketbaseinit";
import { useState } from "react";
import { Button } from "../ui/button";
import { FieldValues, useForm } from "react-hook-form";

export function TestReq() {
    const {control, register, handleSubmit} = useForm({
        mode: "onChange",
        defaultValues: {
            "category" : "test",
            "item": "test",
            "operator": "=",
            "amount": 123
        }
    })

    async function requirementItem(data:FieldValues) {
        const pb = await PocketBaseInit()

        const record = await pb.collection('requirementItem').create(data);

        console.log(record);

        // return record
    }

    return (
        <div>
            <form onSubmit={handleSubmit(requirementItem)}>
                <input type="text" {...register("category")} />
                <input type="text" {...register("item")} />
                <input type="text" {...register("operator")} />
                <input type="number" {...register("amount")} />

                <Button type="submit">Add</Button>
            </form>
        </div>
    )
}