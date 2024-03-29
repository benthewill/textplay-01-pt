import { SignUp } from "@/components/user/SignUp";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="flex flex-col min-h-screen w-full pr-64 pt-36 pl-24 pb-48">
            <SignUp/>
            <div className="pt-4 flex flex-col items-end">
                <p className=" font-semibold text-xl py-2">Already have an account?</p>
                <Button >
                    <Link href="/auth/login">Log In</Link>
                </Button>
            </div>
        </div>
    )
}