'use client'
import { AuthLayout } from "@/components/AuthLayout";
import VerifyOtpForm from "@/components/VerifyOtpForm"
import { useSearchParams } from "next/navigation";

export default function VerifyOtp() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone') || '';
    
    return (
        <AuthLayout
            title="طلای محبی"
            subtitle={
                <>
                    کد تاییدی که به شماره <span className="mx-1 font-mono font-medium">{phone}</span> ارسال شده را وارد کنید.
                </>
            }
        >
            <VerifyOtpForm phone={phone} />
        </AuthLayout>
    )
}