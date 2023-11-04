import { ShotInput } from "@/components/shot/ShotInput";
import { CurrentUser } from "@/components/user/CurrentUser";
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


export default async function Home() {


  return (
    <main className="flex min-h-screen flex-col justify-start p-24">
      <div className=" my-10">
        <CurrentUser/>
        <h1 className=" text-4xl font-extrabold tracking-tight lg:text-5xl">Dear Lady of the Canvas</h1>
        <h2 className=" text-2xl font-semibold tracking-tight lg:text-5xl">01 - painting pretty.</h2>
      </div>
      <div>
          <Link href="/graph">
            <Button className="m-4" variant={"outline"}>
              <p className=" text-lg">
                Create Graphs
              </p>
            </Button>
          </Link>
          <Link href="/shots">
            <Button className="m-4" variant={"outline"}>
              <p className=" text-lg">
                View Shots
              </p>
            </Button>
          </Link>
      </div>
    </main>
  )
}
