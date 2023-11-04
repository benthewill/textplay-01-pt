import AllShots from "@/components/shot/AllShots"
import { ShotInput } from "@/components/shot/ShotInput"
import { TestReq } from "@/components/shot/TestReq"
import { getAllShots } from "@/lib/db/shots"
import { useQuery } from "react-query"

export default function Page() {
    return (
        <div className="p-10">
            <p className=" text-4xl tracking-tight font-bold">
                All Current Shots
            </p>
            <div className="py-5">
                <ShotInput/>
            </div>
            <div className="py-5">
                <AllShots/>
            </div>

        </div>
    )
}