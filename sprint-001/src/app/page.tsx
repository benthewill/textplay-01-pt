import { ShotInput } from "@/components/Shot/ShotInput";
import { CurrentUser } from "@/components/User/CurrentUser";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PocketBaseInit } from "@/lib/db/pocketbaseinit";
import {getCookie} from 'cookies-next'
import Link from "next/link";
import { useState } from "react";

import 'reactflow/dist/style.css';
async function getShots () {
  const pb = await PocketBaseInit()

  const records = await pb.collection('shots').getFullList({
    sort: '-created',
    expand: 'possibleNarrations.requirements.requirementItems'
  });

  return records
}

export default async function Home() {
  const shots = await getShots()

  return (
    <main className="flex min-h-screen flex-col justify-start p-24">
      <div className=" my-10">
        <CurrentUser/>
        <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl">Dear Lady of the Canvas</h1>
        <h2 className=" text-2xl font-semibold tracking-tight lg:text-5xl">01 - painting pretty.</h2>
      </div>
      <div>
          <Link href="/graph">
            <Button variant={"outline"}>
              <p className=" text-lg">
                Create Graphs
              </p>
            </Button>
          </Link>
      </div>
      <div>
        <p>
          {JSON.stringify(shots)}
        </p>
      </div>
    </main>
  )
}
