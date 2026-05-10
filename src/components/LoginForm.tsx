'use client'

import { useSendOtp } from "@/hooks/Auth/useSendOtp";
import { FormEvent } from "react";
import { Button } from "./ui/button";
import { TextField } from "./Fields";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";

export function LoginForm() {
    const router = useRouter();
    const { mutate, isPending, isError, error } = useSendOtp();
    
    const hadleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        const phoneNumber = formData.get("phoneNumber") as string
        if (phoneNumber.length != 11 && phoneNumber.startsWith('09')) {
            toast.warning("فرمت شماره تلفن صحیح نیست.");
            return;
        }

        mutate(
            { phoneNumber },
            {
                onSuccess: () => {
                    toast.success("کد تایید ارسال شد.");

                    router.push(`/otp?phone=${phoneNumber}`)
                },
                onError: (error: any) => {
                    const details = error?.response?.data?.error?.details as Record<string, string[]> | undefined

                    const message =
                        details
                            ? Object.values(details)[0]?.[0]
                            : error?.response?.data?.error?.message ||
                            "خطا در ارسال کد تایید."

                    toast.error(message);
                },
            }
        )
    }

    return (
        <form onSubmit={hadleSubmit}>
            <div className="space-y-6">
            <Input
                name="phoneNumber"
                className="*:placeholder:text-sm"
                placeholder='۰۹۱۲۳۴۵۶۷۸۹'
                type="tel"
                autoFocus
                required
            />
            </div>

            {isError && (
                <p className="mt-2 text-sm text-red-500">
                    {error.response?.data.error?.message}
                </p>
            )}
            <Button 
              type="submit" 
              className="mt-8 w-full"
            >
                {isPending ? (
                    <div className="flex items-center">
                        <Loader2 className="animate-spin -mr-1 ml-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="text-xs sm:text-sm">در حال ورود...</span>
                    </div>
                ) : (
                    'ورود'
                )}
              
            </Button>
        </form>
    )
}