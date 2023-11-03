import { LogIn } from "@/components/User/LogIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogInPage() {
    return (
        <div className="flex flex-col min-h-screen w-full pr-64 pt-36 pl-24 pb-48">
            <LogIn/>
            <div className="pt-4 flex flex-col items-end">
                <p className=" font-semibold text-xl py-2">Need an account?</p>
                <Button >
                    <Link href="/auth/signup">Sign Up</Link>
                </Button>
            </div>
        </div>
    )
}