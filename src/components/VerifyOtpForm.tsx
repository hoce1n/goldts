'use client'

import { useVerifyOtp } from "@/hooks/Auth/useVerifyOtp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { ArrowLeft, Loader2 } from "lucide-react";
import { 
    InputOTP, 
    InputOTPGroup, 
    InputOTPSeparator, 
    InputOTPSlot } from "./ui/input-otp";


type Props = {
    phone: string;
}

const OTP_EXPIRE_SECONDS = 120;

export default function VerifyOtpForm({ phone }: Props) {
    const router = useRouter();
    const { mutate, isPending } = useVerifyOtp();

    const [code, setCode] = useState("");
    const [secondLeft, setSecondLeft] = useState(OTP_EXPIRE_SECONDS);

    useEffect(() => {
        if (secondLeft <= 0) return;

        const timerId = setInterval(() => {
            setSecondLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [secondLeft]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!phone) {
            toast.error("شماره موبایل یافت نشد. دوباره وارد شوید.");
            router.push("/login");
            return;
        }

        if (secondLeft <= 0) {
            toast.error("مهلت استفاده از این کد به پایان رسیده. لطفاً مجدداً کد را دریافت کنید.");
            return;
        }

        mutate(
            { phoneNumber: phone, code },
            {
                onSuccess: (res) => {
                    if (!res.success) {
                        const details = res.error?.details as Record<string, string[]> | undefined;

                        const message = 
                            details && Object.values(details)[0]?.[0]
                                ? Object.values(details)[0][0]
                                : res.error?.message

                        toast.error(message);
                        return;
                    }

                    toast.success("خوش‌آمدید. =)");

                    useAuthStore.getState().setAccessToken(res.data.accessToken);

                    const isCompleted = res.data.isProfileCompleted;
                    

                    if (!isCompleted) router.push('/register')
                    else router.push('/');
                },

                onError: (err: any) => {
                    const details = err?.response?.data?.error?.details as Record<string, string[]> | undefined;

                    const message =
                        details && Object.values(details)[0]?.[0]
                            ? Object.values(details)[0][0]
                            : err?.response?.data?.error?.message || "خظا"

                    toast.error(message)
                },
            }
        );
    };

    const formatTime = (totolSeconds: number) => {
        const m = Math.floor(totolSeconds / 60)
            .toString()
            .padStart(2, "0");

        const s = (totolSeconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleEditPhone = () => {
        router.push("/login");
    }

    const canSubmit = secondLeft > 0 && !isPending;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
                <div
                    onClick={handleEditPhone}
                    className="flex justify-center border-0 cursor-pointer group"
                >
                    <span className="ml-2  underline-offset-5 underline">ویرایش شماره</span>
                    <ArrowLeft className="w-4 group-hover:-translate-x-1 transition-transform" />
                </div>
            </div>
            <div>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e)}
              id="otp"
              autoFocus
              required
              containerClassName="sm:gap-4 justify-center"
            >
              <InputOTPGroup className="gap-1.5 sm:gap-2.5 sm:*:data-[slot=input-otp-slot]:h-16 sm:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border sm:*:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={5} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-1.5 sm:gap-2.5 sm:*:data-[slot=input-otp-slot]:h-16 sm:*:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border sm:*:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={0} />
              </InputOTPGroup>
            </InputOTP>

                {/* <label className="block text-sm mb-2">کد تایید</label>
                <Input
                    className="text-center tracking-[0.4rem]"
                    type="text" 
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    autoFocus
                /> */}
            </div>
            
            <div className="flex items-center justify-between text-xs">
                <span>زمان باقی مانده: {formatTime(secondLeft)}</span>
                {secondLeft <= 0 && (
                    <span className="text-destructive">مهلت این کد تمام شد، دوباره درخواست دهید.</span>
                )}
            </div>

            <Button className="w-full" disabled={!canSubmit}>
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